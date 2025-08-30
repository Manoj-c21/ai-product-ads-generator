// OpenAI DALL-E Implementation
export const generateImageWithOpenAI = async (prompt: string, style: string, mood: string) => {
  const enhancedPrompt = `${prompt}, ${style} style, ${mood} mood, professional product advertisement, high quality, 4K resolution`;
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        provider: 'openai'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

// Stability AI Implementation
export const generateImageWithStability = async (prompt: string, style: string, mood: string) => {
  const enhancedPrompt = `${prompt}, ${style} style, ${mood} mood, professional product advertisement, high quality`;
  
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        provider: 'stability'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image');
    }

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};
