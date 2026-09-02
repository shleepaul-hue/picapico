"use client";

import dynamic from "next/dynamic";
import BrandTransition from "@/components/BrandTransition";

const StudySession = dynamic(() => import("@/components/StudySession"), {
  ssr: false,
  loading: () => <BrandTransition label="학습 준비 중..." />,
});

type Props = {
  destination: string | null;
  dDayLabel: string | null;
};

export default function StudySessionLoader({ destination, dDayLabel }: Props) {
  return <StudySession destination={destination} dDayLabel={dDayLabel} />;
}
