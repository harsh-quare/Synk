import React, { useState, useEffect } from 'react';

// The component accepts a title and subtitle as props for reusability.
function AnimatedHeader({ title, subtitle }) {
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // This useEffect handles the animation logic.
  useEffect(() => {
    let typingInterval;
    let cursorInterval;
    // Reset state when props change, ensuring animation re-runs on navigation
    setTypedSubtitle(''); 

    const startTypingTimeout = setTimeout(() => {
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < subtitle.length) {
          setTypedSubtitle((prev) => prev + subtitle.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
          }, 500);
        }
      }, 50);
    }, title.length * 50 + 200);

    return () => {
      clearTimeout(startTypingTimeout);
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
    // We add the props as dependencies, so the animation re-triggers if the text changes.
  }, [title, subtitle]);

  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 inline-block py-2">
        {title.split('').map((char, index) => (
          <span
            key={index}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h2>

      <div className="flex justify-center items-center h-6">
        <p className="text-gray-400">
          {typedSubtitle}
          <span className={`ml-1 w-px h-5 bg-gray-600 inline-block transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
        </p>
      </div>
    </div>
  );
}

export default AnimatedHeader;