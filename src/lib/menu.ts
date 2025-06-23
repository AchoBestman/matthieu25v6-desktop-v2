import { TranslationKeySchema } from "@/translation";
import {
  AudioLinesIcon,
  Book,
  ImageIcon,
  LucideProps,
  PieChart,
  User,
  Video,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export const menus: {
  title: TranslationKeySchema;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  isActive: boolean;
}[] = [
  {
    title: "home.biography",
    url: "/biographies",
    icon: User,
    isActive: false,
  },
  {
    title: "home.sermon",
    url: "/sermons",
    icon: Book,
    isActive: true,
  },
  {
    title: "home.church",
    url: "/assemblees",
    icon: PieChart,
    isActive: false,
  },
  {
    title: "home.hymns",
    url: "/hymns",
    icon: AudioLinesIcon,
    isActive: false,
  },
  {
    title: "home.photos",
    url: "/photos",
    icon: ImageIcon,
    isActive: false,
  },
  {
    title: "home.videos",
    url: "/videos",
    icon: Video,
    isActive: false,
  },
];
