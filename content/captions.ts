/**
 * Caption tracks (WebVTT) for videos that have spoken audio.
 *
 * Thirteen reels carry an AAC audio track (see docs/report/AUDIT-2026-10.md for the list); the clips under
 * /stock, /videos, /hero and /fx are silent. No transcript is stored in the repository and none may be invented:
 * a caption file must be written by someone who has listened to the clip.
 *
 * To add one: put the file at public/captions/<reel-id>.<lang>.vtt (lang "hi" or "en") and list it here.
 * Every reel player renders whatever is listed, and nothing is rendered for a reel that is not listed.
 */
export type CaptionTrack = { lang: "hi" | "en"; label: string; src: string };

export const captionTracks: Record<string, CaptionTrack[]> = {
  // "shop-par-bharosa": [{ lang: "hi", label: "हिन्दी", src: "/captions/shop-par-bharosa.hi.vtt" }],
};

export function tracksFor(id: string): CaptionTrack[] {
  return captionTracks[id] ?? [];
}
