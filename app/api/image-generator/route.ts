import { NextRequest, NextResponse } from 'next/server';

// Helper function to delay for a specified time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Maximum number of retry attempts
const MAX_RETRIES = 2;

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Prompt from backend is', prompt);

    const apiKey = process.env.STABILITY_API_KEY;
    console.log('API Key:', apiKey);

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Clean the prompt to avoid moderation issues
    const cleanedPrompt = prompt.trim();
    
    // Retry logic
    let lastError = null;
    let creditsUsed = null;
    let remainingCredits = null;
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Retry attempt ${attempt} of ${MAX_RETRIES}`);
          // Wait before retrying, with exponential backoff
          await delay(1000 * Math.pow(2, attempt - 1));
        }
        
        // Use Stability API for reliable image generation
        const response = await fetch(
          'https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              text_prompts: [
                {
                  text: cleanedPrompt,
                  weight: 1
                }
              ],
              cfg_scale: 7,
              height: 1024,
              width: 1024,
              samples: 1,
              steps: 30
            }),
          }
        );
        
        // Get credit information from headers
        creditsUsed = response.headers.get('stability-credit-amount-used') || '1';
        remainingCredits = response.headers.get('stability-credit-amount-remaining') || 'Unknown';
        
        console.log(`Credits used: ${creditsUsed}, Remaining credits: ${remainingCredits}`);
        
        // Handle non-OK responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error Response:', errorData);
          
          // Check for moderation issues (these don't use credits)
          const noCreditsUsed = errorData.name === 'content_moderation';
          
          // If it's a moderation issue or other permanent error, don't retry
          if (noCreditsUsed || response.status === 400) {
            return NextResponse.json(
              { 
                error: errorData.message || `API error: ${response.status}`,
                creditsUsed: noCreditsUsed ? '0' : creditsUsed,
                remainingCredits: remainingCredits
              },
              { status: response.status }
            );
          }
          
          // For other errors, throw to trigger retry
          throw new Error(errorData.message || `API error: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('API Response Data Received Successfully');
        
        if (!responseData.artifacts || responseData.artifacts.length === 0) {
          throw new Error('No image data in response');
        }
        
        // Return in the format expected by frontend, now with credit info
        return NextResponse.json({
          images: [{
            base64: responseData.artifacts[0].base64,
            seed: responseData.artifacts[0].seed,
          }],
          creditsUsed: creditsUsed,
          remainingCredits: remainingCredits
        });
        
      } catch (attemptError: unknown) {
        if (attemptError instanceof Error) {
          console.error(`Attempt ${attempt} failed:`, attemptError);
          lastError = attemptError;
        } else {
          console.error(`Attempt ${attempt} failed with unknown error:`, attemptError);
          lastError = new Error('Unknown error occurred');
        }
      }
    }
    
    // If we get here, all retries failed
    console.error('All retry attempts failed');
    return NextResponse.json(
      { 
        error: lastError?.message || 'Failed to generate image after multiple attempts',
        creditsUsed: '0',
        remainingCredits: remainingCredits || 'Unknown'
      },
      { status: 500 }
    );

  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      creditsUsed: '0',
      remainingCredits: 'Unknown'
    }, { status: 500 });
  }
}
