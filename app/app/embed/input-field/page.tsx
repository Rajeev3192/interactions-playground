"use client";

import { PlaygroundShell } from "@/components/playground/playground-shell";
import { InputFieldPlaygroundBody } from "@/components/playground/input-field-playground-body";

export default function InputFieldEmbedPage() {
  return (
    <PlaygroundShell current="input-field" variant="embed">
      <InputFieldPlaygroundBody variant="embed" />
    </PlaygroundShell>
  );
}
