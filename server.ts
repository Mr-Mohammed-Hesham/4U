import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
import { createRequire } from "module";

let PDFParseClass: any;
try {
  if (typeof require !== "undefined") {
    const pdfModule = require("pdf-parse");
    PDFParseClass = pdfModule.PDFParse;
  } else {
    const requireFromEsm = createRequire(import.meta.url);
    const pdfModule = requireFromEsm("pdf-parse");
    PDFParseClass = pdfModule.PDFParse;
  }
} catch (e) {
  console.warn("Failed to import pdf-parse:", e);
}

// In-memory cache for fetched/transcribed lesson texts to provide instantaneous play subsequent times
const lessonTextCache = new Map<string, string>();

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Highly robust standard CORS middleware for cross-origin environments (like GitHub Pages)
app.use(cors({
  origin: true, // Dynamically mirrors the requesting origin (e.g. GitHub Pages), bypassing browser wildcard restrictions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true, // Supports credentials and complex headers from cross-origin requests
  preflightContinue: false,
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Initialize Gemini client lazily to avoid crashing on startup if the API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in Settings > Secrets!");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Robust content generator with automatic retry (exponential backoff) and model fallback
async function generateContentWithFallbackAndRetry(
  ai: GoogleGenAI,
  contents: any[],
  systemInstruction: string
): Promise<any> {
  // Use highly robust and available model sequences
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Attempt ${attempt} using model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
          },
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err.message || err).toLowerCase();
        const isQuotaError = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit");
        const isNotFoundError = errMsg.includes("not found") || errMsg.includes("404") || errMsg.includes("no longer available");
        const isOverloadedError = errMsg.includes("unavailable") || errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("busy") || errMsg.includes("overloaded") || errMsg.includes("capacity");

        console.warn(`[Gemini API] Error on attempt ${attempt} with model ${model}:`, err.message || err);

        // If it is a quota limit, overload/unavailability, or deprecation/not-found error, do not retry this model. Fail fast and move to fallback!
        if (isQuotaError || isNotFoundError || isOverloadedError) {
          console.warn(`[Gemini API] Fast-failing model ${model} due to ${isOverloadedError ? "overload" : isQuotaError ? "quota limits" : "model unavailability"}. Trying next fallback...`);
          break; // break the retry loop, moving to the next model in modelsToTry
        }

        if (model === modelsToTry[modelsToTry.length - 1] && attempt === maxRetries) {
          break;
        }

        // Exponential backoff delay (e.g. 600ms, 1200ms) for transient errors (e.g. network)
        const delay = Math.pow(2, attempt - 1) * 600;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Failed to generate content with all models and retries");
}

// Robust PDF content generator with automatic retry (exponential backoff) and model fallback
async function generatePdfContentWithFallbackAndRetry(
  ai: GoogleGenAI,
  pdfBase64: string,
  promptText: string
): Promise<any> {
  // Use highly robust and available model sequences for PDF transcription
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of modelsToTry) {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini PDF OCR] Attempt ${attempt} using model: ${model}`);
        const response = await ai.models.generateContent({
          model: model,
          contents: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64,
              },
            },
            promptText,
          ],
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err.message || err).toLowerCase();
        const isQuotaError = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit");
        const isNotFoundError = errMsg.includes("not found") || errMsg.includes("404") || errMsg.includes("no longer available");
        const isOverloadedError = errMsg.includes("unavailable") || errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("busy") || errMsg.includes("overloaded") || errMsg.includes("capacity");

        console.warn(`[Gemini PDF OCR] Error on attempt ${attempt} with model ${model}:`, err.message || err);

        // If it is a quota limit, overload/unavailability, or deprecation/not-found error, do not retry this model. Fail fast and move to fallback!
        if (isQuotaError || isNotFoundError || isOverloadedError) {
          console.warn(`[Gemini PDF OCR] Fast-failing model ${model} due to ${isOverloadedError ? "overload" : isQuotaError ? "quota limits" : "model unavailability"}. Trying next fallback...`);
          break; // break the retry loop, moving to the next model in modelsToTry
        }

        if (model === modelsToTry[modelsToTry.length - 1] && attempt === maxRetries) {
          break;
        }

        // Exponential backoff delay (e.g. 1000ms, 2000ms) for transient errors (e.g. network)
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Failed to transcribe PDF with all models and retries");
}

// 👨‍🏫 Personal Teacher System Instruction
const SYSTEM_INSTRUCTION = `
أنت "المعلم الافتراضي" الحكيم والودود على "المنصة التعليمية المتكاملة 4U".
مهمتك هي مساعدة الطالب ومراجعته في دروسه، والإجابة على استفساراته العامة المتعلقة بالمنهج الدراسي (سواء لبلدان الخليج مثل الإمارات، السعودية، قطر، عمان، البحرين أو مصر).
- ممنوع تماماً ذكر أسماء "جيمني" (Gemini) أو "شات جي بي تي" (ChatGPT) أو "جوجل" (Google) أو أي أداة ذكاء اصطناعي أخرى. إذا سألك الطالب من أنت، أخبره بكل حب: "أنا معلمك الافتراضي ومستشارك الدراسي على منصة 4U، متواجد دائماً هنا لأساعدك في رحلتك التعليمية وسحق الامتحانات! يلا نراجع مع بعض ✨".
- تفاعل مع الطالب بأسلوب المعلم الحنون، الدافئ والمشجع. استخدم عبارات إيجابية مثل "يا بطل"، "يا متميزة"، "يا بطلة المستقبل"، "أحسنت"، "سؤال ذكي جداً!"، "فخور بك وباهتمامك".
- بسّط المفاهيم المعقدة، واستخدم الترتيب النقطي أو الجداول التوضيحية البسيطة عند الحاجة.
- استخدم الرموز التعبيرية بحكمة ومرح لتسهيل القراءة وزيادة التفاعل (مثل: 🔥, 📚, ✨, 🚀, 🎓, 💡, 📝).
- تواصل باللغة العربية بلهجة بيضاء أو فصحى مبسطة وواضحة جداً، وإذا سألك الطالب بالإنجليزية أجب بالإنجليزية بأسلوب مشجع وبسيط ومناسب لطلاب المدارس.
- ركز على تعزيز ثقته بنفسه وذكّره بأهمية المذاكرة والاستمرارية لتحقيق أحلامه.
`;

// AI Chatbot Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAiClient();

    // Map conversation history to the format required by the SDK if present, or use generateContent with system instructions.
    // For general chat we can format the input nicely with the system instruction included.
    const contents = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }
    
    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await generateContentWithFallbackAndRetry(ai, contents, SYSTEM_INSTRUCTION);

    const reply = response.text || "عذراً يا بطل، لم أستطع صياغة رد مناسب حالياً. حاول طرح سؤالك مرة أخرى!";
    res.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ 
      error: "حدث خطأ أثناء التواصل مع المعلم الافتراضي.", 
      details: error.message || error 
    });
  }
});

// Endpoint for AI Lesson Summarizer & Smart Q&A
app.post("/api/lesson-summary", async (req, res) => {
  try {
    const { title, subject, unit, lessonText } = req.body;
    const ai = getAiClient();

    const prompt = `
أنت المعلم الافتراضي المتميز على منصة 4U التعليمية.
قدم ملخصاً تحليلياً شاملاً ومركزاً للدرس التالي:
- عنوان الدرس: ${title || 'غير محدد'}
- المادة: ${subject || 'غير محدد'}
- الوحدة الدراسية: ${unit || 'غير محدد'}
${lessonText ? `- نص أو محتوى الدرس المتاح: ${lessonText.slice(0, 3000)}` : ''}

اكتب الملخص بتنسيق ماركداون (Markdown) بأسلوب ممتع ومشجع وواضح جداً للطلاب باللغة العربية (أو بالإنجليزية إذا كان الدرس من مناهج Inspire/American)، واجعله يحتوي على الأقسام التالية:
1. 🎯 **الفكرة المحورية للدرس** (في سطرين ملهمين)
2. 📌 **أهم المفاهيم والنقاط الرئيسية** (في نقاط واضحة)
3. 📐 **القوانين والمعادلات الأساسية** (إن وجدت في الفيزياء/الرياضيات/الكيمياء)
4. 💡 **نصيحة ذهبية للتفوق في أسئلة هذا الدرس**
`;

    const response = await generateContentWithFallbackAndRetry(ai, [{ role: "user", parts: [{ text: prompt }] }], SYSTEM_INSTRUCTION);
    res.json({ summary: response.text || "تم توليد ملخص الدرس بنجاح." });
  } catch (error: any) {
    console.error("Gemini API Error in lesson summary:", error);
    res.status(500).json({ error: "تعذر توليد ملخص الدرس حالياً." });
  }
});

// Endpoint for Generating Custom Flashcards
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { topic, subject } = req.body;
    const ai = getAiClient();

    const prompt = `
أنت خبير تعليمي ومؤلف مناهج. أنشئ قائمة بـ 6 بطاقات استذكار تكرار متباعد (Flashcards) لموضوع: "${topic || 'المفاهيم الأساسية'}" في مادة "${subject || 'العلوم والرياضيات'}".
يجب أن تكون الأسئلة منطقية، علمية، دقيقة، وقائمة على المنهج المدرسي والامتحانات، مع توضيح القوانين والحلول الرياضية والتفسيرات العلمية.
يجب أن ترجع النتيجة بصيغة JSON حصرية بتنسيق المصفوفة التالية فقط بدون أي كلام إضافي:
[
  {
    "id": "1",
    "front": "السؤال المنطقي الدقيق أو المسألة الحسابية",
    "back": "الحل النموذجي والتفسير العلمي المفصل خطوة بخطوة",
    "category": "مفهوم / قانون / مسألة",
    "formula": "الصيغة الرياضية إن وجدت"
  }
]
`;

    const response = await generateContentWithFallbackAndRetry(ai, [{ role: "user", parts: [{ text: prompt }] }], SYSTEM_INSTRUCTION);
    const rawText = response.text || "[]";
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const cards = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ cards });
  } catch (error: any) {
    console.error("Error generating flashcards:", error);
    res.status(500).json({ cards: [] });
  }
});

// Health check endpoint for monitoring and keep-alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "4U Educational Platform Backend" });
});

// Quran Radio Audio Stream Proxy to bypass firewall, CORS, and browser ORB restrictions
app.get("/api/quran-stream", async (req, res) => {
  const targetUrl = (req.query.url as string) || "";
  if (!targetUrl) {
    return res.status(400).json({ error: "Stream url parameter is required" });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: "Invalid stream URL" });
  }

  const allowedHosts = [
    "cdn.mp3quran.net",
    "backup.qurango.net",
    "qurango.net",
    "radio.mp3islam.com",
    "download.quranicaudio.com",
    "live.mp3quran.net",
    "mp3quran.net",
    "www.mp3quran.net",
    "cdn.islamic.network",
  ];

  if (!allowedHosts.some((host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`))) {
    return res.status(403).json({ error: "Host not permitted by audio proxy" });
  }

  const abortController = new AbortController();
  req.on("close", () => {
    abortController.abort();
  });

  try {
    const upstreamHeaders: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "audio/*, */*;q=0.9",
      "Icy-MetaData": "0",
    };

    if (req.headers.range) {
      upstreamHeaders["Range"] = req.headers.range;
    }

    const upstreamRes = await fetch(targetUrl, {
      headers: upstreamHeaders,
      redirect: "follow",
      signal: abortController.signal,
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return res.status(upstreamRes.status || 502).json({ error: `Upstream audio returned ${upstreamRes.status}` });
    }

    const upstreamContentType = upstreamRes.headers.get("content-type") || "audio/mpeg";
    if (upstreamContentType.includes("text/html")) {
      return res.status(502).json({ error: "Upstream returned HTML instead of audio stream" });
    }

    res.status(upstreamRes.status === 206 ? 206 : 200);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Content-Type", upstreamContentType.includes("audio") ? upstreamContentType : "audio/mpeg");
    res.setHeader("Cache-Control", "no-cache, no-transform");

    const contentLength = upstreamRes.headers.get("content-length");
    if (contentLength) {
      res.setHeader("Content-Length", contentLength);
    }
    const contentRange = upstreamRes.headers.get("content-range");
    if (contentRange) {
      res.setHeader("Content-Range", contentRange);
    }
    const acceptRanges = upstreamRes.headers.get("accept-ranges");
    if (acceptRanges) {
      res.setHeader("Accept-Ranges", acceptRanges);
    }

    res.flushHeaders();

    if (req.method === "HEAD") {
      abortController.abort();
      return res.end();
    }

    const reader = upstreamRes.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (res.writableEnded || res.destroyed) {
        await reader.cancel();
        break;
      }
      res.write(Buffer.from(value));
    }
    if (!res.writableEnded) {
      res.end();
    }
  } catch (err: any) {
    if (err?.name !== "AbortError") {
      console.warn("[Quran Stream Proxy] Error:", err?.message || err);
    }
    if (!res.headersSent) {
      res.status(502).json({ error: "Failed to stream audio" });
    } else if (!res.writableEnded) {
      res.end();
    }
  }
});

// Endpoint to fetch and parse lesson content (HTML or PDF) to feed to TTS
app.get("/api/fetch-lesson-text", async (req, res) => {
  const lessonUrl = req.query.url as string;
  const title = (req.query.title as string) || "";
  const subject = (req.query.subject as string) || "الرياضيات والعلوم";
  const grade = (req.query.grade as string) || "";

  if (!lessonUrl) {
    return res.status(400).json({ error: "URL is required" });
  }

  // 1. Check in-memory cache
  if (lessonTextCache.has(lessonUrl)) {
    console.log(`[Fetch Lesson Text] Cache hit for URL: ${lessonUrl}`);
    return res.json({ text: lessonTextCache.get(lessonUrl) });
  }

  try {
    console.log(`[Fetch Lesson Text] Cache miss. Requesting URL: ${lessonUrl}`);

    // 2. Fetch HTML of the page
    const response = await fetch(lessonUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const htmlText = await response.text();

    // 3. Try to find a PDF link in the HTML
    // We look for strings ending in .pdf inside single/double quotes or simple matches
    const pdfMatch = htmlText.match(/['"]([^'"]+\.pdf)['"]/i);
    let pdfUrl = "";

    if (pdfMatch) {
      const relativePath = pdfMatch[1];
      pdfUrl = new URL(relativePath, lessonUrl).toString();
      console.log(`[Fetch Lesson Text] Found PDF relative path: ${relativePath}, resolved to: ${pdfUrl}`);
    } else if (lessonUrl.toLowerCase().endsWith(".pdf")) {
      pdfUrl = lessonUrl;
    }

    let extractedText = "";

    if (pdfUrl) {
      // 4. Fetch PDF and parse it using pdf-parse or Gemini fallback
      console.log(`[Fetch Lesson Text] Fetching PDF from: ${pdfUrl}`);
      const pdfRes = await fetch(pdfUrl);
      if (pdfRes.ok) {
        const arrayBuffer = await pdfRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        try {
          if (PDFParseClass) {
            console.log(`[Fetch Lesson Text] Trying PDFParseClass text extraction...`);
            const parser = new PDFParseClass({ data: buffer });
            await parser.load();
            const textResult = await parser.getText();
            extractedText = textResult.text || "";
            console.log(`[Fetch Lesson Text] PDFParseClass extracted ${extractedText.length} characters.`);
          }
        } catch (pdfParseError) {
          console.warn(`[Fetch Lesson Text] PDFParseClass error, falling back:`, pdfParseError);
        }

        // 5. Intelligent Fallback: If pdf-parse failed, or if it extracted < 350 characters (indicating a scanned/image PDF)
        const isMinimallyExtracted = !extractedText.trim() || extractedText.trim().length < 350;
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;

        if (isMinimallyExtracted && hasGeminiKey) {
          console.log(`[Fetch Lesson Text] PDF text is minimal or empty (${extractedText.trim().length} chars). Invoking Gemini OCR & transcription...`);
          try {
            const ai = getAiClient();
            const base64 = buffer.toString("base64");
            const promptText = `أنت المعلم الافتراضي الذكي المتميز لمادة ${subject} ${grade ? `(${grade})` : ''}. اقرأ ملف شرح الدرس المرفق ${title ? `(عنوان الدرس: "${title}")` : ''} واشرح محتواه بالتفصيل باللغة العربية الفصحى شرحاً وافياً وممتعاً ومبسّطاً للطلاب وكأنك تلقي درساً صوتياً رائعاً في الفصل. اكتب الشرح في شكل فقرات نصية متصلة وواضحة جداً لتتم قراءتها بواسطة قارئ النصوص الصوتي (لا تستخدم أبداً جداول أو رموزاً غريبة أو معادلات معقدة، فقط لغة عربية فصحى جميلة مشروحة للطلاب). ركز على تفسير المفاهيم الأساسية والقوانين والخطوات بشكل لفظي واضح وسلس يستطيع الطالب استيعابه سماعياً.`;
            
            const genRes = await generatePdfContentWithFallbackAndRetry(ai, base64, promptText);

            if (genRes.text && genRes.text.trim().length > 100) {
              extractedText = genRes.text;
              console.log(`[Fetch Lesson Text] Successfully generated Gemini detailed lesson description of length ${extractedText.length}`);
            }
          } catch (geminiError) {
            console.error(`[Fetch Lesson Text] Gemini PDF parsing failed:`, geminiError);
          }
        }
      } else {
        console.warn(`[Fetch Lesson Text] Failed to fetch PDF from resolved URL: ${pdfRes.statusText}`);
      }
    }

    // 6. Fallback: If no PDF found or PDF parsing yielded empty result, clean up HTML text and return it
    if (!extractedText.trim()) {
      console.log(`[Fetch Lesson Text] No PDF text extracted. Falling back to cleaning HTML text...`);
      // Simple HTML tags & scripts stripper
      let cleanHtml = htmlText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      extractedText = cleanHtml;
    }

    // Clean up excessive whitespace/newlines/decorative characters from the extracted text
    let formattedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    // 7. Store in-memory cache
    lessonTextCache.set(lessonUrl, formattedText);

    // Send back extracted text
    res.json({ text: formattedText });

  } catch (error: any) {
    console.error("[Fetch Lesson Text] Error:", error);
    res.status(500).json({ 
      error: "Failed to extract text from lesson link", 
      details: error.message || error 
    });
  }
});

// -------------------------------------------------------------
// 📚 Lesson Exams Persistent Hub API (Shared across all members)
// -------------------------------------------------------------
const examsDataDir = path.join(process.cwd(), "data");
const examsDataFile = path.join(examsDataDir, "lesson_exams.json");

function ensureExamsFile(): void {
  try {
    if (!fs.existsSync(examsDataDir)) {
      fs.mkdirSync(examsDataDir, { recursive: true });
    }
    if (!fs.existsSync(examsDataFile)) {
      fs.writeFileSync(examsDataFile, JSON.stringify({}, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Notice initializing exams data file:", err);
  }
}

function readAllLessonExams(): Record<string, any[]> {
  ensureExamsFile();
  try {
    if (fs.existsSync(examsDataFile)) {
      const content = fs.readFileSync(examsDataFile, "utf8");
      return content ? JSON.parse(content) : {};
    }
  } catch (err) {
    console.error("Error reading lesson exams file:", err);
  }
  return {};
}

function writeAllLessonExams(data: Record<string, any[]>): boolean {
  ensureExamsFile();
  try {
    fs.writeFileSync(examsDataFile, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing lesson exams file:", err);
    return false;
  }
}

// 1. Get exams for a specific lessonKey or all lessons
app.get("/api/lesson-exams", (req, res) => {
  try {
    const lessonKey = (req.query.lessonKey as string) || "";
    const allExams = readAllLessonExams();

    if (!lessonKey) {
      return res.json({ success: true, examsMap: allExams });
    }

    const exams = allExams[lessonKey] || [];
    return res.json({ success: true, lessonKey, exams });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch lesson exams" });
  }
});

// 2. Save or update exams for a lesson
app.post("/api/lesson-exams", (req, res) => {
  try {
    const { lessonKey, exams, exam } = req.body;
    if (!lessonKey) {
      return res.status(400).json({ success: false, error: "lessonKey is required" });
    }

    const allExams = readAllLessonExams();
    let currentList = allExams[lessonKey] || [];

    if (Array.isArray(exams)) {
      allExams[lessonKey] = exams;
    } else if (exam && exam.id) {
      const idx = currentList.findIndex((item) => item.id === exam.id);
      if (idx >= 0) {
        currentList[idx] = exam;
      } else {
        currentList.push(exam);
      }
      allExams[lessonKey] = currentList;
    }

    writeAllLessonExams(allExams);
    return res.json({ success: true, lessonKey, exams: allExams[lessonKey] || [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to save lesson exam" });
  }
});

// 3. Delete an exam by ID
app.delete("/api/lesson-exams/:lessonKey/:examId", (req, res) => {
  try {
    const { lessonKey, examId } = req.params;
    if (!lessonKey || !examId) {
      return res.status(400).json({ success: false, error: "lessonKey and examId are required" });
    }

    const allExams = readAllLessonExams();
    const currentList = allExams[lessonKey] || [];
    allExams[lessonKey] = currentList.filter((item) => item.id !== examId);

    writeAllLessonExams(allExams);
    return res.json({ success: true, lessonKey, exams: allExams[lessonKey] || [] });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || "Failed to delete lesson exam" });
  }
});

// -------------------------------------------------------------
// 🌐 External Banks Live Connectors (IG-Exam-Bank & SAT-Math-Bank)
// Real-time synchronization with GitHub repositories:
// - https://github.com/Mr-Mohammed-Hesham/IG-Exam-Bank
// - https://github.com/Mr-Mohammed-Hesham/SAT-Math-Bank
// -------------------------------------------------------------
let igBankCache: { data: any[]; timestamp: number } | null = null;
let satBankCache: { data: any[]; timestamp: number } | null = null;

function parseTsArray(code: string, variableName: string): any[] {
  try {
    const startIdx = code.indexOf(variableName);
    if (startIdx === -1) return [];
    const eqIdx = code.indexOf("=", startIdx);
    const arrStart = code.indexOf("[", eqIdx);
    if (arrStart === -1) return [];

    let depth = 0;
    let arrEnd = -1;
    let inString = false;
    let stringChar = "";
    let inLineComment = false;
    let inBlockComment = false;

    for (let i = arrStart; i < code.length; i++) {
      const ch = code[i];
      const next = code[i + 1];
      const prev = code[i - 1];

      if (inLineComment) {
        if (ch === "\n") inLineComment = false;
        continue;
      }
      if (inBlockComment) {
        if (ch === "*" && next === "/") {
          inBlockComment = false;
          i++;
        }
        continue;
      }
      if (inString) {
        if (ch === stringChar && prev !== "\\") inString = false;
      } else {
        if (ch === "/" && next === "/") {
          inLineComment = true;
          i++;
          continue;
        }
        if (ch === "/" && next === "*") {
          inBlockComment = true;
          i++;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") {
          inString = true;
          stringChar = ch;
        } else if (ch === "[") depth++;
        else if (ch === "]") {
          depth--;
          if (depth === 0) {
            arrEnd = i + 1;
            break;
          }
        }
      }
    }

    if (arrEnd !== -1) {
      const arrCode = code.substring(arrStart, arrEnd);
      const parsed = new Function("return " + arrCode)();
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn(`[External Banks Parser] Error parsing ${variableName}:`, err);
  }
  return [];
}

app.get("/api/external-banks/ig", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = Date.now();
  const cacheFile = path.join(examsDataDir, "ig_bank_cache.json");

  // In-memory 60s cache
  if (!forceRefresh && igBankCache && (now - igBankCache.timestamp < 60000)) {
    return res.json({ success: true, count: igBankCache.data.length, exams: igBankCache.data, source: "memory_cache" });
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/IG-Exam-Bank/main/src/data/igExamsData.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6000);
    const upstreamRes = await fetch(rawUrl, { signal: abortCtrl.signal, headers: { "User-Agent": "4U-Platform" } });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const exams = parseTsArray(code, "allIGExams");
      if (exams.length > 0) {
        igBankCache = { data: exams, timestamp: now };
        ensureExamsFile();
        try {
          fs.writeFileSync(cacheFile, JSON.stringify(exams, null, 2), "utf8");
        } catch {}
        return res.json({ success: true, count: exams.length, exams, source: "live_github" });
      }
    }
  } catch (err: any) {
    console.warn("[IG Exam Bank Sync] Fetch failed, falling back to disk cache:", err?.message || err);
  }

  // Fallback to disk cache if available
  if (fs.existsSync(cacheFile)) {
    try {
      const diskData = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(diskData) && diskData.length > 0) {
        igBankCache = { data: diskData, timestamp: now };
        return res.json({ success: true, count: diskData.length, exams: diskData, source: "disk_cache" });
      }
    } catch {}
  }

  if (igBankCache) {
    return res.json({ success: true, count: igBankCache.data.length, exams: igBankCache.data, source: "stale_cache" });
  }

  return res.json({ success: true, count: 0, exams: [], source: "empty" });
});

app.get("/api/external-banks/sat", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = Date.now();
  const cacheFile = path.join(examsDataDir, "sat_bank_cache.json");

  // In-memory 60s cache
  if (!forceRefresh && satBankCache && (now - satBankCache.timestamp < 60000)) {
    return res.json({ success: true, count: satBankCache.data.length, revisionExams: satBankCache.data, source: "memory_cache" });
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/SAT-Math-Bank/main/src/data/fullExamsData.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6000);
    const upstreamRes = await fetch(rawUrl, { signal: abortCtrl.signal, headers: { "User-Agent": "4U-Platform" } });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const revisionExams = parseTsArray(code, "interactiveRevisionExams");
      if (revisionExams.length > 0) {
        satBankCache = { data: revisionExams, timestamp: now };
        ensureExamsFile();
        try {
          fs.writeFileSync(cacheFile, JSON.stringify(revisionExams, null, 2), "utf8");
        } catch {}
        return res.json({ success: true, count: revisionExams.length, revisionExams, source: "live_github" });
      }
    }
  } catch (err: any) {
    console.warn("[SAT Math Bank Sync] Fetch failed, falling back to disk cache:", err?.message || err);
  }

  // Fallback to disk cache if available
  if (fs.existsSync(cacheFile)) {
    try {
      const diskData = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(diskData) && diskData.length > 0) {
        satBankCache = { data: diskData, timestamp: now };
        return res.json({ success: true, count: diskData.length, revisionExams: diskData, source: "disk_cache" });
      }
    } catch {}
  }

  if (satBankCache) {
    return res.json({ success: true, count: satBankCache.data.length, revisionExams: satBankCache.data, source: "stale_cache" });
  }

  return res.json({ success: true, count: 0, revisionExams: [], source: "empty" });
});

// -------------------------------------------------------------
// 🏛️ EOT 2026 Live Connector & Anti-Theft Content Proxy
// Real-time synchronization with Mr-Mohammed-Hesham/EOT without
// exposing any repository slugs or external URLs to end users.
// -------------------------------------------------------------
interface InternalEotCurriculum {
  id: string;
  year: string;
  term: string;
  grade: string;
  stream: string;
  subject: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  primaryUrlTemplate: string;
  fallbackUrlTemplates: string[];
  defaultTotalQuestions: number;
  mcqQuestionsEnd: number;
  knownQuestionTitles?: Record<number, { ar: string; en: string }>;
}

const DEFAULT_EOT2026_BASE_T1: InternalEotCurriculum[] = [
  {
    id: "12-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "فيزياء 12 متقدم — بريدج",
    titleEn: "Grade 12 Advanced Physics — Bridge",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول · مقسم صفحة لكل سؤال وزاري مع الحل والتدريب التفاعلي",
    subtitleEn: "Term 1 EOT Exam Structure · Dedicated interactive page per exam question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT.Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
    knownQuestionTitles: {
      1: { ar: "الكهرباء الساكنة والشحنات الكهربائية — المراجعة التأسيسية", en: "Electrostatics & Electric Charges — Core Review" },
      2: { ar: "القسم 1.2: الشحنات الكهربائية وقانون حفظ الشحنة", en: "Section 1.2: Electric Charges & Conservation" },
      3: { ar: "الموصلات والعوازل والموصلات الفائقة", en: "Conductors, Insulators & Superconductors" },
      4: { ar: "الشحن الكهربائي وتطبيقات الكشاف الكهربائي", en: "Charging Processes & Electroscope Applications" },
      5: { ar: "القوة الكهروستاتيكية داخل الذرة وقانون كولوم", en: "Electrostatic Force Inside the Atom & Coulomb’s Law" },
      6: { ar: "خطوط المجال الكهربائي وتمثيل الشحنات", en: "Electric Field Lines & Charge Configurations" },
      7: { ar: "التوزيعات المتصلة للشحنات الكهربائية", en: "Continuous Charge Distributions" },
      8: { ar: "التدفق الكهربائي وقانون جاوس — الجزء الأول", en: "Electric Flux & Gauss’s Law — Part 1" },
      9: { ar: "التدفق الكهربائي وقانون جاوس — تطبيقات السؤال التاسع", en: "Electric Flux & Gauss’s Law — Question 9 Applications" },
    },
  },
  {
    id: "12-adv-bri-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_bridge",
    subject: "math",
    titleAr: "رياضيات 12 متقدم — بريدج",
    titleEn: "Grade 12 Advanced Mathematics — Bridge",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول · النهايات والاتصال والتفاضل مقسم حسب رقم السؤال",
    subtitleEn: "Term 1 EOT Exam Structure · Limits, Continuity & Derivatives per question page",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-Math-T1-2026-EOT-Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "12-adv-ins-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_inspire",
    subject: "physics",
    titleAr: "فيزياء 12 متقدم — انسباير",
    titleEn: "Grade 12 Advanced Physics — Inspire",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول لمنهج انسباير المتقدم · صفحة مستقلة لكل سؤال",
    subtitleEn: "Term 1 EOT Exam Structure for Inspire Advanced Physics · Page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Ins-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT.Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "12-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "general",
    subject: "math",
    titleAr: "رياضيات 12 عام",
    titleEn: "Grade 12 General Mathematics",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول للمسار العام · تدريبات شاملة لكل سؤال في صفحة منفصلة",
    subtitleEn: "Term 1 EOT Exam Structure for General Stream · Dedicated page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT.Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Gen-math-T1-2026-EOT-Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "11-adv-bri-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "adv_bridge",
    subject: "math",
    titleAr: "رياضيات 11 متقدم — بريدج",
    titleEn: "Grade 11 Advanced Mathematics — Bridge",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول · مراجعة مركزة وتدريب تفاعلي لكل سؤال وزاري",
    subtitleEn: "Term 1 EOT Exam Structure · Focused practice page for every exam question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-Math-T1-2026-EOT-Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "11-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "فيزياء 11 متقدم — بريدج",
    titleEn: "Grade 11 Advanced Physics — Bridge",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول · المتجهات والميكانيكا مقسمة صفحة لكل سؤال",
    subtitleEn: "Term 1 EOT Exam Structure · Vectors & Mechanics structured per question page",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT.Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "11-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "general",
    subject: "math",
    titleAr: "رياضيات 11 عام",
    titleEn: "Grade 11 General Mathematics",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول للمسار العام · تصفح مباشر لصفحات الأسئلة بالترتيب",
    subtitleEn: "Term 1 EOT Exam Structure for General Stream · Sequential question pages",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Gen-math-T1-2026-EOT-Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "10-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "10",
    stream: "general",
    subject: "math",
    titleAr: "رياضيات 10 عام",
    titleEn: "Grade 10 General Mathematics",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول للصف العاشر العام · صفحة مخصصة لكل سؤال",
    subtitleEn: "Term 1 EOT Exam Structure for Grade 10 General · Dedicated page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/10Gen-math-T1-2026-EOT-Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
  {
    id: "10-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "10",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "فيزياء 10 متقدم — بريدج",
    titleEn: "Grade 10 Advanced Physics — Bridge",
    subtitleAr: "هيكل امتحان نهاية الفصل الأول للصف العاشر المتقدم بريدج · كل سؤال في صفحة تفاعلية",
    subtitleEn: "Term 1 EOT Exam Structure for Grade 10 Advanced Bridge · Interactive page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/10Adv-Bri-phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT.Q{q}/",
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
  },
];

let eot2026CurriculaCache: { all: InternalEotCurriculum[]; timestamp: number } | null = null;
let eot2026KnownReposLower: Set<string> | null = null;
const eot2026QuestionCache = new Map<
  string,
  { status: "live" | "pending"; liveTitle?: string; html?: string; checkedAt: number }
>();

const eot2026SharedSettingsFile = path.join(examsDataDir, "eot2026_shared_config.json");

function readEot2026SharedSettings(): { totalQuestionsByCurriculum: Record<string, number> } {
  ensureExamsFile();
  try {
    if (fs.existsSync(eot2026SharedSettingsFile)) {
      const parsed = JSON.parse(fs.readFileSync(eot2026SharedSettingsFile, "utf8"));
      return {
        totalQuestionsByCurriculum: parsed?.totalQuestionsByCurriculum || {},
      };
    }
  } catch {}
  return { totalQuestionsByCurriculum: {} };
}

function writeEot2026SharedSettings(data: { totalQuestionsByCurriculum: Record<string, number> }): void {
  ensureExamsFile();
  try {
    fs.writeFileSync(eot2026SharedSettingsFile, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[EOT 2026 Settings] Write error:", err);
  }
}

function expandEot2026Terms(baseList: InternalEotCurriculum[]): InternalEotCurriculum[] {
  const result: InternalEotCurriculum[] = [];
  const terms: ("T1" | "T2" | "T3")[] = ["T1", "T2", "T3"];
  for (const termId of terms) {
    for (const base of baseList) {
      if (base.term === termId && base.year === "2026") {
        if (!result.some((r) => r.id === base.id)) result.push(base);
        continue;
      }
      if (base.term !== "T1") continue;
      const replaceTermYear = (tpl: string) => tpl.replace(/-T1-2026-/gi, `-${termId}-2026-`);
      const id = base.id.replace("-t1-2026", `-${termId.toLowerCase()}-2026`);
      if (result.some((r) => r.id === id)) continue;
      const termNameAr = termId === "T1" ? "الفصل الأول" : termId === "T2" ? "الفصل الثاني" : "الفصل الثالث";
      const termNameEn = termId === "T1" ? "Term 1" : termId === "T2" ? "Term 2" : "Term 3";
      result.push({
        ...base,
        id,
        year: "2026",
        term: termId,
        subtitleAr: `هيكل امتحان نهاية ${termNameAr} 2026 · مقسم صفحة لكل سؤال وزاري`,
        subtitleEn: `${termNameEn} 2026 EOT Exam Structure · Dedicated interactive page per question`,
        primaryUrlTemplate: replaceTermYear(base.primaryUrlTemplate),
        fallbackUrlTemplates: (base.fallbackUrlTemplates || []).map(replaceTermYear),
        knownQuestionTitles: undefined,
      });
    }
  }
  return result;
}

async function resolveEot2026Curricula(forceRefresh = false): Promise<InternalEotCurriculum[]> {
  const now = Date.now();
  const cacheFile = path.join(examsDataDir, "eot2026_curricula_cache.json");

  if (!forceRefresh && eot2026CurriculaCache && now - eot2026CurriculaCache.timestamp < 60000) {
    return eot2026CurriculaCache.all;
  }

  let baseCurricula: InternalEotCurriculum[] = [];

  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/EOT/main/src/data/eotCurricula.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6000);
    const upstreamRes = await fetch(rawUrl, {
      signal: abortCtrl.signal,
      headers: { "User-Agent": "4U-Platform" },
    });
    clearTimeout(timeout);

    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const parsed = parseTsArray(code, "BASE_2026_T1_CURRICULA");
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseCurricula = parsed.map((item: any) => ({
          id: String(item.id),
          year: String(item.year || "2026"),
          term: String(item.term || "T1"),
          grade: String(item.grade),
          stream: String(item.stream),
          subject: String(item.subject),
          titleAr: String(item.titleAr),
          titleEn: String(item.titleEn),
          subtitleAr: String(item.subtitleAr || ""),
          subtitleEn: String(item.subtitleEn || ""),
          primaryUrlTemplate: String(item.primaryUrlTemplate),
          fallbackUrlTemplates: Array.isArray(item.fallbackUrlTemplates) ? item.fallbackUrlTemplates.map(String) : [],
          defaultTotalQuestions: Number(item.defaultTotalQuestions) || 25,
          mcqQuestionsEnd: Number(item.mcqQuestionsEnd) || 20,
          knownQuestionTitles: item.knownQuestionTitles,
        }));
      }
    }
  } catch (err: any) {
    console.warn("[EOT 2026 Sync] Upstream curricula fetch warning:", err?.message || err);
  }

  if (baseCurricula.length === 0 && fs.existsSync(cacheFile)) {
    try {
      const disk = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(disk) && disk.length > 0) baseCurricula = disk;
    } catch {}
  }

  if (baseCurricula.length === 0) {
    baseCurricula = DEFAULT_EOT2026_BASE_T1;
  }

  let expanded = expandEot2026Terms(baseCurricula);

  // Auto-discover any newly created 2026 EOT repositories across all GitHub repo pages (size > 0)
  try {
    const allRepos: any[] = [];
    for (let page = 1; page <= 5; page++) {
      const repoCtrl = new AbortController();
      const repoTimeout = setTimeout(() => repoCtrl.abort(), 5000);
      const reposRes = await fetch(
        `https://api.github.com/users/Mr-Mohammed-Hesham/repos?per_page=100&page=${page}&sort=updated`,
        {
          signal: repoCtrl.signal,
          headers: { "User-Agent": "4U-Platform", Accept: "application/vnd.github+json" },
        }
      );
      clearTimeout(repoTimeout);
      if (!reposRes.ok) break;
      const batch = await reposRes.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      allRepos.push(...batch);
      if (batch.length < 100) break;
    }

    if (allRepos.length > 0) {
      const lowerSet = new Set<string>();
      for (const r of allRepos) {
        if (r && r.name) lowerSet.add(String(r.name).toLowerCase());
      }
      eot2026KnownReposLower = lowerSet;

      const pattern = /^(\d+)(Adv-Bri|Adv-Ins|Adv-Rev|Jen|Gen)-(phy|math|chem|bio)-(T[123])-(2026)-EOT([-._]?)Q(\d+)$/i;
      for (const repo of allRepos) {
        if (!repo || !repo.name) continue;
        const name = String(repo.name || "");
        const m = name.match(pattern);
        if (!m) continue;
        const [, gradeRaw, streamRaw, subRaw, termRaw, , sepRaw, qStr] = m;
        const sep = sepRaw || "-";
        const qNum = Number(qStr) || 1;
        const term = termRaw.toUpperCase();
        const stream =
          streamRaw.toLowerCase() === "adv-bri"
            ? "adv_bridge"
            : streamRaw.toLowerCase() === "adv-ins" || streamRaw.toLowerCase() === "adv-rev"
            ? "adv_inspire"
            : "general";
        const subject =
          subRaw.toLowerCase() === "phy"
            ? "physics"
            : subRaw.toLowerCase() === "math"
            ? "math"
            : subRaw.toLowerCase() === "chem"
            ? "chemistry"
            : "biology";

        const existing = expanded.find(
          (c) => c.year === "2026" && c.term === term && c.grade === gradeRaw && c.stream === stream && c.subject === subject
        );

        if (existing) {
          if (qNum > existing.defaultTotalQuestions) {
            existing.defaultTotalQuestions = qNum;
          }
        } else {
          const subAr = subject === "physics" ? "فيزياء" : subject === "math" ? "رياضيات" : subject === "chemistry" ? "كيمياء" : "أحياء";
          const subEn = subject === "physics" ? "Physics" : subject === "math" ? "Mathematics" : subject === "chemistry" ? "Chemistry" : "Biology";
          const streamAr = stream === "adv_bridge" ? "متقدم — بريدج" : stream === "adv_inspire" ? "متقدم — انسباير" : "عام";
          const streamEn = stream === "adv_bridge" ? "Advanced — Bridge" : stream === "adv_inspire" ? "Advanced — Inspire" : "General";
          const prefixBeforeQ = name.replace(/([-._]?)Q\d+$/i, "$1Q{q}");
          expanded.push({
            id: `${gradeRaw}-${stream.replace("_", "-")}-${subRaw.toLowerCase()}-${term.toLowerCase()}-2026`,
            year: "2026",
            term,
            grade: gradeRaw,
            stream,
            subject,
            titleAr: `${subAr} ${gradeRaw} ${streamAr}`,
            titleEn: `Grade ${gradeRaw} ${streamEn} ${subEn}`,
            subtitleAr: "هيكل امتحان نهاية الفصل · مقسم صفحة لكل سؤال وزاري مع التدريب التفاعلي",
            subtitleEn: "EOT Exam Structure · Dedicated interactive page per exam question",
            primaryUrlTemplate: `https://mr-mohammed-hesham.github.io/${prefixBeforeQ}/`,
            fallbackUrlTemplates: [
              `https://mr-mohammed-hesham.github.io/${prefixBeforeQ.replace(sep + "Q{q}", (sep === "-" ? "." : "-") + "Q{q}")}/`,
            ],
            defaultTotalQuestions: Math.max(25, qNum),
            mcqQuestionsEnd: 20,
          });
        }
      }
    }
  } catch {}

  try {
    ensureExamsFile();
    fs.writeFileSync(cacheFile, JSON.stringify(baseCurricula, null, 2), "utf8");
  } catch {}

  eot2026CurriculaCache = { all: expanded, timestamp: now };
  return expanded;
}

function cleanEotTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\|\s*Mr\.?\s*Mohammed\s*Hesham.*$/i, "")
    .replace(/^[\p{Extended_Pictographic}\uFE0F\u200D⚡⚛️📐📚🎯🏆🔥✨📊\s]+/u, "")
    .trim();
}

function prepareSafeSrcDocHtml(rawHtml: string): string {
  let html = rawHtml
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, "");

  const protectionScript = `<script>
(function(){
  try {
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
      }
    });
    window.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });
  } catch(e) {}
})();
</script>`;

  if (html.includes("</head>")) {
    html = html.replace("</head>", `${protectionScript}</head>`);
  } else {
    html = `${protectionScript}${html}`;
  }
  return html;
}

async function probeAndFetchEotQuestion(
  curriculum: InternalEotCurriculum,
  q: number,
  forceRefresh = false
): Promise<{ status: "live" | "pending"; liveTitle?: string; html?: string; checkedAt: number }> {
  const key = `${curriculum.id}__Q${q}`;
  const now = Date.now();
  const cached = eot2026QuestionCache.get(key);
  if (!forceRefresh && cached && now - cached.checkedAt < 60000) {
    return cached;
  }

  const qStr = String(q);
  const rawTemplates = [
    curriculum.primaryUrlTemplate.replace("{q}", qStr),
    ...(curriculum.fallbackUrlTemplates || []).map((t) => t.replace("{q}", qStr)),
  ];

  // Check raw.githubusercontent.com/<slug>/main/index.html first (instant, works even if GitHub Pages is off), then GitHub Pages
  const expandedCandidates: string[] = [];
  let anySlugExistsInRepoIndex = !eot2026KnownReposLower || eot2026KnownReposLower.size === 0;

  for (const tplUrl of rawTemplates) {
    const slugMatch = tplUrl.match(/github\.io\/([^/?#]+)/i);
    if (slugMatch && slugMatch[1]) {
      const slug = slugMatch[1];
      if (eot2026KnownReposLower && eot2026KnownReposLower.has(slug.toLowerCase())) {
        anySlugExistsInRepoIndex = true;
      }
      expandedCandidates.push(
        `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/${slug}/main/index.html`
      );
    }
    expandedCandidates.push(tplUrl);
  }

  if (!anySlugExistsInRepoIndex && !forceRefresh) {
    const pending = { status: "pending" as const, checkedAt: now };
    eot2026QuestionCache.set(key, pending);
    return pending;
  }

  const candidates = Array.from(new Set(expandedCandidates));

  for (const candidateUrl of candidates) {
    try {
      const targetUrl = forceRefresh
        ? `${candidateUrl}${candidateUrl.includes("?") ? "&" : "?"}v=${now}`
        : candidateUrl;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const upstream = await fetch(targetUrl, {
        signal: ctrl.signal,
        headers: { "User-Agent": "4U-Platform" },
      });
      clearTimeout(timer);

      if (upstream.ok) {
        const text = await upstream.text();
        if (text && text.length > 200 && !text.includes("<title>Page not found") && !text.includes("There isn't a GitHub Pages site here")) {
          let liveTitle: string | undefined;
          const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          if (m && m[1]) {
            const cleaned = cleanEotTitle(m[1]);
            if (cleaned) liveTitle = cleaned;
          }
          const hit = {
            status: "live" as const,
            liveTitle,
            html: prepareSafeSrcDocHtml(text),
            checkedAt: now,
          };
          eot2026QuestionCache.set(key, hit);
          return hit;
        }
      }
    } catch {}
  }

  const pending = { status: "pending" as const, checkedAt: now };
  eot2026QuestionCache.set(key, pending);
  return pending;
}

// 1. Live Curricula Metadata Endpoint (Zero URLs or Repo Slugs returned to UI)
app.get("/api/external-banks/eot2026", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "true";
    const allCurricula = await resolveEot2026Curricula(forceRefresh);
    const sharedSettings = readEot2026SharedSettings();

    const sanitized = allCurricula.map((c) => ({
      id: c.id,
      year: c.year,
      term: c.term,
      grade: c.grade,
      stream: c.stream,
      subject: c.subject,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      subtitleAr: c.subtitleAr,
      subtitleEn: c.subtitleEn,
      defaultTotalQuestions: sharedSettings.totalQuestionsByCurriculum[c.id] || c.defaultTotalQuestions,
      mcqQuestionsEnd: c.mcqQuestionsEnd,
      knownQuestionTitles: c.knownQuestionTitles,
    }));

    return res.json({
      success: true,
      count: sanitized.length,
      curricula: sanitized,
      sharedSettings,
      syncedAt: Date.now(),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to sync EOT 2026" });
  }
});

// 2. Fast Server-Side Batch Availability Probe
app.post("/api/external-banks/eot2026/probe-batch", async (req, res) => {
  try {
    const { curriculumIds, maxQuestions = 25, forceRefresh = false } = req.body || {};
    const allCurricula = await resolveEot2026Curricula(Boolean(forceRefresh));
    const sharedSettings = readEot2026SharedSettings();

    const targets = Array.isArray(curriculumIds) && curriculumIds.length > 0
      ? allCurricula.filter((c) => curriculumIds.includes(c.id))
      : allCurricula.filter((c) => c.year === "2026" && c.term === "T1");

    const probes: Record<string, Record<number, { status: "live" | "pending"; liveTitle?: string; checkedAt: number }>> = {};

    const tasks: { curr: InternalEotCurriculum; q: number }[] = [];
    for (const curr of targets) {
      probes[curr.id] = {};
      const limit = Math.min(
        Number(maxQuestions) || 25,
        sharedSettings.totalQuestionsByCurriculum[curr.id] || curr.defaultTotalQuestions
      );
      for (let q = 1; q <= limit; q++) {
        tasks.push({ curr, q });
      }
    }

    const concurrency = 10;
    async function worker() {
      while (tasks.length > 0) {
        const item = tasks.shift();
        if (!item) break;
        const result = await probeAndFetchEotQuestion(item.curr, item.q, Boolean(forceRefresh));
        probes[item.curr.id][item.q] = {
          status: result.status,
          liveTitle: result.liveTitle,
          checkedAt: result.checkedAt,
        };
      }
    }

    await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, tasks.length)) }, () => worker()));

    return res.json({ success: true, probes });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || "Batch probe failed" });
  }
});

// 3. Single Question Live HTML Content Delivery (for protected srcDoc rendering)
app.get("/api/external-banks/eot2026/question", async (req, res) => {
  try {
    const curriculumId = String(req.query.curriculumId || "");
    const q = Math.max(1, Number(req.query.q) || 1);
    const forceRefresh = req.query.refresh === "true";

    if (!curriculumId) {
      return res.status(400).json({ success: false, error: "curriculumId is required" });
    }

    const allCurricula = await resolveEot2026Curricula(false);
    const curr = allCurricula.find((c) => c.id === curriculumId);
    if (!curr) {
      return res.status(404).json({ success: false, status: "pending" });
    }

    const result = await probeAndFetchEotQuestion(curr, q, forceRefresh);
    return res.json({
      success: true,
      status: result.status,
      liveTitle: result.liveTitle,
      html: result.html || "",
      checkedAt: result.checkedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, status: "pending", error: err?.message });
  }
});

// 4. Shared EOT 2026 Settings Sync (persists question count updates across sessions)
app.post("/api/external-banks/eot2026/shared-settings", (req, res) => {
  try {
    const { curriculumId, totalQuestions } = req.body || {};
    if (!curriculumId || !totalQuestions) {
      return res.status(400).json({ success: false, error: "curriculumId and totalQuestions are required" });
    }
    const current = readEot2026SharedSettings();
    current.totalQuestionsByCurriculum[String(curriculumId)] = Math.max(1, Math.min(60, Number(totalQuestions) || 25));
    writeEot2026SharedSettings(current);
    return res.json({ success: true, sharedSettings: current });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});


// Helper function to inject the dynamic host URL for WhatsApp and social media bots
function transformHtmlForSocialPreviews(rawHtml: string, req: express.Request): string {
  const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
  const protocol = forwardedProto.split(',')[0].trim() || (req.secure ? 'https' : 'http');
  const forwardedHost = (req.headers['x-forwarded-host'] as string) || '';
  const host = forwardedHost.split(',')[0].trim() || req.headers.host || 'localhost:3000';
  
  const currentBaseUrl = `${protocol}://${host}`;
  const currentFullUrl = `${currentBaseUrl}${req.originalUrl || req.url || '/'}`;

  return rawHtml
    .replace(/https:\/\/hesham-afandi\.github\.io\/4U\/og-image\.jpg/g, `${currentBaseUrl}/og-image.jpg`)
    .replace(/https:\/\/hesham-afandi\.github\.io\/4U\/og-logo\.jpg/g, `${currentBaseUrl}/og-logo.jpg`)
    .replace(/https:\/\/hesham-afandi\.github\.io\/4U\//g, `${currentBaseUrl}/`)
    .replace(/https:\/\/hesham-afandi\.github\.io\/4U/g, currentBaseUrl)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${currentFullUrl}"`)
    .replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${currentFullUrl}"`);
}

// Serve public directory assets directly with explicit content types & CORS for og-image / favicons
const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir, {
  maxAge: "1d",
  setHeaders: (res, filePath) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (filePath.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
    }
  }
}));

// Route to serve dynamic social preview index.html specifically for crawlers and root requests
app.get("/og-preview", (req, res) => {
  const indexPath = path.join(process.cwd(), "index.html");
  if (fs.existsSync(indexPath)) {
    const rawHtml = fs.readFileSync(indexPath, "utf8");
    const transformed = transformHtmlForSocialPreviews(rawHtml, req);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(transformed);
  }
  res.redirect("/");
});

// Start dev server with Vite middleware if in development, else serve static production files
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Custom middleware to inject dynamic OG tags for all HTML responses
    app.use(async (req, res, next) => {
      // Skip API routes, Vite internal modules, and static file extensions
      if (req.path.startsWith('/api') || req.path.startsWith('/@') || req.path.startsWith('/src') || req.path.includes('.')) {
        return next();
      }

      try {
        const indexPath = path.join(process.cwd(), "index.html");
        if (fs.existsSync(indexPath)) {
          let rawHtml = fs.readFileSync(indexPath, "utf8");
          rawHtml = await vite.transformIndexHtml(req.originalUrl || req.url, rawHtml);
          const transformed = transformHtmlForSocialPreviews(rawHtml, req);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          return res.status(200).send(transformed);
        }
      } catch (e) {
        return next();
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    const staticOpts = {
      setHeaders: (res: express.Response) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      },
    };
    app.use(express.static(distPath, staticOpts));
    app.use("/4U", express.static(distPath, staticOpts));
    app.use("/4U", express.static(publicDir, staticOpts));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        const rawHtml = fs.readFileSync(indexPath, "utf8");
        const transformed = transformHtmlForSocialPreviews(rawHtml, req);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(transformed);
      }
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server:", err);
});
