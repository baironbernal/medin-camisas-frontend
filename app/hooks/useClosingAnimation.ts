
import { useState, useCallback } from "react";

/**
 * Hook to handle closing animations before unmounting a component.
 * @param onClose - Callback to execute after the animation finishes.
 * @param duration - Duration of the animation in milliseconds (default: 300).
 * @returns [isClosing, handleClose]
 */
export function useClosingAnimation(onClose: () => void, duration = 300) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, duration);
  }, [onClose, duration]);

  return { isClosing, handleClose };
}
