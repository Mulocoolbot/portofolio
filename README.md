# 🌌 3D Creative Portfolio & Experiment Lab

Website portofolio modern dengan visual 3D WebGL (Three.js & React Three Fiber), antarmuka bergaya cyberpunk/creative technologist ber-efek glassmorphism dan neon glow, serta laboratorium eksperimen 3D interaktif.

---

## 🚀 Fitur Utama

- **Interactive 3D Hero Scene**: Geometri 3D interaktif yang merespons pergerakan mouse/kursor pengguna secara halus dengan material dinamis, partikel galaksi, dan toggle wireframe.
- **3D Creative Experiment Lab ("Tempat Eksperimen")**: Halaman/playground khusus untuk menguji geometri 3D, memodifikasi kecepatan rotasi, palet warna neon, mode wireframe, serta melihat cuplikan kode React Three Fiber langsung.
- **Bento Grid Profil & Capabilities**: Menampilkan filosofi, keahlian teknis (dengan animasi persentase), statistik interaktif, dan riwayat karir.
- **Featured Projects Showcase**: Kartu proyek dengan efek tilt 3D, filter kategori (3D WebGL, Fullstack, AI & Audio, Creative), dan modal pop-up detail lengkap.
- **Micro-Interactions & Web Audio FX**: Efek audio futuristik sintetis (menggunakan Web Audio API murni tanpa file eksternal) dengan tombol mute/unmute.
- **Interactive Custom Cursor**: Kursor bersinar dengan animasi trailing ring pada desktop.
- **Contact Form & Confetti**: Formulir kontak interaktif dengan feedback animasi confetti.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Motion & UI Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## 📦 Cara Menjalankan Project

### 1. Buka Direktori Project
Buka terminal Anda dan masuk ke folder project:
```bash
cd /Users/mullo666/Documents/Job/Program/portofolio
```

### 2. Install Dependencies
Jalankan perintah berikut untuk menginstall seluruh paket dependensi:
```bash
npm install
```

### 3. Jalankan Server Development
Mulai local dev server:
```bash
npm run dev
```
Buka browser di `http://localhost:3000` untuk melihat website portofolio interaktif Anda!

---

## 📁 Struktur Direktori

```
portofolio/
├── src/
│   ├── components/
│   │   ├── 3d/                  # Komponen grafis 3D
│   │   │   ├── Hero3DCanvas.tsx        # Viewport Canvas utama
│   │   │   ├── InteractiveGeometry.tsx # Geometri 3D & deformasi
│   │   │   ├── ParticleField.tsx       # Sistem partikel stardust
│   │   │   └── FloatingShapes.tsx      # Elemen 3D mengambang
│   │   └── ui/                  # Komponen antarmuka pengguna
│   │       ├── Navbar.tsx              # Floating header
│   │       ├── HeroSection.tsx         # Hero banner
│   │       ├── AboutBento.tsx          # Bento grid profil & skills
│   │       ├── ProjectsSection.tsx     # Showcase proyek
│   │       ├── ProjectModal.tsx        # Modal detail proyek
│   │       ├── LabSection.tsx          # Playground eksperimen 3D
│   │       ├── ContactSection.tsx      # Formulir kontak & confetti
│   │       ├── CustomCursor.tsx        # Custom glowing cursor
│   │       ├── SoundEffects.tsx        # Web Audio API sintetis
│   │       └── Footer.tsx              # Footer
│   ├── data/
│   │   └── portfolioData.ts     # Seluruh data profil, skills, proyek & eksperimen
│   ├── types/
│   │   └── index.ts             # Definisi tipe TypeScript
│   ├── App.tsx                  # Komponen utama
│   ├── index.css                # Desain sistem & styling custom
│   └── main.tsx                 # Entrypoint aplikasi
├── index.html                   # HTML template & fonts
├── tailwind.config.js           # Konfigurasi tema warna & styling
└── package.json                 # Manifest dependensi
```

---

## 🧪 Cara Menambahkan Eksperimen 3D Baru

Untuk menambahkan eksperimen visual 3D baru ke dalam **Lab**:
1. Buka file `src/data/portfolioData.ts`.
2. Tambahkan preset baru ke array `experimentPresets`.
3. Anda juga dapat menambahkan model 3D custom (format `.glb` / `.gltf`) menggunakan hook `useGLTF` dari `@react-three/drei` di dalam `src/components/3d/InteractiveGeometry.tsx`!
