/** Selector yang dibatasi ke elemen Motion (hasil gsap.utils.selector). */
export type Select = (selector: string) => HTMLElement[];

/** Fungsi pembersih yang dikembalikan tiap modul animasi. */
export type Cleanup = () => void;
