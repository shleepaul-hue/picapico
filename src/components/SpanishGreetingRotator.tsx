"use client";

import { useEffect, useState } from "react";

// A rotating scrap of spoken Spanish, greeting-flavored, that "flips" in 3D
// (perspective + rotateX) like a little card turning over — pure CSS, no
// animation library, no shadows. Sits next to the bird character on the
// Home and landing screens so the mascot always feels like it's "saying"
// something different, in the language the app teaches.
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
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped(true);
      const swap = setTimeout(() => {
        setGreeting((current) => pickNext(current));
        setFlipped(false);
      }, 220);
      return () => clearTimeout(swap);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ perspective: "500px" }}>
      <span
        className="inline-block rounded-2xl bg-white px-3.5 py-1.5 text-[13px] font-bold text-rosa-600 transition-transform duration-200 ease-in"
        style={{
          transform: flipped ? "rotateX(90deg)" : "rotateX(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {greeting}
      </span>
      <span className="-mt-[3px] h-2 w-2 rotate-45 bg-white" />
    </div>
  );
}
