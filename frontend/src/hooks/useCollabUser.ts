import React from "react";
import { useAppState } from "./ReduxHooks";

export function useCollabUser() {
  const user = useAppState((s) => s.userReducer.user);

  // Generate a random light color (RGB values between 180 and 255)
  function randomLightColor() {
    const r = Math.floor(180 + Math.random() * 75);
    const g = Math.floor(180 + Math.random() * 75);
    const b = Math.floor(180 + Math.random() * 75);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  const stableDataRef = React.useRef<{
    id: string;
    color: string;
  }>({
    id: crypto.randomUUID(),
    color: randomLightColor(),
  });

  return React.useMemo(
    () => ({
      id: stableDataRef.current.id,
      name: user?.name || "Anonymous",
      color: stableDataRef.current.color,
    }),
    [user?.name],
  );
}
