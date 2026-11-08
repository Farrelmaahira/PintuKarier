import Link from "next/link";
import { ArrowUpRight, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import ui from "@/styles/ui.module.css";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger" | "plain";
  size?: "md" | "sm";
  block?: boolean;
  /** Ikon di sel kanan; default panah. Diabaikan untuk `plain`. */
  icon?: ReactNode;
  href?: string;
  /** Tautan keluar situs: dibuka di tab baru. */
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  /** id form untuk tombol submit yang berada di luar elemen <form> (mis. footer modal). */
  form?: string;
  disabled?: boolean;
  loading?: boolean;
}

/** Split CTA dari DESIGN.md: sel label + sel ikon kotak berwarna aksen. */
export function Button({ children, variant = "primary", size = "md", block, icon, href, external, onClick, type = "button", form, disabled, loading }: ButtonProps) {
  const className = [ui.btn, ui[variant], size === "sm" && ui.sm, block && ui.block].filter(Boolean).join(" ");
  const iconSize = size === "sm" ? 18 : 22;
  const cell =
    variant === "plain" ? null : (
      <span className={ui.btnIcon}>
        {loading ? <CircleNotch size={iconSize} className={ui.spin} /> : (icon ?? <ArrowUpRight size={iconSize} />)}
      </span>
    );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className={ui.btnLabel}>{children}</span>
        {cell}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} className={className}>
        <span className={ui.btnLabel}>{children}</span>
        {cell}
      </Link>
    );
  }
  return (
    <button type={type} form={form} className={className} onClick={onClick} disabled={disabled || loading} aria-busy={loading || undefined}>
      <span className={ui.btnLabel}>{loading ? "Bentar ya…" : children}</span>
      {cell}
    </button>
  );
}
