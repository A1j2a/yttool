import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { PageWrapper } from "../animations";
import AnimatedButton from "../components/AnimatedButton";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

// ✅ EmailJS credentials from .env
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Your name",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "your@email.com",
    required: true,
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    placeholder: "How can we help?",
    required: false,
  },
];

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  if (!form.message.trim()) errors.message = "Message is required";
  else if (form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters";
  return errors;
}

const empty = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | sent
  const { toasts, addToast, removeToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setStatus("loading");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject || "No Subject",
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("sent");
    } catch (err) {
      console.error('EmailJS error:', err)
      setStatus('idle')
      addToast(err?.text || err?.message || 'Failed to send. Please try again.', 'error')
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get in <span className="neon-text">Touch</span>
          </h1>
          <p className="text-slate-500">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          {status === "sent" ? (
            <div className="text-center py-12">
              <CheckCircle size={52} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">
                Message Sent!
              </h3>
              <p className="text-slate-500">
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setForm(empty);
                }}
                className="mt-6 text-cyan-400 text-sm hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {FIELDS.slice(0, 2).map((f) => (
                  <div key={f.name}>
                    <label className="block text-slate-400 text-xs font-medium mb-2">
                      {f.label}{" "}
                      {f.required && <span className="text-pink-400">*</span>}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className={`w-full px-4 py-3 rounded-xl glass border text-white placeholder-slate-600 text-sm bg-transparent transition-all ${
                        errors[f.name] ? "border-red-500/60" : "border-white/10"
                      }`}
                    />
                    {errors[f.name] && (
                      <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                        <AlertCircle size={11} /> {errors[f.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-slate-400 text-xs font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-slate-400 text-xs font-medium mb-2">
                  Message <span className="text-pink-400">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us more..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl glass border text-white placeholder-slate-600 text-sm bg-transparent resize-none transition-all ${
                    errors.message ? "border-red-500/60" : "border-white/10"
                  }`}
                />
                {errors.message && (
                  <p className="flex items-center gap-1 text-red-400 text-xs mt-1">
                    <AlertCircle size={11} /> {errors.message}
                  </p>
                )}
              </div>

              <AnimatedButton
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto"
              >
                <Mail size={16} />
                {status === "loading" ? "Sending..." : "Send Message"}
              </AnimatedButton>
            </form>
          )}
        </motion.div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  );
}
