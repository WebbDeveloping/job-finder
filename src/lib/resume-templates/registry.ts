import {
  DEFAULT_ACCENT_BAR_THEME,
  DEFAULT_CLASSIC_THEME,
  DEFAULT_MINIMAL_THEME,
  DEFAULT_SIDEBAR_THEME,
  sanitizeThemeForTemplate,
  type ResumeTheme,
} from "@/lib/resume-templates/theme";

export type ResumeTemplateCategory = "Traditional" | "Modern";

export type ResumeTemplateSupportedOptions = {
  sectionOrder?: boolean;
  pageMargin?: boolean;
  sidebarWidth?: boolean;
};

export type ResumeTemplateDefinition = {
  id: string;
  label: string;
  description: string;
  category: ResumeTemplateCategory;
  defaultTheme: ResumeTheme;
  thumbnailSrc: string;
  thumbnailAlt: string;
  /** Show a "Popular" badge in the gallery (classic only). */
  isPopular?: boolean;
  supportedOptions?: ResumeTemplateSupportedOptions;
};

export const DEFAULT_TEMPLATE_ID = "classic";

export const RESUME_TEMPLATES: Record<string, ResumeTemplateDefinition> = {
  classic: {
    id: "classic",
    label: "Classic",
    description: "Traditional single-column layout with clear section headings.",
    category: "Traditional",
    defaultTheme: DEFAULT_CLASSIC_THEME,
    thumbnailSrc: "/resume-templates/classic.png",
    thumbnailAlt: "Classic resume template preview",
    isPopular: true,
    supportedOptions: {
      sectionOrder: true,
      pageMargin: true,
    },
  },
  sidebar: {
    id: "sidebar",
    label: "Sidebar",
    description:
      "Two-column layout with contact and skills in a left sidebar.",
    category: "Modern",
    defaultTheme: DEFAULT_SIDEBAR_THEME,
    thumbnailSrc: "/resume-templates/sidebar.png",
    thumbnailAlt: "Sidebar resume template preview",
    supportedOptions: {
      sectionOrder: true,
      pageMargin: true,
      sidebarWidth: true,
    },
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description:
      "Centered name and accent underlines — clean and understated.",
    category: "Traditional",
    defaultTheme: DEFAULT_MINIMAL_THEME,
    thumbnailSrc: "/resume-templates/minimal.png",
    thumbnailAlt: "Minimal resume template preview",
    supportedOptions: {
      sectionOrder: true,
      pageMargin: true,
    },
  },
  "accent-bar": {
    id: "accent-bar",
    label: "Accent bar",
    description:
      "Bold color bar at the top using your accent color for a modern look.",
    category: "Modern",
    defaultTheme: DEFAULT_ACCENT_BAR_THEME,
    thumbnailSrc: "/resume-templates/accent-bar.png",
    thumbnailAlt: "Accent bar resume template preview",
    supportedOptions: {
      sectionOrder: true,
      pageMargin: true,
    },
  },
};

export const RESUME_TEMPLATE_LIST = Object.values(RESUME_TEMPLATES);

export const RESUME_TEMPLATE_CATEGORIES: ResumeTemplateCategory[] = [
  "Traditional",
  "Modern",
];

export function getTemplate(id: string): ResumeTemplateDefinition {
  return RESUME_TEMPLATES[assertTemplateId(id)];
}

export function assertTemplateId(id: string): string {
  if (id in RESUME_TEMPLATES) {
    return id;
  }
  return DEFAULT_TEMPLATE_ID;
}

export function templateSupportsSidebarWidth(templateId: string): boolean {
  return getTemplate(templateId).supportedOptions?.sidebarWidth === true;
}

export function getResolvedSupportedOptions(
  template: ResumeTemplateDefinition,
): Required<ResumeTemplateSupportedOptions> {
  const opts = template.supportedOptions ?? {};
  return {
    sectionOrder: opts.sectionOrder !== false,
    pageMargin: opts.pageMargin !== false,
    sidebarWidth: opts.sidebarWidth === true,
  };
}

/** Keeps user theme on template switch; strips keys the new template cannot use. */
export function themeForTemplateSwitch(
  theme: ResumeTheme | null,
  newTemplateId: string,
): ResumeTheme | null {
  return sanitizeThemeForTemplate(
    theme,
    newTemplateId,
    templateSupportsSidebarWidth(newTemplateId),
  );
}
