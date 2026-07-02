"use client";

import { PlaygroundShell } from "@/components/playground/playground-shell";
import { TogglePlaygroundBody } from "@/components/playground/toggle-playground-body";

export default function ToggleEmbedPage() {
  return (
    <PlaygroundShell current="toggle" variant="embed">
      <TogglePlaygroundBody variant="embed" />
    </PlaygroundShell>
  );
}
