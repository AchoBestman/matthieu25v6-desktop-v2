import {
  AudioLinesIcon,
  Book,
  ImageIcon,
  PieChart,
  User,
  Video,
} from "lucide-react";
import { tr } from "@/translation";

export const menus = [
  {
    title: tr("home.biography"),
    url: "/biographies",
    icon: User,
    isActive: false,
  },
  {
    title: tr("home.sermon"),
    url: "/sermons",
    icon: Book,
    isActive: true,
  },
  {
    title: tr("home.church"),
    url: "/assemblees",
    icon: PieChart,
    isActive: false,
  },
  {
    title: tr("home.hymns"),
    url: "/hymns",
    icon: AudioLinesIcon,
    isActive: false,
  },
  {
    title: tr("home.photos"),
    url: "/photos",
    icon: ImageIcon,
    isActive: false,
  },
  {
    title: tr("home.videos"),
    url: "/videos",
    icon: Video,
    isActive: false,
  },
];
