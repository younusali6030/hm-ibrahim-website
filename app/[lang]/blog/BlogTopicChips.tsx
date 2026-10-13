"use client";

import { useBlogTopic } from "./BlogTopics";
import { useT } from "@/lib/i18n";

/** Topic filter in the hero. Buttons, so Space and Enter work; the pressed one is the filter. */
export function BlogTopicChips({ topics, total }: { topics: { name: string; count: number }[]; total: number }) {
  const t = useT();
  const { selected, setSelected, setPreview } = useBlogTopic();
  const chip =
    "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ";
  return (
    <div className="border-t border-white/10 bg-nav">
      <div className="page-container py-3">
        <ul className="flex flex-wrap gap-2" aria-label={t("Topics", "विषय")} onPointerLeave={() => setPreview(null)}>
          <li>
            <button
              type="button"
              aria-pressed={selected === null}
              onClick={() => setSelected(null)}
              onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(null)}
              className={chip + (selected === null ? "border-primary bg-primary/15 text-white" : "border-white/25 text-white hover:bg-white/10")}
            >
              {t("All guides", "सभी गाइड")}
              <span className="font-mono-brand text-xs text-white/60"> · {total}</span>
            </button>
          </li>
          {topics.map((tp) => (
            <li key={tp.name}>
              <button
                type="button"
                aria-pressed={selected === tp.name}
                onClick={() => setSelected(selected === tp.name ? null : tp.name)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setPreview(tp.name)}
                onFocus={() => setPreview(tp.name)}
                onBlur={() => setPreview(null)}
                className={chip + (selected === tp.name ? "border-primary bg-primary/15 text-white" : "border-white/25 text-white hover:bg-white/10")}
              >
                {tp.name}
                <span className="font-mono-brand text-xs text-white/60"> · {tp.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
