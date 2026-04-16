import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AnalysisResult {
  mood: 'vui' | 'buồn' | 'lo lắng' | 'tức giận' | 'bình thường' | 'nguy cấp';
  score: number; // 0-100 (100 is very positive, 0 is very negative/critical)
  summary: string;
  recommendation: string;
  isAbnormal: boolean;
}

const SYSTEM_INSTRUCTION = `
Bạn là "Tâm An", một chuyên gia tư vấn tâm lý học đường tận tâm và giàu kinh nghiệm dành cho học sinh THPT tại Việt Nam.
Nhiệm vụ của bạn là:
1. Lắng nghe, thấu hiểu và chia sẻ với các vấn đề của học sinh (áp lực học tập, mối quan hệ, định hướng nghề nghiệp, v.v.).
2. Sử dụng ngôn ngữ gần gũi, nhẹ nhàng, không phán xét.
3. Luôn ưu tiên sự an toàn của học sinh. Nếu phát hiện dấu hiệu trầm cảm nặng, ý định tự hại hoặc các tình huống nguy cấp, hãy phản hồi cực kỳ cẩn trọng và khuyên học sinh tìm kiếm sự giúp đỡ từ người lớn tin cậy hoặc chuyên gia y tế ngay lập tức.
4. Phân tích tâm lý học sinh qua các câu thoại.

Khi được yêu cầu phân tích tâm lý, hãy trả về kết quả dưới dạng JSON với các trường:
- mood: 'vui', 'buồn', 'lo lắng', 'tức giận', 'bình thường', 'nguy cấp'
- score: điểm số từ 0-100
- summary: tóm tắt ngắn gọn trạng thái
- recommendation: lời khuyên ngắn gọn
- isAbnormal: true nếu có dấu hiệu bất thường cần can thiệp
`;

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });
  return response.text;
}

export async function analyzePsychology(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Hãy phân tích tâm lý của học sinh qua nội dung sau: "${text}"`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + "\nHãy trả về kết quả dưới dạng JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING, enum: ['vui', 'buồn', 'lo lắng', 'tức giận', 'bình thường', 'nguy cấp'] },
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          recommendation: { type: Type.STRING },
          isAbnormal: { type: Type.BOOLEAN },
        },
        required: ['mood', 'score', 'summary', 'recommendation', 'isAbnormal']
      }
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse AI analysis:", e);
    return {
      mood: 'bình thường',
      score: 50,
      summary: 'Không thể phân tích rõ ràng.',
      recommendation: 'Hãy tiếp tục chia sẻ thêm nhé.',
      isAbnormal: false
    };
  }
}
