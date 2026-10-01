"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export function SignOutButton() {
  const [pending, setPending] = useState(false);

  function handleConfirm() {
    setPending(true);
    try {
      sessionStorage.setItem("westoria:just-signed-out", "1");
    } catch {
      // sessionStorage can throw in restricted contexts (private browsing, etc.)
    }
    signOut({ callbackUrl: "/" });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign Out</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Log out?</DialogTitle>
          <DialogDescription>Are you sure you want to log out?</DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending ? "Signing out..." : "Log Out"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
