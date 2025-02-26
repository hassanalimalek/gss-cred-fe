import { TargetAndTransition, Transition } from "framer-motion";

export interface AnimationProps {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
}

/**
 * Creates a fade-in animation with customizable direction and delay
 * @param direction - The direction to fade in from ("up" or "down")
 * @param delay - The delay before starting the animation (in seconds)
 * @returns Animation properties for framer-motion
 */
export const fadeIn = (direction: "up" | "down" = "up", delay: number = 0): AnimationProps => ({
  initial: { y: direction === "up" ? 40 : -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

/**
 * Creates a fade-in animation for elements entering from the sides
 * @param direction - The direction to fade in from ("left" or "right")
 * @param delay - The delay before starting the animation (in seconds)
 * @returns Animation properties for framer-motion
 */
export const fadeInSide = (direction: "left" | "right" = "left", delay: number = 0): AnimationProps => ({
  initial: { x: direction === "left" ? -40 : 40, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

/**
 * Creates a scale animation for elements that need to grow or shrink into view
 * @param delay - The delay before starting the animation (in seconds)
 * @returns Animation properties for framer-motion
 */
export const scaleIn = (delay: number = 0): AnimationProps => ({
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: {
    duration: 0.6,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});
