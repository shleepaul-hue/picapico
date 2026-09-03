// Best-effort free-text destination -> flag emoji lookup. `profiles.destination`
// is a free-text field ("바르셀로나, 스페인", "Cancún, Mexico", ...), so this
// just matches known country/city keywords anywhere in the string rather than
// requiring a geocoding lookup. Spanish-speaking countries are listed first
// since that's what the app is actually for, but a handful of other common
// travel destinations are included too so the flag still shows up for them.
const DESTINATION_FLAGS: { flag: string; keywords: string[] }[] = [
  { flag: "🇪🇸", keywords: ["스페인", "spain", "마드리드", "madrid", "바르셀로나", "barcelona", "세비야", "sevilla", "발렌시아", "valencia"] },
  { flag: "🇲🇽", keywords: ["멕시코", "mexico", "México", "칸쿤", "cancun", "cancún", "멕시코시티"] },
  { flag: "🇦🇷", keywords: ["아르헨티나", "argentina", "부에노스아이레스", "buenos aires"] },
  { flag: "🇨🇴", keywords: ["콜롬비아", "colombia", "보고타", "bogota", "bogotá", "메데인", "medellin", "medellín"] },
  { flag: "🇵🇪", keywords: ["페루", "peru", "perú", "리마", "lima", "쿠스코", "cusco", "마추픽추", "machu picchu"] },
  { flag: "🇨🇱", keywords: ["칠레", "chile", "산티아고", "santiago"] },
  { flag: "🇨🇺", keywords: ["쿠바", "cuba", "아바나", "havana", "habana"] },
  { flag: "🇻🇪", keywords: ["베네수엘라", "venezuela"] },
  { flag: "🇪🇨", keywords: ["에콰도르", "ecuador", "키토", "quito"] },
  { flag: "🇬🇹", keywords: ["과테말라", "guatemala"] },
  { flag: "🇧🇴", keywords: ["볼리비아", "bolivia"] },
  { flag: "🇩🇴", keywords: ["도미니카", "dominican"] },
  { flag: "🇺🇾", keywords: ["우루과이", "uruguay"] },
  { flag: "🇵🇾", keywords: ["파라과이", "paraguay"] },
  { flag: "🇨🇷", keywords: ["코스타리카", "costa rica"] },
  { flag: "🇵🇦", keywords: ["파나마", "panama", "panamá"] },
  { flag: "🇭🇳", keywords: ["온두라스", "honduras"] },
  { flag: "🇸🇻", keywords: ["엘살바도르", "el salvador"] },
  { flag: "🇳🇮", keywords: ["니카라과", "nicaragua"] },
  { flag: "🇬🇶", keywords: ["적도기니", "equatorial guinea"] },
  // Common non-Spanish destinations users might still type in
  { flag: "🇮🇩", keywords: ["발리", "인도네시아", "bali", "indonesia"] },
  { flag: "🇯🇵", keywords: ["일본", "japan", "도쿄", "tokyo", "오사카", "osaka"] },
  { flag: "🇹🇭", keywords: ["태국", "thailand", "방콕", "bangkok"] },
  { flag: "🇻🇳", keywords: ["베트남", "vietnam"] },
  { flag: "🇫🇷", keywords: ["프랑스", "france", "파리", "paris"] },
  { flag: "🇮🇹", keywords: ["이탈리아", "italy", "로마", "rome", "roma"] },
  { flag: "🇺🇸", keywords: ["미국", "united states", "뉴욕", "new york"] },
];

export function getDestinationFlag(
  destination: string | null | undefined
): string | null {
  if (!destination) return null;
  const lower = destination.toLowerCase();
  for (const entry of DESTINATION_FLAGS) {
    if (entry.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry.flag;
    }
  }
  return null;
}
