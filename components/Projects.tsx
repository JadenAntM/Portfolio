"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowLink } from "@/components/ArrowLink";
import { HeadingReveal } from "@/components/HeadingReveal";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { PROJECTS, type Project } from "@/data/projects";
import { SECTIONS } from "@/data/sections";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const meta = SECTIONS.find((section) => section.id === "projects")!;
const SETTLE_SPRING = {
  type: "spring",
  stiffness: 460,
  damping: 34,
  mass: 0.45,
} as const;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function ProjectCard({
  project,
  linkTabIndex,
}: {
  project: Project;
  linkTabIndex?: number;
}) {
  return (
    <article
      className={`project-card group grid overflow-hidden rounded-sm border border-border bg-bg transition-colors hover:border-accent focus-within:border-accent ${project.details ? "project-card-detailed" : ""}`}
    >
      <div className="project-card-media relative min-h-0 overflow-hidden border-b border-border bg-surface md:border-r md:border-b-0">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.alt}
            fill
            priority={PROJECTS.indexOf(project) === 0}
            sizes="(min-width: 48rem) 40vw, 86vw"
            className="project-card-image object-contain"
          />
        ) : null}
        <span className="mono absolute top-3 left-3 border border-border bg-bg px-2 py-1 text-micro text-fg-tertiary">
          PROJECT_{pad(PROJECTS.indexOf(project) + 1)}
        </span>
      </div>

      <div className="project-card-copy flex min-h-0 flex-col p-5 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-h3 text-fg">{project.name}</h3>
          {project.subtitle ? (
            <p className="mono text-mono-sm text-fg-tertiary">
              {project.subtitle}
            </p>
          ) : null}
        </div>
        <p className="mt-3 text-body text-fg-secondary">{project.description}</p>

        {project.attribution ? (
          <p className="mono mt-4 border-l border-accent pl-3 text-micro leading-relaxed text-fg-secondary">
            {project.attribution}
          </p>
        ) : null}

        {project.details ? (
          <dl className="mt-4 space-y-3 border-t border-border pt-4">
            {project.details.map((detail) => (
              <div key={detail.label}>
                <dt className="mono text-micro uppercase text-fg-tertiary">
                  {detail.label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-fg-secondary">
                  {detail.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-6 border-t border-border pt-5">
          <p className="mono mb-3 text-micro uppercase text-fg-tertiary">Stack</p>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="mono rounded-sm border border-border px-2 py-1 text-micro text-fg-tertiary"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 pt-6">
          {project.liveDemoHref ? (
            <ArrowLink href={project.liveDemoHref} external tabIndex={linkTabIndex}>
              Live demo
            </ArrowLink>
          ) : null}
          {project.sourceCodeHref ? (
            <ArrowLink href={project.sourceCodeHref} external tabIndex={linkTabIndex}>
              Source code
            </ArrowLink>
          ) : project.href ? (
            <ArrowLink href={project.href} external tabIndex={linkTabIndex}>
              View project
            </ArrowLink>
          ) : project.accessLabel ? (
            <p className="mono text-micro uppercase tracking-wide text-fg-tertiary">
              {project.accessLabel}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Carriage({
  project,
  index,
  activeIndex,
  settle,
}: {
  project: Project;
  index: number;
  activeIndex: number;
  settle: boolean;
}) {
  return (
    <motion.div
      data-project-carriage={index}
      className="project-carriage relative shrink-0 snap-center pt-9"
      animate={{ y: settle && activeIndex === index ? -6 : 0 }}
      transition={SETTLE_SPRING}
    >
      <span
        aria-hidden
        className="absolute top-0 left-1/2 h-9 border-l border-border"
      />
      <span
        aria-hidden
        className="absolute top-8 left-1/2 size-2 -translate-x-1/2 border border-border bg-bg"
      />
      <ProjectCard
        project={project}
        linkTabIndex={settle && activeIndex !== index ? -1 : undefined}
      />
    </motion.div>
  );
}

function ProjectHeading({
  activeIndex,
  onPrevious,
  onNext,
}: {
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <GridRow
      mainClassName="project-rail-header"
      main={
        <div>
          <div className="flex items-end justify-between gap-6">
            <div>
              <SectionMarker index={meta.index!} />
              <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>
            </div>
            <p
              data-project-index
              className="mono shrink-0 text-mono-sm text-fg-tertiary"
              aria-label={`Project ${activeIndex + 1} of ${PROJECTS.length}`}
              aria-live="polite"
            >
              <span className="text-accent">{pad(activeIndex + 1)}</span>
              <span className="px-1">/</span>
              {pad(PROJECTS.length)}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="mono text-label uppercase text-fg-tertiary">
              <span className="sm:hidden">Swipe or use controls</span>
              <span className="hidden sm:inline">Drag or use controls</span>
            </p>

            <div
              className="flex shrink-0 gap-2"
              role="group"
              aria-label="Project controls"
            >
              <button
                type="button"
                onClick={onPrevious}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                aria-controls="project-gallery"
                className="mono grid size-11 place-items-center rounded-sm border border-border text-mono-sm text-fg transition-[border-color,color] hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-fg-tertiary disabled:opacity-35 disabled:hover:border-border"
              >
                <span aria-hidden>←</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={activeIndex === PROJECTS.length - 1}
                aria-label="Next project"
                aria-controls="project-gallery"
                className="mono grid size-11 place-items-center rounded-sm border border-border text-mono-sm text-fg transition-[border-color,color] hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-fg-tertiary disabled:opacity-35 disabled:hover:border-border"
              >
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}

export function Projects() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const pointerGestureRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startScrollLeft: number;
    axis: "x" | "y" | null;
  } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const lockHorizontalWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

      event.preventDefault();
      const deltaScale =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? viewport.clientWidth
            : 1;
      viewport.scrollLeft += event.deltaX * deltaScale;
    };

    viewport.addEventListener("wheel", lockHorizontalWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", lockHorizontalWheel);
  }, []);

  const getNearestProjectIndex = () => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row) return null;

    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const cards = [...row.querySelectorAll<HTMLElement>("[data-project-carriage]")];
    if (cards.length === 0) return null;

    return cards.reduce((nearest, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const nearestCard = cards[nearest];
      const nearestCenter = nearestCard.offsetLeft + nearestCard.offsetWidth / 2;
      return Math.abs(cardCenter - center) < Math.abs(nearestCenter - center)
        ? index
        : nearest;
    }, 0);
  };

  const updateNativeIndex = () => {
    const next = getNearestProjectIndex();
    if (next === null) return;
    setActiveIndex((current) => (current === next ? current : next));
  };

  const scrollToProject = (index: number) => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row) return;

    const cards = row.querySelectorAll<HTMLElement>("[data-project-carriage]");
    const target = cards.item(index);
    if (!target) return;

    const left = target.offsetLeft - (viewport.clientWidth - target.offsetWidth) / 2;
    viewport.scrollTo({
      left,
      behavior: prefersReduced ? "auto" : "smooth",
    });
    setActiveIndex(index);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;

    pointerGestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      axis: null,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - gesture.startX;
    const deltaY = event.clientY - gesture.startY;

    if (gesture.axis === null) {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 6) return;
      gesture.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
      if (gesture.axis === "x") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }

    if (gesture.axis !== "x") return;
    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.startScrollLeft - deltaX;
  };

  const finishPointerGesture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = pointerGestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;

    pointerGestureRef.current = null;
    if (gesture.axis !== "x") return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const next = getNearestProjectIndex();
    if (next !== null) scrollToProject(next);
  };

  const carriages = PROJECTS.map((project, index) => (
    <Carriage
      key={project.name}
      project={project}
      index={index}
      activeIndex={activeIndex}
      settle={!prefersReduced}
    />
  ));

  return (
    <Section id={meta.id}>
      <div data-cursor-rail>
        <ProjectHeading
          activeIndex={activeIndex}
          onPrevious={() => scrollToProject(activeIndex - 1)}
          onNext={() => scrollToProject(activeIndex + 1)}
        />
        <div className="project-list-shell relative border-t border-border py-8">
          <span aria-hidden className="absolute inset-x-0 top-8 border-t border-border" />
          <div
            id="project-gallery"
            ref={viewportRef}
            className="project-native-scroll overflow-x-auto overscroll-x-contain"
            role="region"
            aria-label="Project gallery"
            data-lenis-prevent
            data-project-axis-lock="horizontal"
            tabIndex={0}
            onScroll={updateNativeIndex}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerGesture}
            onPointerCancel={finishPointerGesture}
          >
            <div ref={rowRef} className="flex w-max gap-[4vw] px-[7vw] md:px-[12vw]">
              {carriages}
            </div>
          </div>
          <div
            className="mt-5 flex justify-center"
            role="group"
            aria-label="Choose a project"
            data-project-dots
          >
            {PROJECTS.map((project, index) => (
              <button
                key={project.name}
                type="button"
                className="group/dot grid size-8 place-items-center"
                aria-label={`Show project ${index + 1}: ${project.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                aria-controls="project-gallery"
                onClick={() => scrollToProject(index)}
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full border transition-[border-color,background-color,transform] group-hover/dot:border-accent ${
                    activeIndex === index
                      ? "scale-125 border-accent bg-accent"
                      : "border-border-hi bg-transparent"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
