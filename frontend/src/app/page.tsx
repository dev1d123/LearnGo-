'use client';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useFrame } from '@react-three/fiber';

// Lazy-load 3D components client-side
const Canvas = dynamic(() => import('@react-three/fiber').then(m => m.Canvas), { ssr: false }) as unknown as React.ComponentType<any>;
const OrbitControls = dynamic(() => import('@react-three/drei').then(m => m.OrbitControls), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(m => m.Float), { ssr: false });
const Stars = dynamic(() => import('@react-three/drei').then(m => m.Stars), { ssr: false });
const Sparkles = dynamic(() => import('@react-three/drei').then(m => m.Sparkles), { ssr: false });
const EffectComposer = dynamic(() => import('@react-three/postprocessing').then(m => m.EffectComposer), { ssr: false });
const Bloom = dynamic(() => import('@react-three/postprocessing').then(m => m.Bloom), { ssr: false });
const Vignette = dynamic(() => import('@react-three/postprocessing').then(m => m.Vignette), { ssr: false });

// For animation frames in R3F helpers

function TorusKnot() {
  const ref = useRef<any>(null);
  useFrame((_state: any, delta: number) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.35;
    ref.current.rotation.y += delta * 0.25;
    const s = 1 + Math.sin(performance.now() / 800) * 0.06;
    ref.current.scale.set(s, s, s);
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <torusKnotGeometry args={[1.25, 0.3, 300, 48, 2, 3]} />
      <meshStandardMaterial color={'#22d3ee'} metalness={0.6} roughness={0.15} emissive={'#22d3ee'} emissiveIntensity={0.7} />
    </mesh>
  );
}

function Blob() {
  return (
    <Float speed={1.8} rotationIntensity={1.2} floatIntensity={2.2}>
      <mesh position={[-2.6, 0.6, -0.6]}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color={'#a78bfa'} metalness={0.45} roughness={0.25} emissive={'#a78bfa'} emissiveIntensity={0.45} />
      </mesh>
    </Float>
  );
}

function WireSphere() {
  const ref = useRef<any>(null);
  useFrame((_state: any, delta: number) => {
    if (!ref.current) return;
    ref.current.rotation.z -= delta * 0.3;
  });
  return (
    <mesh ref={ref} position={[2.9, -0.2, 0]}>
      <sphereGeometry args={[1.15, 64, 64]} />
      <meshStandardMaterial color={'#60a5fa'} wireframe metalness={0.15} roughness={0.9} />
    </mesh>
  );
}

function ScrollIndicator() {
  return (
    <div className="relative inline-flex items-center justify-center h-10 w-6 rounded-full border border-white/30 mt-16">
      <motion.span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-white"
        animate={{ y: [0, 18, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ top: 6 }}
      />
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Wheel -> scroll to next section
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        document.getElementById('info')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[100svh] overflow-hidden text-white bg-gradient-to-b from-sky-950 via-blue-950 to-black"
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'radial-gradient(60% 50% at 50% 40%, black, transparent 75%)',
          maskImage: 'radial-gradient(60% 50% at 50% 40%, black, transparent 75%)',
        }}
      />

      {/* Animated conic glow for dramatic effect */}
      <motion.div
        className="pointer-events-none absolute -inset-[10%] -z-20 blur-3xl opacity-60"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.22), rgba(168,85,247,0.18), rgba(34,197,94,0.18), rgba(56,189,248,0.22))'
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Vignette glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" style={{
        background: 'radial-gradient(60% 40% at 50% 30%, rgba(56,189,248,0.28), transparent 60%)'
      }} />

      <div className="absolute inset-0 -z-10">
        {mounted && (
          <Suspense fallback={null}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true }} camera={{ position: [0, 0, 6.2], fov: 60 }}>
              <color attach="background" args={[0, 0, 0]} />
              <ambientLight intensity={0.9} />
              <spotLight position={[6, 8, 4]} angle={0.7} penumbra={0.65} intensity={1.8} color={'#7dd3fc'} />
              <pointLight position={[-6, -4, 3]} intensity={1.1} color={'#a78bfa'} />
              <pointLight position={[0, 3, -3]} intensity={0.6} color={'#22c55e'} />

              {/* Background stars + sparkles */}
              <Stars radius={90} depth={60} count={3200} factor={3.8} saturation={0} fade speed={1} />
              <Sparkles count={220} scale={[12, 7, 7]} size={2.2} speed={0.55} color={'white'} opacity={0.95} />
              <Sparkles count={120} scale={[8, 5, 5]} size={1.6} speed={0.7} color={'#22d3ee'} opacity={0.6} />

              {/* Centerpiece + accents */}
              <TorusKnot />
              <Blob />
              <WireSphere />

              {/* Postprocessing for glow and depth */}
              <EffectComposer>
                <Bloom mipmapBlur intensity={1.25} luminanceThreshold={0.18} luminanceSmoothing={0.35} radius={0.9} />
                <Vignette eskil={false} offset={0.25} darkness={0.85} />
              </EffectComposer>

              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.6} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/10 backdrop-blur-md"
        >
          Nuevo • Tutor IA Multimodular
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-5 max-w-5xl text-4xl md:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_22px_rgba(34,211,238,0.55)]"
        >
          Aprende más rápido con un Tutor IA que te guía, practica y juega
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-2xl text-base md:text-lg text-white/90"
        >
          Unifica resúmenes, práctica guiada, tarjetas, rutas de aprendizaje y minijuegos en un solo lugar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <a
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-900 font-semibold px-5 py-2.5 shadow-lg shadow-cyan-500/20 ring-1 ring-white/10 hover:from-cyan-300 hover:to-sky-400"
          >
            Explorar módulos
          </a>
          <a
            href="#how"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 text-white font-medium px-5 py-2.5 ring-1 ring-white/20 hover:bg-white/15"
          >
            Cómo se usa
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left w-full max-w-4xl"
        >
          <div className="rounded-lg bg-slate-800/40 p-4 ring-1 ring-white/10">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Módulos</span>
            <span className="block text-xl font-bold">5</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 ring-1 ring-white/10">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Estudiantes</span>
            <span className="block text-xl font-bold">+1K</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 ring-1 ring-white/10">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Ahorro de tiempo</span>
            <span className="block text-xl font-bold">~60%</span>
          </div>
          <div className="rounded-lg bg-slate-800/40 p-4 ring-1 ring-white/10">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Soporte</span>
            <span className="block text-xl font-bold">24/7</span>
          </div>
        </motion.div>

        <button aria-label="Desplazar a la siguiente sección" onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}>
          <ScrollIndicator />
        </button>
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section id="info" className="py-20 md:py-28 container mx-auto px-6 bg-slate-950">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-xl bg-slate-800/40 p-6 ring-1 ring-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-semibold">¿Qué hace tu proyecto?</h3>
          <p className="text-slate-300 leading-relaxed">
            Es un Tutor mediante IA que integra cinco módulos: Resúmenes (Summarizer), Práctica guiada (Practice), Tarjetas (FlashCards), Rutas personalizadas (LearningPath) y juegos generados por IA (LearnPlay).
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.05 }} className="rounded-xl bg-slate-800/40 p-6 ring-1 ring-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-semibold">¿A quién ayuda?</h3>
          <p className="text-slate-300 leading-relaxed">
            A estudiantes de diversas áreas. Incluimos menús con opciones guiadas para evitar prompts complejos y acelerar su flujo de estudio.
          </p>
        </motion.div>
        <motion.div id="how" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="rounded-xl bg-slate-800/40 p-6 ring-1 ring-white/10 backdrop-blur-sm">
          <h3 className="text-xl font-semibold">¿Cómo se usa?</h3>
          <ol className="list-decimal list-inside text-slate-200 space-y-2">
            <li>Elige un módulo (p.ej., Summarizer o Practice).</li>
            <li>Sube tu material o pega el contenido.</li>
            <li>Selecciona objetivo (resumir, practicar, memorizar, planificar o jugar).</li>
            <li>La IA genera contenido y te guía con pasos claros y medibles.</li>
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="py-20 md:py-28 container mx-auto px-6 bg-slate-950">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl md:text-3xl font-bold">Problema y solución</h3>
          <p className="text-slate-300 leading-relaxed">
            Estudiar con múltiples herramientas dispersas fragmenta la atención y aumenta el tiempo invertido. Nuestra solución reúne todo en una sola experiencia coherente: resume, practica, memoriza y juega con el mismo contexto; además, genera rutas de aprendizaje adaptadas.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="rounded-xl bg-slate-800/30 ring-1 ring-white/10 overflow-hidden">
          {/* Imagen sugerida: problem-solution-graphic.png */}
          <img src="/images/problem-solution-graphic.png" alt="Problema y solución" className="w-full h-64 object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { key: 'summarizer', title: 'Summarizer', desc: 'Convierte textos densos en ideas clave y resúmenes accionables.', img: '/images/feature-summarizer.gif' },
    { key: 'practice', title: 'Practice', desc: 'Ejercicios generados por IA con feedback inmediato.', img: '/images/feature-practice.gif' },
    { key: 'flashcards', title: 'FlashCards', desc: 'Tarjetas inteligentes con repetición espaciada.', img: '/images/feature-flashcards.gif' },
    { key: 'learningpath', title: 'LearningPath', desc: 'Ruta personalizada según tu nivel y meta.', img: '/images/feature-learningpath.gif' },
    { key: 'learnplay', title: 'LearnPlay', desc: 'Minijuegos generados por IA para aprender jugando.', img: '/images/feature-learnplay.gif' },
  ];
  return (
    <section id="features" className="py-20 md:py-28 container mx-auto px-6 bg-slate-950">
      <h3 className="text-2xl md:text-3xl font-bold text-center">Características principales</h3>
      <p className="text-center text-slate-400 max-w-2xl mx-auto">
        Diseñadas para mantenerte en flujo: aprende, practica y juega sin cambiar de contexto.
      </p>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <motion.div key={f.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl bg-slate-800/40 p-6 ring-1 ring-white/10 backdrop-blur-sm hover:translate-y-[-2px] transition-transform">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-slate-800/30 ring-1 ring-white/10">
              {/* Reemplaza por el GIF o imagen sugerida */}
              <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 text-lg font-semibold">{f.title}</h4>
            <p className="text-slate-300 leading-relaxed mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    { name: 'Integrante 1', role: 'IA / Backend', img: '/images/team-1.jpg' },
    { name: 'Integrante 2', role: 'Frontend / UX', img: '/images/team-2.jpg' },
    { name: 'Integrante 3', role: 'PM / Investigación', img: '/images/team-3.jpg' },
  ];
  return (
    <section id="team" className="py-20 md:py-28 container mx-auto px-6 bg-slate-950">
      <h3 className="text-2xl md:text-3xl font-bold text-center">El equipo</h3>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {team.map(m => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-xl bg-slate-800/40 p-6 ring-1 ring-white/10 text-center">
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-1 ring-white/15">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-3 font-semibold">{m.name}</h4>
            <p className="text-slate-400 text-sm">{m.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative bg-slate-950 text-white">
        <HeroSection />
        <InfoSection />
        <FeaturesSection />
        <ProblemSection />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
