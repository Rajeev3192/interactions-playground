"use client";

import { PlaygroundShell } from "@/components/playground/playground-shell";
import { TooltipPlaygroundBody } from "@/components/playground/tooltip-playground-body";

export default function TooltipPlaygroundPage() {
  return (
    <PlaygroundShell current="tooltip">
      <TooltipPlaygroundBody variant="full" />
    </PlaygroundShell>
  );
}
