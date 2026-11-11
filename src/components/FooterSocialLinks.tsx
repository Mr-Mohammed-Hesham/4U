import React from 'react';

interface FooterSocialLinksProps {
  className?: string;
}

export const FooterSocialLinks: React.FC<FooterSocialLinksProps> = ({
  className = '',
}) => {
  const whatsappUrl = 'https://wa.me/971555642674';
  const telegramUrl = 'https://t.me/+971555642674';
  const facebookUrl = 'https://www.facebook.com/4UPlatform';
  const email = 'mohammedhesham872@gmail.com';

  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      {/* Facebook */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="صفحة منصة 4U على فيسبوك"
        aria-label="Facebook 4UPlatform"
        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-[#1877F2] text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#1877F2] transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105"
      >
        <svg
          className="w-4 h-4 fill-current text-[#1877F2] group-hover:text-white transition-colors"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="text-xs font-bold">فيسبوك</span>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="تواصل عبر واتساب"
        aria-label="WhatsApp"
        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-[#25D366] text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#25D366] transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105"
      >
        <svg
          className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white transition-colors"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-xs font-bold">واتساب</span>
      </a>

      {/* Telegram */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="تواصل عبر تليجرام"
        aria-label="Telegram"
        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-[#229ED9] text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#229ED9] transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105"
      >
        <svg
          className="w-4 h-4 fill-current text-[#229ED9] group-hover:text-white transition-colors"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" />
        </svg>
        <span className="text-xs font-bold">تليجرام</span>
      </a>

      {/* Email */}
      <a
        href={`mailto:${email}`}
        title={`راسلنا عبر البريد الإلكتروني: ${email}`}
        aria-label="Email"
        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-amber-600 text-slate-300 hover:text-white border border-slate-700/80 hover:border-amber-500 transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105"
      >
        <svg
          className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs font-bold">البريد الإلكتروني</span>
      </a>
    </div>
  );
};
