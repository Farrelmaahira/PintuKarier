import type { CSSProperties } from "react";
import landing from "@/styles/landing.module.css";

interface Chapter {
  who: string;
  tone: string;
  title: string;
  body: string;
}

interface ChapterListProps {
  chapters: Chapter[];
  activeIndex: number;
}

/** Chapter cerita hero; yang aktif terang, sisanya redup. Tiap item menggerakkan satu tahap ilustrasi. */
export function ChapterList({ chapters, activeIndex }: ChapterListProps) {
  return (
    <ol id="cara-kerja" className={landing.chapters}>
      {chapters.map((chapter, index) => (
        <li
          key={chapter.who}
          className={landing.chapter}
          data-chapter
          data-active={activeIndex === index}
          style={{ "--tone": chapter.tone } as CSSProperties}
        >
          <span className={landing.chapterWho}>{chapter.who}</span>
          <h2 className={landing.chapterTitle}>{chapter.title}</h2>
          <p className={landing.chapterBody}>{chapter.body}</p>
        </li>
      ))}
    </ol>
  );
}
