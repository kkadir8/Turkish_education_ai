import { OpenAI } from "openai";

const INVALID_TRANSCRIPT_PATTERNS = [
    /altyazi\s*m\.?k\.?/i,
    /altyaz[ıi]/i,
    /^m\.?k\.?$/i,
];

function isLikelyInvalidTranscript(text: string) {
    const normalized = text.trim();
    if (!normalized) return true;
    if (normalized.length < 2) return true;
    return INVALID_TRANSCRIPT_PATTERNS.some((pattern) => pattern.test(normalized));
}

export async function POST(req: Request) {
    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Mock Fallback if API Key is missing or invalid format
        if (!apiKey) {
            console.warn("API Key missing, returning mock transcription.");
            // Simulate a delay for realism
            await new Promise(resolve => setTimeout(resolve, 1000));
            return Response.json({ text: "Merhaba, nasılsın? (Mock: API Anahtarı eksik)" });
        }

        const openai = new OpenAI({ apiKey });

        try {
            const transcription = await openai.audio.transcriptions.create({
                file: file,
                model: "whisper-1",
                language: "tr",
                prompt: "Bu bir Türkçe konuşma kaydıdır. Altyazı etiketi veya kişi adı uydurma.",
                temperature: 0,
            });
            console.log("Transcript:", transcription.text);
            if (isLikelyInvalidTranscript(transcription.text)) {
                return Response.json(
                    { error: "No valid speech detected" },
                    { status: 422 }
                );
            }
            return Response.json({ text: transcription.text });
        } catch (apiError: any) {
            console.error("Whisper API Failed:", apiError);
            return Response.json(
                { error: "Transcription failed" },
                { status: 502 }
            );
        }

    } catch (error) {
        console.error("Critical Server Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
