import { useState } from "react";
import { motion } from "framer-motion";
import { PageWrapper } from "../animations";
import AnimatedButton from "../components/AnimatedButton";
import {
  Mail,
  MessageCircle,
  Share2,
  Code2,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useToast } from "../hooks/useToast";
import Toast from "../components/Toast";

const SUPPORT_CARDS = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    desc: "Chat with our team in real-time",
    action: "Start Chat",
    color: "#00f5ff",
  },
  {
    icon: Mail,
    title: "Email Support",
    desc: "support@nexatools.io",
    action: "Send Email",
    color: "#bf00ff",
  },
  {
    icon: Share2,
    title: "Twitter / X",
    desc: "@NexaTools",
    action: "Tweet Us",
    color: "#ff0080",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast("Please fill all required fields", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      addToast("Please enter a valid email address", "error");
      return;
    }
    setSent(true);
    addToast("Message sent! We'll reply within 24 hours.", "success");
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Get in <span className="neon-text">Touch</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Support Cards */}
        {/* <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {SUPPORT_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass glass-hover rounded-2xl p-5 text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}25`,
                }}
              >
                <card.icon size={22} style={{ color: card.color }} />
              </div>
              <h3 className="text-white font-semibold mb-1">{card.title}</h3>
              <p className="text-slate-500 text-xs mb-3">{card.desc}</p>
              <button
                className="text-xs font-medium transition-colors"
                style={{ color: card.color }}
              >
                {card.action} →
              </button>
            </motion.div>
          ))}
        </div> */}

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-8"
        >
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">
                Message Sent!
              </h3>
              <p className="text-slate-500">
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
                className="mt-6 text-cyan-400 text-sm hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-white font-bold text-xl mb-6">
                Send a Message
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-slate-400 text-xs font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-slate-400 text-xs font-medium mb-2">
                  Message *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us more..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-slate-600 text-sm bg-transparent resize-none"
                />
              </div>
              <AnimatedButton type="submit" className="w-full sm:w-auto">
                <Mail size={16} />
                Send Message
              </AnimatedButton>
            </form>
          )}
        </motion.div>
      </div>
      <Toast toasts={toasts} removeToast={removeToast} />
    </PageWrapper>
  );
}
