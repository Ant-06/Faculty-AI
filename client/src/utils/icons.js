import {
  MessageSquare,
  Sparkles,
  Star,
  Search,
  NotebookText,
  Image,
  Code2,
  FileText,
  BarChart3,
  Sparkle,
  BookOpen,
  GraduationCap,
  Wrench,
  Shield,
  PresentationIcon,
} from "lucide-react";

const ICONS = {
  MessageSquare,
  Sparkles,
  Star,
  Search,
  NotebookText,
  Image,
  Code2,
  FileText,
  BarChart3,
  PresentationIcon,
  Sparkle,
  BookOpen,
  GraduationCap,
  Wrench,
  Shield,
};

export function getIcon(name) {
  return ICONS[name] || Sparkles;
}
