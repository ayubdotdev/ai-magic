// app/generate/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [creditsUsed, setCreditsUsed] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    // Clear previous image when generating a new one
    setGeneratedImage(null);
    setIsLoading(true);
    setError(null);
    setCurrentPrompt(prompt);
    
    try {
      const response = await fetch('/api/image-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      console.log("prompt from frontend is", prompt);
      console.log("response from frontend is", response);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.error);
        // Even on error, update credit information if available
        if (errorData.creditsUsed) {
          setCreditsUsed(errorData.creditsUsed);
        }
        if (errorData.remainingCredits) {
          setRemainingCredits(errorData.remainingCredits);
        }
        throw new Error(errorData.error || 'Failed to generate image');
      }
      
      const responseData = await response.json();
      console.log("data from frontend is", responseData);

      // Update credits information
      if (responseData.creditsUsed) {
        setCreditsUsed(responseData.creditsUsed);
      }
      if (responseData.remainingCredits) {
        setRemainingCredits(responseData.remainingCredits);
      }

      if (responseData?.images && responseData.images.length > 0) {
        setGeneratedImage(`data:image/png;base64,${responseData.images[0].base64}`);
      } else {
        throw new Error('No image generated');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 -z-10">
        <div className="absolute h-full w-full bg-black">
          <div className="absolute h-full w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            AI Image Creator
          </Link>
          
          <Link 
            href="/"
            className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Prompt Input */}
          <motion.div 
            className="md:col-span-2" 
            variants={itemVariants}
          >
            <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl border border-gray-800 sticky top-8">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Describe Your Image
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                    Your prompt
                  </label>
                  <textarea
                    id="prompt"
                    className="w-full p-4 h-40 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-white"
                    placeholder="Describe the image you want to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg font-medium text-white 
                            bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
                            disabled:opacity-70 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating{currentPrompt ? ` "${currentPrompt}"` : '...'}
                    </div>
                  ) : 'Generate Image'}
                </motion.button>
                
                {error && (
                  <motion.div 
                    className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm text-red-200"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4 text-gray-300">Tips for great results</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex items-start">
                      <span className="mr-2 text-purple-400">•</span> 
                      Be specific about what you want to see
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-purple-400">•</span> 
                      Include details about style, lighting, and mood
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-purple-400">•</span> 
                      Try phrases like "digital art", "photorealistic", or "oil painting"
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </motion.div>
          
          {/* Right Column - Results */}
          <motion.div 
            className="md:col-span-3" 
            variants={itemVariants}
          >
            <div className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl border border-gray-800 h-full min-h-[400px]">
              <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                Your Creation
                {currentPrompt && !isLoading && generatedImage ? <span className="block text-sm font-normal text-gray-400 mt-1">"{currentPrompt}"</span> : null}
              </h2>
              
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px] bg-black/50 rounded-lg border border-gray-800">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-blue-500 animate-spin animation-delay-500"></div>
                  </div>
                  <p className="mt-4 text-gray-400">Creating your masterpiece...</p>
                </div>
              ) : generatedImage ? (
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  key={generatedImage} // Add key to force re-render when image changes
                >
                  <div className="relative w-full h-[400px] md:h-[500px] bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                    <img 
                      src={generatedImage}
                      alt={`Generated image for: ${currentPrompt || 'AI creation'}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <motion.div 
                    className="mt-6 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <a 
                      href={generatedImage} 
                      download={`ai-${currentPrompt?.replace(/\s+/g, '-').toLowerCase() || 'creation'}.png`}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Image
                      </div>
                    </a>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-black/50 rounded-lg border border-gray-700 border-dashed text-center">
                  <div className="w-20 h-20 mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">Your image will appear here</p>
                  <p className="text-gray-500 text-sm mt-2">Type a prompt and click Generate</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}