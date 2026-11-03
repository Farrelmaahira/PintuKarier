import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { LandingRole } from "@/lib/data/roles";
import landing from "@/styles/landing.module.css";

interface RoleCardProps {
  role: LandingRole;
}

/** Kartu rail per peran: chip mono, bar judul, media berwarna, ringkasan. */
export function RoleCard({ role }: RoleCardProps) {
  return (
    <Link href={`/register?peran=${role.userRole}`} className={landing.roleCard} style={{ "--tone": role.tone } as React.CSSProperties}>
      <span className={landing.roleTag}>{role.who}</span>
      <span className={landing.rail}>
        <span className={landing.railInner}>
          <span className={landing.roleIcon}>
            <ArrowUpRight size={22} />
          </span>
          <span className={landing.roleName}>{role.label}</span>
        </span>
      </span>
      <span className={`${landing.roleMedia} ${landing.roleMediaDoodle}`}>
        <Image src={`/illustrations/doodles/${role.img}.svg`} alt="" fill sizes="(max-width: 768px) 100vw, 45vw" className={`${landing.roleImg} ${landing.roleDoodle}`} />
      </span>
      <span className={landing.roleBody}>{role.summary}</span>
    </Link>
  );
}
