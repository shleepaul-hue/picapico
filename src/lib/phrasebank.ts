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

// 질문형("~요?")인지 평서문/감탄문인지 판별 — 한국어·스페인어 표현 모두 물음표로
// 끝나는지만 보면 구분된다. 오답 보기의 문장 유형을 정답과 맞춰서, 유저가 뜻은
// 몰라도 "물음표가 붙은 게 하나뿐이네" 같은 식으로 문장부호만 보고 찍어
// 맞히는 걸 막기 위해 쓰인다.
function isQuestion(text: string): boolean {
  return text.trim().endsWith("?");
}

// 4-way multiple choice: the correct Korean translation plus 3 distractors
// drawn from the rest of that session's phrases (falling back to the whole
// bank if a session is shorter than 4 phrases). Distractors are restricted
// to the same sentence type (질문형/평서문) as the correct answer — otherwise
// the odd one out gives the answer away without any Spanish knowledge.
export function buildChoices(correct: Phrase, sessionPhrases: Phrase[]): string[] {
  const wantQuestion = isQuestion(correct.korean);
  const sameType = (p: Phrase) =>
    p.korean !== correct.korean && isQuestion(p.korean) === wantQuestion;

  const sessionPool = sessionPhrases.length > 3 ? sessionPhrases : PHRASE_BANK;
  let candidates = sessionPool.filter(sameType);
  // Fall back to the full bank (still filtered by sentence type) if this
  // session's other phrases don't have enough of the matching type.
  if (candidates.length < 3) {
    candidates = PHRASE_BANK.filter(sameType);
  }

  const distractors = shuffle(candidates.map((p) => p.korean)).slice(0, 3);
  return shuffle([...distractors, correct.korean]);
}

// 응용문제(bonus round): 뜻(한국어)을 보고 스페인어 표현을 고르는 역방향 회상.
// 오늘 세션에서 함께 배운 나머지 표현들을 오답으로 써서 — 방금 익힌 것들끼리라
// 서로 헷갈리기 쉬운, 자연히 "비슷한 단어/동사"인 오답이 나온다. 여기서도 오답은
// 정답과 같은 문장 유형(질문형/평서문)으로 제한한다.
export function buildBonusChoices(correct: Phrase, sessionPhrases: Phrase[]): string[] {
  const wantQuestion = isQuestion(correct.spanish);
  const sameType = (p: Phrase) =>
    p.spanish !== correct.spanish && isQuestion(p.spanish) === wantQuestion;

  const sessionPool = sessionPhrases.length > 3 ? sessionPhrases : PHRASE_BANK;
  let candidates = sessionPool.filter(sameType);
  if (candidates.length < 3) {
    candidates = PHRASE_BANK.filter(sameType);
  }

  const distractors = shuffle(candidates.map((p) => p.spanish)).slice(0, 3);
  return shuffle([...distractors, correct.spanish]);
}
