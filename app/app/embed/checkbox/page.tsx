"use client";

import { PlaygroundShell } from "@/components/playground/playground-shell";
import { CheckboxPlaygroundBody } from "@/components/playground/checkbox-playground-body";

export default function CheckboxEmbedPage() {
  return (
    <PlaygroundShell current="checkbox" variant="embed">
      <CheckboxPlaygroundBody variant="embed" />
    </PlaygroundShell>
  );
}
