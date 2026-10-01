"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ImageSlot = {
  id: string;
  url: string | null;
  status: "uploading" | "done" | "error";
};

let nextId = 0;
const makeId = () => `${Date.now()}-${nextId++}`;

export function ImagePicker({ defaultValue }: { defaultValue?: string }) {
  const [slots, setSlots] = useState<ImageSlot[]>(
    defaultValue
      ? defaultValue
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
          .map((url) => ({ id: makeId(), url, status: "done" as const }))
      : []
  );
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading = slots.some((s) => s.status === "uploading");
  const doneUrls = slots.filter((s) => s.status === "done" && s.url).map((s) => s.url as string);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const newSlots = Array.from(files).map((file) => ({ file, slotId: makeId() }));

    setSlots((prev) => [
      ...prev,
      ...newSlots.map((s) => ({ id: s.slotId, url: null, status: "uploading" as const })),
    ]);

    for (const { file, slotId } of newSlots) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok || !data.url) {
          toast.error(data.error ?? `Could not upload ${file.name}`);
          setSlots((prev) => prev.filter((s) => s.id !== slotId));
          continue;
        }

        setSlots((prev) =>
          prev.map((s) => (s.id === slotId ? { ...s, url: data.url, status: "done" as const } : s))
        );
      } catch {
        toast.error(`Could not upload ${file.name}`);
        setSlots((prev) => prev.filter((s) => s.id !== slotId));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    setSlots((prev) => [...prev, { id: makeId(), url, status: "done" }]);
    setUrlInput("");
  }

  function removeSlot(id: string) {
    setSlots((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <Label>Product Images</Label>

      <div className="mt-2 flex flex-wrap gap-3">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="group relative size-24 shrink-0 overflow-hidden rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-cream-dark)]"
          >
            {slot.status === "uploading" && (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="size-5 animate-spin text-[var(--color-ink-soft)]" />
              </div>
            )}
            {slot.status === "done" && slot.url && (
              <Image src={slot.url} alt="Product image" fill className="object-cover" unoptimized />
            )}
            {slot.status === "error" && (
              <div className="flex h-full items-center justify-center text-red-500">
                <AlertCircle className="size-5" />
              </div>
            )}
            {slot.status !== "uploading" && (
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          aria-label="Add product image"
          className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-[var(--color-ink)]/25 text-[var(--color-ink-soft)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-dark)] disabled:opacity-50"
        >
          <Plus className="size-6" />
          <span className="text-xs font-medium">Add</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {isUploading ? "Uploading..." : "Upload from device"}
        </Button>

        <div className="flex items-center gap-2">
          <Input
            placeholder="or paste an image URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            className="h-9 w-56"
          />
          <Button type="button" variant="ghost" size="sm" onClick={addUrl}>
            Add
          </Button>
        </div>
      </div>

      <input type="hidden" name="images" value={doneUrls.join(",")} />
      {doneUrls.length === 0 && !isUploading && (
        <p className="mt-1 text-xs text-[var(--color-brand-dark)]">At least one image is required.</p>
      )}
    </div>
  );
}
