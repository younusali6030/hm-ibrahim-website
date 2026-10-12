import Image from "next/image";
import { blurFor, isIllustration } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Optional second view, cross-faded in on hover/focus of the parent `.group`. */
  src2?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  position?: string;
};

/**
 * A dark-steel photo plate: blur-up placeholder, a slow tilt-and-lift on hover (transform only,
 * off under reduced motion), an optional second view, and an honest "Drawing" chip for illustrations.
 * The parent must have the `group` class and `relative overflow-hidden`.
 */
export function PhotoPlate({ src, alt, src2, sizes, priority, className, position }: Props) {
  const blurDataURL = blurFor(src);
  const drawing = isIllustration(src);
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        {...(blurDataURL ? { placeholder: "blur" as const, blurDataURL } : {})}
        style={position ? { objectPosition: position } : undefined}
        className={cn(
          drawing ? "object-contain" : "object-cover",
          "will-change-transform motion-safe:transition-[transform,opacity] motion-safe:duration-700 motion-safe:ease-out",
          "motion-safe:group-hover:[transform:perspective(900px)_rotateX(1.5deg)_rotateY(-2.5deg)_scale(1.05)]",
          src2 && "motion-safe:group-hover:opacity-0",
          className,
        )}
      />
      {src2 && (
        <Image
          src={src2}
          alt=""
          fill
          sizes={sizes}
          aria-hidden="true"
          {...(blurFor(src2) ? { placeholder: "blur" as const, blurDataURL: blurFor(src2) } : {})}
          className="object-cover opacity-0 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:group-hover:opacity-100"
        />
      )}
      <span
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,hsl(0_0%_100%/0.09)_50%,transparent_65%)] bg-[length:250%_100%] bg-[position:140%_0] motion-safe:transition-[background-position] motion-safe:duration-1000 motion-safe:group-hover:bg-[position:-40%_0]"
        aria-hidden="true"
      />
      {drawing && (
        <span className="absolute bottom-1.5 left-1.5 rounded-[4px] bg-[#070d14]/85 px-1.5 py-0.5 font-mono-brand text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Drawing
        </span>
      )}
    </>
  );
}
