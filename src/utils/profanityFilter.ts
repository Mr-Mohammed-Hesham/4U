/**
 * Profanity and Moderation Filter for Public Chat Rooms
 * Filters inappropriate language, profanity, insults, and offensive terms in Arabic and English.
 */

// List of common offensive, vulgar, and profanity words (Arabic & English)
const FORBIDDEN_PATTERNS: (string | RegExp)[] = [
  // Arabic profanity & insults & inappropriate terms (comprehensive list & normalized patterns)
  /كلب/i, /كلبة/i, /حمار/i, /حمارة/i, /غبي/i, /غباء/i, /حيوان/i, /حيوانة/i, /زفت/i, /حقير/i, /حقيرة/i, 
  /سافل/i, /سافلة/i, /واطي/i, /واطية/i, /قذر/i, /قذرة/i, /وسخ/i, /وسخة/i, /تفه/i, /تفلة/i, /تف عليكم/i,
  /يا غبي/i, /يا حمار/i, /يا كلب/i, /يا حيوان/i, /تافه/i, /تافهة/i, /حقارة/i, /سفالة/i, /صايع/i, /صايعة/i,
  /عرص/i, /شرموط/i, /شرموطة/i, /قحبة/i, /منحط/i, /منحطة/i, /خول/i, /كس/i, /كسك/i, /كسها/i, /كسهم/i,
  /طيز/i, /طيزك/i, /زب/i, /زبي/i, /نيك/i, /منيك/i, /تناك/i, /ينيك/i, /متناك/i, /شتم/i, /سب/i, 
  /يلعن/i, /يلعنك/i, /لعنة/i, /الله يلعن/i, /ابن ال/i, /ابن الكلب/i, /ابن الحرام/i, /ابن الشرموطة/i, 
  /يا ابن/i, /الزفت/i, /شحات/i, /لوطي/i, /شاذ/i, /اباحي/i, /إباحي/i, /سكس/i, /بورن/i, /porn/i, /nude/i, /xxx/i,
  /لعنة الله/i, /خرا/i, /خرة/i, /أبو شخة/i, /معفن/i, /معفنة/i, /جربان/i, /ندل/i, /نجس/i, /عاهر/i, /عاهرة/i,

  // English profanity & insults
  /\bfuck\w*/i,
  /\bshit\w*/i,
  /\bbitch\w*/i,
  /\basshole\w*/i,
  /\bdick\w*/i,
  /\bcunt\w*/i,
  /\bastard\w*/i,
  /\bslut\w*/i,
  /\bwhore\w*/i,
  /\bstupid\b/i,
  /\bidiot\b/i,
  /\bdumb\b/i,
  /\bfaggot\w*/i,
  /\bnigger\w*/i,
  /\bporn\w*/i,
  /\bsex\b/i,
  /\bboobs\b/i,
  /\bpussy\b/i
];

/**
 * Checks if a string contains profanity or inappropriate language.
 */
export function containsProfanity(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  const normalizedText = text.trim();
  
  return FORBIDDEN_PATTERNS.some((pattern) => {
    if (pattern instanceof RegExp) {
      return pattern.test(normalizedText);
    }
    return normalizedText.toLowerCase().includes(pattern.toLowerCase());
  });
}

/**
 * Cleans / sanitizes text by replacing profanity with asterisks.
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  let sanitized = text;
  
  FORBIDDEN_PATTERNS.forEach((pattern) => {
    if (pattern instanceof RegExp) {
      sanitized = sanitized.replace(pattern, (match) => '*'.repeat(match.length));
    } else {
      const regex = new RegExp(pattern, 'gi');
      sanitized = sanitized.replace(regex, (match) => '*'.repeat(match.length));
    }
  });
  
  return sanitized;
}
