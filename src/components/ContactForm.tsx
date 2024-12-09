import React, { useState } from "react";
import { Button } from "./ui/button";

const ContactForm = ({ ACCESS_KEY }: { ACCESS_KEY: string }) => {
  const [formData, setFormData] = useState({
    $first_name: "",
    $last_name: "",
    email: "",
    subject: "",
    message: "",
    accessKey: ACCESS_KEY,
  });
  const [status, setStatus] = useState<
    "idle" | "success" | "error" | "loading"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatus("loading");
      const response = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-2xl font-bold text-background">
        Thank you! We received your message and will reply shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {status === "error" && <div className="text-red-500">{errorMessage}</div>}
      <input type="hidden" name="accessKey" value={ACCESS_KEY} />
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* First Name */}
        <div className="space-y-2 w-full">
          <label htmlFor="first_name" className="block text-sm font-semibold">
            First Name <span className="text-gray-300">(required)</span>
          </label>
          <input
            type="text"
            id="first_name"
            name="$first_name"
            className="w-full px-4 py-2 bg-background text-black rounded-xl focus:ring-2 focus:ring-gold focus:outline-none"
            required
            value={formData.$first_name}
            onChange={handleChange}
          />
        </div>
        {/* Last Name */}
        <div className="space-y-2 w-full">
          <label htmlFor="last_name" className="block text-sm font-semibold">
            Last Name <span className="text-gray-300">(required)</span>
          </label>
          <input
            type="text"
            id="last_name"
            name="$last_name"
            className="w-full px-4 py-2 bg-background text-black rounded-xl focus:ring-2 focus:ring-gold focus:outline-none"
            required
            value={formData.$last_name}
            onChange={handleChange}
          />
        </div>
      </div>
      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold">
          Email <span className="text-gray-300">(required)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-full px-4 py-2 bg-background text-black rounded-xl focus:ring-2 focus:ring-gold focus:outline-none"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      {/* Subject */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-semibold">
          Subject <span className="text-gray-300">(required)</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="w-full px-4 py-2 bg-background text-black rounded-xl focus:ring-2 focus:ring-gold focus:outline-none"
          required
          value={formData.subject}
          onChange={handleChange}
        />
      </div>
      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold">
          Message <span className="text-gray-300">(required)</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="w-full px-4 py-2 bg-background text-black rounded-xl focus:ring-2 focus:ring-gold focus:outline-none min-h-48"
          required
          value={formData.message}
          onChange={handleChange}
        />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

export default ContactForm;
