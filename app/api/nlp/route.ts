import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();
        
        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const response = await fetch(`http://localhost:8080/analyze?word=${encodeURIComponent(text)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch from Zemberek server');
        }

        const data = await response.text();
        return NextResponse.json({ result: data });
    } catch (error) {
        console.error('NLP API Error:', error);
        return NextResponse.json({ error: 'Zemberek sunucusuna bağlanılamadı. Java serverının çalıştığından emin olun.' }, { status: 500 });
    }
}
