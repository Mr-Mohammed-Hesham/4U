import React, { useState, useEffect } from 'react';
import { Bell, Volume2, CheckCircle2, Clock, Sparkles, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface ReminderSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dailyReminderTime: string;
  dailyReminderActive: boolean;
  dailyReminderMsg: string;
  updateReminderSettings: (time: string, active: boolean, msg: string) => void;
  showToastMsg: (msg: string) => void;
  onTestAlarm?: () => void;
}

export const ReminderSettingModal: React.FC<ReminderSettingModalProps> = ({
  isOpen,
  onClose,
  dailyReminderTime,
  dailyReminderActive,
  dailyReminderMsg,
  updateReminderSettings,
  showToastMsg,
  onTestAlarm,
}) => {
  const [permissionState, setPermissionState] = useState<string>('default');
  const [localTime, setLocalTime] = useState<string>(dailyReminderTime || '17:00');
  const [localActive, setLocalActive] = useState<boolean>(dailyReminderActive);
  const [localMsg, setLocalMsg] = useState<string>(dailyReminderMsg || 'حان وقت المذاكرة اليومي! فلنجتهد معاً لنصنع التفوق 📚✨');

  useEffect(() => {
    setLocalTime(dailyReminderTime || '17:00');
    setLocalActive(dailyReminderActive);
    setLocalMsg(dailyReminderMsg || 'حان وقت المذاكرة اليومي! فلنجتهد معاً لنصنع التفوق 📚✨');
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, [isOpen, dailyReminderTime, dailyReminderActive, dailyReminderMsg]);

  if (!isOpen) return null;

  const handleToggleActive = async (newActive: boolean) => {
    setLocalActive(newActive);
    if (newActive && 'Notification' in window && Notification.permission !== 'granted') {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === 'granted') {
          showToastMsg('✅ تم تفعيل إشعارات المتصفح والنظام للتذكير اليومي');
        }
      } catch (err) {
        console.warn('Notification permission request error:', err);
      }
    }
  };

  const handleRequestPermissions = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === 'granted') {
          showToastMsg('🔔 تم السماح بإشعارات المتصفح بنجاح');
        } else if (perm === 'denied') {
          showToastMsg('⚠️ الإشعارات محظورة في إعدادات المتصفح، سيعمل التنبيه الصوتي ونافذة المنبه داخل المنصة.');
        }
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSaveAndClose = () => {
    updateReminderSettings(localTime, localActive, localMsg);
    showToastMsg('💾 تم حفظ وضبط المنبه والتذكير اليومي بنجاح');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-950 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-right overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5 flex-row-reverse">
          <div className="flex items-center gap-2.5 flex-row-reverse">
            <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-1.5">
                <span>ضبط المنبه والتذكير اليومي</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                منبه ذكي ينبهك في موعد دراستك بصوت وشاشة وإشعارات
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-right">
          {/* Toggle Switch */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
            <div className="text-right">
              <span className="font-black text-sm block text-gray-800 dark:text-slate-200">تفعيل التذكير التلقائي اليومي</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 block mt-0.5">
                سيرن المنبه وتظهر نافذة التحفيز في الوقت المحدد
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={localActive}
                onChange={(e) => handleToggleActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>اختر وقت التنبيه اليومي (توقيت جهازك):</span>
            </label>
            <div className="relative">
              <input 
                type="time" 
                value={localTime}
                onChange={(e) => setLocalTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-gray-800 dark:text-white font-mono font-black text-center text-2xl focus:outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>
          </div>

          {/* Message text */}
          <div>
            <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>رسالة التحفيز المخصصة:</span>
            </label>
            <input 
              type="text" 
              value={localMsg}
              onChange={(e) => setLocalMsg(e.target.value)}
              placeholder="مثال: حان وقت المذاكرة اليومية والتحصيل للوصول للقمة! 🚀"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 px-4 text-xs font-bold text-gray-800 dark:text-white focus:outline-none focus:border-indigo-500 text-right"
            />
          </div>

          {/* Browser Notification Status & Quick Permission */}
          {'Notification' in window && (
            <div className="bg-indigo-50/60 dark:bg-indigo-950/30 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300">
                  إشعارات المتصفح:{' '}
                  <strong className={permissionState === 'granted' ? 'text-emerald-500' : 'text-amber-500'}>
                    {permissionState === 'granted' ? 'مفعلة بالكامل 🟢' : 'تحتاج إذن للتنبيه بالخلفية 🔔'}
                  </strong>
                </span>
              </div>
              {permissionState !== 'granted' && (
                <button
                  type="button"
                  onClick={handleRequestPermissions}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition cursor-pointer"
                >
                  منح الإذن
                </button>
              )}
            </div>
          )}

          {/* Test Alarm Sound Button */}
          <button
            type="button"
            onClick={() => {
              if (onTestAlarm) {
                onTestAlarm();
              }
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>🔔 تجربة صوت المنبه والتنبيه الآن</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
          <button 
            onClick={handleSaveAndClose}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition shadow-lg hover:shadow-indigo-500/25 cursor-pointer text-sm"
          >
            حفظ وضبط المنبه
          </button>
          <button 
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 py-3 px-5 rounded-2xl font-bold transition cursor-pointer text-xs"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

