/** Marketing illustrations for HowItHelpsSection — see docs/ASSETS.md */
export const HOW_IT_HELPS_ILLUSTRATIONS = {
  pipeline: "/illustrations/feature-pipeline.svg",
  resume: "/illustrations/feature-resume-editor.svg",
  templates: "/illustrations/feature-templates.svg",
  ats: "/illustrations/feature-ats.svg",
} as const;

export type HowItHelpsIllustrationKey = keyof typeof HOW_IT_HELPS_ILLUSTRATIONS;
