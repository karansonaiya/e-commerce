"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-[var(--color-ink)] py-16 text-white">
      <div className="container-x flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Join the Westoria Circle</h2>
        <p className="mt-2 max-w-md text-white/70">
          Sign up for early access to new launches and exclusive member offers.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Thanks for subscribing!");
            setEmail("");
          }}
          className="mt-6 flex w-full max-w-md gap-2"
        >
          <Input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    </section>
  );
}
