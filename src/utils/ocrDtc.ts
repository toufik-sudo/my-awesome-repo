import { createWorker } from "tesseract.js";

/** Standard DTC pattern: one letter + 4 digits (e.g., P0420, B1234, C0056, U0100) */
const DTC_PATTERN = /\b[PBCU][0-9]{4}\b/gi;

export type OcrResult = {
  fullText: string;
  dtcCodes: string[];
};

/**
 * Run OCR on an image blob/file and extract DTC codes.
 */
export async function extractDtcFromImage(imageSource: File | Blob | string): Promise<OcrResult> {
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(imageSource);

    const matches = text.match(DTC_PATTERN) || [];
    // Deduplicate and uppercase
    const dtcCodes = [...new Set(matches.map((c) => c.toUpperCase()))];

    return { fullText: text, dtcCodes };
  } finally {
    await worker.terminate();
  }
}
