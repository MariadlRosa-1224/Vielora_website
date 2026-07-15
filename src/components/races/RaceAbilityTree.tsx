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

type AbilityLevelGroup = {
  id: string;
  label: string;
  abilities: RaceAbility[];
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

  const parentsById = useMemo(() => {
    const parents: Record<string, string[]> = {};

    tree.abilities.forEach((ability) => {
      ability.follows.forEach((nextId) => {
        parents[nextId] ??= [];
        parents[nextId].push(ability.id);
      });
    });

    return parents;
  }, [tree.abilities]);

  const activeAbilityIds = useMemo(() => {
    if (!hoveredAbilityId) return new Set<string>();

    const active = new Set<string>();
    const hoveredAbility = abilityById[hoveredAbilityId];

    if (!hoveredAbility) return active;

    function visit(id: string) {
      if (active.has(id)) return;

      const ability = abilityById[id];

      if (!ability) return;

      if (!sharesBranchPath(hoveredAbility, ability)) return;

      active.add(id);

      const parents = parentsById[id] ?? [];
      parents.forEach(visit);
    }

    visit(hoveredAbilityId);

    return active;
  }, [hoveredAbilityId, abilityById, parentsById]);

  const activeEdgeIds = useMemo(() => {
    const active = new Set<string>();

    edges.forEach((edge) => {
      if (activeAbilityIds.has(edge.from) && activeAbilityIds.has(edge.to)) {
        active.add(`${edge.from}->${edge.to}`);
      }
    });

    return active;
  }, [edges, activeAbilityIds]);

  const measureEdges = useCallback(() => {
    const container = containerRef.current;

    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const nextEdges: Edge[] = [];

    tree.abilities.forEach((ability) => {
      const fromNode = nodeRefs.current[ability.id];

      if (!fromNode) return;

      const fromRect = fromNode.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const fromY = fromRect.bottom - containerRect.top;

      ability.follows.forEach((nextId) => {
        const nextAbility = abilityById[nextId];
        const toNode = nodeRefs.current[nextId];

        if (!nextAbility || !toNode) return;

        const toRect = toNode.getBoundingClientRect();

        const toX = toRect.left + toRect.width / 2 - containerRect.left;
        const toY = toRect.top - containerRect.top;

        const middleY = fromY + (toY - fromY) / 2;

        const path = [
          `M ${fromX} ${fromY}`,
          `L ${fromX} ${middleY}`,
          `L ${toX} ${middleY}`,
          `L ${toX} ${toY}`,
        ].join(" ");

        nextEdges.push({
          from: ability.id,
          to: nextId,
          path,
          color: getEdgeColor(ability, nextAbility),
        });
      });
    });

    setEdges(nextEdges);
  }, [tree.abilities, abilityById]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(measureEdges);

    const observer = new ResizeObserver(() => {
      measureEdges();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", measureEdges);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measureEdges);
    };
  }, [measureEdges]);

  const abilitiesByLevel = useMemo<AbilityLevelGroup[]>(() => {
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
      <h2 className="mb-4 text-center font-['Spectral_SC'] text-2xl font-bold uppercase tracking-wider text-white sm:text-3xl">
        Base Abilities
      </h2>

      <p className="mx-auto mb-6 max-w-xl text-center text-xs text-white/60 md:hidden">
        Tap an ability to see its description and requirements.
      </p>

      <div className="md:hidden">
        <MobileAbilityList
          levels={abilitiesByLevel}
          abilityById={abilityById}
          onSelect={setSelectedAbility}
        />
      </div>

      <div className="hidden md:block">
        <p className="mb-4 text-center text-xs text-white/50 lg:hidden">
          Swipe horizontally if the tree is wider than the screen.
        </p>

        <div
          ref={containerRef}
          className="relative overflow-x-auto px-3 pb-20 pt-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#fff48e]/50 lg:px-4"
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

          <div className="relative z-10 min-w-[760px] lg:min-w-[900px] xl:min-w-[1020px]">
            {abilitiesByLevel.map((level, levelIndex) => (
              <div key={level.id} className="relative">
                {levelIndex > 0 && (
                  <div className="my-10 rounded-lg border border-white/50 bg-white/5 py-4 text-center backdrop-blur-sm lg:my-12 lg:py-5">
                    <h3 className="font-['Spectral_SC'] text-xl font-bold uppercase tracking-wider text-white lg:text-2xl">
                      {level.label}
                    </h3>
                  </div>
                )}

                {levelIndex === 0 && (
                  <div className="mb-8 border-t border-white/50 lg:mb-10" />
                )}

                <div className="flex min-h-[76px] items-center justify-center gap-6 lg:min-h-[80px] lg:gap-10 xl:gap-12">
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
                        onFocus={() => setHoveredAbilityId(ability.id)}
                        onBlur={() => setHoveredAbilityId(null)}
                        onClick={() => setSelectedAbility(ability)}
                        className={[
                          "relative min-h-[54px] w-32 rounded-md border px-3 py-2",
                          "!bg-[#252642]/95 text-center font-['Spectral_SC'] text-xs font-bold uppercase tracking-wider text-white",
                          "transition duration-200 hover:-translate-y-1 hover:border-[#fff48e]",
                          "focus:outline-none focus:ring-2 focus:ring-[#fff48e]",
                          "lg:min-h-[58px] lg:w-[150px] lg:px-4 lg:py-3 lg:text-sm",
                          isActive
                            ? "border-[#fff48e] shadow-[0_0_18px_rgba(255,244,142,0.55)]"
                            : "border-white/10",
                          isHovered ? "scale-105" : "",
                        ].join(" ")}
                        style={{
                          boxShadow: isActive
                            ? `0 0 18px ${getEdgeColor(ability, ability)}`
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

function MobileAbilityList({
  levels,
  abilityById,
  onSelect,
}: {
  levels: AbilityLevelGroup[];
  abilityById: Record<string, RaceAbility>;
  onSelect: (ability: RaceAbility) => void;
}) {
  return (
    <div className="space-y-6">
      {levels.map((level) => {
        if (level.abilities.length === 0) return null;

        return (
          <section key={level.id} className="border border-white/30 rounded-lg ">
          <CollapsibleSection key={level.id} title={level.label}>

            <div className="grid gap-3 sm:grid-cols-2 pt-4">
              {level.abilities.map((ability) => {
                const requiredAbilities = ability.requires
                  .map((id) => abilityById[id])
                  .filter(Boolean);

                const color = getBranchColor(
                  ability.branch[0] === "path-yellow"
                    ? "path-yellow"
                    :
                  ability.branch.find((branch) => branch !== "path-yellow") ??
                    ability.branch[0] ??
                    "path-yellow",
                );

                return (
                  <button
                    key={ability.id}
                    type="button"
                    onClick={() => onSelect(ability)}
                    className="rounded-lg border border-white/15 bg-[#252642]/90 p-4 text-left transition hover:border-[#fff48e] focus:outline-none focus:ring-2 focus:ring-[#fff48e]"
                    style={{
                      boxShadow: `inset 4px 0 0 ${color}`,
                    }}
                  >
                    <span className="block font-['Spectral_SC'] text-base font-bold uppercase tracking-wider text-white">
                      {ability.name}
                    </span>

                    <span className="mt-2 line-clamp-2 block text-xs leading-relaxed text-white/60">
                      {ability.description}
                    </span>

                    {requiredAbilities.length > 0 && (
                      <span className="mt-3 block text-[11px] uppercase tracking-wider text-[#fff48e]/80">
                        {ability.requiresMode === "any"
                          ? "Requires one of: "
                          : ability.requires.length > 1
                            ? "Requires all of: "
                            : "Requires: "}
                        {requiredAbilities
                          .map((required) => required.name)
                          .join(", ")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CollapsibleSection>
        </section>
        );
      })}
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="">
<button
  type="button"
  onClick={() => setIsOpen((current) => !current)}
  aria-expanded={isOpen}
  className={["!border-none !bg-[#111120]/50 p-4 !backdrop-blur-sm ",
    "flex w-full appearance-none items-center justify-between text-left shadow-none !outline-none ring-0",
  ].join(" ")}
>
  <span className="font-['Spectral_SC'] font-bold uppercase tracking-wide">
    {title}
  </span>

  <span
    aria-hidden="true"
    className={[
      "text-sm transition-transform duration-200",
      isOpen ? "rotate-180 text-[#fff48e]" : "rotate-0",
    ].join(" ")}
  >
    ▾
  </span>
</button>

      <div
        className={[
          "grid transition-all duration-300 ease-in-out",
          " !bg-[#111120]/50 px-4 !backdrop-blur-sm",
          isOpen ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden text-sm leading-relaxed text-white">
          {children}
        </div>
      </div>
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

  const requirementLabel =
    ability.requires.length === 0
      ? "Required abilities"
      : ability.requiresMode === "any"
        ? "Requires one of"
        : ability.requires.length === 1
          ? "Requires"
          : "Requires all of";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 py-4 sm:items-center sm:px-6"
      onClick={onClose}
    >
      <article
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#fff48e] bg-[#111120] p-5 text-white shadow-2xl sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
          <h3 className="font-['Spectral_SC'] text-2xl font-bold uppercase tracking-wider text-[#fff48e] sm:text-3xl">
            {ability.name}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="w-fit rounded-md border border-white/30 bg-transparent px-3 py-1 text-sm text-white hover:border-[#fff48e] hover:text-[#fff48e]"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-white">
          {ability.description}
        </p>

        <div className="mt-6 border-t border-white/20 pt-4">
          <p className="font-['Spectral_SC'] text-sm font-bold uppercase tracking-wider text-white/70">
            {requirementLabel}
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

function getPathBranches(ability: RaceAbility) {
  return ability.branch.filter((branch) => branch !== "path-yellow");
}

function sharesBranchPath(abilityA: RaceAbility, abilityB: RaceAbility) {
  const branchesA = getPathBranches(abilityA);
  const branchesB = getPathBranches(abilityB);

  if (branchesA.length === 0 || branchesB.length === 0) {
    return abilityA.branch.some((branch) => abilityB.branch.includes(branch));
  }

  return branchesA.some((branch) => branchesB.includes(branch));
}

function getEdgeColor(fromAbility: RaceAbility, toAbility: RaceAbility) {
  const sharedBranches = fromAbility.branch.filter((branch) =>
    toAbility.branch.includes(branch),
  );

  const preferredBranch =
    sharedBranches[0] === "path-yellow"
      ? "path-yellow"
      : sharedBranches.find((branch) => branch !== "path-yellow") ??
        sharedBranches[0] ??
        toAbility.branch.find((branch) => branch !== "path-yellow") ??
        toAbility.branch[0] ??
        fromAbility.branch[0] ??
        "path-yellow";

  return getBranchColor(preferredBranch);
}

function getBranchColor(branch: string) {
  const colors: Record<string, string> = {
    "path-blue": vieloraColors.blue,
    "path-violet": vieloraColors.violet,
    "path-aqua": vieloraColors.aqua,
    "path-red": vieloraColors.roseRed,
    "path-coral": vieloraColors.coral,
    "path-yellow": vieloraColors.parchment,
  };

  return colors[branch] ?? "#fff48e";
}