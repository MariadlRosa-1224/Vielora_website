// src/components/races/RaceAbilityTree.tsx

"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { RaceAbilityTree, RaceAbility } from "@/lib/races";
import { vieloraColors } from "@/theme/colors";

type RaceAbilityTreeProps = {
  tree: RaceAbilityTree;
  className?: string;
};

type Edge = {
  from: string;
  to: string;
  color: string;
  path: string;
};

export default function RaceAbilityTree({
  tree,
  className = "",
}: RaceAbilityTreeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [hoveredAbilityId, setHoveredAbilityId] = useState<string | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<RaceAbility | null>(
    null,
  );
  const [edges, setEdges] = useState<Edge[]>([]);

  const abilityById = useMemo(() => {
    return Object.fromEntries(
      tree.abilities.map((ability) => [ability.id, ability]),
    );
  }, [tree.abilities]);

  const activeAbilityIds = useMemo(() => {
    if (!hoveredAbilityId) return new Set<string>();

    const active = new Set<string>();

    function visit(id: string) {
      if (active.has(id)) return;

      active.add(id);

      const ability = abilityById[id];

      if (!ability) return;


      ability.requires.forEach(visit);
    }

    visit(hoveredAbilityId);

    return active;
  }, [hoveredAbilityId, abilityById]);

  const activeEdgeIds = useMemo(() => {
    const active = new Set<string>();

    activeAbilityIds.forEach((id) => {
      const ability = abilityById[id];

      if (!ability) return;

      ability.requires.forEach((requiredId) => {
        if (activeAbilityIds.has(requiredId)) {
          active.add(`${requiredId}->${id}`);
        }
      });
    });

    return active;
  }, [activeAbilityIds, abilityById]);

  const measureEdges = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const nextEdges: Edge[] = [];

    tree.abilities.forEach((ability) => {
      const toNode = nodeRefs.current[ability.id];

      if (!toNode) return;

      const toRect = toNode.getBoundingClientRect();

      const toX = toRect.left + toRect.width / 2 - containerRect.left;
      const toY = toRect.top - containerRect.top;

      ability.requires.forEach((requiredId) => {
        const fromNode = nodeRefs.current[requiredId];

        if (!fromNode) return;

        const fromRect = fromNode.getBoundingClientRect();

        const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
        const fromY = fromRect.bottom - containerRect.top;

        const middleY = fromY + (toY - fromY) / 2;

        const path = [
          `M ${fromX} ${fromY}`,
          `L ${fromX} ${middleY}`,
          `L ${toX} ${middleY}`,
          `L ${toX} ${toY}`,
        ].join(" ");

        nextEdges.push({
          from: requiredId,
          to: ability.id,
          path,
          color: getBranchColor(ability.branch),
        });
      });
    });

    setEdges(nextEdges);
  }, [tree.abilities]);

  useLayoutEffect(() => {
    measureEdges();

    const observer = new ResizeObserver(() => {
      measureEdges();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", measureEdges);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureEdges);
    };
  }, [measureEdges]);

  const abilitiesByLevel = useMemo(() => {
    return tree.levels.map((level) => {
      const abilities = tree.abilities
        .filter((ability) => ability.level === level.id)
        .sort((a, b) => a.order - b.order);

      return {
        ...level,
        abilities,
      };
    });
  }, [tree.levels, tree.abilities]);

  return (
    <section className={className}>
      <h2 className="mb-8 text-center font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-white">
        Base Abilities
      </h2>

      <div
        ref={containerRef}
        className="relative overflow-x-auto px-4 pb-20 pt-4"
      >
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          {edges.map((edge) => {
            const edgeId = `${edge.from}->${edge.to}`;
            const isActive = activeEdgeIds.has(edgeId);

            return (
              <path
                key={edgeId}
                d={edge.path}
                fill="none"
                stroke={isActive ? edge.color : "rgba(255,255,255,0.28)"}
                strokeWidth={isActive ? 4 : 2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-200"
                style={{
                  filter: isActive
                    ? `drop-shadow(0 0 8px ${edge.color})`
                    : "none",
                }}
              />
            );
          })}
        </svg>

        <div className="relative z-10 min-w-[850px]">
          {abilitiesByLevel.map((level, levelIndex) => (
            <div key={level.id} className="relative">
              {levelIndex > 0 && (
                <div className="my-12 border-y border-white/50 bg-white/10 py-5 text-center backdrop-blur-sm">
                  <h3 className="font-['Spectral_SC'] text-2xl font-bold uppercase tracking-wider text-white">
                    {level.label}
                  </h3>
                </div>
              )}

              {levelIndex === 0 && (
                <div className="mb-10 border-t border-white/50" />
              )}

              <div className="flex min-h-[80px] items-center justify-center gap-12">
                {level.abilities.map((ability) => {
                  const isActive = activeAbilityIds.has(ability.id);
                  const isHovered = hoveredAbilityId === ability.id;

                  return (
                    <button
                      key={ability.id}
                      ref={(node) => {
                        nodeRefs.current[ability.id] = node;
                      }}
                      type="button"
                      onMouseEnter={() => setHoveredAbilityId(ability.id)}
                      onMouseLeave={() => setHoveredAbilityId(null)}
                      onClick={() => setSelectedAbility(ability)}
                      className={[
                        "relative min-h-[58px] w-[150px] rounded-md border px-4 py-3",
                        "bg-[#252642]/95 text-center font-['Spectral_SC'] text-sm font-bold uppercase tracking-wider text-white",
                        "transition duration-200 hover:-translate-y-1 hover:border-[#fff48e]",
                        "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",
                        isActive
                          ? "border-[#fff48e] shadow-[0_0_18px_rgba(255,244,142,0.55)]"
                          : "border-white/10",
                        isHovered ? "scale-105" : "",
                      ].join(" ")}
                      style={{
                        boxShadow: isActive
                          ? `0 0 18px ${getBranchColor(ability.branch)}`
                          : undefined,
                      }}
                    >
                      {ability.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAbility && (
        <AbilityModal
          ability={selectedAbility}
          abilityById={abilityById}
          onClose={() => setSelectedAbility(null)}
        />
      )}
    </section>
  );
}

function AbilityModal({
  ability,
  abilityById,
  onClose,
}: {
  ability: RaceAbility;
  abilityById: Record<string, RaceAbility>;
  onClose: () => void;
}) {
  const requiredAbilities = ability.requires
    .map((id) => abilityById[id])
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <article
        className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#fff48e] bg-[#111120] p-8 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-8">
          <h3 className="font-['Spectral_SC'] text-3xl font-bold uppercase tracking-wider text-[#fff48e]">
            {ability.name}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/30 bg-transparent px-3 py-1 text-sm text-white hover:border-[#fff48e] hover:text-[#fff48e]"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-white">
          {ability.description}
        </p>

        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="font-['Spectral_SC'] text-sm font-bold uppercase tracking-wider text-white/70">
            Required abilities
          </p>

          {requiredAbilities.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
              {requiredAbilities.map((required) => (
                <li
                  key={required.id}
                  className="rounded-md border border-white/20 px-3 py-1"
                >
                  {required.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-white/50">None</p>
          )}
        </div>
      </article>
    </div>
  );
}

function getBranchColor(branch: string) {
  const colors: Record<string, string> = {
  "path-blue": vieloraColors.blue,
  "path-violet": vieloraColors.violet,
  "path-aqua": vieloraColors.aqua,
  "path-rose": vieloraColors.roseRed,
  "path-coral": vieloraColors.coral,
  "path-yellow": vieloraColors.parchment,
  };

  return colors[branch] ?? "#fff48e";
}