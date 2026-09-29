"use client";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderTracking } from "@/actions/orders";

export function OrderTrackingForm({
  orderId,
  trackingNumber,
  courierName,
  trackingUrl,
}: {
  orderId: string;
  trackingNumber: string | null;
  courierName: string | null;
  trackingUrl: string | null;
}) {
  async function action(formData: FormData) {
    await updateOrderTracking(orderId, formData);
    toast.success("Tracking details saved");
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="courierName">Courier Name</Label>
        <Input
          id="courierName"
          name="courierName"
          placeholder="e.g. Delhivery, BlueDart"
          defaultValue={courierName ?? ""}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="trackingNumber">Tracking Number</Label>
        <Input
          id="trackingNumber"
          name="trackingNumber"
          defaultValue={trackingNumber ?? ""}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
        <Input
          id="trackingUrl"
          name="trackingUrl"
          placeholder="https://courier.com/track/..."
          defaultValue={trackingUrl ?? ""}
          className="mt-1.5"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Saving..." : "Save Tracking Details"}
    </Button>
  );
}
