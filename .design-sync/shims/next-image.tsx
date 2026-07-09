// design-sync shim: renders next/image as a plain <img> so bundled components
// render in the Claude Design runtime (Next's Image needs the Next server runtime).
import * as React from "react";

type Src = string | { src: string };

export default function Image(props: any) {
  const {
    src,
    alt = "",
    width,
    height,
    fill,
    priority,
    quality,
    sizes,
    placeholder,
    blurDataURL,
    loader,
    unoptimized,
    style,
    ...rest
  } = props ?? {};
  const resolved: string =
    typeof src === "string" ? src : (src as { src?: string })?.src ?? "";
  const finalStyle = fill
    ? {
        position: "absolute" as const,
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover" as const,
        ...style,
      }
    : style;
  return React.createElement("img", {
    src: resolved,
    alt,
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    style: finalStyle,
    ...rest,
  });
}

export { Image };
