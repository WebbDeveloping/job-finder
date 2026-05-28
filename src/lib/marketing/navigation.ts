export type NavItemLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavSectionHeader = {
  label: string;
  href: string;
  description?: string;
  icon: NavIconName;
};

export type NavColumnSection = {
  header: NavSectionHeader;
  items?: NavItemLink[];
};

export type NavColumn = {
  sections: NavColumnSection[];
};

export type NavBanner = {
  title: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
};

export type NavMenu = {
  id: string;
  label: string;
  columns: NavColumn[];
  banner: NavBanner;
};

export type NavIconName =
  | "builder"
  | "chart"
  | "folder"
  | "layout"
  | "zap"
  | "book"
  | "bookmark"
  | "help"
  | "trending"
  | "timeline"
  | "analytics"
  | "dashboard"
  | "camera"
  | "pen"
  | "box"
  | "columns"
  | "pdf"
  | "notes";

export const marketingNavMenus: NavMenu[] = [
  {
    id: "resume",
    label: "Resume",
    columns: [
      {
        sections: [
          {
            header: {
              label: "Resume Builder",
              href: "/signup",
              icon: "builder",
            },
            items: [
              { label: "Create from scratch", href: "/signup" },
              { label: "Upload existing resume", href: "/signup" },
              { label: "Live preview editor", href: "/#resume-builder-features-heading" },
            ],
          },
          {
            header: {
              label: "ATS-Friendly Resumes",
              href: "/#ats-section-heading",
              icon: "chart",
            },
          },
          {
            header: {
              label: "Resume Examples",
              href: "/#for-applicants-heading",
              icon: "folder",
            },
            items: [
              { label: "Senior professionals", href: "/#for-applicants-heading" },
              { label: "First-time job seekers", href: "/#for-applicants-heading" },
              { label: "Career switchers", href: "/#for-applicants-heading" },
              { label: "Creative professionals", href: "/#for-applicants-heading" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "Resume Templates",
              href: "/#resume-picker-heading",
              icon: "layout",
            },
            items: [
              {
                label: "Classic layouts",
                href: "/#resume-picker-heading",
                description: "Clean, conservative templates for any industry",
              },
              {
                label: "Modern layouts",
                href: "/#resume-picker-heading",
                description: "Contemporary designs with strong visual hierarchy",
              },
              {
                label: "Single & multi-column",
                href: "/#resume-builder-features-heading",
                description: "Flexible layouts that adapt to your experience",
              },
              {
                label: "PDF export",
                href: "/signup",
                description: "Download polished resumes ready to send",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "Resume Writing Guides",
              href: "/#how-it-helps-heading",
              icon: "book",
            },
            items: [
              {
                label: "How to write a resume",
                href: "/#how-it-helps-heading",
                description: "Structure every section with confidence",
              },
              {
                label: "ATS optimization tips",
                href: "/#ats-section-heading",
                description: "Pass screening systems without sacrificing design",
              },
              {
                label: "Pick the right template",
                href: "/#resume-picker-heading",
                description: "Match layout to role, industry, and experience level",
              },
              {
                label: "Resume builder features",
                href: "/#resume-builder-features-heading",
                description: "Fonts, colors, sections, and export options",
              },
            ],
          },
        ],
      },
    ],
    banner: {
      title: "ATS-friendly resume builder",
      ctaLabel: "Build your resume",
      ctaHref: "/signup",
      imageSrc: "/illustrations/feature-resume-editor.svg",
      imageAlt: "Resume builder preview",
      imageWidth: 280,
      imageHeight: 220,
    },
  },
  {
    id: "job-search",
    label: "Job Search",
    columns: [
      {
        sections: [
          {
            header: {
              label: "Application Pipeline",
              href: "/signup",
              icon: "timeline",
            },
            items: [
              { label: "Track every application", href: "/signup" },
              { label: "Stage history", href: "/#job-search-hub-heading" },
              { label: "Add applications quickly", href: "/signup" },
            ],
          },
          {
            header: {
              label: "Pipeline Tracker",
              href: "/#job-search-hub-heading",
              icon: "dashboard",
            },
          },
          {
            header: {
              label: "Stage Analytics",
              href: "/#stats-section-heading",
              icon: "analytics",
            },
            items: [
              { label: "Conversion by stage", href: "/#stats-section-heading" },
              { label: "Sankey visualization", href: "/#job-search-hub-heading" },
              { label: "Search performance", href: "/#stats-section-heading" },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "One Workspace",
              href: "/#job-search-hub-heading",
              icon: "notes",
            },
            items: [
              {
                label: "Resume + applications",
                href: "/#job-search-hub-heading",
                description: "Build resumes and track roles in one place",
              },
              {
                label: "Notes per application",
                href: "/#job-search-hub-heading",
                description: "Keep context for every company and role",
              },
              {
                label: "PDF on demand",
                href: "/signup",
                description: "Export tailored resumes when you apply",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "Getting Started",
              href: "/#how-it-helps-heading",
              icon: "book",
            },
            items: [
              {
                label: "How Job Finder helps",
                href: "/#how-it-helps-heading",
                description: "See the full workflow from resume to offer",
              },
              {
                label: "Job seeker reviews",
                href: "/#testimonials-heading",
                description: "What users say about the workspace",
              },
              {
                label: "Career path guides",
                href: "/#for-applicants-heading",
                description: "Templates and tips by experience level",
              },
            ],
          },
        ],
      },
    ],
    banner: {
      title: "Your job search command center",
      ctaLabel: "Start tracking",
      ctaHref: "/signup",
      imageSrc: "/illustrations/feature-pipeline.svg",
      imageAlt: "Application pipeline preview",
      imageWidth: 280,
      imageHeight: 220,
    },
  },
  {
    id: "resources",
    label: "Resources",
    columns: [
      {
        sections: [
          {
            header: {
              label: "Guides",
              href: "/#how-it-helps-heading",
              icon: "bookmark",
            },
            items: [
              {
                label: "How Job Finder helps",
                href: "/#how-it-helps-heading",
                description: "Resume, pipeline, and analytics in one workflow",
              },
              {
                label: "Resume tips",
                href: "/#resume-builder-features-heading",
                description: "ATS-friendly design and customization",
              },
              {
                label: "Pipeline best practices",
                href: "/#job-search-hub-heading",
                description: "Stay organized from first apply to final offer",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "Career Growth",
              href: "/#for-applicants-heading",
              icon: "trending",
              description: "Templates and advice tailored to where you are in your career",
            },
            items: [
              {
                label: "Senior professionals",
                href: "/#for-applicants-heading",
                description: "Leadership-focused layouts and tracking",
              },
              {
                label: "First-time job seekers",
                href: "/#for-applicants-heading",
                description: "Start strong with structured templates",
              },
              {
                label: "Career switchers",
                href: "/#for-applicants-heading",
                description: "Highlight transferable skills clearly",
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            header: {
              label: "Community",
              href: "/#testimonials-heading",
              icon: "help",
            },
            items: [
              {
                label: "User reviews",
                href: "/#testimonials-heading",
                description: "See how job seekers use Job Finder",
              },
              {
                label: "Why we built this",
                href: "/#how-it-helps-heading",
                description: "A workspace built for real job searches",
              },
              {
                label: "Contact support",
                href: "mailto:support@jobfinder.app",
                description: "Questions about your account or workflow",
              },
            ],
          },
        ],
      },
    ],
    banner: {
      title: "Free job search workspace",
      ctaLabel: "Get started free",
      ctaHref: "/signup",
      imageSrc: "/illustrations/hero-job-search.svg",
      imageAlt: "Job search workspace preview",
      imageWidth: 280,
      imageHeight: 200,
    },
  },
];
