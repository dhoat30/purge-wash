"use client";

import { useState } from "react";
import styles from "./PurgeQuoteForm.module.css";

const initialForm = { name: "", phone: "", email: "", address: "", service: "House washing", message: "" };

export default function PurgeQuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus("submitting");
    const message = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email || "Not supplied"}`,
      `Property address: ${form.address}`,
      `Service: ${form.service}`,
      `Notes: ${form.message || "None"}`,
    ].join("\n");

    try {
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email || "website@purge.nz", formName: "Purge Wash website quote", message }),
      });
      if (!response.ok) throw new Error("Unable to submit quote");
      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className={styles.form} onSubmit={submitForm}>
      <div className={styles.cardHeader}>
        <strong>Get Your Free Quote</strong>
        <p>Takes less than a minute. No obligation.</p>
      </div>
      <div className={styles.highlightBar}><span>⚡</span> Tailored cleaning for your property</div>
      <div className={styles.fields}>
        <div className={styles.formHeader}><span>Tell us about your place</span><small>Fields marked * are required</small></div>
        <div className={styles.twoColumns}>
          <label><span>Name *</span><input name="name" value={form.name} onChange={updateField} autoComplete="name" required placeholder="Your name" /></label>
          <label><span>Phone *</span><input name="phone" value={form.phone} onChange={updateField} autoComplete="tel" required placeholder="021 123 4567" /></label>
        </div>
        <label><span>Email</span><input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" placeholder="you@example.co.nz" /></label>
        <label><span>Property address *</span><input name="address" value={form.address} onChange={updateField} autoComplete="street-address" required placeholder="Street and suburb" /></label>
        <label>
          <span>What would you like cleaned? *</span>
          <select name="service" value={form.service} onChange={updateField} required>
            <option>House washing</option><option>Roof treatment</option><option>Gutter cleaning</option><option>Driveway or paths</option><option>Deck or fence</option><option>Commercial exterior</option><option>Multiple services</option>
          </select>
        </label>
        <label><span>Anything else we should know?</span><textarea name="message" value={form.message} onChange={updateField} rows="3" placeholder="Property size, access, problem areas…" /></label>
        <button type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending…" : "Request my free quote"}<span>→</span></button>
        <p className={styles.footerNote}>Honest advice • Clear scope • No obligation</p>
        <p className={styles.privacy}>🔒 Your details are kept private and only used for this enquiry.</p>
        {status === "success" && <p className={styles.success} role="status">Thanks—your request is on its way. We’ll be in touch.</p>}
        {status === "error" && <p className={styles.error} role="alert">Something went wrong. Please try again or give us a call.</p>}
      </div>
    </form>
  );
}
