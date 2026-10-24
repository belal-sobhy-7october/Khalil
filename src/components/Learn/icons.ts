import {
  Bot, Calculator, CalendarClock, Camera, ChartColumn, Clapperboard, Code, FileText, Film, GraduationCap, Headset, Languages, Laptop,
  LayoutTemplate, Megaphone, Mic, Network, Palette, Presentation, Search, Shapes, ShieldCheck, Smartphone, SquareKanban, Store,
  TrendingUp, Workflow, type LucideIcon,
} from 'lucide-react';
import type { LearnHubId } from '../../data/learnCatalog';

export const HUB_ICONS: Record<LearnHubId, LucideIcon> = { languages: Languages, skills: GraduationCap };

export const SKILL_ICONS: Record<string, LucideIcon> = {
  callCenter: Headset,
  sales: TrendingUp,
  programming: Code,
  automation: Workflow,
  aiTools: Bot,
  dataAnalysis: ChartColumn,
  cybersecurity: ShieldCheck,
  design: Palette,
  visualIdentity: Shapes,
  uiux: LayoutTemplate,
  videoEditing: Clapperboard,
  motionGraphics: Film,
  productPhotography: Camera,
  voiceOver: Mic,
  copywriting: FileText,
  socialMedia: Megaphone,
  seo: Search,
  ecommerce: Store,
  freelancing: Laptop,
  projectManagement: SquareKanban,
  accounting: Calculator,
  virtualAssistant: CalendarClock,
  translation: Languages,
  onlineTeaching: Presentation,
  phoneRepair: Smartphone,
  computerNetworks: Network,
};
