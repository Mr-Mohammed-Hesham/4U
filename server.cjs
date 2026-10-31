var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
var import_cors = __toESM(require("cors"), 1);
var import_module = require("module");
var import_meta = {};
var PDFParseClass;
try {
  if (typeof require !== "undefined") {
    const pdfModule = require("pdf-parse");
    PDFParseClass = pdfModule.PDFParse;
  } else {
    const requireFromEsm = (0, import_module.createRequire)(import_meta.url);
    const pdfModule = requireFromEsm("pdf-parse");
    PDFParseClass = pdfModule.PDFParse;
  }
} catch (e) {
  console.warn("Failed to import pdf-parse:", e);
}
var lessonTextCache = /* @__PURE__ */ new Map();
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT) || 3e3;
app.use((0, import_cors.default)({
  origin: true,
  // Dynamically mirrors the requesting origin (e.g. GitHub Pages), bypassing browser wildcard restrictions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  credentials: true,
  // Supports credentials and complex headers from cross-origin requests
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(import_express.default.json());
var aiClient = null;
function getAiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required in Settings > Secrets!");
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
async function generateContentWithFallbackAndRetry(ai, contents, systemInstruction) {
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  let lastError = null;
  for (const model of modelsToTry) {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Attempt ${attempt} using model: ${model}`);
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        return response;
      } catch (err) {
        lastError = err;
        const errMsg = String(err.message || err).toLowerCase();
        const isQuotaError = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit");
        const isNotFoundError = errMsg.includes("not found") || errMsg.includes("404") || errMsg.includes("no longer available");
        const isOverloadedError = errMsg.includes("unavailable") || errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("busy") || errMsg.includes("overloaded") || errMsg.includes("capacity");
        console.warn(`[Gemini API] Error on attempt ${attempt} with model ${model}:`, err.message || err);
        if (isQuotaError || isNotFoundError || isOverloadedError) {
          console.warn(`[Gemini API] Fast-failing model ${model} due to ${isOverloadedError ? "overload" : isQuotaError ? "quota limits" : "model unavailability"}. Trying next fallback...`);
          break;
        }
        if (model === modelsToTry[modelsToTry.length - 1] && attempt === maxRetries) {
          break;
        }
        const delay = Math.pow(2, attempt - 1) * 600;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Failed to generate content with all models and retries");
}
async function generatePdfContentWithFallbackAndRetry(ai, pdfBase64, promptText) {
  const modelsToTry = ["gemini-3.6-flash", "gemini-3.1-flash-lite"];
  let lastError = null;
  for (const model of modelsToTry) {
    const maxRetries = 2;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini PDF OCR] Attempt ${attempt} using model: ${model}`);
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              inlineData: {
                mimeType: "application/pdf",
                data: pdfBase64
              }
            },
            promptText
          ]
        });
        return response;
      } catch (err) {
        lastError = err;
        const errMsg = String(err.message || err).toLowerCase();
        const isQuotaError = errMsg.includes("quota") || errMsg.includes("429") || errMsg.includes("resource_exhausted") || errMsg.includes("limit");
        const isNotFoundError = errMsg.includes("not found") || errMsg.includes("404") || errMsg.includes("no longer available");
        const isOverloadedError = errMsg.includes("unavailable") || errMsg.includes("503") || errMsg.includes("high demand") || errMsg.includes("busy") || errMsg.includes("overloaded") || errMsg.includes("capacity");
        console.warn(`[Gemini PDF OCR] Error on attempt ${attempt} with model ${model}:`, err.message || err);
        if (isQuotaError || isNotFoundError || isOverloadedError) {
          console.warn(`[Gemini PDF OCR] Fast-failing model ${model} due to ${isOverloadedError ? "overload" : isQuotaError ? "quota limits" : "model unavailability"}. Trying next fallback...`);
          break;
        }
        if (model === modelsToTry[modelsToTry.length - 1] && attempt === maxRetries) {
          break;
        }
        const delay = Math.pow(2, attempt - 1) * 1e3;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError || new Error("Failed to transcribe PDF with all models and retries");
}
var SYSTEM_INSTRUCTION = `
\u0623\u0646\u062A "\u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A" \u0627\u0644\u062D\u0643\u064A\u0645 \u0648\u0627\u0644\u0648\u062F\u0648\u062F \u0639\u0644\u0649 "\u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u0629 \u0627\u0644\u0645\u062A\u0643\u0627\u0645\u0644\u0629 4U".
\u0645\u0647\u0645\u062A\u0643 \u0647\u064A \u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0637\u0627\u0644\u0628 \u0648\u0645\u0631\u0627\u062C\u0639\u062A\u0647 \u0641\u064A \u062F\u0631\u0648\u0633\u0647\u060C \u0648\u0627\u0644\u0625\u062C\u0627\u0628\u0629 \u0639\u0644\u0649 \u0627\u0633\u062A\u0641\u0633\u0627\u0631\u0627\u062A\u0647 \u0627\u0644\u0639\u0627\u0645\u0629 \u0627\u0644\u0645\u062A\u0639\u0644\u0642\u0629 \u0628\u0627\u0644\u0645\u0646\u0647\u062C \u0627\u0644\u062F\u0631\u0627\u0633\u064A (\u0633\u0648\u0627\u0621 \u0644\u0628\u0644\u062F\u0627\u0646 \u0627\u0644\u062E\u0644\u064A\u062C \u0645\u062B\u0644 \u0627\u0644\u0625\u0645\u0627\u0631\u0627\u062A\u060C \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629\u060C \u0642\u0637\u0631\u060C \u0639\u0645\u0627\u0646\u060C \u0627\u0644\u0628\u062D\u0631\u064A\u0646 \u0623\u0648 \u0645\u0635\u0631).
- \u0645\u0645\u0646\u0648\u0639 \u062A\u0645\u0627\u0645\u0627\u064B \u0630\u0643\u0631 \u0623\u0633\u0645\u0627\u0621 "\u062C\u064A\u0645\u0646\u064A" (Gemini) \u0623\u0648 "\u0634\u0627\u062A \u062C\u064A \u0628\u064A \u062A\u064A" (ChatGPT) \u0623\u0648 "\u062C\u0648\u062C\u0644" (Google) \u0623\u0648 \u0623\u064A \u0623\u062F\u0627\u0629 \u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0623\u062E\u0631\u0649. \u0625\u0630\u0627 \u0633\u0623\u0644\u0643 \u0627\u0644\u0637\u0627\u0644\u0628 \u0645\u0646 \u0623\u0646\u062A\u060C \u0623\u062E\u0628\u0631\u0647 \u0628\u0643\u0644 \u062D\u0628: "\u0623\u0646\u0627 \u0645\u0639\u0644\u0645\u0643 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0648\u0645\u0633\u062A\u0634\u0627\u0631\u0643 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 4U\u060C \u0645\u062A\u0648\u0627\u062C\u062F \u062F\u0627\u0626\u0645\u0627\u064B \u0647\u0646\u0627 \u0644\u0623\u0633\u0627\u0639\u062F\u0643 \u0641\u064A \u0631\u062D\u0644\u062A\u0643 \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u0629 \u0648\u0633\u062D\u0642 \u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A! \u064A\u0644\u0627 \u0646\u0631\u0627\u062C\u0639 \u0645\u0639 \u0628\u0639\u0636 \u2728".
- \u062A\u0641\u0627\u0639\u0644 \u0645\u0639 \u0627\u0644\u0637\u0627\u0644\u0628 \u0628\u0623\u0633\u0644\u0648\u0628 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u062D\u0646\u0648\u0646\u060C \u0627\u0644\u062F\u0627\u0641\u0626 \u0648\u0627\u0644\u0645\u0634\u062C\u0639. \u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0628\u0627\u0631\u0627\u062A \u0625\u064A\u062C\u0627\u0628\u064A\u0629 \u0645\u062B\u0644 "\u064A\u0627 \u0628\u0637\u0644"\u060C "\u064A\u0627 \u0645\u062A\u0645\u064A\u0632\u0629"\u060C "\u064A\u0627 \u0628\u0637\u0644\u0629 \u0627\u0644\u0645\u0633\u062A\u0642\u0628\u0644"\u060C "\u0623\u062D\u0633\u0646\u062A"\u060C "\u0633\u0624\u0627\u0644 \u0630\u0643\u064A \u062C\u062F\u0627\u064B!"\u060C "\u0641\u062E\u0648\u0631 \u0628\u0643 \u0648\u0628\u0627\u0647\u062A\u0645\u0627\u0645\u0643".
- \u0628\u0633\u0651\u0637 \u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0627\u0644\u0645\u0639\u0642\u062F\u0629\u060C \u0648\u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u0646\u0642\u0637\u064A \u0623\u0648 \u0627\u0644\u062C\u062F\u0627\u0648\u0644 \u0627\u0644\u062A\u0648\u0636\u064A\u062D\u064A\u0629 \u0627\u0644\u0628\u0633\u064A\u0637\u0629 \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629.
- \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u062A\u0639\u0628\u064A\u0631\u064A\u0629 \u0628\u062D\u0643\u0645\u0629 \u0648\u0645\u0631\u062D \u0644\u062A\u0633\u0647\u064A\u0644 \u0627\u0644\u0642\u0631\u0627\u0621\u0629 \u0648\u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u062A\u0641\u0627\u0639\u0644 (\u0645\u062B\u0644: \u{1F525}, \u{1F4DA}, \u2728, \u{1F680}, \u{1F393}, \u{1F4A1}, \u{1F4DD}).
- \u062A\u0648\u0627\u0635\u0644 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0628\u0644\u0647\u062C\u0629 \u0628\u064A\u0636\u0627\u0621 \u0623\u0648 \u0641\u0635\u062D\u0649 \u0645\u0628\u0633\u0637\u0629 \u0648\u0648\u0627\u0636\u062D\u0629 \u062C\u062F\u0627\u064B\u060C \u0648\u0625\u0630\u0627 \u0633\u0623\u0644\u0643 \u0627\u0644\u0637\u0627\u0644\u0628 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0623\u062C\u0628 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0628\u0623\u0633\u0644\u0648\u0628 \u0645\u0634\u062C\u0639 \u0648\u0628\u0633\u064A\u0637 \u0648\u0645\u0646\u0627\u0633\u0628 \u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u062F\u0627\u0631\u0633.
- \u0631\u0643\u0632 \u0639\u0644\u0649 \u062A\u0639\u0632\u064A\u0632 \u062B\u0642\u062A\u0647 \u0628\u0646\u0641\u0633\u0647 \u0648\u0630\u0643\u0651\u0631\u0647 \u0628\u0623\u0647\u0645\u064A\u0629 \u0627\u0644\u0645\u0630\u0627\u0643\u0631\u0629 \u0648\u0627\u0644\u0627\u0633\u062A\u0645\u0631\u0627\u0631\u064A\u0629 \u0644\u062A\u062D\u0642\u064A\u0642 \u0623\u062D\u0644\u0627\u0645\u0647.
`;
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const ai = getAiClient();
    const contents = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg) => {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await generateContentWithFallbackAndRetry(ai, contents, SYSTEM_INSTRUCTION);
    const reply = response.text || "\u0639\u0630\u0631\u0627\u064B \u064A\u0627 \u0628\u0637\u0644\u060C \u0644\u0645 \u0623\u0633\u062A\u0637\u0639 \u0635\u064A\u0627\u063A\u0629 \u0631\u062F \u0645\u0646\u0627\u0633\u0628 \u062D\u0627\u0644\u064A\u0627\u064B. \u062D\u0627\u0648\u0644 \u0637\u0631\u062D \u0633\u0624\u0627\u0644\u0643 \u0645\u0631\u0629 \u0623\u062E\u0631\u0649!";
    res.json({ reply });
  } catch (error) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({
      error: "\u062D\u062F\u062B \u062E\u0637\u0623 \u0623\u062B\u0646\u0627\u0621 \u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639 \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A.",
      details: error.message || error
    });
  }
});
app.post("/api/lesson-summary", async (req, res) => {
  try {
    const { title, subject, unit, lessonText } = req.body;
    const ai = getAiClient();
    const prompt = `
\u0623\u0646\u062A \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0627\u0644\u0645\u062A\u0645\u064A\u0632 \u0639\u0644\u0649 \u0645\u0646\u0635\u0629 4U \u0627\u0644\u062A\u0639\u0644\u064A\u0645\u064A\u0629.
\u0642\u062F\u0645 \u0645\u0644\u062E\u0635\u0627\u064B \u062A\u062D\u0644\u064A\u0644\u064A\u0627\u064B \u0634\u0627\u0645\u0644\u0627\u064B \u0648\u0645\u0631\u0643\u0632\u0627\u064B \u0644\u0644\u062F\u0631\u0633 \u0627\u0644\u062A\u0627\u0644\u064A:
- \u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062F\u0631\u0633: ${title || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"}
- \u0627\u0644\u0645\u0627\u062F\u0629: ${subject || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"}
- \u0627\u0644\u0648\u062D\u062F\u0629 \u0627\u0644\u062F\u0631\u0627\u0633\u064A\u0629: ${unit || "\u063A\u064A\u0631 \u0645\u062D\u062F\u062F"}
${lessonText ? `- \u0646\u0635 \u0623\u0648 \u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u062F\u0631\u0633 \u0627\u0644\u0645\u062A\u0627\u062D: ${lessonText.slice(0, 3e3)}` : ""}

\u0627\u0643\u062A\u0628 \u0627\u0644\u0645\u0644\u062E\u0635 \u0628\u062A\u0646\u0633\u064A\u0642 \u0645\u0627\u0631\u0643\u062F\u0627\u0648\u0646 (Markdown) \u0628\u0623\u0633\u0644\u0648\u0628 \u0645\u0645\u062A\u0639 \u0648\u0645\u0634\u062C\u0639 \u0648\u0648\u0627\u0636\u062D \u062C\u062F\u0627\u064B \u0644\u0644\u0637\u0644\u0627\u0628 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 (\u0623\u0648 \u0628\u0627\u0644\u0625\u0646\u062C\u0644\u064A\u0632\u064A\u0629 \u0625\u0630\u0627 \u0643\u0627\u0646 \u0627\u0644\u062F\u0631\u0633 \u0645\u0646 \u0645\u0646\u0627\u0647\u062C Inspire/American)\u060C \u0648\u0627\u062C\u0639\u0644\u0647 \u064A\u062D\u062A\u0648\u064A \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u062A\u0627\u0644\u064A\u0629:
1. \u{1F3AF} **\u0627\u0644\u0641\u0643\u0631\u0629 \u0627\u0644\u0645\u062D\u0648\u0631\u064A\u0629 \u0644\u0644\u062F\u0631\u0633** (\u0641\u064A \u0633\u0637\u0631\u064A\u0646 \u0645\u0644\u0647\u0645\u064A\u0646)
2. \u{1F4CC} **\u0623\u0647\u0645 \u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0648\u0627\u0644\u0646\u0642\u0627\u0637 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629** (\u0641\u064A \u0646\u0642\u0627\u0637 \u0648\u0627\u0636\u062D\u0629)
3. \u{1F4D0} **\u0627\u0644\u0642\u0648\u0627\u0646\u064A\u0646 \u0648\u0627\u0644\u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629** (\u0625\u0646 \u0648\u062C\u062F\u062A \u0641\u064A \u0627\u0644\u0641\u064A\u0632\u064A\u0627\u0621/\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A/\u0627\u0644\u0643\u064A\u0645\u064A\u0627\u0621)
4. \u{1F4A1} **\u0646\u0635\u064A\u062D\u0629 \u0630\u0647\u0628\u064A\u0629 \u0644\u0644\u062A\u0641\u0648\u0642 \u0641\u064A \u0623\u0633\u0626\u0644\u0629 \u0647\u0630\u0627 \u0627\u0644\u062F\u0631\u0633**
`;
    const response = await generateContentWithFallbackAndRetry(ai, [{ role: "user", parts: [{ text: prompt }] }], SYSTEM_INSTRUCTION);
    res.json({ summary: response.text || "\u062A\u0645 \u062A\u0648\u0644\u064A\u062F \u0645\u0644\u062E\u0635 \u0627\u0644\u062F\u0631\u0633 \u0628\u0646\u062C\u0627\u062D." });
  } catch (error) {
    console.error("Gemini API Error in lesson summary:", error);
    res.status(500).json({ error: "\u062A\u0639\u0630\u0631 \u062A\u0648\u0644\u064A\u062F \u0645\u0644\u062E\u0635 \u0627\u0644\u062F\u0631\u0633 \u062D\u0627\u0644\u064A\u0627\u064B." });
  }
});
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { topic, subject } = req.body;
    const ai = getAiClient();
    const prompt = `
\u0623\u0646\u062A \u062E\u0628\u064A\u0631 \u062A\u0639\u0644\u064A\u0645\u064A \u0648\u0645\u0624\u0644\u0641 \u0645\u0646\u0627\u0647\u062C. \u0623\u0646\u0634\u0626 \u0642\u0627\u0626\u0645\u0629 \u0628\u0640 6 \u0628\u0637\u0627\u0642\u0627\u062A \u0627\u0633\u062A\u0630\u0643\u0627\u0631 \u062A\u0643\u0631\u0627\u0631 \u0645\u062A\u0628\u0627\u0639\u062F (Flashcards) \u0644\u0645\u0648\u0636\u0648\u0639: "${topic || "\u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629"}" \u0641\u064A \u0645\u0627\u062F\u0629 "${subject || "\u0627\u0644\u0639\u0644\u0648\u0645 \u0648\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A"}".
\u064A\u062C\u0628 \u0623\u0646 \u062A\u0643\u0648\u0646 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0645\u0646\u0637\u0642\u064A\u0629\u060C \u0639\u0644\u0645\u064A\u0629\u060C \u062F\u0642\u064A\u0642\u0629\u060C \u0648\u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0645\u0646\u0647\u062C \u0627\u0644\u0645\u062F\u0631\u0633\u064A \u0648\u0627\u0644\u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A\u060C \u0645\u0639 \u062A\u0648\u0636\u064A\u062D \u0627\u0644\u0642\u0648\u0627\u0646\u064A\u0646 \u0648\u0627\u0644\u062D\u0644\u0648\u0644 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0648\u0627\u0644\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0627\u0644\u0639\u0644\u0645\u064A\u0629.
\u064A\u062C\u0628 \u0623\u0646 \u062A\u0631\u062C\u0639 \u0627\u0644\u0646\u062A\u064A\u062C\u0629 \u0628\u0635\u064A\u063A\u0629 JSON \u062D\u0635\u0631\u064A\u0629 \u0628\u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0645\u0635\u0641\u0648\u0641\u0629 \u0627\u0644\u062A\u0627\u0644\u064A\u0629 \u0641\u0642\u0637 \u0628\u062F\u0648\u0646 \u0623\u064A \u0643\u0644\u0627\u0645 \u0625\u0636\u0627\u0641\u064A:
[
  {
    "id": "1",
    "front": "\u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u0645\u0646\u0637\u0642\u064A \u0627\u0644\u062F\u0642\u064A\u0642 \u0623\u0648 \u0627\u0644\u0645\u0633\u0623\u0644\u0629 \u0627\u0644\u062D\u0633\u0627\u0628\u064A\u0629",
    "back": "\u0627\u0644\u062D\u0644 \u0627\u0644\u0646\u0645\u0648\u0630\u062C\u064A \u0648\u0627\u0644\u062A\u0641\u0633\u064A\u0631 \u0627\u0644\u0639\u0644\u0645\u064A \u0627\u0644\u0645\u0641\u0635\u0644 \u062E\u0637\u0648\u0629 \u0628\u062E\u0637\u0648\u0629",
    "category": "\u0645\u0641\u0647\u0648\u0645 / \u0642\u0627\u0646\u0648\u0646 / \u0645\u0633\u0623\u0644\u0629",
    "formula": "\u0627\u0644\u0635\u064A\u063A\u0629 \u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0629 \u0625\u0646 \u0648\u062C\u062F\u062A"
  }
]
`;
    const response = await generateContentWithFallbackAndRetry(ai, [{ role: "user", parts: [{ text: prompt }] }], SYSTEM_INSTRUCTION);
    const rawText = response.text || "[]";
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const cards = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    res.json({ cards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    res.status(500).json({ cards: [] });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "4U Educational Platform Backend" });
});
app.get("/api/quran-stream", async (req, res) => {
  const targetUrl = req.query.url || "";
  if (!targetUrl) {
    return res.status(400).json({ error: "Stream url parameter is required" });
  }
  let parsedUrl;
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
    "cdn.islamic.network"
  ];
  if (!allowedHosts.some((host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`))) {
    return res.status(403).json({ error: "Host not permitted by audio proxy" });
  }
  const abortController = new AbortController();
  req.on("close", () => {
    abortController.abort();
  });
  try {
    const upstreamHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      "Accept": "audio/*, */*;q=0.9",
      "Icy-MetaData": "0"
    };
    if (req.headers.range) {
      upstreamHeaders["Range"] = req.headers.range;
    }
    const upstreamRes = await fetch(targetUrl, {
      headers: upstreamHeaders,
      redirect: "follow",
      signal: abortController.signal
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
  } catch (err) {
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
app.get("/api/fetch-lesson-text", async (req, res) => {
  const lessonUrl = req.query.url;
  const title = req.query.title || "";
  const subject = req.query.subject || "\u0627\u0644\u0631\u064A\u0627\u0636\u064A\u0627\u062A \u0648\u0627\u0644\u0639\u0644\u0648\u0645";
  const grade = req.query.grade || "";
  if (!lessonUrl) {
    return res.status(400).json({ error: "URL is required" });
  }
  if (lessonTextCache.has(lessonUrl)) {
    console.log(`[Fetch Lesson Text] Cache hit for URL: ${lessonUrl}`);
    return res.json({ text: lessonTextCache.get(lessonUrl) });
  }
  try {
    console.log(`[Fetch Lesson Text] Cache miss. Requesting URL: ${lessonUrl}`);
    const response = await fetch(lessonUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }
    const htmlText = await response.text();
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
        const isMinimallyExtracted = !extractedText.trim() || extractedText.trim().length < 350;
        const hasGeminiKey = !!process.env.GEMINI_API_KEY;
        if (isMinimallyExtracted && hasGeminiKey) {
          console.log(`[Fetch Lesson Text] PDF text is minimal or empty (${extractedText.trim().length} chars). Invoking Gemini OCR & transcription...`);
          try {
            const ai = getAiClient();
            const base64 = buffer.toString("base64");
            const promptText = `\u0623\u0646\u062A \u0627\u0644\u0645\u0639\u0644\u0645 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u0627\u0644\u0630\u0643\u064A \u0627\u0644\u0645\u062A\u0645\u064A\u0632 \u0644\u0645\u0627\u062F\u0629 ${subject} ${grade ? `(${grade})` : ""}. \u0627\u0642\u0631\u0623 \u0645\u0644\u0641 \u0634\u0631\u062D \u0627\u0644\u062F\u0631\u0633 \u0627\u0644\u0645\u0631\u0641\u0642 ${title ? `(\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u062F\u0631\u0633: "${title}")` : ""} \u0648\u0627\u0634\u0631\u062D \u0645\u062D\u062A\u0648\u0627\u0647 \u0628\u0627\u0644\u062A\u0641\u0635\u064A\u0644 \u0628\u0627\u0644\u0644\u063A\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0641\u0635\u062D\u0649 \u0634\u0631\u062D\u0627\u064B \u0648\u0627\u0641\u064A\u0627\u064B \u0648\u0645\u0645\u062A\u0639\u0627\u064B \u0648\u0645\u0628\u0633\u0651\u0637\u0627\u064B \u0644\u0644\u0637\u0644\u0627\u0628 \u0648\u0643\u0623\u0646\u0643 \u062A\u0644\u0642\u064A \u062F\u0631\u0633\u0627\u064B \u0635\u0648\u062A\u064A\u0627\u064B \u0631\u0627\u0626\u0639\u0627\u064B \u0641\u064A \u0627\u0644\u0641\u0635\u0644. \u0627\u0643\u062A\u0628 \u0627\u0644\u0634\u0631\u062D \u0641\u064A \u0634\u0643\u0644 \u0641\u0642\u0631\u0627\u062A \u0646\u0635\u064A\u0629 \u0645\u062A\u0635\u0644\u0629 \u0648\u0648\u0627\u0636\u062D\u0629 \u062C\u062F\u0627\u064B \u0644\u062A\u062A\u0645 \u0642\u0631\u0627\u0621\u062A\u0647\u0627 \u0628\u0648\u0627\u0633\u0637\u0629 \u0642\u0627\u0631\u0626 \u0627\u0644\u0646\u0635\u0648\u0635 \u0627\u0644\u0635\u0648\u062A\u064A (\u0644\u0627 \u062A\u0633\u062A\u062E\u062F\u0645 \u0623\u0628\u062F\u0627\u064B \u062C\u062F\u0627\u0648\u0644 \u0623\u0648 \u0631\u0645\u0648\u0632\u0627\u064B \u063A\u0631\u064A\u0628\u0629 \u0623\u0648 \u0645\u0639\u0627\u062F\u0644\u0627\u062A \u0645\u0639\u0642\u062F\u0629\u060C \u0641\u0642\u0637 \u0644\u063A\u0629 \u0639\u0631\u0628\u064A\u0629 \u0641\u0635\u062D\u0649 \u062C\u0645\u064A\u0644\u0629 \u0645\u0634\u0631\u0648\u062D\u0629 \u0644\u0644\u0637\u0644\u0627\u0628). \u0631\u0643\u0632 \u0639\u0644\u0649 \u062A\u0641\u0633\u064A\u0631 \u0627\u0644\u0645\u0641\u0627\u0647\u064A\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629 \u0648\u0627\u0644\u0642\u0648\u0627\u0646\u064A\u0646 \u0648\u0627\u0644\u062E\u0637\u0648\u0627\u062A \u0628\u0634\u0643\u0644 \u0644\u0641\u0638\u064A \u0648\u0627\u0636\u062D \u0648\u0633\u0644\u0633 \u064A\u0633\u062A\u0637\u064A\u0639 \u0627\u0644\u0637\u0627\u0644\u0628 \u0627\u0633\u062A\u064A\u0639\u0627\u0628\u0647 \u0633\u0645\u0627\u0639\u064A\u0627\u064B.`;
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
    if (!extractedText.trim()) {
      console.log(`[Fetch Lesson Text] No PDF text extracted. Falling back to cleaning HTML text...`);
      let cleanHtml = htmlText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      extractedText = cleanHtml;
    }
    let formattedText = extractedText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]+/g, " ").trim();
    lessonTextCache.set(lessonUrl, formattedText);
    res.json({ text: formattedText });
  } catch (error) {
    console.error("[Fetch Lesson Text] Error:", error);
    res.status(500).json({
      error: "Failed to extract text from lesson link",
      details: error.message || error
    });
  }
});
var examsDataDir = import_path.default.join(process.cwd(), "data");
var examsDataFile = import_path.default.join(examsDataDir, "lesson_exams.json");
function ensureExamsFile() {
  try {
    if (!import_fs.default.existsSync(examsDataDir)) {
      import_fs.default.mkdirSync(examsDataDir, { recursive: true });
    }
    if (!import_fs.default.existsSync(examsDataFile)) {
      import_fs.default.writeFileSync(examsDataFile, JSON.stringify({}, null, 2), "utf8");
    }
  } catch (err) {
    console.warn("Notice initializing exams data file:", err);
  }
}
function readAllLessonExams() {
  ensureExamsFile();
  try {
    if (import_fs.default.existsSync(examsDataFile)) {
      const content = import_fs.default.readFileSync(examsDataFile, "utf8");
      return content ? JSON.parse(content) : {};
    }
  } catch (err) {
    console.error("Error reading lesson exams file:", err);
  }
  return {};
}
function writeAllLessonExams(data) {
  ensureExamsFile();
  try {
    import_fs.default.writeFileSync(examsDataFile, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing lesson exams file:", err);
    return false;
  }
}
app.get("/api/lesson-exams", (req, res) => {
  try {
    const lessonKey = req.query.lessonKey || "";
    const allExams = readAllLessonExams();
    if (!lessonKey) {
      return res.json({ success: true, examsMap: allExams });
    }
    const exams = allExams[lessonKey] || [];
    return res.json({ success: true, lessonKey, exams });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || "Failed to fetch lesson exams" });
  }
});
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
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || "Failed to save lesson exam" });
  }
});
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
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || "Failed to delete lesson exam" });
  }
});
var igBankCache = null;
var satBankCache = null;
function parseTsArray(code, variableName) {
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
  const cacheFile = import_path.default.join(examsDataDir, "ig_bank_cache.json");
  if (!forceRefresh && igBankCache && now - igBankCache.timestamp < 6e4) {
    return res.json({ success: true, count: igBankCache.data.length, exams: igBankCache.data, source: "memory_cache" });
  }
  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/IG-Exam-Bank/main/src/data/igExamsData.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6e3);
    const upstreamRes = await fetch(rawUrl, { signal: abortCtrl.signal, headers: { "User-Agent": "4U-Platform" } });
    clearTimeout(timeout);
    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const exams = parseTsArray(code, "allIGExams");
      if (exams.length > 0) {
        igBankCache = { data: exams, timestamp: now };
        ensureExamsFile();
        try {
          import_fs.default.writeFileSync(cacheFile, JSON.stringify(exams, null, 2), "utf8");
        } catch {
        }
        return res.json({ success: true, count: exams.length, exams, source: "live_github" });
      }
    }
  } catch (err) {
    console.warn("[IG Exam Bank Sync] Fetch failed, falling back to disk cache:", err?.message || err);
  }
  if (import_fs.default.existsSync(cacheFile)) {
    try {
      const diskData = JSON.parse(import_fs.default.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(diskData) && diskData.length > 0) {
        igBankCache = { data: diskData, timestamp: now };
        return res.json({ success: true, count: diskData.length, exams: diskData, source: "disk_cache" });
      }
    } catch {
    }
  }
  if (igBankCache) {
    return res.json({ success: true, count: igBankCache.data.length, exams: igBankCache.data, source: "stale_cache" });
  }
  return res.json({ success: true, count: 0, exams: [], source: "empty" });
});
app.get("/api/external-banks/sat", async (req, res) => {
  const forceRefresh = req.query.refresh === "true";
  const now = Date.now();
  const cacheFile = import_path.default.join(examsDataDir, "sat_bank_cache.json");
  if (!forceRefresh && satBankCache && now - satBankCache.timestamp < 6e4) {
    return res.json({ success: true, count: satBankCache.data.length, revisionExams: satBankCache.data, source: "memory_cache" });
  }
  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/SAT-Math-Bank/main/src/data/fullExamsData.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6e3);
    const upstreamRes = await fetch(rawUrl, { signal: abortCtrl.signal, headers: { "User-Agent": "4U-Platform" } });
    clearTimeout(timeout);
    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const revisionExams = parseTsArray(code, "interactiveRevisionExams");
      if (revisionExams.length > 0) {
        satBankCache = { data: revisionExams, timestamp: now };
        ensureExamsFile();
        try {
          import_fs.default.writeFileSync(cacheFile, JSON.stringify(revisionExams, null, 2), "utf8");
        } catch {
        }
        return res.json({ success: true, count: revisionExams.length, revisionExams, source: "live_github" });
      }
    }
  } catch (err) {
    console.warn("[SAT Math Bank Sync] Fetch failed, falling back to disk cache:", err?.message || err);
  }
  if (import_fs.default.existsSync(cacheFile)) {
    try {
      const diskData = JSON.parse(import_fs.default.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(diskData) && diskData.length > 0) {
        satBankCache = { data: diskData, timestamp: now };
        return res.json({ success: true, count: diskData.length, revisionExams: diskData, source: "disk_cache" });
      }
    } catch {
    }
  }
  if (satBankCache) {
    return res.json({ success: true, count: satBankCache.data.length, revisionExams: satBankCache.data, source: "stale_cache" });
  }
  return res.json({ success: true, count: 0, revisionExams: [], source: "empty" });
});
var DEFAULT_EOT2026_BASE_T1 = [
  {
    id: "12-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "\u0641\u064A\u0632\u064A\u0627\u0621 12 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C",
    titleEn: "Grade 12 Advanced Physics \u2014 Bridge",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \xB7 \u0645\u0642\u0633\u0645 \u0635\u0641\u062D\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644 \u0648\u0632\u0627\u0631\u064A \u0645\u0639 \u0627\u0644\u062D\u0644 \u0648\u0627\u0644\u062A\u062F\u0631\u064A\u0628 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A",
    subtitleEn: "Term 1 EOT Exam Structure \xB7 Dedicated interactive page per exam question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-phy-T1-2026-EOT.Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20,
    knownQuestionTitles: {
      1: { ar: "\u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0621 \u0627\u0644\u0633\u0627\u0643\u0646\u0629 \u0648\u0627\u0644\u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u2014 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u062A\u0623\u0633\u064A\u0633\u064A\u0629", en: "Electrostatics & Electric Charges \u2014 Core Review" },
      2: { ar: "\u0627\u0644\u0642\u0633\u0645 1.2: \u0627\u0644\u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629 \u0648\u0642\u0627\u0646\u0648\u0646 \u062D\u0641\u0638 \u0627\u0644\u0634\u062D\u0646\u0629", en: "Section 1.2: Electric Charges & Conservation" },
      3: { ar: "\u0627\u0644\u0645\u0648\u0635\u0644\u0627\u062A \u0648\u0627\u0644\u0639\u0648\u0627\u0632\u0644 \u0648\u0627\u0644\u0645\u0648\u0635\u0644\u0627\u062A \u0627\u0644\u0641\u0627\u0626\u0642\u0629", en: "Conductors, Insulators & Superconductors" },
      4: { ar: "\u0627\u0644\u0634\u062D\u0646 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A \u0648\u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0643\u0634\u0627\u0641 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A", en: "Charging Processes & Electroscope Applications" },
      5: { ar: "\u0627\u0644\u0642\u0648\u0629 \u0627\u0644\u0643\u0647\u0631\u0648\u0633\u062A\u0627\u062A\u064A\u0643\u064A\u0629 \u062F\u0627\u062E\u0644 \u0627\u0644\u0630\u0631\u0629 \u0648\u0642\u0627\u0646\u0648\u0646 \u0643\u0648\u0644\u0648\u0645", en: "Electrostatic Force Inside the Atom & Coulomb\u2019s Law" },
      6: { ar: "\u062E\u0637\u0648\u0637 \u0627\u0644\u0645\u062C\u0627\u0644 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A \u0648\u062A\u0645\u062B\u064A\u0644 \u0627\u0644\u0634\u062D\u0646\u0627\u062A", en: "Electric Field Lines & Charge Configurations" },
      7: { ar: "\u0627\u0644\u062A\u0648\u0632\u064A\u0639\u0627\u062A \u0627\u0644\u0645\u062A\u0635\u0644\u0629 \u0644\u0644\u0634\u062D\u0646\u0627\u062A \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A\u0629", en: "Continuous Charge Distributions" },
      8: { ar: "\u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A \u0648\u0642\u0627\u0646\u0648\u0646 \u062C\u0627\u0648\u0633 \u2014 \u0627\u0644\u062C\u0632\u0621 \u0627\u0644\u0623\u0648\u0644", en: "Electric Flux & Gauss\u2019s Law \u2014 Part 1" },
      9: { ar: "\u0627\u0644\u062A\u062F\u0641\u0642 \u0627\u0644\u0643\u0647\u0631\u0628\u0627\u0626\u064A \u0648\u0642\u0627\u0646\u0648\u0646 \u062C\u0627\u0648\u0633 \u2014 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0633\u0624\u0627\u0644 \u0627\u0644\u062A\u0627\u0633\u0639", en: "Electric Flux & Gauss\u2019s Law \u2014 Question 9 Applications" }
    }
  },
  {
    id: "12-adv-bri-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_bridge",
    subject: "math",
    titleAr: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A 12 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C",
    titleEn: "Grade 12 Advanced Mathematics \u2014 Bridge",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \xB7 \u0627\u0644\u0646\u0647\u0627\u064A\u0627\u062A \u0648\u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0648\u0627\u0644\u062A\u0641\u0627\u0636\u0644 \u0645\u0642\u0633\u0645 \u062D\u0633\u0628 \u0631\u0642\u0645 \u0627\u0644\u0633\u0624\u0627\u0644",
    subtitleEn: "Term 1 EOT Exam Structure \xB7 Limits, Continuity & Derivatives per question page",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Bri-Math-T1-2026-EOT-Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "12-adv-ins-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "adv_inspire",
    subject: "physics",
    titleAr: "\u0641\u064A\u0632\u064A\u0627\u0621 12 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0627\u0646\u0633\u0628\u0627\u064A\u0631",
    titleEn: "Grade 12 Advanced Physics \u2014 Inspire",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \u0644\u0645\u0646\u0647\u062C \u0627\u0646\u0633\u0628\u0627\u064A\u0631 \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \xB7 \u0635\u0641\u062D\u0629 \u0645\u0633\u062A\u0642\u0644\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644",
    subtitleEn: "Term 1 EOT Exam Structure for Inspire Advanced Physics \xB7 Page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Adv-Ins-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Adv-Ins-phy-T1-2026-EOT.Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "12-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "12",
    stream: "general",
    subject: "math",
    titleAr: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A 12 \u0639\u0627\u0645",
    titleEn: "Grade 12 General Mathematics",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0639\u0627\u0645 \xB7 \u062A\u062F\u0631\u064A\u0628\u0627\u062A \u0634\u0627\u0645\u0644\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644 \u0641\u064A \u0635\u0641\u062D\u0629 \u0645\u0646\u0641\u0635\u0644\u0629",
    subtitleEn: "Term 1 EOT Exam Structure for General Stream \xB7 Dedicated page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT.Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/12Jen-math-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/12Gen-math-T1-2026-EOT-Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "11-adv-bri-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "adv_bridge",
    subject: "math",
    titleAr: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A 11 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C",
    titleEn: "Grade 11 Advanced Mathematics \u2014 Bridge",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \xB7 \u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u0631\u0643\u0632\u0629 \u0648\u062A\u062F\u0631\u064A\u0628 \u062A\u0641\u0627\u0639\u0644\u064A \u0644\u0643\u0644 \u0633\u0624\u0627\u0644 \u0648\u0632\u0627\u0631\u064A",
    subtitleEn: "Term 1 EOT Exam Structure \xB7 Focused practice page for every exam question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-Math-T1-2026-EOT-Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "11-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "\u0641\u064A\u0632\u064A\u0627\u0621 11 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C",
    titleEn: "Grade 11 Advanced Physics \u2014 Bridge",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \xB7 \u0627\u0644\u0645\u062A\u062C\u0647\u0627\u062A \u0648\u0627\u0644\u0645\u064A\u0643\u0627\u0646\u064A\u0643\u0627 \u0645\u0642\u0633\u0645\u0629 \u0635\u0641\u062D\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644",
    subtitleEn: "Term 1 EOT Exam Structure \xB7 Vectors & Mechanics structured per question page",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Adv-Bri-phy-T1-2026-EOT.Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "11-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "11",
    stream: "general",
    subject: "math",
    titleAr: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A 11 \u0639\u0627\u0645",
    titleEn: "Grade 11 General Mathematics",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0639\u0627\u0645 \xB7 \u062A\u0635\u0641\u062D \u0645\u0628\u0627\u0634\u0631 \u0644\u0635\u0641\u062D\u0627\u062A \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0628\u0627\u0644\u062A\u0631\u062A\u064A\u0628",
    subtitleEn: "Term 1 EOT Exam Structure for General Stream \xB7 Sequential question pages",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/11Jen-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/11Gen-math-T1-2026-EOT-Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "10-gen-math-t1-2026",
    year: "2026",
    term: "T1",
    grade: "10",
    stream: "general",
    subject: "math",
    titleAr: "\u0631\u064A\u0627\u0636\u064A\u0627\u062A 10 \u0639\u0627\u0645",
    titleEn: "Grade 10 General Mathematics",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0635\u0641 \u0627\u0644\u0639\u0627\u0634\u0631 \u0627\u0644\u0639\u0627\u0645 \xB7 \u0635\u0641\u062D\u0629 \u0645\u062E\u0635\u0635\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644",
    subtitleEn: "Term 1 EOT Exam Structure for Grade 10 General \xB7 Dedicated page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/10Jen-math-T1-2026-EOT.Q{q}/",
      "https://mr-mohammed-hesham.github.io/10Gen-math-T1-2026-EOT-Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  },
  {
    id: "10-adv-bri-phy-t1-2026",
    year: "2026",
    term: "T1",
    grade: "10",
    stream: "adv_bridge",
    subject: "physics",
    titleAr: "\u0641\u064A\u0632\u064A\u0627\u0621 10 \u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C",
    titleEn: "Grade 10 Advanced Physics \u2014 Bridge",
    subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644 \u0644\u0644\u0635\u0641 \u0627\u0644\u0639\u0627\u0634\u0631 \u0627\u0644\u0645\u062A\u0642\u062F\u0645 \u0628\u0631\u064A\u062F\u062C \xB7 \u0643\u0644 \u0633\u0624\u0627\u0644 \u0641\u064A \u0635\u0641\u062D\u0629 \u062A\u0641\u0627\u0639\u0644\u064A\u0629",
    subtitleEn: "Term 1 EOT Exam Structure for Grade 10 Advanced Bridge \xB7 Interactive page per question",
    primaryUrlTemplate: "https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT-Q{q}/",
    fallbackUrlTemplates: [
      "https://mr-mohammed-hesham.github.io/10Adv-Bri-phy-T1-2026-EOT-Q{q}/",
      "https://mr-mohammed-hesham.github.io/10Adv-Bri-Phy-T1-2026-EOT.Q{q}/"
    ],
    defaultTotalQuestions: 25,
    mcqQuestionsEnd: 20
  }
];
var eot2026CurriculaCache = null;
var eot2026KnownReposLower = null;
var eot2026QuestionCache = /* @__PURE__ */ new Map();
var eot2026SharedSettingsFile = import_path.default.join(examsDataDir, "eot2026_shared_config.json");
function readEot2026SharedSettings() {
  ensureExamsFile();
  try {
    if (import_fs.default.existsSync(eot2026SharedSettingsFile)) {
      const parsed = JSON.parse(import_fs.default.readFileSync(eot2026SharedSettingsFile, "utf8"));
      return {
        totalQuestionsByCurriculum: parsed?.totalQuestionsByCurriculum || {}
      };
    }
  } catch {
  }
  return { totalQuestionsByCurriculum: {} };
}
function writeEot2026SharedSettings(data) {
  ensureExamsFile();
  try {
    import_fs.default.writeFileSync(eot2026SharedSettingsFile, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("[EOT 2026 Settings] Write error:", err);
  }
}
function expandEot2026Terms(baseList) {
  const result = [];
  const terms = ["T1", "T2", "T3"];
  for (const termId of terms) {
    for (const base of baseList) {
      if (base.term === termId && base.year === "2026") {
        if (!result.some((r) => r.id === base.id)) result.push(base);
        continue;
      }
      if (base.term !== "T1") continue;
      const replaceTermYear = (tpl) => tpl.replace(/-T1-2026-/gi, `-${termId}-2026-`);
      const id = base.id.replace("-t1-2026", `-${termId.toLowerCase()}-2026`);
      if (result.some((r) => r.id === id)) continue;
      const termNameAr = termId === "T1" ? "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u0623\u0648\u0644" : termId === "T2" ? "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062B\u0627\u0646\u064A" : "\u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062B\u0627\u0644\u062B";
      const termNameEn = termId === "T1" ? "Term 1" : termId === "T2" ? "Term 2" : "Term 3";
      result.push({
        ...base,
        id,
        year: "2026",
        term: termId,
        subtitleAr: `\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 ${termNameAr} 2026 \xB7 \u0645\u0642\u0633\u0645 \u0635\u0641\u062D\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644 \u0648\u0632\u0627\u0631\u064A`,
        subtitleEn: `${termNameEn} 2026 EOT Exam Structure \xB7 Dedicated interactive page per question`,
        primaryUrlTemplate: replaceTermYear(base.primaryUrlTemplate),
        fallbackUrlTemplates: (base.fallbackUrlTemplates || []).map(replaceTermYear),
        knownQuestionTitles: void 0
      });
    }
  }
  return result;
}
async function resolveEot2026Curricula(forceRefresh = false) {
  const now = Date.now();
  const cacheFile = import_path.default.join(examsDataDir, "eot2026_curricula_cache.json");
  if (!forceRefresh && eot2026CurriculaCache && now - eot2026CurriculaCache.timestamp < 6e4) {
    return eot2026CurriculaCache.all;
  }
  let baseCurricula = [];
  try {
    const rawUrl = `https://raw.githubusercontent.com/Mr-Mohammed-Hesham/EOT/main/src/data/eotCurricula.ts?_t=${now}`;
    const abortCtrl = new AbortController();
    const timeout = setTimeout(() => abortCtrl.abort(), 6e3);
    const upstreamRes = await fetch(rawUrl, {
      signal: abortCtrl.signal,
      headers: { "User-Agent": "4U-Platform" }
    });
    clearTimeout(timeout);
    if (upstreamRes.ok) {
      const code = await upstreamRes.text();
      const parsed = parseTsArray(code, "BASE_2026_T1_CURRICULA");
      if (Array.isArray(parsed) && parsed.length > 0) {
        baseCurricula = parsed.map((item) => ({
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
          knownQuestionTitles: item.knownQuestionTitles
        }));
      }
    }
  } catch (err) {
    console.warn("[EOT 2026 Sync] Upstream curricula fetch warning:", err?.message || err);
  }
  if (baseCurricula.length === 0 && import_fs.default.existsSync(cacheFile)) {
    try {
      const disk = JSON.parse(import_fs.default.readFileSync(cacheFile, "utf8"));
      if (Array.isArray(disk) && disk.length > 0) baseCurricula = disk;
    } catch {
    }
  }
  if (baseCurricula.length === 0) {
    baseCurricula = DEFAULT_EOT2026_BASE_T1;
  }
  let expanded = expandEot2026Terms(baseCurricula);
  try {
    const allRepos = [];
    for (let page = 1; page <= 5; page++) {
      const repoCtrl = new AbortController();
      const repoTimeout = setTimeout(() => repoCtrl.abort(), 5e3);
      const reposRes = await fetch(
        `https://api.github.com/users/Mr-Mohammed-Hesham/repos?per_page=100&page=${page}&sort=updated`,
        {
          signal: repoCtrl.signal,
          headers: { "User-Agent": "4U-Platform", Accept: "application/vnd.github+json" }
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
      const lowerSet = /* @__PURE__ */ new Set();
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
        const stream = streamRaw.toLowerCase() === "adv-bri" ? "adv_bridge" : streamRaw.toLowerCase() === "adv-ins" || streamRaw.toLowerCase() === "adv-rev" ? "adv_inspire" : "general";
        const subject = subRaw.toLowerCase() === "phy" ? "physics" : subRaw.toLowerCase() === "math" ? "math" : subRaw.toLowerCase() === "chem" ? "chemistry" : "biology";
        const existing = expanded.find(
          (c) => c.year === "2026" && c.term === term && c.grade === gradeRaw && c.stream === stream && c.subject === subject
        );
        if (existing) {
          if (qNum > existing.defaultTotalQuestions) {
            existing.defaultTotalQuestions = qNum;
          }
        } else {
          const subAr = subject === "physics" ? "\u0641\u064A\u0632\u064A\u0627\u0621" : subject === "math" ? "\u0631\u064A\u0627\u0636\u064A\u0627\u062A" : subject === "chemistry" ? "\u0643\u064A\u0645\u064A\u0627\u0621" : "\u0623\u062D\u064A\u0627\u0621";
          const subEn = subject === "physics" ? "Physics" : subject === "math" ? "Mathematics" : subject === "chemistry" ? "Chemistry" : "Biology";
          const streamAr = stream === "adv_bridge" ? "\u0645\u062A\u0642\u062F\u0645 \u2014 \u0628\u0631\u064A\u062F\u062C" : stream === "adv_inspire" ? "\u0645\u062A\u0642\u062F\u0645 \u2014 \u0627\u0646\u0633\u0628\u0627\u064A\u0631" : "\u0639\u0627\u0645";
          const streamEn = stream === "adv_bridge" ? "Advanced \u2014 Bridge" : stream === "adv_inspire" ? "Advanced \u2014 Inspire" : "General";
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
            subtitleAr: "\u0647\u064A\u0643\u0644 \u0627\u0645\u062A\u062D\u0627\u0646 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0641\u0635\u0644 \xB7 \u0645\u0642\u0633\u0645 \u0635\u0641\u062D\u0629 \u0644\u0643\u0644 \u0633\u0624\u0627\u0644 \u0648\u0632\u0627\u0631\u064A \u0645\u0639 \u0627\u0644\u062A\u062F\u0631\u064A\u0628 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A",
            subtitleEn: "EOT Exam Structure \xB7 Dedicated interactive page per exam question",
            primaryUrlTemplate: `https://mr-mohammed-hesham.github.io/${prefixBeforeQ}/`,
            fallbackUrlTemplates: [
              `https://mr-mohammed-hesham.github.io/${prefixBeforeQ.replace(sep + "Q{q}", (sep === "-" ? "." : "-") + "Q{q}")}/`
            ],
            defaultTotalQuestions: Math.max(25, qNum),
            mcqQuestionsEnd: 20
          });
        }
      }
    }
  } catch {
  }
  try {
    ensureExamsFile();
    import_fs.default.writeFileSync(cacheFile, JSON.stringify(baseCurricula, null, 2), "utf8");
  } catch {
  }
  eot2026CurriculaCache = { all: expanded, timestamp: now };
  return expanded;
}
function cleanEotTitle(rawTitle) {
  return rawTitle.replace(/\s*\|\s*Mr\.?\s*Mohammed\s*Hesham.*$/i, "").replace(/^[\p{Extended_Pictographic}\uFE0F\u200D⚡⚛️📐📚🎯🏆🔥✨📊\s]+/u, "").trim();
}
function prepareSafeSrcDocHtml(rawHtml) {
  let html = rawHtml.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "").replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, "");
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
async function probeAndFetchEotQuestion(curriculum, q, forceRefresh = false) {
  const key = `${curriculum.id}__Q${q}`;
  const now = Date.now();
  const cached = eot2026QuestionCache.get(key);
  if (!forceRefresh && cached && now - cached.checkedAt < 6e4) {
    return cached;
  }
  const qStr = String(q);
  const rawTemplates = [
    curriculum.primaryUrlTemplate.replace("{q}", qStr),
    ...(curriculum.fallbackUrlTemplates || []).map((t) => t.replace("{q}", qStr))
  ];
  const expandedCandidates = [];
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
    const pending2 = { status: "pending", checkedAt: now };
    eot2026QuestionCache.set(key, pending2);
    return pending2;
  }
  const candidates = Array.from(new Set(expandedCandidates));
  for (const candidateUrl of candidates) {
    try {
      const targetUrl = forceRefresh ? `${candidateUrl}${candidateUrl.includes("?") ? "&" : "?"}v=${now}` : candidateUrl;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5e3);
      const upstream = await fetch(targetUrl, {
        signal: ctrl.signal,
        headers: { "User-Agent": "4U-Platform" }
      });
      clearTimeout(timer);
      if (upstream.ok) {
        const text = await upstream.text();
        if (text && text.length > 200 && !text.includes("<title>Page not found") && !text.includes("There isn't a GitHub Pages site here")) {
          let liveTitle;
          const m = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          if (m && m[1]) {
            const cleaned = cleanEotTitle(m[1]);
            if (cleaned) liveTitle = cleaned;
          }
          const hit = {
            status: "live",
            liveTitle,
            html: prepareSafeSrcDocHtml(text),
            checkedAt: now
          };
          eot2026QuestionCache.set(key, hit);
          return hit;
        }
      }
    } catch {
    }
  }
  const pending = { status: "pending", checkedAt: now };
  eot2026QuestionCache.set(key, pending);
  return pending;
}
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
      knownQuestionTitles: c.knownQuestionTitles
    }));
    return res.json({
      success: true,
      count: sanitized.length,
      curricula: sanitized,
      sharedSettings,
      syncedAt: Date.now()
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || "Failed to sync EOT 2026" });
  }
});
app.post("/api/external-banks/eot2026/probe-batch", async (req, res) => {
  try {
    const { curriculumIds, maxQuestions = 25, forceRefresh = false } = req.body || {};
    const allCurricula = await resolveEot2026Curricula(Boolean(forceRefresh));
    const sharedSettings = readEot2026SharedSettings();
    const targets = Array.isArray(curriculumIds) && curriculumIds.length > 0 ? allCurricula.filter((c) => curriculumIds.includes(c.id)) : allCurricula.filter((c) => c.year === "2026" && c.term === "T1");
    const probes = {};
    const tasks = [];
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
          checkedAt: result.checkedAt
        };
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, tasks.length)) }, () => worker()));
    return res.json({ success: true, probes });
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || "Batch probe failed" });
  }
});
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
      checkedAt: result.checkedAt
    });
  } catch (err) {
    return res.status(500).json({ success: false, status: "pending", error: err?.message });
  }
});
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
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});
function transformHtmlForSocialPreviews(rawHtml, req) {
  const forwardedProto = req.headers["x-forwarded-proto"] || "";
  const protocol = forwardedProto.split(",")[0].trim() || (req.secure ? "https" : "http");
  const forwardedHost = req.headers["x-forwarded-host"] || "";
  const host = forwardedHost.split(",")[0].trim() || req.headers.host || "localhost:3000";
  const currentBaseUrl = `${protocol}://${host}`;
  const currentFullUrl = `${currentBaseUrl}${req.originalUrl || req.url || "/"}`;
  return rawHtml.replace(/https:\/\/hesham-afandi\.github\.io\/4U\/og-image\.jpg/g, `${currentBaseUrl}/og-image.jpg`).replace(/https:\/\/hesham-afandi\.github\.io\/4U\/og-logo\.jpg/g, `${currentBaseUrl}/og-logo.jpg`).replace(/https:\/\/hesham-afandi\.github\.io\/4U\//g, `${currentBaseUrl}/`).replace(/https:\/\/hesham-afandi\.github\.io\/4U/g, currentBaseUrl).replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${currentFullUrl}"`).replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${currentFullUrl}"`);
}
var publicDir = import_path.default.join(process.cwd(), "public");
app.use(import_express.default.static(publicDir, {
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
app.get("/og-preview", (req, res) => {
  const indexPath = import_path.default.join(process.cwd(), "index.html");
  if (import_fs.default.existsSync(indexPath)) {
    const rawHtml = import_fs.default.readFileSync(indexPath, "utf8");
    const transformed = transformHtmlForSocialPreviews(rawHtml, req);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(transformed);
  }
  res.redirect("/");
});
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.startsWith("/@") || req.path.startsWith("/src") || req.path.includes(".")) {
        return next();
      }
      try {
        const indexPath = import_path.default.join(process.cwd(), "index.html");
        if (import_fs.default.existsSync(indexPath)) {
          let rawHtml = import_fs.default.readFileSync(indexPath, "utf8");
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
    const distPath = import_path.default.join(process.cwd(), "dist");
    const staticOpts = {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    };
    app.use(import_express.default.static(distPath, staticOpts));
    app.use("/4U", import_express.default.static(distPath, staticOpts));
    app.use("/4U", import_express.default.static(publicDir, staticOpts));
    app.get("*", (req, res) => {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ error: "API route not found" });
      }
      const indexPath = import_path.default.join(distPath, "index.html");
      if (import_fs.default.existsSync(indexPath)) {
        const rawHtml = import_fs.default.readFileSync(indexPath, "utf8");
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
//# sourceMappingURL=server.cjs.map
