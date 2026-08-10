import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MessageSquare, Sparkles, Github, Linkedin, Twitter } from 'lucide-react';
import confetti from 'canvas-confetti';
import { personalInfo } from '../../data/portfolioData';
import { soundFX } from './SoundEffects';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    soundFX.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      soundFX.playSuccess();

      // Confetti Burst Effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#00f2fe', '#8a2be2', '#f72585', '#10b981']
        });
      } catch {
        // Confetti fallback
      }
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyber-cyan mb-4 backdrop-blur-md">
          <Mail className="w-3.5 h-3.5" />
          <span>START A CONVERSATION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Mari Wujudkan <span className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">Ide Hebat Anda</span>
        </h2>
        <p className="mt-4 text-slate-400 max-w-2xl text-sm sm:text-base">
          Tertarik membuat website 3D interaktif, produk visual digital, atau ingin berdiskusi seputar rekayasa frontend? Silakan hubungi saya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Info & Socials (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/10">
          <div>
            <span className="text-xs font-mono text-slate-500 block mb-2">DIRECT CONTACT</span>
            <h3 className="text-2xl font-bold text-white mb-4">
              Terbuka untuk peluang freelance & kolaborasi
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-8">
              Saya selalu bersemangat untuk mengeksplorasi tantangan baru di bidang web grafis 3D dan produk interaktif.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.socials.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-cyan/40 text-slate-200 hover:text-white transition-all text-xs sm:text-sm font-mono"
              >
                <div className="w-8 h-8 rounded-xl bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{personalInfo.socials.email}</span>
              </a>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs font-mono text-slate-300 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Waktu Respon Cepat (&lt;24 Jam)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <span className="text-xs font-mono text-slate-500 block mb-3">SOCIAL CHANNELS</span>
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyber-cyan transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyber-cyan transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-slate-300 hover:text-cyber-cyan transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Message Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-8 border border-white/10 relative">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Pesan Berhasil Terkirim!</h4>
              <p className="text-sm text-slate-300 max-w-md">
                Terima kasih telah menghubungi. Saya akan segera membalas pesan Anda secepatnya.
              </p>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors"
              >
                Kirim Pesan Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2">NAMA LENGKAP</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Alex Pratama"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2">EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-2">PESAN / DETAIL PROYEK</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan tentang proyek atau ide yang ingin Anda buat..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple text-black font-bold text-sm flex items-center justify-center gap-2 shadow-neon-cyan hover:shadow-neon-cyan/80 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Mengirimkan Pesan...</span>
                ) : (
                  <>
                    <span>Kirim Pesan Sekarang</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
