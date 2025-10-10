"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect } from "react";

// The classic Typewriter effect: character-by-character reveal
export const TypewriterEffect = ({ words, className, cursorClassName }) => {
  // Split each word into characters
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      // Animate each character span
      animate(
        "span.char", // Target elements with class 'char'
        {
          opacity: 1, // Make it visible
          // 'width' is not necessary for typewriter, simple opacity works better
        },
        {
          duration: 0.05, // Faster duration for each character
          delay: stagger(0.025), // Adjusted stagger for better speed
          ease: "linear",
        }
      );
    }
  }, [isInView, animate]);

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        // Added margin-right to separate words
        <div key={`word-${idx}`} className="inline-block mr-[0.5ch]"> 
          {word.text.map((char, index) => (
            <span
              key={`char-${index}`}
              className={cn("opacity-0 char", word.className)} // Target class 'char' and start at opacity 0
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div
      className={cn(
        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className={cn(
          "inline-block rounded-sm w-[6px] h-6 md:h-8 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      />
    </div>
  );
};

// Smooth effect: text slides in from left, useful for hero sections
export const TypewriterEffectSmooth = ({ words, className, cursorClassName }) => {
  // Combine all words into a single string for better width calculation
  const wordsString = words.map(word => word.text).join(" ");
  
  // Find the index of the last word for special styling
  const lastWordIndex = words.length - 1;

  const renderWords = () => (
    <div className="flex justify-center flex-wrap"> {/* Use flex-wrap to handle responsiveness */}
      {words.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block mr-3"> {/* Use margin for space */}
          {/* Apply a special class/style to the last word */}
          <span 
            className={cn(
              idx === lastWordIndex ? "text-blue-500 dark:text-blue-500" : "text-black dark:text-white", // Default color for all but last
              word.className // Custom class from props
            )}
          >
            {word.text}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={cn("flex space-x-1 my-6 justify-center", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{ width: "0%" }}
        // Use a key to ensure the width animation targets the full width of the rendered text
        whileInView={{ width: "fit-content" }} 
        transition={{ duration: 2, ease: "linear", delay: 0.5 }} // Adjusted delay
      >
        {/*
          The key to the smooth effect is that the text is fully rendered but hidden by
          the 'overflow-hidden' container, and the container's width is animated.
          whitespace-nowrap is removed to allow natural wrapping on small screens
        */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold">
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: 2.5 }} // Adjusted delay to start after text is revealed
        className={cn(
          "block rounded-sm w-[6px] h-6 sm:h-8 xl:h-12 bg-blue-500",
          cursorClassName
        )}
      />
    </div>
  );
};