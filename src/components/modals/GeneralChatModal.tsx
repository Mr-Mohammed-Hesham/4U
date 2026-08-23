import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, X, Image as ImageIcon, Paperclip, Mic, MicOff, 
  Square, Play, Pause, Download, Folder, FileText, Music, Crown, Users, 
  Sparkles, AlertCircle, Search, Filter, RefreshCw, CheckCircle2, ChevronDown, Eye, ShieldAlert,
  Trash2, Pin, PinOff, Smile, Heart, ThumbsUp, Flame, Star, Award, Shield, User, Mail, Calendar, Phone, BookOpen, Clock, Zap
} from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { containsProfanity, sanitizeText } from '../../utils/profanityFilter';
import { CHAT_ROOMS } from '../../hooks/useChatUnread';

interface ChatRoom {
  id: string;
  name: string;
  icon: string;
  description: string;
  gradeBadge?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderUid: string;
  senderName: string;
  senderEmail: string;
  senderPhoto?: string;
  senderRole?: 'admin' | 'user';
  text?: string;
  // Pin feature
  isPinned?: boolean;
  pinnedAt?: string;
  pinnedBy?: string;
  // Reactions mapping: emoji -> array of user uids/names
  reactions?: Record<string, string[]>;
  // Attachment fields
  fileUrl?: string;
  fileName?: string;
  fileType?: string; // 'image' | 'pdf' | 'doc' | 'audio' | 'file'
  fileSize?: string;
  audioUrl?: string;
  audioDuration?: number;
  createdAt: string | any;
}

interface UserProfileModalData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role?: string;
  phoneNumber?: string;
  guardianPhone?: string;
  gradeName?: string;
  createdAt?: string;
  lastLoginAt?: string;
  examsCompletedCount?: number;
  lessonsCompletedCount?: number;
  points?: number;
  averageScore?: number;
}

const AVAILABLE_REACTIONS = [
  { emoji: '👍', label: 'إعجاب' },
  { emoji: '❤️', label: 'حب' },
  { emoji: '🔥', label: 'حماس' },
  { emoji: '👏', label: 'تصفيق' },
  { emoji: '⭐', label: 'نجمة' },
  { emoji: '💡', label: 'فكرة' },
  { emoji: '😂', label: 'ضحك' }
];

interface GeneralChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  } | null;
  isAdmin: boolean;
  userGradeName?: string;
  unreadMap?: Record<string, number>;
  onMarkRoomAsRead?: (roomId: string) => void;
  onActiveRoomChange?: (roomId: string) => void;
}

export const GeneralChatModal: React.FC<GeneralChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAdmin,
  userGradeName,
  unreadMap,
  onMarkRoomAsRead,
  onActiveRoomChange
}) => {
  // Determine initial chat room based on user's grade
  const getInitialRoomId = () => {
    if (!userGradeName) return 'general';
    if ((userGradeName.includes('12') || userGradeName.includes('ثاني عشر')) && userGradeName.includes('متقدم')) return 'grade12_adv';
    if (userGradeName.includes('12') || userGradeName.includes('ثاني عشر')) return 'grade12_gen';
    if ((userGradeName.includes('11') || userGradeName.includes('حادي عشر')) && userGradeName.includes('متقدم')) return 'grade11_adv';
    if (userGradeName.includes('11') || userGradeName.includes('حادي عشر')) return 'grade11_gen';
    if ((userGradeName.includes('10') || userGradeName.includes('عاشر')) && userGradeName.includes('متقدم')) return 'grade10_adv';
    if (userGradeName.includes('10') || userGradeName.includes('عاشر')) return 'grade10_gen';
    if ((userGradeName.includes('9') || userGradeName.includes('تاسع')) && userGradeName.includes('متقدم')) return 'grade9_adv';
    if (userGradeName.includes('9') || userGradeName.includes('تاسع')) return 'grade9_gen';
    if ((userGradeName.includes('8') || userGradeName.includes('ثامن')) && userGradeName.includes('متقدم')) return 'grade8_adv';
    if (userGradeName.includes('8') || userGradeName.includes('ثامن')) return 'grade8_gen';
    if ((userGradeName.includes('7') || userGradeName.includes('سابع')) && userGradeName.includes('متقدم')) return 'grade7_adv';
    if (userGradeName.includes('7') || userGradeName.includes('سابع')) return 'grade7_gen';
    if ((userGradeName.includes('5') || userGradeName.includes('خامس')) && userGradeName.includes('متقدم')) return 'grade5_adv';
    if (userGradeName.includes('5') || userGradeName.includes('خامس')) return 'grade5_gen';
    return 'general';
  };

  const [activeRoomId, setActiveRoomId] = useState<string>('general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(true);
  const [profanityWarning, setProfanityWarning] = useState<string | null>(null);

  // Admin Profile Inspector Modal State (Admin Only)
  const [inspectedUserProfile, setInspectedUserProfile] = useState<UserProfileModalData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // Reaction picker active message id
  const [reactionPickerMsgId, setReactionPickerMsgId] = useState<string | null>(null);

  // Attachment states
  const [attachedFile, setAttachedFile] = useState<{
    url: string;
    name: string;
    type: 'image' | 'pdf' | 'doc' | 'audio' | 'file';
    size: string;
  } | null>(null);

  // Voice recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Shared Files / Media Library Drawer View
  const [showMediaLibrary, setShowMediaLibrary] = useState<boolean>(false);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'images' | 'docs' | 'audio'>('all');
  const [mediaSearchQuery, setMediaSearchQuery] = useState<string>('');

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Helper for local storage backup
  const loadLocalBackupMessages = (roomId: string): ChatMessage[] => {
    try {
      const saved = localStorage.getItem(`chat_backup_${roomId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error loading local chat backup:", e);
    }
    return [];
  };

  const saveLocalBackupMessages = (roomId: string, newMessages: ChatMessage[]) => {
    try {
      localStorage.setItem(`chat_backup_${roomId}`, JSON.stringify(newMessages.slice(-100)));
    } catch (e) {
      console.warn("Error saving local chat backup:", e);
    }
  };

  // Helper for local persistent reactions
  const loadLocalReactions = (roomId: string): Record<string, Record<string, string[]>> => {
    try {
      const saved = localStorage.getItem(`chat_reactions_${roomId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error loading local reactions:", e);
    }
    return {};
  };

  const saveLocalReactions = (roomId: string, reactionsMap: Record<string, Record<string, string[]>>) => {
    try {
      localStorage.setItem(`chat_reactions_${roomId}`, JSON.stringify(reactionsMap));
    } catch (e) {
      console.warn("Error saving local reactions:", e);
    }
  };

  // Set initial room when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial = getInitialRoomId();
      setActiveRoomId(initial);
      onMarkRoomAsRead?.(initial);
      onActiveRoomChange?.(initial);
    }
  }, [isOpen, userGradeName]);

  // Notify parent on room change or snapshot read
  useEffect(() => {
    if (isOpen && activeRoomId) {
      onMarkRoomAsRead?.(activeRoomId);
      onActiveRoomChange?.(activeRoomId);
    }
  }, [isOpen, activeRoomId, onMarkRoomAsRead, onActiveRoomChange]);

  // Real-time Firestore message subscription with Local Backup Fallback
  useEffect(() => {
    if (!isOpen || !activeRoomId) return;

    setIsLoadingMessages(true);
    // Pre-populate with local backup if available
    const localBackup = loadLocalBackupMessages(activeRoomId);
    if (localBackup.length > 0) {
      setMessages(localBackup);
    }

    const messagesCol = collection(db, 'community_chats', activeRoomId, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'), limit(250));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const localReactionsMap = loadLocalReactions(activeRoomId);
      const fetched: ChatMessage[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        let formattedDate = 'الآن';
        if (data.createdAt) {
          if (typeof data.createdAt === 'string') {
            formattedDate = new Date(data.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
          } else if (data.createdAt.toDate) {
            formattedDate = data.createdAt.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
          }
        }

        // Merge server reactions with local reactions
        const serverReactions = (data.reactions && typeof data.reactions === 'object') ? data.reactions : {};
        const localMsgReactions = localReactionsMap[docSnap.id] || {};
        const mergedReactions: Record<string, string[]> = { ...serverReactions };

        // Ensure user's local reaction selections are not lost on snapshot re-renders
        Object.entries(localMsgReactions).forEach(([emoji, rawUsers]) => {
          const uList = Array.isArray(rawUsers) ? rawUsers : [];
          if (uList.length > 0) {
            const existing = Array.isArray(mergedReactions[emoji]) ? [...mergedReactions[emoji]] : [];
            uList.forEach(u => {
              if (!existing.includes(u)) existing.push(u);
            });
            mergedReactions[emoji] = existing;
          }
        });

        fetched.push({
          id: docSnap.id,
          roomId: activeRoomId,
          senderUid: data.senderUid || '',
          senderName: data.senderName || 'طالب المنصة',
          senderEmail: data.senderEmail || '',
          senderPhoto: data.senderPhoto || '',
          senderRole: data.senderRole || 'user',
          text: data.text || '',
          isPinned: !!data.isPinned,
          pinnedAt: data.pinnedAt || '',
          pinnedBy: data.pinnedBy || '',
          reactions: mergedReactions,
          fileUrl: data.fileUrl || '',
          fileName: data.fileName || '',
          fileType: data.fileType || '',
          fileSize: data.fileSize || '',
          audioUrl: data.audioUrl || '',
          audioDuration: data.audioDuration || 0,
          createdAt: formattedDate
        });
      });
      setMessages(fetched);
      saveLocalBackupMessages(activeRoomId, fetched);
      setIsLoadingMessages(false);
      setTimeout(() => scrollToBottom(), 100);
    }, (err: any) => {
      console.warn("Firestore realtime chat notice:", err?.message || err);
      setIsLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [isOpen, activeRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Admin Action: Delete message
  const handleDeleteMessage = async (msgId: string) => {
    if (!isAdmin) return;
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً من الشات؟')) return;

    // Delete locally immediately
    setMessages(prev => {
      const updated = prev.filter(m => m.id !== msgId);
      saveLocalBackupMessages(activeRoomId, updated);
      return updated;
    });

    // Remove from local reactions cache
    const localReactionsMap = loadLocalReactions(activeRoomId);
    if (localReactionsMap[msgId]) {
      delete localReactionsMap[msgId];
      saveLocalReactions(activeRoomId, localReactionsMap);
    }

    try {
      // Delete from Firestore
      const msgRef = doc(db, 'community_chats', activeRoomId, 'messages', msgId);
      await deleteDoc(msgRef);
    } catch (err: any) {
      console.warn("Notice deleting message from Firestore:", err);
    }
  };

  // Admin Action: Pin / Unpin message
  const handleTogglePinMessage = async (msgId: string, currentPinStatus: boolean) => {
    if (!isAdmin) return;

    const newPinStatus = !currentPinStatus;
    const nowStr = new Date().toISOString();

    // Update state locally and backup
    setMessages(prev => {
      const updated = prev.map(m => m.id === msgId ? { ...m, isPinned: newPinStatus } : m);
      saveLocalBackupMessages(activeRoomId, updated);
      return updated;
    });

    try {
      const msgRef = doc(db, 'community_chats', activeRoomId, 'messages', msgId);
      await setDoc(msgRef, {
        isPinned: newPinStatus,
        pinnedAt: newPinStatus ? nowStr : null,
        pinnedBy: newPinStatus ? (currentUser?.displayName || 'المسؤول') : null
      }, { merge: true });
    } catch (err: any) {
      console.warn("Notice updating pin status in Firestore:", err);
    }
  };

  // Everyone Action: Toggle Reaction (Add or remove reaction)
  const handleToggleReaction = async (msgId: string, emoji: string) => {
    if (!currentUser) return;

    const userKey = currentUser.uid || currentUser.email;
    const targetMsg = messages.find(m => m.id === msgId);
    if (!targetMsg) return;

    const currentReactions: Record<string, string[]> = {};
    if (targetMsg.reactions) {
      Object.entries(targetMsg.reactions).forEach(([k, v]) => {
        if (Array.isArray(v)) currentReactions[k] = [...v];
      });
    }

    const currentUsersForEmoji = Array.isArray(currentReactions[emoji]) ? [...currentReactions[emoji]] : [];
    const hasReacted = currentUsersForEmoji.includes(userKey);
    let updatedUsersForEmoji: string[];

    if (hasReacted) {
      updatedUsersForEmoji = currentUsersForEmoji.filter(u => u !== userKey);
    } else {
      updatedUsersForEmoji = [...currentUsersForEmoji, userKey];
    }

    if (updatedUsersForEmoji.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = updatedUsersForEmoji;
    }

    // Close reaction picker
    setReactionPickerMsgId(null);

    // Save in local reactions persistent storage
    const localReactionsMap = loadLocalReactions(activeRoomId);
    localReactionsMap[msgId] = currentReactions;
    saveLocalReactions(activeRoomId, localReactionsMap);

    // Optimistically update UI and backup
    setMessages(prev => {
      const updated = prev.map(m => m.id === msgId ? { ...m, reactions: currentReactions } : m);
      saveLocalBackupMessages(activeRoomId, updated);
      return updated;
    });

    // Write to Firestore with setDoc and merge: true
    try {
      const msgRef = doc(db, 'community_chats', activeRoomId, 'messages', msgId);
      await setDoc(msgRef, {
        reactions: currentReactions
      }, { merge: true });
    } catch (err: any) {
      console.warn("Notice toggling reaction in Firestore (preserved locally):", err);
    }
  };

  // Admin Action: Inspect User Profile
  const handleInspectUserProfile = async (msg: ChatMessage) => {
    if (!isAdmin) return;

    setIsLoadingProfile(true);
    setInspectedUserProfile({
      uid: msg.senderUid,
      displayName: msg.senderName,
      email: msg.senderEmail,
      photoURL: msg.senderPhoto,
      role: msg.senderRole
    });

    try {
      if (msg.senderUid) {
        const userDocRef = doc(db, 'users', msg.senderUid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const uData = snap.data();
          setInspectedUserProfile(prev => ({
            ...prev!,
            displayName: uData.displayName || prev!.displayName,
            phoneNumber: uData.phoneNumber,
            guardianPhone: uData.guardianPhone,
            gradeName: uData.gradeName,
            createdAt: uData.createdAt,
            lastLoginAt: uData.lastLoginAt,
            examsCompletedCount: uData.examsCompletedCount || 0,
            lessonsCompletedCount: uData.lessonsCompletedCount || 0,
            points: uData.points || 0,
            averageScore: uData.averageScore || 0,
            role: uData.role || prev!.role
          }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch extra profile details from firestore:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) return;
    if (!inputText.trim() && !attachedFile) return;

    // Check for profanity, vulgarity, offensive language or insults
    if (containsProfanity(inputText)) {
      setProfanityWarning('⚠️ يُحظر إرسال الألفاظ غير اللائقة أو البذيئة أو الشتم في الشات العام. يرجى الالتزام بالحديث المحترم الراقي.');
      return;
    }

    setProfanityWarning(null);
    setIsSending(true);

    const nowISO = new Date().toISOString();
    const formattedNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const role: 'admin' | 'user' = isAdmin ? 'admin' : 'user';
    const messagePayload = {
      roomId: activeRoomId,
      senderUid: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email.split('@')[0] || 'طالب المنصة',
      senderEmail: currentUser.email,
      senderPhoto: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`,
      senderRole: role,
      text: sanitizeText(inputText.trim()),
      isPinned: false,
      reactions: {},
      fileUrl: attachedFile?.url || '',
      fileName: attachedFile?.name || '',
      fileType: attachedFile?.type || '',
      fileSize: attachedFile?.size || '',
      createdAt: nowISO
    };

    // Optimistic message for immediate UI response
    const optimisticMsg: ChatMessage = {
      id: 'local_' + Date.now(),
      ...messagePayload,
      createdAt: formattedNow
    };

    try {
      const messagesCol = collection(db, 'community_chats', activeRoomId, 'messages');
      await addDoc(messagesCol, messagePayload);

      // Clear states
      setInputText('');
      setAttachedFile(null);
      setTimeout(() => scrollToBottom(), 100);
    } catch (err: any) {
      console.warn("Notice sending message to Firestore:", err?.message || err);
      // Keep optimistic message locally so student doesn't lose text
      setMessages((prev) => {
        const updated = [...prev, optimisticMsg];
        saveLocalBackupMessages(activeRoomId, updated);
        return updated;
      });
      setInputText('');
      setAttachedFile(null);
      setTimeout(() => scrollToBottom(), 100);
    } finally {
      setIsSending(false);
    }
  };

  // Helper to format byte sizes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle File Selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isImageOnly = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 8MB for inline base64 preview/storage)
    if (file.size > 8 * 1024 * 1024) {
      alert('حجم الملف كبير جداً! الحد الأقصى المسموح به هو 8 ميجابايت.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      let detectedType: 'image' | 'pdf' | 'doc' | 'audio' | 'file' = 'file';

      if (file.type.startsWith('image/')) detectedType = 'image';
      else if (file.type === 'application/pdf') detectedType = 'pdf';
      else if (file.type.startsWith('audio/')) detectedType = 'audio';
      else if (file.type.includes('word') || file.type.includes('document')) detectedType = 'doc';

      setAttachedFile({
        url: result,
        name: file.name,
        type: detectedType,
        size: formatBytes(file.size)
      });
    };
    reader.readAsDataURL(file);
    // Reset file input
    e.target.value = '';
  };

  // Voice Recording Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          if (currentUser) {
            setIsSending(true);
            const messagePayload = {
              roomId: activeRoomId,
              senderUid: currentUser.uid,
              senderName: currentUser.displayName || currentUser.email.split('@')[0] || 'طالب المنصة',
              senderEmail: currentUser.email,
              senderPhoto: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.email)}`,
              senderRole: isAdmin ? 'admin' : 'user',
              text: '🎙️ تسجيل صوتي',
              audioUrl: base64Audio,
              audioDuration: recordingTime,
              isPinned: false,
              reactions: {},
              createdAt: new Date().toISOString()
            };
            try {
              const messagesCol = collection(db, 'community_chats', activeRoomId, 'messages');
              await addDoc(messagesCol, messagePayload);
            } catch (err) {
              console.error("Error sending voice message:", err);
            } finally {
              setIsSending(false);
            }
          }
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all track media streams
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('تعذر الوصول إلى الميكروفون. يرجى السماح بتسجيل الصوت في إعدادات المتصفح.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // Detach onstop callback
      mediaRecorderRef.current.stop();
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  // Toggle audio play
  const togglePlayAudio = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      audioElementsRef.current[msgId]?.pause();
      setPlayingAudioId(null);
    } else {
      // Pause all other audios
      Object.values(audioElementsRef.current).forEach((a: HTMLAudioElement) => a?.pause());
      if (!audioElementsRef.current[msgId]) {
        const audio = new Audio(url);
        audio.onended = () => setPlayingAudioId(null);
        audioElementsRef.current[msgId] = audio;
      }
      audioElementsRef.current[msgId].play();
      setPlayingAudioId(msgId);
    }
  };

  // Compute attached media count for shared files drawer button
  const attachedMediaList = messages.filter(m => m.fileUrl || m.audioUrl);
  const pinnedMessagesList = messages.filter(m => m.isPinned);
  const imageCount = attachedMediaList.filter(m => m.fileType === 'image').length;
  const docsCount = attachedMediaList.filter(m => m.fileType === 'pdf' || m.fileType === 'doc' || m.fileType === 'file').length;
  const audioCount = attachedMediaList.filter(m => m.audioUrl || m.fileType === 'audio').length;

  const filteredMedia = attachedMediaList.filter(m => {
    const matchesFilter = 
      mediaFilter === 'all' ? true :
      mediaFilter === 'images' ? m.fileType === 'image' :
      mediaFilter === 'docs' ? (m.fileType === 'pdf' || m.fileType === 'doc' || m.fileType === 'file') :
      mediaFilter === 'audio' ? (!!m.audioUrl || m.fileType === 'audio') : true;

    const matchesSearch = mediaSearchQuery.trim() === '' ? true :
      (m.fileName?.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
       m.senderName.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
       m.text?.toLowerCase().includes(mediaSearchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const activeRoom = CHAT_ROOMS.find(r => r.id === activeRoomId) || CHAT_ROOMS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
      >
        {/* MODAL HEADER */}
        <div className="gradient-primary px-4 md:px-6 py-3.5 flex items-center justify-between gap-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-amber-300">
              <MessageSquare className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base md:text-lg text-white">
                  غرف الدردشة والتواصل الطلابي المباشر
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  مباشر ومحفوظ
                </span>
                {isAdmin && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                    <Crown className="w-3 h-3 text-slate-950" />
                    لوحة تحكم المسؤول
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 font-medium hidden sm:block">
                تواصل وتفاعل مع زملائك - مع ميزة التفاعل بالرموز، وتثبيت وحذف الرسائل للمسؤول
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Shared Files & Media Library Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowMediaLibrary(!showMediaLibrary)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                showMediaLibrary 
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-black' 
                  : 'bg-white/10 hover:bg-white/20 text-amber-300 border-white/20'
              }`}
              title="مكتبة الملفات والوسائط المرفوعة"
            >
              <Folder className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="hidden md:inline">مكتبة المرفقات</span>
              <span className="bg-slate-950 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                {attachedMediaList.length}
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="إغلاق الشات"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CHAT ROOM SELECTOR BAR (Horizontal Scrollable Tabs) */}
        <div className="bg-slate-950/90 border-b border-slate-800/80 p-2.5 px-4 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <span className="text-xs font-extrabold text-amber-400 whitespace-nowrap pl-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>اختر الغرفة:</span>
          </span>

          {CHAT_ROOMS.map((room) => {
            const isActive = room.id === activeRoomId;
            const roomUnreadCount = unreadMap?.[room.id] || 0;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoomId(room.id);
                  setShowMediaLibrary(false);
                  onMarkRoomAsRead?.(room.id);
                  onActiveRoomChange?.(room.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border shrink-0 relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{room.icon}</span>
                <span>{room.name}</span>
                {room.gradeBadge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {room.gradeBadge}
                  </span>
                )}
                {!isActive && roomUnreadCount > 0 && (
                  <span className="bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-extrabold animate-pulse shadow-md min-w-[18px] text-center">
                    {roomUnreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ACTIVE ROOM DESCRIPTION BADGE */}
        <div className="bg-slate-950/50 px-4 py-1.5 border-b border-slate-800/60 text-xs text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-amber-300 font-bold">{activeRoom.icon} {activeRoom.name}:</span>
            <span className="text-slate-300 truncate">{activeRoom.description}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {pinnedMessagesList.length > 0 && (
              <span className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                <Pin className="w-3 h-3 fill-amber-400" />
                {pinnedMessagesList.length} مثبتة
              </span>
            )}
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              سجل محفوظ دائماً • Firestore DB
            </span>
          </div>
        </div>

        {/* PINNED MESSAGES CAROUSEL / NOTICE BAR */}
        {pinnedMessagesList.length > 0 && !showMediaLibrary && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 flex items-center gap-2 text-xs text-amber-200 shrink-0">
            <Pin className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400" />
            <div className="flex-1 overflow-hidden">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <span>رسالة مثبتة بواسطة المسؤول ({pinnedMessagesList[0].senderName}):</span>
              </div>
              <p className="text-slate-200 text-xs truncate">
                {pinnedMessagesList[0].text || (pinnedMessagesList[0].fileUrl ? 'مرفق وسائط' : 'تسجيل صوتي')}
              </p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleTogglePinMessage(pinnedMessagesList[0].id, true)}
                className="px-2 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold transition cursor-pointer flex items-center gap-1 border border-amber-400/40"
                title="إلغاء التثبيت"
              >
                <PinOff className="w-3 h-3" />
                <span>إلغاء التثبيت</span>
              </button>
            )}
          </div>
        )}

        {/* MAIN BODY: CHAT MESSAGES OR MEDIA LIBRARY DRAWER */}
        <div className="flex-1 relative overflow-hidden flex flex-col bg-slate-950/40">
          
          {showMediaLibrary ? (
            /* ========================================================= */
            /* 📁 SHARED FILES & MEDIA LIBRARY VIEW                      */
            /* ========================================================= */
            <div className="flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
                    <Folder className="w-4 h-4 text-amber-400" />
                    <span>مكتبة وسائط وملفات ({activeRoom.name})</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    استعرض وقم بتحميل جميع الصور، المستندات والتسجيلات الصوتية المرفوعة في هذا الشات
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="بحث في المرفقات..."
                      value={mediaSearchQuery}
                      onChange={(e) => setMediaSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setMediaFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({attachedMediaList.length})
                </button>
                <button
                  onClick={() => setMediaFilter('images')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaFilter === 'images' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  الصور ({imageCount})
                </button>
                <button
                  onClick={() => setMediaFilter('docs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaFilter === 'docs' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  المستندات والملفات ({docsCount})
                </button>
                <button
                  onClick={() => setMediaFilter('audio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    mediaFilter === 'audio' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  التسجيلات الصوتية ({audioCount})
                </button>
              </div>

              {/* Media Items Grid */}
              {filteredMedia.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-2">
                  <Folder className="w-12 h-12 text-slate-700 stroke-1" />
                  <p className="text-sm font-bold text-slate-400">لا توجد ملفات أو مرفقات في هذا القسم حتى الآن</p>
                  <p className="text-xs text-slate-500">شارك الصور والملخصات الصوتية مع زملائك لتظهر هنا</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {filteredMedia.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between space-y-2.5 hover:border-slate-700 transition shadow-lg group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <img 
                            src={item.senderPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.senderEmail)}`} 
                            alt={item.senderName} 
                            className="w-6 h-6 rounded-full border border-slate-700 shrink-0 object-cover"
                          />
                          <span className="text-xs font-bold text-slate-300 truncate">{item.senderName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">{item.createdAt}</span>
                      </div>

                      {item.fileType === 'image' && item.fileUrl && (
                        <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center group-hover:ring-1 group-hover:ring-indigo-500/50 transition">
                          <img src={item.fileUrl} alt={item.fileName || 'صورة'} className="w-full h-full object-cover" />
                          <a
                            href={item.fileUrl}
                            download={item.fileName || 'image.png'}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-indigo-600 text-white transition backdrop-blur-md shadow cursor-pointer"
                            title="تحميل الصورة"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {(item.fileType === 'pdf' || item.fileType === 'doc' || item.fileType === 'file') && item.fileUrl && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 truncate">
                            <FileText className="w-8 h-8 text-indigo-400 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-200 truncate">{item.fileName || 'ملف مرفق'}</p>
                              <span className="text-[10px] text-slate-500">{item.fileSize}</span>
                            </div>
                          </div>
                          <a
                            href={item.fileUrl}
                            download={item.fileName || 'file'}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
                            title="تحميل"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {item.audioUrl && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
                            <span className="flex items-center gap-1">
                              <Music className="w-3.5 h-3.5" />
                              تسجيل صوتي
                            </span>
                            {item.audioDuration && <span className="text-[10px] text-slate-400 font-mono">{item.audioDuration} ثانية</span>}
                          </div>
                          <audio controls src={item.audioUrl} className="w-full h-8 accent-indigo-500" />
                        </div>
                      )}

                      {item.text && item.text !== '🎙️ تسجيل صوتي' && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 italic bg-slate-950/40 p-1.5 rounded-lg">
                          "{item.text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* 💬 MESSAGES STREAM VIEW                                   */
            /* ========================================================= */
            <div className="flex-1 p-3 md:p-5 overflow-y-auto custom-scrollbar space-y-4">
              
              {isLoadingMessages ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
                  <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
                  <p className="text-xs font-medium">جاري تحميل رسائل {activeRoom.name} المباشرة...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center text-slate-500 space-y-3 my-auto">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                    {activeRoom.icon}
                  </div>
                  <h4 className="font-bold text-base text-slate-300">كن أول من يبدأ المحادثة في {activeRoom.name}!</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    اكتب سؤالك، أو اشترك مع زملائك برفع ملخصات وصور وتسجيلات صوتية مفيدة للجميع.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = currentUser?.uid === msg.senderUid || currentUser?.email === msg.senderEmail;
                  const isMsgAdmin = msg.senderRole === 'admin';
                  const userKey = currentUser?.uid || currentUser?.email || '';

                  return (
                    <div 
                      key={msg.id}
                      className={`relative group/msg flex gap-2.5 max-w-[90%] md:max-w-[80%] ${
                        isMe ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0 mt-0.5">
                        <img 
                          src={msg.senderPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(msg.senderEmail)}`} 
                          alt={msg.senderName} 
                          onClick={() => {
                            if (isAdmin) handleInspectUserProfile(msg);
                          }}
                          className={`w-8 h-8 rounded-full border border-slate-700 object-cover ${
                            isAdmin ? 'cursor-pointer hover:ring-2 hover:ring-amber-400 transition transform hover:scale-105' : ''
                          }`}
                          title={isAdmin ? 'اضغط لعرض ملف الطالب ومستواه التعليمي (خاص بالمسؤول)' : undefined}
                        />
                        {isMsgAdmin && (
                          <span className="absolute -bottom-1 -right-1 p-0.5 bg-amber-400 rounded-full text-slate-950 shadow">
                            <Crown className="w-2.5 h-2.5 fill-slate-950" />
                          </span>
                        )}
                      </div>

                      {/* Bubble & Controls */}
                      <div className={`flex flex-col space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                        
                        {/* Header: Name (Clickable for Admin), Role Badge, Time, Pin Badge */}
                        <div className="flex items-center gap-1.5 text-[11px] px-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (isAdmin) handleInspectUserProfile(msg);
                            }}
                            className={`font-bold transition ${
                              isAdmin 
                                ? 'text-amber-300 hover:text-amber-200 hover:underline cursor-pointer flex items-center gap-1' 
                                : 'text-slate-300 cursor-default'
                            }`}
                            title={isAdmin ? 'اضغط لعرض ملف الطالب والبيانات التفصيلية (خاص بالمسؤول)' : undefined}
                          >
                            <span>{msg.senderName}</span>
                            {isAdmin && (
                              <Eye className="w-3 h-3 text-amber-400 opacity-60 group-hover/msg:opacity-100 transition" />
                            )}
                          </button>

                          {isMsgAdmin && (
                            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/50 text-[9px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                              أدمن
                            </span>
                          )}

                          {msg.isPinned && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 shadow-sm">
                              <Pin className="w-2.5 h-2.5 fill-amber-400" />
                              مثبتة
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500 font-mono">{msg.createdAt}</span>
                        </div>

                        {/* Content Bubble with Action Toolbar on Hover */}
                        <div className="relative group/bubble">
                          <div 
                            className={`p-3 rounded-2xl space-y-2 text-xs md:text-sm leading-relaxed shadow-md transition-all ${
                              msg.isPinned ? 'ring-2 ring-amber-400/60 shadow-amber-500/10' : ''
                            } ${
                              isMe 
                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                                : isMsgAdmin
                                  ? 'bg-slate-900 border border-amber-500/40 text-slate-100 rounded-tl-none shadow-amber-500/5'
                                  : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                            }`}
                          >
                            {/* Image Attachment */}
                            {msg.fileType === 'image' && msg.fileUrl && (
                              <div className="rounded-xl overflow-hidden border border-slate-700/80 max-w-sm">
                                <img 
                                  src={msg.fileUrl} 
                                  alt={msg.fileName || 'صورة مرفقة'} 
                                  className="w-full max-h-72 object-contain bg-slate-950" 
                                />
                              </div>
                            )}

                            {/* File Attachment */}
                            {(msg.fileType === 'pdf' || msg.fileType === 'doc' || msg.fileType === 'file') && msg.fileUrl && (
                              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                                <FileText className="w-7 h-7 text-indigo-400 shrink-0" />
                                <div className="flex-1 truncate">
                                  <p className="text-xs font-bold text-slate-200 truncate">{msg.fileName || 'ملف مرفق'}</p>
                                  <span className="text-[10px] text-slate-400">{msg.fileSize || 'مستند'}</span>
                                </div>
                                <a 
                                  href={msg.fileUrl} 
                                  download={msg.fileName || 'file'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
                                  title="تحميل"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              </div>
                            )}

                            {/* Voice Note / Audio Player */}
                            {msg.audioUrl && (
                              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center gap-3 min-w-[200px]">
                                <button
                                  onClick={() => togglePlayAudio(msg.id, msg.audioUrl!)}
                                  className="p-2 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300 transition shrink-0 cursor-pointer shadow"
                                >
                                  {playingAudioId === msg.id ? (
                                    <Pause className="w-4 h-4 fill-slate-950" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                    <Mic className="w-3 h-3" />
                                    تسجيل صوتي
                                  </p>
                                  {msg.audioDuration && (
                                    <span className="text-[9px] text-slate-400 font-mono">{msg.audioDuration} ثانية</span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Text Content */}
                            {msg.text && (
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                            )}

                          </div>

                          {/* FLOATING ACTION TOOLBAR (Reactions for everyone, Delete & Pin for Admin only) */}
                          <div className={`absolute top-0 transform -translate-y-1/2 flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-full px-1.5 py-0.5 shadow-xl opacity-0 group-hover/msg:opacity-100 transition z-10 ${
                            isMe ? 'left-0' : 'right-0'
                          }`}>
                            
                            {/* Add Reaction Button */}
                            <button
                              type="button"
                              onClick={() => setReactionPickerMsgId(reactionPickerMsgId === msg.id ? null : msg.id)}
                              className="p-1 rounded-full hover:bg-slate-800 text-amber-400 transition cursor-pointer"
                              title="إضافة تفاعل"
                            >
                              <Smile className="w-3.5 h-3.5" />
                            </button>

                            {/* Admin Actions: Pin & Delete & Profile View */}
                            {isAdmin && (
                              <>
                                <span className="w-px h-3 bg-slate-700" />
                                
                                {/* Pin Toggle Button */}
                                <button
                                  type="button"
                                  onClick={() => handleTogglePinMessage(msg.id, !!msg.isPinned)}
                                  className={`p-1 rounded-full transition cursor-pointer ${
                                    msg.isPinned 
                                      ? 'text-amber-400 bg-amber-400/20 hover:bg-amber-400/30' 
                                      : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                                  }`}
                                  title={msg.isPinned ? 'إلغاء تثبيت الرسالة' : 'تثبيت الرسالة في أعلى الشات'}
                                >
                                  {msg.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                                </button>

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="p-1 rounded-full text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 transition cursor-pointer"
                                  title="حذف الرسالة نهائياً (صلاحية مسؤول)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {/* Inspect Profile Button */}
                                <button
                                  type="button"
                                  onClick={() => handleInspectUserProfile(msg)}
                                  className="p-1 rounded-full text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/60 transition cursor-pointer"
                                  title="عرض ملف الطالب"
                                >
                                  <User className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>

                          {/* REACTION PICKER POPUP */}
                          <AnimatePresence>
                            {reactionPickerMsgId === msg.id && (
                              <motion.div
                                initial={{ scale: 0.8, opacity: 0, y: 5 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 5 }}
                                className={`absolute -top-11 bg-slate-900 border border-slate-700/90 rounded-full px-2 py-1 flex items-center gap-1.5 shadow-2xl z-20 ${
                                  isMe ? 'left-0' : 'right-0'
                                }`}
                              >
                                {AVAILABLE_REACTIONS.map(item => (
                                  <button
                                    key={item.emoji}
                                    type="button"
                                    onClick={() => handleToggleReaction(msg.id, item.emoji)}
                                    className="hover:scale-125 transition transform text-base p-1 rounded-full hover:bg-slate-800 cursor-pointer"
                                    title={item.label}
                                  >
                                    {item.emoji}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>

                        {/* RENDERED REACTIONS BADGES */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className={`flex flex-wrap gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(msg.reactions).map(([emoji, rawUsers]) => {
                              const usersList = Array.isArray(rawUsers) ? rawUsers : [];
                              if (usersList.length === 0) return null;
                              const hasReacted = usersList.includes(userKey);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleToggleReaction(msg.id, emoji)}
                                  className={`px-2 py-0.5 rounded-full text-xs font-bold transition flex items-center gap-1 border cursor-pointer ${
                                    hasReacted 
                                      ? 'bg-indigo-600/30 border-indigo-400/60 text-indigo-200' 
                                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
                                  }`}
                                  title={hasReacted ? 'إلغاء التفاعل' : 'تفاعل بهذا الرمز'}
                                >
                                  <span>{emoji}</span>
                                  <span className="text-[10px] font-mono font-black">{usersList.length}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

        </div>

        {/* PROFANITY WARNING BANNER */}
        {profanityWarning && (
          <div className="bg-rose-950/90 border-t border-b border-rose-500/50 px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-rose-200 shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{profanityWarning}</span>
            </div>
            <button
              onClick={() => setProfanityWarning(null)}
              className="p-1 rounded bg-rose-900/50 hover:bg-rose-800/80 text-rose-300 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ATTACHMENT PREVIEW BAR (if file selected) */}
        {attachedFile && (
          <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between gap-3 text-xs shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2.5 truncate">
              {attachedFile.type === 'image' ? (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                  <img src={attachedFile.url} alt="معاينة" className="w-full h-full object-cover" />
                </div>
              ) : (
                <FileText className="w-6 h-6 text-indigo-400 shrink-0" />
              )}
              <div className="truncate">
                <p className="font-bold text-slate-200 truncate">{attachedFile.name}</p>
                <span className="text-[10px] text-slate-400">{attachedFile.size}</span>
              </div>
            </div>

            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-rose-400 transition cursor-pointer"
              title="إلغاء المرفق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* INPUT FOOTER BAR */}
        <div className="bg-slate-950 p-3 md:p-4 border-t border-slate-800 shrink-0">
          {isRecording ? (
            /* Voice Recording Bar */
            <div className="flex items-center justify-between gap-3 bg-red-950/60 border border-red-500/40 p-3 rounded-2xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-200">جاري تسجيل الصوتي...</span>
                <span className="text-xs font-mono text-amber-300 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-red-500/30">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold transition cursor-pointer shadow-lg flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>إرسال التسجيل</span>
                </button>
              </div>
            </div>
          ) : (
            /* Standard Input Bar */
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 md:gap-3">
              {/* Image Input Trigger */}
              <input 
                type="file" 
                ref={imageInputRef} 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, true)} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition cursor-pointer shrink-0"
                title="إرفاق صورة"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Document/File Input Trigger */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept=".pdf,.doc,.docx,.xlsx,.pptx,.zip,.txt,audio/*" 
                onChange={(e) => handleFileUpload(e, false)} 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-indigo-400 border border-slate-800 transition cursor-pointer shrink-0"
                title="إرفاق ملف أو مستند"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Record Button */}
              <button
                type="button"
                onClick={startRecording}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-800 transition cursor-pointer shrink-0"
                title="تسجيل صوتي مباشر"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={`اكتب رسالتك في ${activeRoom.name}...`}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (profanityWarning) setProfanityWarning(null);
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSending || (!inputText.trim() && !attachedFile)}
                className={`p-2.5 px-4 md:px-5 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSending || (!inputText.trim() && !attachedFile)
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30'
                }`}
              >
                <Send className="w-4 h-4 rotate-180" />
                <span className="hidden sm:inline">إرسال</span>
              </button>
            </form>
          )}
        </div>

        {/* ========================================================= */}
        {/* 🛡️ ADMIN ONLY: USER PROFILE INSPECTOR MODAL               */}
        {/* ========================================================= */}
        <AnimatePresence>
          {inspectedUserProfile && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 15 }}
                className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 text-slate-100"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <span>الملف الشخصي للطالب (خاص بالمسؤول)</span>
                  </div>
                  <button
                    onClick={() => setInspectedUserProfile(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <img
                    src={inspectedUserProfile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inspectedUserProfile.email)}`}
                    alt={inspectedUserProfile.displayName}
                    className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover shadow"
                  />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-base text-white flex items-center gap-1.5">
                      <span>{inspectedUserProfile.displayName}</span>
                      {inspectedUserProfile.role === 'admin' && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-md">
                          مسؤول
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{inspectedUserProfile.email}</span>
                    </p>
                    {inspectedUserProfile.gradeName && (
                      <span className="inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {inspectedUserProfile.gradeName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-indigo-400" />
                      الامتحانات المكتملة
                    </span>
                    <p className="text-sm font-extrabold text-indigo-300 font-mono">
                      {inspectedUserProfile.examsCompletedCount ?? 0}
                    </p>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      مجموع النقاط
                    </span>
                    <p className="text-sm font-extrabold text-amber-300 font-mono">
                      {inspectedUserProfile.points ?? 0} XP
                    </p>
                  </div>

                  {inspectedUserProfile.phoneNumber && (
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 col-span-2">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        رقم هاتف الطالب
                      </span>
                      <p className="text-xs font-bold text-slate-200 font-mono">
                        {inspectedUserProfile.phoneNumber}
                      </p>
                    </div>
                  )}

                  {inspectedUserProfile.guardianPhone && (
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 col-span-2">
                      <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-400" />
                        رقم هاتف ولي الأمر
                      </span>
                      <p className="text-xs font-bold text-slate-200 font-mono">
                        {inspectedUserProfile.guardianPhone}
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1 col-span-2">
                    <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      معرّف الحساب (UID)
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {inspectedUserProfile.uid || 'غير محدد'}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <button
                  type="button"
                  onClick={() => setInspectedUserProfile(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                >
                  إغلاق نافذة الملف
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};
