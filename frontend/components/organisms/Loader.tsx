"use client";

import { useRef } from "react";
import { DottedArrow } from "../atoms/DottedArrow";
import { DottedX } from "../atoms/DottedX";
import { useLoaderIntro } from "@/lib/hooks/useLoaderIntro";
import landing from "@/styles/landing.module.css";

const BLOCK_COUNT = 16;

/** Overflow-style loader (fakturin DESIGN.md section 4): progress window that expands into the page. */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const gone = useLoaderIntro(ref);
  if (gone) return null;

  return (
    <div ref={ref} className={landing.loader} aria-hidden="true">
      <div className={`${landing.loaderGrid} graph-paper`} />
      <div className={landing.loaderWindow} data-window>
        <div className={landing.loaderBar} data-bar>
          <span className={landing.loaderTitle}>
            <span className={landing.codeTag} data-tag>
              &lt;hackathon&gt;
            </span>{" "}
            IT Comp 2026{" "}
            <span className={landing.codeTag} data-tag>
              &lt;/hackathon&gt;
            </span>
          </span>
          <button type="button" className={landing.loaderClose} data-close tabIndex={-1}>
            <DottedX />
          </button>
        </div>
        <div className={landing.loaderCard} data-card>
          <div className={landing.rail}>
            <div className={landing.railInner}>
              <span className={landing.loaderIcon} data-icon>
                <DottedArrow />
              </span>
              <span className={landing.loaderText}>
                <span data-status>MEMBACA CV…</span>
                <span data-pct>0%</span>
              </span>
            </div>
          </div>
          <div className={landing.loaderBlocks} data-blocks>
            {Array.from({ length: BLOCK_COUNT }, (_, index) => (
              <span key={index} className={landing.loaderBlock} data-block />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
