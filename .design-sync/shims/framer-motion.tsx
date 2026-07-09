// design-sync shim: neutralize framer-motion in the design-system bundle.
// Components use `motion.*` with `initial={{opacity:0}}` + `whileInView` entrance
// animations. In a static design surface (and in headless capture) the
// intersection/scroll events never fire, so those elements stay at opacity 0 and
// render blank. For a design system the correct behavior is "render at the final
// visible state" — so motion.<tag> becomes a plain <tag> with motion-only props
// stripped, and the rest of the API is inert passthrough.
import * as React from "react";

const STRIP = new Set([
  "initial", "animate", "exit", "variants", "transition", "custom",
  "whileHover", "whileTap", "whileFocus", "whileDrag", "whileInView", "viewport",
  "onViewportEnter", "onViewportLeave", "onAnimationStart", "onAnimationComplete", "onUpdate",
  "drag", "dragConstraints", "dragElastic", "dragMomentum", "dragControls", "dragListener",
  "dragSnapToOrigin", "dragTransition", "dragDirectionLock",
  "layout", "layoutId", "layoutDependency", "layoutScroll", "layoutRoot",
  "transformTemplate", "inherit", "transformValues",
]);

function clean(props: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const k in props) if (!STRIP.has(k)) out[k] = props[k];
  return out;
}

const cache = new Map<string, React.ElementType>();
function motionComponent(tag: string): React.ElementType {
  let C = cache.get(tag);
  if (!C) {
    C = React.forwardRef((props: any, ref: any) =>
      React.createElement(tag, { ref, ...clean(props) }),
    ) as React.ElementType;
    (C as any).displayName = `motion.${tag}`;
    cache.set(tag, C);
  }
  return C;
}

export const motion: any = new Proxy(
  {},
  { get: (_t, key) => motionComponent(typeof key === "string" ? key : "div") },
);
export const m = motion;

const Frag = ({ children }: { children?: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);
export const AnimatePresence = Frag;
export const MotionConfig = Frag;
export const LazyMotion = Frag;
export const domAnimation = {};
export const domMax = {};

export const useInView = () => true;
export const useReducedMotion = () => true;
const controls = () => ({ start: () => Promise.resolve(), stop: () => {}, set: () => {} });
export const useAnimation = controls;
export const useAnimationControls = controls;
export const useMotionValue = (v: any) => ({ get: () => v, set: () => {}, on: () => () => {}, destroy: () => {} });
export const useTransform = () => ({ get: () => 0, set: () => {}, on: () => () => {} });
export const useSpring = (v: any) => v;
export const useScroll = () => ({
  scrollX: useMotionValue(0),
  scrollY: useMotionValue(0),
  scrollXProgress: useMotionValue(0),
  scrollYProgress: useMotionValue(0),
});

export default { motion, AnimatePresence };
