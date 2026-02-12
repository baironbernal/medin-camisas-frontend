
import { useState, useCallback } from "react";

/**
 * Hook to manage the full lifecycle of opening and animated closing of a component.
 * 
 * @param duration - Duration of the exit animation in ms (default: 300)
 * @returns {
 *   isOpen: boolean;      // Should the component be mounted?
 *   isClosing: boolean;   // Should the exit animation play?
 *   open: () => void;     // Call to open
 *   close: () => void;    // Call to start closing animation
 *   toggle: () => void;   // Toggle open/close
 * }
 */
export function useAnimatedOpen(duration = 300) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    setIsClosing(false);
  }, []);

  const close = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, duration);
  }, [duration]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, close, open]);

  return { isOpen, isClosing, open, close, toggle };
}
