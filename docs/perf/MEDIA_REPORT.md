# Media performance report

Generated 2026-10-12 by the media/performance pass. Originals are preserved outside the repo (scratchpad copy); git tag `baseline-pre-evolution` also holds the pre-optimisation files.

## Totals (public/, excluding public/fx and public/og, added by the design agent after the baseline)

| Folder | Before | After | Saved |
|---|---|---|---|
| reels | 77.0 MB | 57.0 MB | 26% |
| videos | 28.2 MB | 26.4 MB | 6% |
| products | 27.2 MB | 24.4 MB | 10% |
| stock | 7.6 MB | 7.3 MB | 4% |
| hero | 6.9 MB | 6.8 MB | 1% |
| blog | 5.3 MB | 5.3 MB | 0% |
| brands | 4.3 MB | 2.7 MB | 37% |
| (root files) | 1.5 MB | 0.9 MB | 43% |
| about | 0.9 MB | 0.8 MB | 16% |
| **Total** | **159.0 MB** | **131.7 MB** | **17%** |

Videos (44 mp4): 118.9 MB -> 85.3 MB. Images (259 png/jpg/webp): 40.2 MB -> 34.9 MB.

## Method

- Tools: ffmpeg-static / ffprobe-static / sharp installed in a scratch dir (package.json untouched).
- MP4: libx264 slow, CRF 30 (hero CRF 28), yuv420p, +faststart, AAC 96k stereo, metadata stripped, short side capped at 720 (reels/videos/stock/products) or 1080 (hero). Same file names and paths. SSIM vs source on the heaviest reel was 0.974 (visually transparent). The spec asked for CRF ~26, but sources were already low-bitrate (~1.8 Mbps) and CRF 26 made about half of the 44 files larger than the original, so CRF 30 was used. Where a re-encode was still not smaller, the original streams were kept and only remuxed (metadata stripped, faststart).
- WebM: VP9 CRF 44 (hero CRF 40), Opus 64k. On this footage VP9 was not smaller than H.264 for most files, so a .webm is kept only where it is at least 10% smaller than the .mp4 (11 of 44). A `<source type="video/webm">` listed first is only worth it for those.
- Images: PNG lossless (zlib 9, effort 10), or 256-colour palette when mean abs error vs lossless <= 1.5/255 on a white flatten and >=20% smaller; JPEG mozjpeg q80 progressive; WebP re-encoded q82 only if >=15% smaller; longest side capped at 1600 px (never upscaled); written only if >=3% smaller. Metadata stripped, EXIF orientation baked in.
- Posters: every video that had a same-name .jpg kept it (recompressed). hero-wide.mp4 / hero-scrub.mp4 have no same-name jpg but hero/poster-wide.jpg and hero/poster.jpg exist and were left as the referenced posters.

## Videos

| File | Dim | Dur | Audio | Before | MP4 after | WebM |
|---|---|---|---|---|---|---|
| /reels/pvc-hexa-mesh.mp4 | 720x1280 | 35.9s | yes | 8391 KB | 5285 KB | dropped (not smaller) |
| /reels/frp-bars.mp4 | 720x1280 | 34.0s | yes | 8058 KB | 5300 KB | dropped (not smaller) |
| /reels/kabootar-jali.mp4 | 720x1280 | 31.2s | yes | 7388 KB | 5535 KB | dropped (not smaller) |
| /reels/check-the-strength.mp4 | 720x1280 | 30.9s | yes | 7323 KB | 5158 KB | dropped (not smaller) |
| /reels/shop-par-bharosa.mp4 | 720x1280 | 28.4s | yes | 6557 KB | 4089 KB | dropped (not smaller) |
| /reels/machhar-full-stop.mp4 | 720x1280 | 25.8s | yes | 6096 KB | 4559 KB | dropped (not smaller) |
| /reels/rat-jaali-customer.mp4 | 720x1280 | 25.9s | yes | 5623 KB | 2691 KB | 2368 KB |
| /reels/tata-wire-rate.mp4 | 720x1280 | 23.7s | yes | 5598 KB | 3392 KB | 2942 KB |
| /reels/kala-taar-wholesale.mp4 | 720x1280 | 23.6s | yes | 5550 KB | 3278 KB | dropped (not smaller) |
| /reels/chainlink-walkthrough.mp4 | 720x1280 | 21.8s | yes | 5205 KB | 4202 KB | dropped (not smaller) |
| /reels/perforated-sheet-customer.mp4 | 720x1280 | 20.3s | yes | 4798 KB | 3414 KB | dropped (not smaller) |
| /hero/hero-wide.mp4 | 1600x900 | 12.0s | no | 3736 KB | 3722 KB | dropped (not smaller) |
| /reels/weldmesh-jali.mp4 | 720x1280 | 14.3s | yes | 3396 KB | 2016 KB | dropped (not smaller) |
| /reels/nail-reel.mp4 | 720x1280 | 14.2s | yes | 3375 KB | 2840 KB | dropped (not smaller) |
| /hero/hero-scrub.mp4 | 720x1280 | 18.1s | no | 2995 KB | 2995 KB | dropped (not smaller) |
| /products/frp-bars-pipe.mp4 | 832x464 | 17.1s | no | 2388 KB | 1489 KB | dropped (not smaller) |
| /videos/weldmesh-cutting.mp4 | 720x1280 | 14.1s | no | 1970 KB | 1970 KB | dropped (not smaller) |
| /videos/weldmesh.mp4 | 720x1280 | 14.0s | no | 1887 KB | 1593 KB | dropped (not smaller) |
| /videos/concertina-wire.mp4 | 720x1280 | 14.0s | no | 1887 KB | 1268 KB | 1135 KB |
| /videos/expanded-mesh.mp4 | 720x1280 | 14.0s | no | 1844 KB | 1212 KB | dropped (not smaller) |
| /videos/binding-wire.mp4 | 720x1280 | 14.0s | no | 1836 KB | 1068 KB | 944 KB |
| /videos/fiber-mesh.mp4 | 720x1280 | 14.0s | no | 1826 KB | 996 KB | 890 KB |
| /videos/frp-pipe.mp4 | 720x402 | 14.1s | no | 1773 KB | 941 KB | dropped (not smaller) |
| /stock/weldmesh.mp4 | 720x1280 | 10.1s | no | 1688 KB | 1688 KB | dropped (not smaller) |
| /videos/frp-bar.mp4 | 720x1280 | 14.0s | no | 1680 KB | 876 KB | 700 KB |
| /videos/perforated-sheet.mp4 | 720x1280 | 14.0s | no | 1591 KB | 818 KB | 563 KB |
| /products/sr-hoe-with-handle.mp4 | 476x848 | 14.3s | no | 1528 KB | 811 KB | 679 KB |
| /videos/sr-hoe.mp4 | 476x848 | 14.0s | no | 1388 KB | 788 KB | 662 KB |
| /stock/nails.mp4 | 720x1280 | 7.0s | no | 1226 KB | 1103 KB | dropped (not smaller) |
| /videos/mosquito-net-cutting.mp4 | 720x1280 | 8.6s | no | 1223 KB | 1223 KB | dropped (not smaller) |
| /videos/pigeon-net.mp4 | 720x1280 | 8.0s | no | 1164 KB | 1164 KB | dropped (not smaller) |
| /stock/perforated.mp4 | 720x1280 | 6.5s | no | 1086 KB | 1086 KB | dropped (not smaller) |
| /stock/expanded.mp4 | 720x1280 | 6.5s | no | 1074 KB | 1074 KB | dropped (not smaller) |
| /videos/wire-nails-sorting.mp4 | 720x1280 | 7.3s | no | 1055 KB | 1055 KB | dropped (not smaller) |
| /videos/expanded-mesh-closeup.mp4 | 720x1280 | 6.6s | no | 940 KB | 940 KB | dropped (not smaller) |
| /videos/perforated-cutting.mp4 | 720x1280 | 6.5s | no | 934 KB | 934 KB | dropped (not smaller) |
| /stock/concertina.mp4 | 720x1280 | 5.0s | no | 899 KB | 899 KB | dropped (not smaller) |
| /videos/wire-nails.mp4 | 720x1280 | 5.9s | no | 878 KB | 823 KB | dropped (not smaller) |
| /products/jhatka-machine-fencing-wire.mp4 | 360x640 | 17.5s | no | 828 KB | 393 KB | 342 KB |
| /stock/binding-wire.mp4 | 720x1280 | 4.3s | no | 770 KB | 765 KB | dropped (not smaller) |
| /videos/jhatka-machine.mp4 | 360x640 | 14.0s | no | 681 KB | 341 KB | 298 KB |
| /videos/binding-wire-closeup.mp4 | 720x1280 | 4.3s | no | 654 KB | 654 KB | dropped (not smaller) |
| /videos/concertina-closeup.mp4 | 720x1280 | 2.9s | no | 486 KB | 486 KB | dropped (not smaller) |
| /videos/mosquito-net.mp4 | 720x1280 | 3.0s | no | 463 KB | 463 KB | dropped (not smaller) |

All 44 mp4 verified with ffprobe: h264 video, duration within 0.3 s of source, audio present wherever the source had it; kept webm files verified vp9 with same duration/audio.

## Images (files that changed)

| File | Dim (orig) | Before | After | Method |
|---|---|---|---|---|
| /products/clutch-wire-1.png | 648x918 | 1015 KB | 336 KB | palette mae=0.00 |
| /logo.png | 1536x1024 | 895 KB | 342 KB | lossless |
| /products/national-barbed-wire-1.png | 817x864 | 920 KB | 416 KB | palette mae=0.00 |
| /brands/border-chainlink.jpg | 1600x2134 -> max 1600 | 816 KB | 393 KB | mozjpeg q80 |
| /products/concrete-cover-block-3.png | 870x722 | 627 KB | 215 KB | palette mae=0.97 |
| /brands/border-chainlink-barbed.jpg | 1600x2134 -> max 1600 | 633 KB | 339 KB | mozjpeg q80 |
| /brands/border-barbed.jpg | 1600x2134 -> max 1600 | 579 KB | 317 KB | mozjpeg q80 |
| /brands/cm-chainlink-wide.jpg | 1600x956 | 542 KB | 381 KB | mozjpeg q80 |
| /about/storefront-hero.jpg | 1600x1116 | 466 KB | 310 KB | mozjpeg q80 |
| /brands/cm-chainlink.jpg | 1600x1200 | 528 KB | 376 KB | mozjpeg q80 |
| /products/gi-pipes.png | 1280x600 | 355 KB | 245 KB | palette mae=1.21 |
| /brands/chainlink-arranged.jpg | 1600x740 | 255 KB | 163 KB | mozjpeg q80 |
| /logo-transparent.png | 2000x2000 -> max 1600 | 139 KB | 51 KB | palette mae=0.13 |
| /brands/border-logo-clear.png | 633x292 | 115 KB | 35 KB | lossless |
| /videos/mosquito-net-cutting.jpg | 720x1280 | 251 KB | 176 KB | mozjpeg q80 |
| /products/safety-net-2.png | 500x500 | 236 KB | 164 KB | lossless |
| /brands/cm-barbed.jpg | 1334x750 | 213 KB | 154 KB | mozjpeg q80 |
| /brands/cm-logo-clear.png | 562x313 | 82 KB | 28 KB | lossless |
| /stock/binding-wire.jpg | 720x1280 | 241 KB | 187 KB | mozjpeg q80 |
| /videos/binding-wire-closeup.jpg | 720x1280 | 231 KB | 181 KB | mozjpeg q80 |
| /stock/weldmesh.jpg | 720x1280 | 195 KB | 146 KB | mozjpeg q80 |
| /products/roofing-nail-2.png | 500x500 | 166 KB | 120 KB | palette mae=1.23 |
| /videos/expanded-mesh-closeup.jpg | 720x1280 | 196 KB | 151 KB | mozjpeg q80 |
| /logo-wordmark.png | 900x258 | 72 KB | 28 KB | palette mae=0.35 |
| /stock/expanded.jpg | 720x1280 | 199 KB | 156 KB | mozjpeg q80 |
| /hero/poster-wide.jpg | 1600x900 | 220 KB | 181 KB | mozjpeg q80 |
| /videos/weldmesh-cutting.jpg | 720x1280 | 170 KB | 131 KB | mozjpeg q80 |
| /videos/weldmesh.jpg | 720x1280 | 185 KB | 150 KB | mozjpeg q80 |
| /videos/binding-wire.jpg | 720x1280 | 183 KB | 149 KB | mozjpeg q80 |
| /stock/perforated.jpg | 720x1280 | 170 KB | 137 KB | mozjpeg q80 |
| /videos/expanded-mesh.jpg | 720x1280 | 165 KB | 133 KB | mozjpeg q80 |
| /reels/machhar-full-stop.jpg | 720x1280 | 131 KB | 100 KB | mozjpeg q80 |
| /reels/perforated-sheet-customer.jpg | 720x1280 | 164 KB | 134 KB | mozjpeg q80 |
| /brands/stack-barbed-2.jpg | 1280x1280 | 298 KB | 270 KB | mozjpeg q80 |
| /reels/chainlink-walkthrough.jpg | 720x1280 | 148 KB | 120 KB | mozjpeg q80 |
| /videos/mosquito-net.jpg | 720x1280 | 152 KB | 125 KB | mozjpeg q80 |
| /videos/perforated-cutting.jpg | 720x1280 | 160 KB | 135 KB | mozjpeg q80 |
| /stock/nails.jpg | 720x1280 | 141 KB | 116 KB | mozjpeg q80 |
| /reels/kala-taar-wholesale.jpg | 720x1280 | 146 KB | 121 KB | mozjpeg q80 |
| /reels/weldmesh-jali.jpg | 720x1280 | 151 KB | 127 KB | mozjpeg q80 |
| /reels/nail-reel.jpg | 720x1280 | 129 KB | 108 KB | mozjpeg q80 |
| /videos/wire-nails-sorting.jpg | 720x1280 | 134 KB | 113 KB | mozjpeg q80 |
| /reels/pvc-hexa-mesh.jpg | 720x1280 | 130 KB | 111 KB | mozjpeg q80 |
| /videos/concertina-closeup.jpg | 720x1280 | 122 KB | 104 KB | mozjpeg q80 |
| /brands/stack-barbed.jpg | 1280x960 | 225 KB | 207 KB | mozjpeg q80 |
| /videos/frp-bar.jpg | 720x1280 | 127 KB | 109 KB | mozjpeg q80 |
| /videos/fiber-mesh.jpg | 720x1280 | 118 KB | 101 KB | mozjpeg q80 |
| /videos/wire-nails.jpg | 720x1280 | 126 KB | 110 KB | mozjpeg q80 |
| /reels/frp-bars.jpg | 720x1280 | 133 KB | 117 KB | mozjpeg q80 |
| /hero/poster.jpg | 720x1280 | 125 KB | 110 KB | mozjpeg q80 |
| /products/jhatka-machine-fencing-wire.jpg | 360x640 | 46 KB | 32 KB | mozjpeg q80 |
| /videos/jhatka-machine.jpg | 360x640 | 46 KB | 32 KB | mozjpeg q80 |
| /reels/shop-par-bharosa.jpg | 720x1280 | 56 KB | 42 KB | mozjpeg q80 |
| /reels/check-the-strength.jpg | 720x1280 | 96 KB | 83 KB | mozjpeg q80 |
| /stock/concertina.jpg | 720x1280 | 107 KB | 95 KB | mozjpeg q80 |
| /reels/rat-jaali-customer.jpg | 720x1280 | 112 KB | 100 KB | mozjpeg q80 |
| /products/roofing-nail-1.png | 500x500 | 45 KB | 33 KB | lossless |
| /videos/perforated-sheet.jpg | 720x1280 | 86 KB | 75 KB | mozjpeg q80 |
| /reels/tata-wire-rate.jpg | 720x1280 | 113 KB | 102 KB | mozjpeg q80 |
| /videos/concertina-wire.jpg | 720x1280 | 102 KB | 92 KB | mozjpeg q80 |
| /products/frp-bars-pipe.jpg | 464x832 | 59 KB | 52 KB | mozjpeg q80 |
| /videos/frp-pipe.jpg | 720x402 | 47 KB | 40 KB | mozjpeg q80 |
| /products/sr-hoe-with-handle.jpg | 476x848 | 50 KB | 44 KB | mozjpeg q80 |
| /videos/pigeon-net.jpg | 720x1280 | 90 KB | 84 KB | mozjpeg q80 |
| /videos/sr-hoe.jpg | 476x848 | 47 KB | 42 KB | mozjpeg q80 |
| /reels/kabootar-jali.jpg | 720x1280 | 21 KB | 20 KB | mozjpeg q80 |
| /products/types-nails.png | 590x250 | 8 KB | 7 KB | lossless |

Unchanged (already optimal or <3% gain): 192 files.

## Weakest product images

Measured on the files in public/products (sharpness = variance of Laplacian on a 400 px greyscale; corners = mean luminance of the four corners). Raw numbers: lowest sharpness / lowest resolution / darkest backgrounds.

### Very low resolution (longest side < 400 px, will be upscaled and look soft on retina/Android)

- /products/welded-wire-mesh-1.png: 125x125
- /products/gi-perforated-3.png: 281x179
- /products/fastener-nail-1.png: 300x300
- /products/gi-wire.png: 313x161
- /products/tmt-bar.png: 326x155
- /products/warehouse-steel-sections.png: 329x153
- /products/chain-link-wire.png: 350x269

### Soft / blurry (lowest edge sharpness)

- /products/fastener-nail-1.png: 300x300, sharpness 20
- /products/pigeon-spike-3.png: 1000x805, sharpness 49
- /products/pigeon-spike-1.png: 1600x1062, sharpness 69
- /products/concrete-cover-block-1.png: 500x500, sharpness 94
- /products/ss-fine-mesh-1.png: 1200x1200, sharpness 114
- /products/concrete-cover-block-2.png: 500x481, sharpness 148
- /products/welded-wire-mesh-1.png: 125x125, sharpness 179
- /products/sr-pickaxe-geti-5.png: 1000x369, sharpness 309

### Dark or inconsistent background (corner luminance < 90 of 255; the catalogue norm is near-white)

- /products/ms-wire-rope.png: corners 0/255
- /products/fiber-mesh-main.png: corners 10/255
- /products/ss-gi-mesh-jali-2.png: corners 16/255
- /products/fiber-mesh-1.png: corners 49/255
- /products/sr-pickaxe-geti-1.png: corners 50/255
- /products/welded-wire-mesh-1.png: corners 50/255
- /products/mosquito-net.png: corners 55/255
- /products/ss-gi-mesh-jali-3.png: corners 60/255
- /products/tata-gi-wire-2.png: corners 63/255
- /products/grinding-disc-main.png: corners 64/255
- /products/ms-round-bar.png: corners 69/255
- /products/brands/boarder/chainlink-1.png: corners 73/255
- /products/brands/boarder/chainlink-3.png: corners 73/255
- /products/clutch-wire-2.png: corners 74/255
- /products/brands/cm/chainlink-1.png: corners 76/255
- /products/ss-wire-rope-2.png: corners 76/255
- /products/ms-angle.png: corners 83/255
- /products/wire-nail-2.png: corners 83/255
- /products/ms-wire-rope-2.png: corners 84/255
- /products/perforated-sheet-2.png: corners 84/255

Another 61 images have mid-grey or tinted backgrounds (corner luminance 90-200), i.e. inconsistent with the white-background shots; see MEDIA_REPORT raw data in docs/perf/product-image-metrics.json.

### Not-fixable-by-compression note

Images smaller than ~500 px on the long side are already at their maximum information; recompression cannot improve them. They need re-shooting or sourcing from the manufacturer. No content was invented or replaced.

## Files not safely optimised / caveats

- public/logo.png, logo-dark.png, logo-transparent.png, logo-wordmark.png: recompressed losslessly or with a palette only where error was below threshold; if the brand team needs bit-exact masters, restore from the tag.
- 33 .webm siblings generated were deleted because they were larger than the .mp4; nothing referenced them.
- Video posters named `/videos/*.jpg` and `/products/*.jpg` are not referenced by literal path in code (probably derived by swapping the extension); they were kept and only recompressed.
- public/fx/* belongs to the design agent and was not touched.
- Reels are 25-36 s; after re-encode the biggest are still 5-6 MB. The real saving for mobile is not autoplaying/preloading them (see recommendations).

## Recommendations for code (lead)

1. Every `<video>` outside the hero: `preload="none"` (or `metadata`) with the `poster` set, and start loading only on viewport entry / tap. Reels grid should not fetch 13 files up front.
2. Respect data saving: skip autoplay and preload when `navigator.connection?.saveData` or `effectiveType` is `2g`/`slow-2g`/`3g`; show the poster with a play button.
3. Add `<source src="...webm" type="video/webm">` before the mp4 source only for the 11 files that have one (list in the Videos table).
4. Hero: poster files are hero/poster.jpg and hero/poster-wide.jpg; give the hero video `preload="metadata"` and keep the poster as the LCP image.
5. next/image: set `sizes` accurately so product cards pull 400-640 px variants, not the 1600 px originals.
