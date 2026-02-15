import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'DEEPSEEK_API_KEY is not set in environment variables'
      }, { status: 500 });
    }

    // Пробуем сделать простой запрос к Deepseek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: 'Say "test" in one word' }
        ],
        temperature: 0.7,
        max_tokens: 10
      })
    });

    const data = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data,
      keyPrefix: apiKey.substring(0, 7) + '...'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}