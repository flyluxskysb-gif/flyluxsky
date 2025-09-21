import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Получаем реальный IP клиента из заголовков
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = forwarded ? forwarded.split(',')[0].trim() : 
                   request.headers.get('x-real-ip') || 
                   request.headers.get('cf-connecting-ip') || 
                   'check'; // fallback на автоопределение IPStack
    
    // Используем конкретный IP или 'check' для автоопределения
    const apiUrl = realIp === 'check' ? 
      `https://api.ipstack.com/check?access_key=${process.env.IPSTACK_API_KEY}` :
      `https://api.ipstack.com/${realIp}?access_key=${process.env.IPSTACK_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FlyLuxSky/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch geolocation data from ipstack.com: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Добавляем информацию о том, какой IP был использован для отладки
    const responseData = {
      ...data,
      debug_info: {
        detected_ip: realIp,
        api_url_used: apiUrl.replace(process.env.IPSTACK_API_KEY || '', '[API_KEY]')
      }
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    // Error fetching IP geolocation in API route
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ 
      error: "Failed to fetch geolocation data", 
      details: errorMessage,
      suggestion: "Try again later or check your network connection"
    }, { status: 500 });
  }
}