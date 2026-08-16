import React from 'react';
import { Clipboard, Share2, Check, ExternalLink, Sparkles, Smartphone } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareInfo: { title: string; url: string; description?: string } | null;
  showToastMsg: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareInfo,
  showToastMsg,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [copiedFull, setCopiedFull] = React.useState(false);

  if (!isOpen || !shareInfo) return null;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const currentUrl = shareInfo.url.startsWith('http') ? shareInfo.url : `${originUrl}${shareInfo.url}`;
  const title = shareInfo.title || 'المنصة التعليمية المتكاملة 4U | م. محمد هشام';
  const description = shareInfo.description || 'منصة تعليمية متكاملة للمناهج والخطط الدراسية التفاعلية: اختبارات إلكترونية ذاتية، شروحات ذكية، ومكتبة شاملة لكافة المواد والصفوف.';

  // WhatsApp Web / App share text (URL placed cleanly first so WhatsApp crawler unfurls the preview immediately)
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${currentUrl}\n\n📚 ${title}\n🎓 المنصة التعليمية المتكاملة 4U\n✍️ م. محمد هشام`)}`;
  
  // Telegram share
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(`📚 ${title} - المنصة التعليمية المتكاملة 4U`)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      showToastMsg('✅ تم نسخ الرابط بنجاح');
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      showToastMsg('❌ فشل النسخ');
    });
  };

  const handleCopyFullMessage = () => {
    const fullText = `🌟 *${title}*\n\n📖 المنصة التعليمية المتكاملة 4U تحت إشراف م. محمد هشام\nتضم مناهج تفاعلية، امتحانات إلكترونية ذاتية، ملخصات وبنوك أسئلة محلولة.\n\n🔗 الرابط المباشر:\n${currentUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedFull(true);
      showToastMsg('✅ تم نسخ الرسالة الترويجية الكاملة');
      setTimeout(() => setCopiedFull(false), 2500);
    }).catch(() => {
      showToastMsg('❌ فشل النسخ');
    });
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: currentUrl,
        });
        showToastMsg('✅ تمت المشاركة بنجاح');
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 text-right overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 flex-row-reverse">
          <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-5 h-5" />
            </span>
            <span>مشاركة الرابط والبطاقة الذكية</span>
          </h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition flex items-center justify-center cursor-pointer text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Live Social Card Visual Preview */}
        <div className="mb-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              معاينة بطاقة الوصف التلقائية في واتساب وتطبيقات المحادثة:
            </span>
          </div>
          
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 shadow-sm">
            <img 
              src={`${originUrl}/og-image.jpg`} 
              alt="4U Platform Preview" 
              className="w-full h-32 sm:h-36 object-cover object-center bg-indigo-900"
              onError={(e) => {
                // Fallback image if needed
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="p-3">
              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5 uppercase tracking-wide">
                {originUrl ? new URL(originUrl).hostname : '4u-platform'}
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 leading-snug line-clamp-1 mb-1">
                {title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {/* WhatsApp Direct Share */}
          <a 
            href={whatsappShareUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-black transition duration-200 shadow-md hover:shadow-emerald-500/20 active:scale-95"
          >
            <span className="text-2xl">💬</span>
            <span>واتساب (WhatsApp)</span>
          </a>

          {/* Telegram Share */}
          <a 
            href={telegramShareUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-sky-500 hover:bg-sky-400 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-black transition duration-200 shadow-md hover:shadow-sky-500/20 active:scale-95"
          >
            <span className="text-2xl">✈️</span>
            <span>تليجرام (Telegram)</span>
          </a>

          {/* Native Mobile Share Sheet */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
            <button 
              onClick={handleNativeShare}
              className="col-span-2 sm:col-span-1 bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-black transition duration-200 shadow-md hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
            >
              <Smartphone className="w-6 h-6 text-amber-300" />
              <span>مشاركة الموبايل 📱</span>
            </button>
          ) : (
            <button 
              onClick={handleCopyFullMessage}
              className="col-span-2 sm:col-span-1 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-black transition duration-200 shadow-md hover:shadow-purple-500/20 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span>{copiedFull ? 'تم النسخ ✅' : 'نسخ الرسالة 📜'}</span>
            </button>
          )}
        </div>

        {/* Copy Direct Link Section */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <button 
              onClick={handleCopyLink}
              className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white py-2.5 px-4 rounded-xl font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Clipboard className="w-4 h-4 text-amber-300" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
            <input 
              type="text" 
              readOnly 
              value={currentUrl}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs px-3 rounded-xl focus:outline-none font-mono select-all truncate"
            />
          </div>
        </div>

        {/* Helpful WhatsApp Note */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <span className="text-base shrink-0">💡</span>
          <div>
            <span className="font-bold block mb-0.5">نصيحة هامة عند إرسال الرابط في واتساب:</span>
            <span>
              عند لصق الرابط في أي محادثة أو جروب واتساب، **انتظر ثانية واحدة فقط** حتى تظهر بطاقة صورة الغلاف والوصف تلقائياً أعلى مربع الكتابة قبل الضغط على زر الإرسال.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

