"use client";

import { PlaygroundShell } from "@/components/playground/playground-shell";
import { ButtonPlaygroundBody } from "@/components/playground/button-playground-body";

export default function ButtonEmbedPage() {
  return (
    <PlaygroundShell current="button" variant="embed">
      <ButtonPlaygroundBody variant="embed" />
    </PlaygroundShell>
  );
}
