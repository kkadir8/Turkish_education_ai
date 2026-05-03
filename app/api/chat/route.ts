import { OpenAI } from "openai";
import { TURKISH_TEACHER_SYSTEM_PROMPT } from "@/lib/constants";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        // Check if API Key is missing and return Mock immediately if so
        if (!apiKey) {
            console.warn("API Key missing, using mock.");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Response.json({
                message: {
                    role: "assistant",
                    content: "Merhaba! Harika gidiyorsun. (Uyarı: OpenAI API anahtarı girilmediği için bu demo yanıtı görüyorsunuz.)"
                }
            });
        }

        const openai = new OpenAI({ apiKey });

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: TURKISH_TEACHER_SYSTEM_PROMPT },
                    ...messages
                ],
            });
            return Response.json({ message: completion.choices[0].message });

        } catch (apiError: any) {
            console.error("OpenAI Call Failed:", apiError);

            // Check specific error types if possible, or just generalize
            let userMessage = "API hatası alındı, otomatik cevap veriliyor.";
            if (apiError.status === 401) userMessage = "API Anahtarı geçersiz.";
            if (apiError.status === 429) userMessage = "API Kotası dolmuş.";

            return Response.json({
                message: {
                    role: "assistant",
                    content: `Harika bir deneme! Devam edelim. (Sistem Notu: ${userMessage} Uygulama çökmemesi için bu yanıt üretildi.)`
                }
            });
        }

    } catch (error: any) {
        console.error("Critical Route Error:", error);
        return Response.json({
            error: "API Error",
            details: error.message
        }, { status: 500 });
    }
}
