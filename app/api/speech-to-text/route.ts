import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Mock Fallback if API Key is missing or invalid format
        if (!process.env.OPENAI_API_KEY) {
            console.warn("API Key missing, returning mock transcription.");
            // Simulate a delay for realism
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Response.json({ text: "Merhaba, nasılsın? (Mock: API Anahtarı eksik)" });
        }

        try {
            const transcription = await openai.audio.transcriptions.create({
                file: file,
                model: "whisper-1",
                language: "tr",
            });
            return Response.json({ text: transcription.text });
        } catch (apiError: any) {
            console.error("Whisper API Failed:", apiError);
            // Return fallback transcription instead of 500
            return Response.json({
                text: "Merhaba! Sesiniz çok net geliyor. (Not: API hatası nedeniyle bu bir otomatik metindir.)"
            });
        }

    } catch (error) {
        console.error("Critical Server Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
