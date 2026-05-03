import { OpenAI } from "openai";
import { TURKISH_VOICE_TEACHER_PROMPT } from "@/lib/voicePrompt";

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
                    content: "Merhaba! Ben Turkish Teacher. (OpenAI API anahtarı girilmediği için demo yanıtı.)"
                }
            });
        }

        console.log("Voice Chat Messages:", messages);
        const openai = new OpenAI({ apiKey });

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: TURKISH_VOICE_TEACHER_PROMPT },
                    ...messages
                ],
            });
            console.log("AI Response:", completion.choices[0].message.content);
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
