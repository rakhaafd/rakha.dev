import { useState } from "react";
import emailjs from "@emailjs/browser";
import Label from "../Elements/Label";
import Button from "../Elements/Button";
import { FaEnvelope, FaMapMarkerAlt, FaSpinner, FaPaperPlane } from "react-icons/fa";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  emailjs.init(EMAILJS_PUBLIC_KEY);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (status.message) setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    const now = new Date();
    const date = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const time = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    const templateParams = {
      name: form.name,
      email: form.email,
      message: form.message,
      date: date,
      time: time,
      to_email: "rakhafausta07@gmail.com",
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status === 200) {
        setStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon."
        });
        setForm({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({
        type: "error",
        message: "Oops! Something went wrong. Please try again later."
      });
    } finally {
      setIsLoading(false);
      
      if (status.type === "success") {
        setTimeout(() => {
          setStatus({ type: "", message: "" });
        }, 5000);
      }
    }
  };

  return (
    <section id="contact" className="py-20 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white mb-4">
              Get in <span className="text-[var(--color-accent)]">Touch</span>
            </h3>
            
            <p className="text-gray-400 leading-relaxed">
              I'm always open to connect, share ideas, and grow together. 
              Whether it's about web development or just exchanging thoughts 
              about tech, feel free to drop a message.
            </p>

            <div className="cursor-pointer space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] hover:border-[var(--color-accent)]/30 transition-all duration-300 group">
                <div className="p-3 bg-[#2a2a2a] rounded-lg group-hover:bg-[#2a2a2a]/80">
                  <FaEnvelope className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-white">rakhafausta07@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] hover:border-[var(--color-accent)]/30 transition-all duration-300 group">
                <div className="p-3 bg-[#2a2a2a] rounded-lg group-hover:bg-[#2a2a2a]/80">
                  <FaMapMarkerAlt className="text-[var(--color-accent)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-white">Semarang, Indonesia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-8 hover:border-[var(--color-accent)]/30 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">Send Message</h3>
            
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl text-sm ${
                status.type === "success" 
                  ? "bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-[var(--color-accent)]" 
                  : "bg-red-500/10 border border-red-500/30 text-red-500"
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" text="Name" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <Label htmlFor="email" text="Email" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <Label htmlFor="message" text="Message" />
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="Your message"
                  className="w-full px-4 py-3 rounded-xl bg-[#242424] border border-[#2a2a2a] text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent)] transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <Button
                text={isLoading ? "Sending..." : "Send Message"}
                type="submit"
                disabled={isLoading}
                icon={isLoading ? <FaSpinner className="text-lg animate-spin" /> : <FaPaperPlane className="text-lg" />}
                className={`w-full justify-center mt-4 bg-[var(--color-accent)] text-black font-semibold py-3 rounded-xl transition-all duration-300 ${
                  isLoading 
                    ? "opacity-70 cursor-not-allowed" 
                    : "hover:bg-[var(--color-accent-hover)]"
                }`}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}