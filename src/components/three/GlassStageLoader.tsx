"use client";

import dynamic from "next/dynamic";

// WebGL só existe no navegador e não deve atrasar o primeiro paint.
const GlassStage = dynamic(() => import("./GlassStage").then((m) => m.GlassStage), {
  ssr: false,
});

export function GlassStageLoader() {
  return <GlassStage />;
}
