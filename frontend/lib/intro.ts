export const INTRO_DONE = "pintukarier:intro-done";
/** Fired when the loader starts opening onto the page; hero motion starts here. */
export const INTRO_REVEAL = "pintukarier:intro-reveal";

/** Inline script for <head>-time decision: play the intro once per session. */
export const INTRO_SCRIPT = `try{var d=document.documentElement;if(!sessionStorage.getItem('pintukarier.intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.intro='play';sessionStorage.setItem('pintukarier.intro','1')}}catch(e){}`;

/** Lenis instance shared by Motion (writer) and scrollToTarget (reader). */
export const lenisRef: { current: import("lenis").default | null } = { current: null };
