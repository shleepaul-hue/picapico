// Small built-in bank of travel small-talk phrases used to generate quiz
// sessions. Not a DB table — this is static app content, separate from
// public.phrases (which records phrases a user has actually learned).

export type Phrase = {
  spanish: string;
  korean: string;
  category: "인사" | "스몰토크";
};

export const PHRASE_BANK: Phrase[] = [
  { spanish: "¿De dónde eres?", korean: "어디 출신이세요?", category: "인사" },
  { spanish: "Mucho gusto", korean: "만나서 반가워요", category: "인사" },
  { spanish: "¿Cómo te llamas?", korean: "이름이 뭐예요?", category: "인사" },
  { spanish: "¿Cuántos años tienes?", korean: "몇 살이에요?", category: "인사" },
  { spanish: "Nos vemos luego", korean: "나중에 봐요", category: "인사" },
  { spanish: "¡Que tengas un buen día!", korean: "좋은 하루 보내세요!", category: "인사" },
  { spanish: "¿A dónde vas?", korean: "어디 가세요?", category: "스몰토크" },
  { spanish: "¿Qué tal tu día?", korean: "오늘 하루 어땠어요?", category: "스몰토크" },
  { spanish: "Estoy de vacaciones", korean: "저는 휴가 중이에요", category: "스몰토크" },
  {
    spanish: "¿Me recomiendas algún lugar?",
    korean: "추천해줄 만한 곳 있어요?",
    category: "스몰토크",
  },
  { spanish: "Es mi primera vez aquí", korean: "여기 처음 왔어요", category: "스몰토크" },
  { spanish: "¿Hablas inglés?", korean: "영어 할 줄 아세요?", category: "스몰토크" },
  { spanish: "Gracias por tu ayuda", korean: "도와줘서 고마워요", category: "스몰토크" },
  { spanish: "¿Cuánto cuesta esto?", korean: "이거 얼마예요?", category: "스몰토크" },
  { spanish: "¿Dónde está el baño?", korean: "화장실이 어디예요?", category: "스몰토크" },
];

export const SESSION_LENGTH = 5;

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

export function pickSessionPhrases(): Phrase[] {
  return shuffle(PHRASE_BANK).slice(0, SESSION_LENGTH);
}

// 4-way multiple choice: the correct Korean translation plus 3 distractors
// drawn from the rest of that session's phrases (falling back to the whole
// bank if a session is shorter than 4 phrases).
export function buildChoices(correct: Phrase, sessionPhrases: Phrase[]): string[] {
  const pool =
    sessionPhrases.length > 3 ? sessionPhrases : PHRASE_BANK;
  const distractors = shuffle(
    pool.filter((p) => p.korean !== correct.korean).map((p) => p.korean)
  ).slice(0, 3);
  return shuffle([...distractors, correct.korean]);
}
