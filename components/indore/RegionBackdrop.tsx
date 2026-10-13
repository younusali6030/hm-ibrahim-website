import { INDORE_CENTRE, regionPlaces } from "@/content/indoreRegion";
import { site } from "@/content/site";

/**
 * The hero's background: Indore and the towns around it, drawn to scale from their published coordinates.
 * One unit is one kilometre, measured from the shop (equirectangular at the shop's latitude, which is exact
 * enough over 60 km). Rings are true distances from the counter. There are no roads on it: the lines link each
 * town to the counter and are not routes.
 */
const R = (n: number) => Math.round(n * 100) / 100;
const KM_LAT = 110.57;
const KM_LON = 111.32 * Math.cos((site.geo.latitude * Math.PI) / 180);
export const kmFromShop = (lat: number, lon: number) => ({
  x: R((lon - site.geo.longitude) * KM_LON),
  y: R((site.geo.latitude - lat) * KM_LAT),
});
/** Straight-line distance from the counter, in whole kilometres. */
export const distanceKm = (lat: number, lon: number) => {
  const p = kmFromShop(lat, lon);
  return Math.round(Math.hypot(p.x, p.y));
};

// The counter sits just left of centre, in the gap between the copy and the photographs, so its rings sweep both.
const VIEW = { x: -92, y: -58, w: 184, h: 108 };
const RINGS = [10, 25, 50];

export function RegionBackdrop({ names }: { names: Record<string, string> }) {
  const towns = regionPlaces.map((p) => ({ ...p, ...kmFromShop(p.lat, p.lon), label: names[p.id] ?? p.name }));
  const city = kmFromShop(INDORE_CENTRE.lat, INDORE_CENTRE.lon);
  const grid: { v: boolean; at: number; label: string }[] = [];
  for (let lon = 74.7; lon <= 76.4; lon += 0.1) grid.push({ v: true, at: kmFromShop(0, lon).x, label: `${lon.toFixed(1)}°E` });
  for (let lat = 22.3; lat <= 23.3; lat += 0.1) grid.push({ v: false, at: kmFromShop(lat, 0).y, label: `${lat.toFixed(1)}°N` });
  return (
    <div className="ih-backdrop" aria-hidden="true">
      <svg viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id="ihb-glow">
            <stop offset="0" stopColor="#ff7a1c" stopOpacity="0.34" />
            <stop offset="0.45" stopColor="#ff7a1c" stopOpacity="0.08" />
            <stop offset="1" stopColor="#ff7a1c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ihb-urban">
            <stop offset="0" stopColor="#9db6d1" stopOpacity="0.3" />
            <stop offset="1" stopColor="#9db6d1" stopOpacity="0" />
          </radialGradient>
        </defs>
        {grid.map((g, i) =>
          g.v ? (
            <g key={i}>
              <line x1={g.at} x2={g.at} y1={VIEW.y} y2={VIEW.y + VIEW.h} className="ihb-grid" />
              <text x={g.at + 0.6} y={VIEW.y + VIEW.h - 9} className="ihb-tick">{g.label}</text>
            </g>
          ) : (
            <g key={i}>
              <line x1={VIEW.x} x2={VIEW.x + VIEW.w} y1={g.at} y2={g.at} className="ihb-grid" />
              <text x={VIEW.x + VIEW.w - 22} y={g.at - 0.6} className="ihb-tick">{g.label}</text>
            </g>
          )
        )}
        <circle cx="0" cy="0" r="58" fill="url(#ihb-glow)" />
        <circle cx={city.x} cy={city.y} r="13" fill="url(#ihb-urban)" />
        {towns.map((t) => (
          <circle key={t.id} cx={t.x} cy={t.y} r={R(t.km * 1.8)} fill="url(#ihb-urban)" />
        ))}
        {RINGS.map((r, i) => (
          <g key={r}>
            <circle cx="0" cy="0" r={r} className="ihb-ring" style={{ animationDelay: `${0.2 + i * 0.18}s` }} />
            <text x={R(-r * 0.7071) - 0.8} y={R(r * 0.7071) + 2.6} className="ihb-ring-label" textAnchor="end">{r} km</text>
          </g>
        ))}
        {towns.map((t, i) => {
          // A gentle bow, always to the same side, so the lines read as links and not as a ruler.
          const mx = R(t.x / 2 + t.y * 0.14);
          const my = R(t.y / 2 - t.x * 0.14);
          return <path key={t.id} d={`M0 0 Q${mx} ${my} ${t.x} ${t.y}`} pathLength={1} className="ihb-link" style={{ animationDelay: `${0.7 + i * 0.16}s` }} />;
        })}
        {towns.map((t) => (
          <g key={t.id}>
            <circle cx={t.x} cy={t.y} r="0.9" className="ihb-town" />
            {/* Names sit to the right, clear of the copy column; the northern town has open space to its left. */}
            <text x={t.x + (t.y < -30 ? -2 : 2)} y={t.y + 0.9} textAnchor={t.y < -30 ? "end" : "start"} className="ihb-name">{t.label}</text>
          </g>
        ))}
        <circle cx="0" cy="0" r="2.2" className="ihb-pulse" />
        <circle cx="0" cy="0" r="1.1" className="ihb-shop" />
      </svg>
    </div>
  );
}
