import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    apiKeyConfigured: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 5) + '...' : 'not set',
    timestamp: new Date().toISOString()
  });
}