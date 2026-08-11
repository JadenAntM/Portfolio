import Image from "next/image";
import { ArrowLink } from "@/components/ArrowLink";
import { HeadingReveal } from "@/components/HeadingReveal";
import { GridRow, Section, SectionMarker, headingId } from "@/components/Section";
import { ScrollStage, ScrollStageItem } from "@/components/ScrollStage";
import { SpecBlock } from "@/components/SpecBlock";
import { PROJECTS, type Project } from "@/data/projects";
import { SECTIONS } from "@/data/sections";

const meta = SECTIONS.find((section) => section.id === "projects")!;

function ProjectCard({
  project,
  position,
  total,
}: {
  project: Project;
  position: number;
  total: number;
}) {
  return (
    <GridRow
      main={
        <>
          {/* max-h keeps the frame inside the pinned viewport on short screens;
              the image crops rather than pushing the copy off the bottom. */}
          <div className="relative aspect-16/10 max-h-[42vh] w-full max-w-[46rem] overflow-hidden rounded-sm border border-border bg-surface">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(min-width: 64rem) 46rem, 100vw"
              className="object-cover"
            />
          </div>

          <h3 className="mt-8 text-h3 text-fg">{project.name}</h3>

          <p className="mt-3 max-w-(--measure-body) text-body text-fg-secondary">
            {project.description}
          </p>
        </>
      }
      spec={
        <>
          <SpecBlock label="Stack" first>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-border px-2 py-1 text-fg-tertiary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </SpecBlock>

          <SpecBlock label="Link">
            <ArrowLink href={project.href} external>
              View project
            </ArrowLink>
          </SpecBlock>

          <SpecBlock label="Position">
            <span className="text-accent">
              {String(position).padStart(2, "0")}
            </span>
            <span className="px-1 text-fg-tertiary">/</span>
            {String(total).padStart(2, "0")}
          </SpecBlock>
        </>
      }
    />
  );
}

export function Projects() {
  return (
    <Section id={meta.id}>
      <GridRow
        main={
          <>
            <SectionMarker index={meta.index!} />
            <HeadingReveal id={headingId(meta.id)}>{meta.label}</HeadingReveal>
            <p className="mono mt-4 text-label uppercase text-fg-tertiary">
              Selected work — {PROJECTS.length} projects
            </p>
          </>
        }
      />

      {/* Same stage as Work Experience, so the scroll from one section into the
          next keeps a single handoff grammar rather than switching devices. */}
      <ScrollStage count={PROJECTS.length}>
        {PROJECTS.map((project, i) => (
          <ScrollStageItem key={project.name} index={i}>
            <ProjectCard
              project={project}
              position={i + 1}
              total={PROJECTS.length}
            />
          </ScrollStageItem>
        ))}
      </ScrollStage>
    </Section>
  );
}
