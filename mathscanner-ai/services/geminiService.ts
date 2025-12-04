import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are an expert academic typesetter and mathematician. 
Your task is to transcribe images or PDFs of mathematics exams into clean, editable Markdown.
Rules:
1. **Mathematical Accuracy**: Use LaTeX for all mathematical expressions.
   - Use single dollar signs ($...$) for inline math.
   - Use double dollar signs ($$...$$) for block display math (equations on their own line).
   - Ensure complex structures like matrices, integrals, limits, and fractions are correctly formatted.
2. **Structure Preservation**: Maintain the original numbering (Question 1, Question 2, etc.) and layout structure as much as possible.
3. **Vietnamese Language**: The source text is likely in Vietnamese. Preserve the text exactly as written, correcting only obvious OCR typos if safe to do so.
4. **No Solving**: Do NOT solve the math problems. Only transcribe them.
5. **Images**: If there are geometric figures or graphs, insert a placeholder like *[Hình vẽ/Đồ thị]* unless you can describe it simply in text.
6. **Output**: Return ONLY the Markdown content. Do not include introductory or concluding conversational text.
`;

export const transcribeDocument = async (
  base64Data: string,
  mimeType: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing from environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Using gemini-2.5-flash for speed and multimodal capability. 
    // It handles both images and PDFs effectively.
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: "Transcribe this math exam document into Markdown with LaTeX formulas.",
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for high fidelity transcription
      },
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Transcription Error:", error);
    throw error;
  }
};