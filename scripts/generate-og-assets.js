import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateAssets() {
  const publicDir = path.join(process.cwd(), 'public');

  // 1. Generate 1200x630 Open Graph Banner (WhatsApp / Social Media Share Card)
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <defs>
      <!-- Deep Luxury Slate/Indigo Background -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>

      <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#818cf8" />
        <stop offset="100%" stop-color="#a855f7" />
      </linearGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="50%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#fcd34d" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(30, 41, 59, 0.7)" />
        <stop offset="100%" stop-color="rgba(15, 23, 42, 0.85)" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="25" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#000000" flood-opacity="0.5" />
      </filter>
    </defs>

    <!-- Background Canvas -->
    <rect width="1200" height="630" fill="url(#bgGrad)" />

    <!-- Ambient Glowing Orbs -->
    <circle cx="1050" cy="150" r="220" fill="#4f46e5" opacity="0.25" filter="url(#glow)" />
    <circle cx="150" cy="500" r="180" fill="#f59e0b" opacity="0.15" filter="url(#glow)" />
    <circle cx="900" cy="480" r="150" fill="#8b5cf6" opacity="0.18" filter="url(#glow)" />

    <!-- Subtle Tech Grid Lines -->
    <g opacity="0.05" stroke="#ffffff" stroke-width="1">
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="300" x2="1200" y2="300" />
      <line x1="0" y1="400" x2="1200" y2="400" />
      <line x1="0" y1="500" x2="1200" y2="500" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Main Outer Card Container -->
    <rect x="40" y="40" width="1120" height="550" rx="28" fill="url(#cardGrad)" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" filter="url(#softShadow)" />

    <!-- Top Status Badge -->
    <g transform="translate(600, 95)">
      <rect x="-180" y="-18" width="360" height="36" rx="18" fill="rgba(99, 102, 241, 0.18)" stroke="rgba(129, 140, 248, 0.4)" stroke-width="1" />
      <circle cx="-145" cy="0" r="5" fill="#10b981" />
      <text x="-125" y="5" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="15" font-weight="bold" fill="#a5b4fc" direction="rtl">المنصة التعليمية الذكية الشاملة 2025/2026</text>
    </g>

    <!-- Brand Logo (4U with Academic Cap) -->
    <g transform="translate(600, 210) scale(1.65)">
      <!-- 4U Graphic Center (Offset by -50, -50 for center pivot) -->
      <g transform="translate(-50, -50)">
        <!-- 4 -->
        <path d="M 39,20 L 39,75" fill="none" stroke="url(#primaryGrad)" stroke-width="11" stroke-linecap="round" />
        <path d="M 39,20 L 14,53 L 49,53" fill="none" stroke="url(#primaryGrad)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        <!-- U -->
        <path d="M 57,32 L 57,58 C 57,67 63,73 71,73 C 79,73 85,67 85,58 L 85,32" fill="none" stroke="url(#goldGrad)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Graduation Cap -->
        <path d="M 48,6 L 66,13 L 48,20 L 30,13 Z" fill="url(#goldGrad)" stroke="#ffffff" stroke-width="1" />
        <path d="M 40,16 L 40,19 C 40,21.5 43,22.5 48,22.5 C 53,22.5 56,21.5 56,19 L 56,16" fill="url(#goldGrad)" opacity="0.9" />
        <path d="M 48,13 L 66,13 L 66,22" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="66" cy="23" r="2" fill="#d97706" />
      </g>
    </g>

    <!-- Main Title (Arabic Display) -->
    <text x="600" y="325" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif" font-size="44" font-weight="900" fill="#ffffff" direction="rtl">
      المنصة التعليمية المتكاملة 4U
    </text>

    <!-- Subtitle (Teacher Name) -->
    <text x="600" y="375" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif" font-size="24" font-weight="700" fill="#fbbf24" direction="rtl">
      إشراف وتطوير: م. محمد هشام
    </text>

    <!-- Three Feature Pills -->
    <g transform="translate(600, 440)">
      <!-- Pill 1: Exams -->
      <g transform="translate(-360, 0)">
        <rect x="-140" y="-22" width="280" height="44" rx="22" fill="rgba(30, 41, 59, 0.9)" stroke="rgba(251, 191, 36, 0.4)" stroke-width="1.2" />
        <text x="0" y="6" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="16" font-weight="bold" fill="#f1f5f9" direction="rtl">📝 اختبارات إلكترونية وبنوك أسئلة</text>
      </g>
      <!-- Pill 2: Curriculums -->
      <g transform="translate(0, 0)">
        <rect x="-140" y="-22" width="280" height="44" rx="22" fill="rgba(30, 41, 59, 0.9)" stroke="rgba(129, 140, 248, 0.4)" stroke-width="1.2" />
        <text x="0" y="6" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="16" font-weight="bold" fill="#f1f5f9" direction="rtl">📚 مناهج وخطط دراسية تفاعلية</text>
      </g>
      <!-- Pill 3: AI & Summaries -->
      <g transform="translate(360, 0)">
        <rect x="-140" y="-22" width="280" height="44" rx="22" fill="rgba(30, 41, 59, 0.9)" stroke="rgba(52, 211, 153, 0.4)" stroke-width="1.2" />
        <text x="0" y="6" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="16" font-weight="bold" fill="#f1f5f9" direction="rtl">✨ شروحات ذكية وغرف تواصل</text>
      </g>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(600, 525)">
      <rect x="-240" y="-18" width="480" height="36" rx="18" fill="url(#primaryGrad)" />
      <text x="0" y="5" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" font-size="15" font-weight="800" fill="#ffffff" direction="rtl">
        اضغط لفتح المنصة واستعراض الدروس والاختبارات 🚀
      </text>
    </g>
  </svg>
  `;

  // 2. Generate 600x600 Square Logo (Open Graph 1:1 format)
  const ogSquareSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
    <defs>
      <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090d16" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1e1b4b" />
      </linearGradient>

      <linearGradient id="primaryGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#818cf8" />
        <stop offset="100%" stop-color="#a855f7" />
      </linearGradient>

      <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f59e0b" />
        <stop offset="50%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#fcd34d" />
      </linearGradient>

      <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="20" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <rect width="600" height="600" rx="80" fill="url(#bgGrad2)" />
    <rect x="15" y="15" width="570" height="570" rx="65" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="2" />

    <!-- Ambient glow -->
    <circle cx="300" cy="240" r="140" fill="#4f46e5" opacity="0.3" filter="url(#glow2)" />
    <circle cx="300" cy="240" r="90" fill="#f59e0b" opacity="0.2" filter="url(#glow2)" />

    <!-- Brand Logo in Center -->
    <g transform="translate(300, 240) scale(2.8)">
      <g transform="translate(-50, -50)">
        <path d="M 39,20 L 39,75" fill="none" stroke="url(#primaryGrad2)" stroke-width="11" stroke-linecap="round" />
        <path d="M 39,20 L 14,53 L 49,53" fill="none" stroke="url(#primaryGrad2)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 57,32 L 57,58 C 57,67 63,73 71,73 C 79,73 85,67 85,58 L 85,32" fill="none" stroke="url(#goldGrad2)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 48,6 L 66,13 L 48,20 L 30,13 Z" fill="url(#goldGrad2)" stroke="#ffffff" stroke-width="1" />
        <path d="M 40,16 L 40,19 C 40,21.5 43,22.5 48,22.5 C 53,22.5 56,21.5 56,19 L 56,16" fill="url(#goldGrad2)" opacity="0.9" />
        <path d="M 48,13 L 66,13 L 66,22" fill="none" stroke="url(#goldGrad2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="66" cy="23" r="2" fill="#d97706" />
      </g>
    </g>

    <text x="300" y="445" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif" font-size="34" font-weight="900" fill="#ffffff" direction="rtl">
      منصة 4U التعليمية
    </text>
    <text x="300" y="490" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif" font-size="20" font-weight="700" fill="#fbbf24" direction="rtl">
      م. محمد هشام
    </text>
    <text x="300" y="530" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif" font-size="14" font-weight="600" fill="#94a3b8" direction="rtl">
      مناهج تفاعلية • اختبارات إلكترونية • ملخصات
    </text>
  </svg>
  `;

  // Render to JPEG & PNG binary buffers
  const ogJpegBuffer = await sharp(Buffer.from(ogSvg))
    .jpeg({ quality: 88, progressive: true })
    .toBuffer();

  const ogPngBuffer = await sharp(Buffer.from(ogSvg))
    .png({ compressionLevel: 8 })
    .toBuffer();

  const squareJpegBuffer = await sharp(Buffer.from(ogSquareSvg))
    .jpeg({ quality: 90, progressive: true })
    .toBuffer();

  const faviconPngBuffer = await sharp(Buffer.from(ogSquareSvg))
    .resize(512, 512)
    .png()
    .toBuffer();

  const favicon192Buffer = await sharp(Buffer.from(ogSquareSvg))
    .resize(192, 192)
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.jpg'), ogJpegBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogPngBuffer);
  fs.writeFileSync(path.join(publicDir, 'og-logo.jpg'), squareJpegBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), faviconPngBuffer);
  fs.writeFileSync(path.join(publicDir, 'favicon_192.png'), favicon192Buffer);

  console.log('✅ Generated og-image.jpg size:', ogJpegBuffer.length, 'bytes');
  console.log('✅ Generated og-image.png size:', ogPngBuffer.length, 'bytes');
  console.log('✅ Generated og-logo.jpg size:', squareJpegBuffer.length, 'bytes');
  console.log('✅ Generated favicon.png size:', faviconPngBuffer.length, 'bytes');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
