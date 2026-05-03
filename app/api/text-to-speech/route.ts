import { OpenAI } from "openai";

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text || typeof text !== "string") {
            return Response.json({ error: "Text is required" }, { status: 400 });
        }

        const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
        const elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID;
        const openAiApiKey = process.env.OPENAI_API_KEY;
        let elevenFallbackReason = "";

        if (elevenLabsApiKey && elevenLabsVoiceId) {
            try {
                const elevenResponse = await fetch(
                    `https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}`,
                    {
                        method: "POST",
                        headers: {
                            "xi-api-key": elevenLabsApiKey,
                            "Content-Type": "application/json",
                            "Accept": "audio/mpeg",
                        },
                        body: JSON.stringify({
                            text,
                            model_id: "eleven_multilingual_v2",
                            voice_settings: {
                                stability: 0.5,
                                similarity_boost: 0.75,
                            },
                        }),
                    }
                );

                if (elevenResponse.ok) {
                    const buffer = Buffer.from(await elevenResponse.arrayBuffer());
                    return new Response(buffer, {
                        headers: {
                            "Content-Type": "audio/mpeg",
                            "x-tts-provider": "elevenlabs",
                        },
                    });
                }

                const elevenErrorText = await elevenResponse.text();
                try {
                    const parsed = JSON.parse(elevenErrorText);
                    elevenFallbackReason = parsed?.detail?.code || parsed?.detail?.message || "";
                } catch {
                    elevenFallbackReason = "";
                }
                console.error("ElevenLabs TTS Error:", elevenResponse.status, elevenErrorText);
            } catch (elevenError) {
                console.error("ElevenLabs TTS Request Failed:", elevenError);
                elevenFallbackReason = "elevenlabs_request_failed";
            }
        }

        if (!openAiApiKey) {
            return Response.json(
                { error: "TTS service unavailable. Check ElevenLabs or OpenAI keys." },
                { status: 500 }
            );
        }

        try {
            const openai = new OpenAI({ apiKey: openAiApiKey });
            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: text,
            });

            const buffer = Buffer.from(await mp3.arrayBuffer());
            return new Response(buffer, {
                headers: {
                    "Content-Type": "audio/mpeg",
                    "x-tts-provider": "openai-fallback",
                    ...(elevenFallbackReason ? { "x-tts-fallback-reason": elevenFallbackReason } : {}),
                },
            });
        } catch (openAiError) {
            console.error("OpenAI TTS Error:", openAiError);
            return Response.json({ error: "TTS generation failed" }, { status: 502 });
        }
    } catch (error: any) {
        console.error("TTS Route Error:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
