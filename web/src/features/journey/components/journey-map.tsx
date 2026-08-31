import Link from "next/link";
import {
  Check,
  CircleDashed,
  Clock3,
  LockKeyhole,
  Play,
  RotateCcw,
} from "lucide-react";

import type { JourneyNode } from "@/features/journey/domain/build-journey-map";

const stateLabel = {
  available: "Siap dikerjakan",
  started: "Sedang berjalan",
  completed: "Selesai",
  missed: "Terlewat",
  next: "Berikutnya",
  locked: "Terkunci",
} as const;

function NodeIcon({ state }: { state: JourneyNode["state"] }) {
  if (state === "completed") return <Check size={18} strokeWidth={2.3} />;
  if (state === "started" || state === "available")
    return <Play size={17} strokeWidth={2.1} />;
  if (state === "missed") return <RotateCcw size={17} strokeWidth={2} />;
  if (state === "next") return <CircleDashed size={18} strokeWidth={2} />;
  return <LockKeyhole size={16} strokeWidth={1.9} />;
}

export function JourneyMap({ nodes }: { nodes: JourneyNode[] }) {
  return (
    <section className="journey-map" aria-label="Peta quest 14 hari">
      {nodes.map((node) => {
        const isActionable =
          node.state === "available" || node.state === "started";
        const content = (
          <>
            <span className="journey-node__marker" aria-hidden="true">
              <NodeIcon state={node.state} />
            </span>
            <span className="journey-node__content">
              <span className="journey-node__meta">
                Day {String(node.dayNumber).padStart(2, "0")} · {stateLabel[node.state]}
              </span>
              <strong>{node.title}</strong>
              <small>{node.theme}</small>
              <span className="journey-node__reward">
                <Clock3 size={14} strokeWidth={1.9} aria-hidden="true" />
                {node.durationMinutes} menit · +{node.xpValue} XP
              </span>
            </span>
          </>
        );

        return isActionable ? (
          <Link
            key={node.id}
            href="/"
            className={`journey-node journey-node--${node.state}`}
          >
            {content}
          </Link>
        ) : (
          <article
            key={node.id}
            className={`journey-node journey-node--${node.state}`}
          >
            {content}
          </article>
        );
      })}
    </section>
  );
}
