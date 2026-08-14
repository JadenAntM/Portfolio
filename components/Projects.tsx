"use client";

import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowLink } from "@/components/ArrowLink";
import { HeadingReveal } from "@/components/HeadingReveal";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { PROJECTS, type Project } from "@/data/projects";
import { SECTIONS } from "@/data/sections";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const meta = SECTIONS.find((section) => section.id === "projects")!;
const MOBILE = "(max-width: 47.999rem)";
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
      <div className="relative min-h-0 overflow-hidden border-b border-border bg-surface md:border-r md:border-b-0">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(min-width: 48rem) 40vw, 86vw"
          className="object-contain p-2"
        />
        <span className="mono absolute top-3 left-3 border border-border bg-bg px-2 py-1 text-micro text-fg-tertiary">
          PROJECT_{pad(PROJECTS.indexOf(project) + 1)}
        </span>
      </div>

      <div className="flex min-h-0 flex-col p-5 sm:p-6 lg:p-8">
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
          ) : (
            <ArrowLink href={project.href} external tabIndex={linkTabIndex}>
              View project
            </ArrowLink>
          )}
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

function ProjectHeading({ activeIndex }: { activeIndex: number }) {
  return (
    <GridRow
      mainClassName="project-rail-header"
      main={
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>
            <p className="mono mt-3 text-label uppercase text-fg-tertiary">
              Selected engineering work
            </p>
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
      }
    />
  );
}

export function Projects() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [travel, setTravel] = useState({ start: 0, end: 0 });
  const prefersReduced = usePrefersReducedMotion();
  const isMobile = useMediaQuery(MOBILE, true);
  const isStatic = prefersReduced || isMobile;

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [travel.start, travel.end],
  );

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (isStatic) return;
    const next = Math.round(progress * Math.max(PROJECTS.length - 1, 0));
    setActiveIndex((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row || isStatic) return;

    const measure = () => {
      const cards = row.querySelectorAll<HTMLElement>("[data-project-carriage]");
      const first = cards.item(0);
      const last = cards.item(cards.length - 1);
      if (!first || !last) return;

      const midpoint = viewport.clientWidth / 2;
      setTravel({
        start: midpoint - first.offsetWidth / 2,
        end: midpoint - (last.offsetLeft + last.offsetWidth / 2),
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(row);
    return () => observer.disconnect();
  }, [isStatic]);

  const updateNativeIndex = () => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    if (!viewport || !row) return;

    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const cards = [...row.querySelectorAll<HTMLElement>("[data-project-carriage]")];
    const next = cards.reduce((nearest, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const nearestCard = cards[nearest];
      const nearestCenter = nearestCard.offsetLeft + nearestCard.offsetWidth / 2;
      return Math.abs(cardCenter - center) < Math.abs(nearestCenter - center)
        ? index
        : nearest;
    }, 0);
    setActiveIndex((current) => (current === next ? current : next));
  };

  const carriages = PROJECTS.map((project, index) => (
    <Carriage
      key={project.name}
      project={project}
      index={index}
      activeIndex={activeIndex}
      settle={!isStatic}
    />
  ));

  if (isStatic) {
    return (
      <Section id={meta.id}>
        <div ref={trackRef}>
          <ProjectHeading activeIndex={activeIndex} />
          <div className="project-list-shell relative border-t border-border py-8">
            <span aria-hidden className="absolute inset-x-0 top-8 border-t border-border" />
            <div
              ref={viewportRef}
              className="project-native-scroll overflow-x-auto overscroll-x-contain"
              role="region"
              aria-label="Project gallery"
              tabIndex={0}
              onScroll={updateNativeIndex}
            >
              <div ref={rowRef} className="flex w-max gap-[4vw] px-[7vw] md:px-[12vw]">
                {carriages}
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section id={meta.id}>
      <div
        ref={trackRef}
        data-project-rail
        className="relative"
        style={{ height: `${Math.max(PROJECTS.length, 1) * 100}dvh` }}
      >
        <div className="project-rail-pin flex flex-col overflow-hidden">
          <ProjectHeading activeIndex={activeIndex} />
          <div ref={viewportRef} className="relative min-h-0 flex-1 overflow-hidden">
            <span aria-hidden className="absolute inset-x-0 top-0 border-t border-border" />
            <motion.div
              ref={rowRef}
              className="absolute top-0 left-0 flex w-max gap-[4vw]"
              style={{ x }}
            >
              {carriages}
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}
