// app/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Aceternity-inspired shimmer button
const ShimmerButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="inline-flex h-14 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};


// Aceternity-inspired background grid
const GridBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute h-full w-full bg-black">
        <div className="absolute h-full w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px]" />
      </div>
    </div>
  );
};

// Aceternity-inspired text glow effect
interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

const GlowingText: React.FC<GlowingTextProps> = ({ children, className = "" }) => {
  return (
    <span className={`relative bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 ${className}`}>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-xl opacity-50" />
      {children}
    </span>
  );
};

export default function LandingPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGetStarted = () => {
    setIsRedirecting(true);
    // In a real app, you'd use next/navigation's router.push
    // This is a simplified example
    setTimeout(() => {
      window.location.href = '/generate';
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const featureItems = [
    {
      title: "No Login Required",
      description: "Start creating immediately without any account setup",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      title: "Advanced AI",
      description: "Powered by leading AI image generation technology",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Instant Downloads",
      description: "Save your creations immediately to your device",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <GridBackground />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-block mb-6"
            variants={itemVariants}
          >
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-200 text-sm font-medium border border-purple-500/20">
              Free for everyone
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
            variants={itemVariants}
          >
            Create stunning images with <GlowingText>AI magic</GlowingText>
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Transform your ideas into beautiful visuals in seconds. No login required. 
            Powered by advanced AI image generation technology.
          </motion.p>
          
          <motion.div variants={itemVariants}>
            <ShimmerButton onClick={handleGetStarted}>
              {isRedirecting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Getting Started...
                </div>
              ) : (
                <div className="flex items-center">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </ShimmerButton>
          </motion.div>
        </motion.div>
        
        {/* Animated Gradient Card */}
        <motion.div 
          className="mt-20 relative rounded-xl overflow-hidden border border-gray-800"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7, type: "spring" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/30 via-blue-800/30 to-pink-800/30 opacity-50 animate-gradient-xy"></div>
          <div className="relative p-8 md:p-12 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-sm">
            {/* Preview Image */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut"
                  }}
                  className="text-center p-6"
                >
                  <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-white">Your imagination becomes reality here</p>
                  <p className="text-gray-300 mt-2">Click "Get Started" to begin creating</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          className="mt-24 grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-b from-gray-900 to-black p-6 rounded-xl border border-gray-800"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <div className="text-purple-400">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}