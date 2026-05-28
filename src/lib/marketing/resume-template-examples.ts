export type ResumeTemplateExample = {
  id: string;
  src: string;
  alt: string;
};

export const RESUME_TEMPLATE_EXAMPLES: ResumeTemplateExample[] = Array.from(
  { length: 8 },
  (_, index) => {
    const n = index + 1;
    return {
      id: String(n),
      src: `/resume-template-example/${n}.png`,
      alt: `Resume template example ${n}`,
    };
  },
);

export function nextExampleIndex(index: number, step = 1): number {
  const len = RESUME_TEMPLATE_EXAMPLES.length;
  return (((index + step) % len) + len) % len;
}
