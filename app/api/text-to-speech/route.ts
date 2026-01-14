import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy", // or onyx, echo, fable
            input: text,
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());

        return new Response(buffer, {
            headers: {
                "Content-Type": "audio/mpeg",
            },
        });
    } catch (error) {
        console.error("TTS API Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
