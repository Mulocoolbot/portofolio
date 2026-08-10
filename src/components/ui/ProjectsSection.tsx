import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { projectsData } from '../../data/portfolioData';
import { Project } from '../../types';
import { ProjectModal } from './ProjectModal';
import { soundFX } from './SoundEffects';

export const ProjectsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: '3d-web', label: '3D WebGL' },
    { id: 'fullstack', label: 'Fullstack Apps' },
    { id: 'ai-experiment', label: 'AI & Audio' },
    { id: 'creative', label: 'Creative Tech' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header with Dynamic 3D Inversion */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="blend-invert inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-mono font-bold mb-4 shadow-sm backdrop-blur-xs">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>FEATURED CREATIONS</span>
        </div>
        <h2 className="blend-invert text-3xl sm:text-5xl font-extrabold tracking-tight select-none">
          Karya Pilihan &amp; Proyek Inovatif
        </h2>
        <p className="blend-invert mt-4 max-w-2xl text-sm sm:text-base font-medium select-none">
          Koleksi proyek pilihan yang memadukan rekayasa perangkat lunak modern, animasi 3D, dan antarmuka masa depan.
        </p>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFX.playClick();
                setSelectedCategory(cat.id);
              }}
              onMouseEnter={() => soundFX.playHover()}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-white border border-cyan-500/30 shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            onClick={() => {
              soundFX.playClick();
              setActiveModalProject(project);
            }}
            className="group cursor-pointer glass-panel rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
          >
            {/* Image Container with 3D Hover Scale */}
            <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-white/5">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
              
              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/50 border border-white/15 text-[11px] font-mono text-white/80 font-bold shadow-sm backdrop-blur-md">
                  {project.category}
                </span>
              </div>

              {/* View Details Hover Badge */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white/60 group-hover:text-white group-hover:bg-cyan-500/30 group-hover:border-cyan-500/40 transition-all shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs font-mono text-white/40 font-medium mt-1">
                  {project.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-white/50 mt-3 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags & Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-white/60 font-medium border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[10px] font-mono text-white/30 font-semibold self-center">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-cyan-400 font-bold group-hover:underline">
                  Detail &amp; Preview →
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Detail Modal Component */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
