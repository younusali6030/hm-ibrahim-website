"use client";

import {
  Box,
  Cylinder,
  Grid3X3,
  Wrench,
  ShoppingBag,
  Package,
  HardHat,
  Warehouse,
  Truck,
  Scissors,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Box,
  Cylinder,
  Grid3X3,
  Wrench,
  ShoppingBag,
  Package,
  HardHat,
  Warehouse,
  Truck,
  Scissors,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Box;
}

export { iconMap };
