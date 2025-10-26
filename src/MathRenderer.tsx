import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        MathJax: {
            typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
        };
    }
}

interface MathRendererProps {
  latex: string;
  className?: string;
  inline?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ latex, className, inline = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const Component = inline ? 'span' : 'div';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add delimiters for MathJax to process
    const delimiters = inline ? ['$', '$'] : ['$$', '$$'];
    container.innerHTML = `${delimiters[0]}${latex}${delimiters[1]}`;

    const typeset = () => {
      if (window.MathJax?.typesetPromise) {
        window.MathJax.typesetPromise([container]).catch((err) => {
          console.error("MathJax typesetting error:", err);
          container.innerHTML = latex; // Fallback to raw text on error
        });
      }
    };

    // If MathJax is already loaded, typeset immediately.
    // Otherwise, poll until it's available.
    if (window.MathJax?.typesetPromise) {
      typeset();
    } else {
      let attempts = 0;
      const intervalId = setInterval(() => {
        attempts++;
        if (window.MathJax?.typesetPromise) {
          clearInterval(intervalId);
          typeset();
        } else if (attempts > 10) { // Timeout after 2 seconds
          clearInterval(intervalId);
          console.error("MathJax failed to load.");
          container.innerHTML = latex; // Fallback
        }
      }, 200);

      return () => clearInterval(intervalId);
    }
  }, [latex, inline]);

  return <Component ref={containerRef} className={className}></Component>;
};

export default MathRenderer;
