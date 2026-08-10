import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Sparkles, Github, Linkedin, Twitter } from 'lucide-react';
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
          colors: ['#18181b', '#52525b', '#71717a', '#a1a1aa']
        });
      } catch {
        // Confetti fallback
      }
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header with Dynamic 3D Inversion */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="blend-invert inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold mb-4 shadow-sm backdrop-blur-xs">
          <Mail className="w-3.5 h-3.5" />
          <span>START A CONVERSATION</span>
        </div>
        <h2 className="blend-invert text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
          Mari Wujudkan Ide Hebat Anda
        </h2>
        <p className="blend-invert mt-4 max-w-2xl text-sm sm:text-base font-medium select-none">
          Tertarik membuat website 3D interaktif, produk visual digital, atau ingin berdiskusi seputar rekayasa frontend? Silakan hubungi saya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Info & Socials (5 cols) */}
        <div className="lg:col-span-5 glass-panel bg-white/85 rounded-3xl p-8 flex flex-col justify-between border border-neutral-300 shadow-sm">
          <div>
            <span className="text-xs font-mono text-neutral-500 font-bold block mb-2">DIRECT CONTACT</span>
            <h3 className="text-2xl font-bold text-neutral-950 mb-4">
              Terbuka untuk peluang freelance &amp; kolaborasi
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed mb-8">
              Saya selalu bersemangat untuk mengeksplorasi tantangan baru di bidang web grafis 3D dan produk interaktif.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.socials.email}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-300 hover:border-neutral-900 text-neutral-800 hover:text-neutral-950 transition-all text-xs sm:text-sm font-mono font-medium"
              >
                <div className="w-8 h-8 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-900">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{personalInfo.socials.email}</span>
              </a>

              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-neutral-800 font-medium flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span>Waktu Respon Cepat (&lt;24 Jam)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <span className="text-xs font-mono text-neutral-500 font-bold block mb-3">SOCIAL CHANNELS</span>
            <div className="flex items-center gap-3">
              <a
                href={personalInfo.socials.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all shadow-sm"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all shadow-sm"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={personalInfo.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white border border-neutral-300 flex items-center justify-center text-neutral-800 transition-all shadow-sm"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Message Form (7 cols) */}
        <div className="lg:col-span-7 glass-panel bg-white/85 rounded-3xl p-8 border border-neutral-300 shadow-sm relative">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold text-neutral-950 mb-2">Pesan Berhasil Terkirim!</h4>
              <p className="text-sm text-neutral-700 max-w-md">
                Terima kasih telah menghubungi. Saya akan segera membalas pesan Anda secepatnya.
              </p>
              <button
                onClick={() => {
                  soundFX.playClick();
                  setSubmitted(false);
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="mt-6 px-6 py-2.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-mono text-neutral-800 font-bold hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Kirim Pesan Lainnya
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-neutral-900 font-bold block mb-2">NAMA LENGKAP</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Alex Pratama"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-900 font-bold block mb-2">EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-900 font-bold block mb-2">PESAN / DETAIL PROYEK</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan tentang proyek atau ide yang ingin Anda buat..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-300 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-neutral-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-neutral-800 transition-all disabled:opacity-50"
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
