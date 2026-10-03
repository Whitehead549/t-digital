export type Lesson = { id: string; title: string; duration: string; courseId: string }

const lessonSet = (courseId: string, items: [string, string][]): Lesson[] =>
  items.map(([title, duration], index) => ({ id: String(index + 1).padStart(2, '0'), title, duration, courseId }))

export const lessons: Lesson[] = [
  ...lessonSet('virtual-assistance', [['Getting started', '08 min'], ['Core concepts', '14 min'], ['Build your first project', '22 min'], ['Managing inboxes & calendars', '18 min'], ['Landing your first client', '16 min']]),
  ...lessonSet('content-creation', [['Finding your niche', '10 min'], ['Scripting short-form videos', '15 min'], ['Filming with your phone', '19 min'], ['Editing for retention', '24 min'], ['Understanding the algorithm', '12 min']]),
  ...lessonSet('cybersecurity', [['Security fundamentals', '12 min'], ['Networking basics', '20 min'], ['Setting up a Kali lab', '25 min'], ['Reconnaissance', '18 min'], ['Reporting vulnerabilities', '14 min']]),
  ...lessonSet('mobile-skills', [['Smartphone camera settings', '11 min'], ['Lighting on a budget', '13 min'], ['Mobile video editing', '21 min'], ['Graphic design on Canva', '17 min'], ['Whiteboard animation', '19 min']]),
  ...lessonSet('full-stack-web', [['How the web works', '09 min'], ['React fundamentals', '26 min'], ['Next.js App Router', '28 min'], ['APIs & databases', '30 min'], ['Deploying to Vercel', '12 min']]),
  ...lessonSet('wordpress-business-sites', [['Domains & hosting', '10 min'], ['Installing WordPress', '12 min'], ['Designing with Elementor', '27 min'], ['Speed & SEO', '16 min'], ['Handing off to clients', '09 min']]),
  ...lessonSet('flutter-apps', [['Dart crash course', '22 min'], ['Widgets & layouts', '25 min'], ['State management', '24 min'], ['Firebase backend', '29 min'], ['Publishing to app stores', '15 min']]),
  ...lessonSet('ui-ux-figma', [['Design thinking', '11 min'], ['Wireframing', '17 min'], ['Figma auto layout', '23 min'], ['Prototyping interactions', '19 min'], ['Building a design system', '26 min']]),
  ...lessonSet('data-analysis-python', [['Excel for analysts', '18 min'], ['Python & pandas', '27 min'], ['Cleaning messy data', '22 min'], ['Visualising insights', '20 min'], ['Power BI dashboards', '25 min']]),
  ...lessonSet('prompt-engineering', [['How LLMs work', '13 min'], ['Prompt anatomy', '15 min'], ['Few-shot & chain-of-thought', '18 min'], ['Building prompt templates', '16 min'], ['Evaluating outputs', '12 min']]),
  ...lessonSet('ai-video-creation', [['AI video landscape', '09 min'], ['Writing video prompts', '14 min'], ['Generating scenes with Veo 3', '21 min'], ['Voiceover & music', '15 min'], ['Final edit & export', '17 min']]),
  ...lessonSet('digital-marketing-ads', [['Marketing funnels', '12 min'], ['Meta Ads Manager', '24 min'], ['Google Search ads', '22 min'], ['Retargeting', '14 min'], ['Reading your analytics', '16 min']]),
  ...lessonSet('airtable-automation', [['Airtable basics', '10 min'], ['Designing your base', '18 min'], ['Views & interfaces', '15 min'], ['Automations', '21 min'], ['Integrations with Zapier', '17 min']]),
  ...lessonSet('freelancing-business', [['Choosing a profitable skill', '11 min'], ['Creating a winning profile', '16 min'], ['Writing proposals', '19 min'], ['Pricing & negotiation', '14 min'], ['Getting repeat clients', '12 min']]),
  ...lessonSet('dslr-photography', [['Understanding exposure', '16 min'], ['Composition rules', '13 min'], ['Portrait photography', '20 min'], ['Product photography', '18 min'], ['Editing in Lightroom', '24 min']]),
  ...lessonSet('soc-analyst', [['Inside a SOC', '10 min'], ['SIEM fundamentals', '23 min'], ['Log analysis', '26 min'], ['Threat hunting', '22 min'], ['Incident response playbooks', '19 min']]),
]

export function getLessons(courseId: string) { return lessons.filter((lesson) => lesson.courseId === courseId) }
