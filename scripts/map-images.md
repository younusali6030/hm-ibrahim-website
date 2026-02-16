# Image Mapping Guide

This guide helps map uploaded product images to products in the catalog.

## Image Naming Convention

All images should be placed in `/public/products/` with clean, web-safe filenames:
- Lowercase letters
- Hyphens instead of spaces
- No special characters (remove &, /, etc.)
- Keep original extension (.jpg, .png, .webp)

## Examples

| Original Filename | Clean Filename |
|------------------|----------------|
| `binding wire.jpg` | `binding-wire.jpg` |
| `ss/gi mesh and jali.webp` | `ss-gi-mesh-and-jali.webp` |
| `15mmx15mmweldedwiremesh.webp` | `15mmx15mm-welded-wiremesh.webp` |
| `Fastner & Nail 1.jpg` | `fastener-nail-1.jpg` |
| `Perfortated sheet.jpeg.webp` | `perforated-sheet.webp` |

## Product Slug Mapping

Products are matched by slug. Common mappings:

- `ms-angles` → `ms-angle.png`, `ms-angles.png`
- `binding-wire` → `binding-wire.jpg`
- `fasteners-nails` → `fastener-nail.jpg`, `fastener-nail-1.jpg`
- `welded-mesh` → `welding-mesh.jpg`, `15mmx15mm-welded-wiremesh.webp`
- `ss-gi-mesh-jalies` → `ss-gi-mesh-and-jali.webp`
- `perforated-sheets` → `perforated-sheet.webp`
- `crowbars-pickaxes` → `pickaxe-crowbar-3.webp`

## Multiple Images

If a product has multiple images, add all matching filenames to the `images` array:

```typescript
{
  slug: "fasteners-nails",
  images: ["/products/fastener-nail-1.jpg", "/products/fastener-nail.jpg"],
  // ...
}
```

## Adding New Images

1. Place image file in `/public/products/` with clean filename
2. Update `/content/products.ts`:
   - Add to `images` array: `images: ["/products/your-image.jpg"]`
   - Keep `image` field for backward compatibility: `image: "/products/your-image.jpg"`

## Category Fallbacks

If a product has no specific image, it falls back to:
1. Product `images[0]`
2. Product `image`
3. Category `image`
4. `/placeholder-product.svg`
