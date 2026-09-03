"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  phraseId: string;
  initialFavorite: boolean;
};

// Lets a user mark a just-learned phrase as a favorite right on the
// completion screen — the only place phrases.is_favorite actually gets set,
// which is what makes the Archive page's "즐겨찾기" tab a real, DB-backed
// filter instead of a tab that can never have data.
export default function FavoritePhraseButton({ phraseId, initialFavorite }: Props) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [saving, setSaving] = useState(false);

  const toggle = async () => {
    if (saving) return;
    const next = !favorite;
    setFavorite(next);
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("phrases")
      .update({ is_favorite: next })
      .eq("id", phraseId);
    if (error) setFavorite(!next);
    setSaving(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기에 추가"}
      aria-pressed={favorite}
      className="flex h-6 w-6 shrink-0 items-center justify-center transition-transform active:scale-90"
    >
      <Star
        size={16}
        strokeWidth={2}
        className={favorite ? "fill-rosa text-rosa" : "text-neutral-300"}
      />
    </button>
  );
}
