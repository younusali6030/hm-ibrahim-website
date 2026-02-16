"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/app/contact/actions";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (honeypot) return;
    const formData = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const result = await submitContact(formData);
      if (result?.success) {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        return;
      }
      setError(result?.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="font-medium text-foreground">Message sent.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />
      <div>
        <Label htmlFor="contact-name">Name *</Label>
        <Input id="contact-name" name="name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="contact-email">Email *</Label>
        <Input id="contact-email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="contact-phone">Phone</Label>
        <Input id="contact-phone" name="phone" type="tel" className="mt-1" />
      </div>
      <div>
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea id="contact-message" name="message" required className="mt-1 min-h-[120px]" />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
