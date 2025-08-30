import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, provider = 'stability' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let imageUrl;

    if (provider === 'openai') {
      imageUrl = await generateWithOpenAI(prompt);
    } else if (provider === 'stability') {
      imageUrl = await generateWithStability(prompt);
    } else {
      return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}

// OpenAI DALL-E Implementation
async function generateWithOpenAI(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url'
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.data[0].url;
}

// Stability AI Implementation  
async function generateWithStability(prompt: string) {
  const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`,
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: prompt,
          weight: 1
        }
      ],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      samples: 1,
      steps: 30,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stability AI error: ${error.message || 'Unknown error'}`);
  }

  const data = await response.json();
  
  // Return base64 image as data URL
  const base64Image = data.artifacts[0].base64;
  return `data:image/png;base64,${base64Image}`;
}
