import { OpenAI } from "openai";
import { TURKISH_VOICE_TEACHER_PROMPT } from "@/lib/voicePrompt";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Check if API Key is missing and return Mock immediately if so
        if (!process.env.OPENAI_API_KEY) {
            console.warn("API Key missing, using mock.");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Response.json({
                message: {
                    role: "assistant",
                    content: "Merhaba! Ben Turkish Teacher. (OpenAI API anahtarı girilmediği için demo yanıtı.)"
                }
            });
        }

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: TURKISH_VOICE_TEACHER_PROMPT },
                    ...messages
                ],
            });
            return Response.json({ message: completion.choices[0].message });

        } catch (apiError: any) {
            console.error("OpenAI Call Failed:", apiError);

            let userMessage = "API hatası alındı.";
            if (apiError.status === 401) userMessage = "API Anahtarı geçersiz.";
            if (apiError.status === 429) userMessage = "API Kotası dolmuş.";

            return Response.json({
                message: {
                    role: "assistant",
                    content: `Tekrar dene! (${userMessage})`
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
