"use client";

import { useEffect, useState } from "react";

// A rotating scrap of spoken Spanish, greeting-flavored, in a cute little
// speech bubble next to the bird character on the Home and signup screens —
// so the mascot always feels like it's "saying" something different, in the
// language the app teaches. Each new phrase rises up into place (reusing the
// existing fade-slide-up motion primitive) rather than flipping/rotating.
const GREETINGS = [
  "¡Hola!",
  "¿Qué tal?",
  "¡Buenas!",
  "¿Cómo estás?",
  "¡Hey, amigo!",
  "¿Qué onda?",
  "¡Buen día!",
  "¡Nos vemos!",
];

function pickNext(current: string): string {
  const options = GREETINGS.filter((g) => g !== current);
  return options[Math.floor(Math.random() * options.length)];
}

type Props = {
  className?: string;
};

export default function SpanishGreetingRotator({ className = "" }: Props) {
  const [greeting, setGreeting] = useState(GREETINGS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting((current) => pickNext(current));
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="overflow-hidden rounded-full border border-rosa-100 bg-white px-4 py-1.5">
        {/* key={greeting} remounts the span on every swap, replaying the
           rise-up animation each time instead of only on first paint. */}
        <span
          key={greeting}
          className="animate-fade-slide-up inline-block text-[13px] font-bold text-rosa-600"
        >
          {greeting}
        </span>
      </div>
      <span className="-mt-[3px] h-2 w-2 rotate-45 border-b border-r border-rosa-100 bg-white" />
    </div>
  );
}
