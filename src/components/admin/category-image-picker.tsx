"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function CategoryImagePicker({ defaultValue }: { defaultValue?: string | null }) {
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.url) {
        toast.error(data.error ?? `Could not upload ${file.name}`);
        return;
      }
      setUrl(data.url);
    } catch {
      toast.error(`Could not upload ${file.name}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <Label>Banner Image</Label>
      <div className="mt-2 flex items-center gap-3">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-[var(--color-ink)]/15 bg-[var(--color-cream-dark)]">
          {uploading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="size-5 animate-spin text-[var(--color-ink-soft)]" />
            </div>
          ) : url ? (
            <>
              <Image src={url} alt="Category banner" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => setUrl(null)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs text-[var(--color-ink-soft)]/50">
              No image
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {uploading ? "Uploading..." : url ? "Replace" : "Upload"}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files)}
      />
      <input type="hidden" name="image" value={url ?? ""} />
    </div>
  );
}
