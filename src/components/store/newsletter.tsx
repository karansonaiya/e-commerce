"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] py-16 text-white">
      <div className="absolute left-1/2 top-0 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[var(--color-brand)]/10 blur-3xl [animation-duration:6s]" />
      <Reveal className="container-x relative flex flex-col items-center text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          <TextReveal text="Join the Westoria Circle" />
        </h2>
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
      </Reveal>
    </section>
  );
}
