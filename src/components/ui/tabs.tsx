"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex items-center justify-center gap-8 border-b border-[var(--color-ink)]/10",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "font-display relative px-1 pb-4 text-lg font-medium text-[var(--color-ink-soft)] transition-colors data-[state=active]:text-[var(--color-ink)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--color-brand)] after:transition-all data-[state=active]:after:w-full",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn("mt-8", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
