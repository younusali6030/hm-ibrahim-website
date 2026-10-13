import { notFound } from "next/navigation";
import { LabClient } from "./LabClient";

/** Development-only bench for the 3D heroes. Returns 404 in production. */
export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <LabClient />;
}
