/** Re-mounts on every navigation, so each page eases in the same way. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
