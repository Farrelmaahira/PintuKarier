import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import ui from "@/styles/ui.module.css";

interface SearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export function SearchField({ value, onChange, placeholder }: SearchFieldProps) {
  return (
    <div className={ui.search}>
      <MagnifyingGlass size={18} className={ui.searchIcon} aria-hidden />
      <input type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={ui.input} />
    </div>
  );
}
