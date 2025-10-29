// src/components/layout/Footer/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections: FooterSection[] = [
    {
      title: 'Producto',
      links: [
        { href: '/summarizer', label: 'Summarizer' },
        { href: '/practice', label: 'Practice' },
        { href: '/flashcards', label: 'Flashcards' },
        { href: '/learn-play', label: 'Learn&Play' },
        { href: '/learning-path', label: 'Learning Path' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { href: '/how-it-works', label: '¿Cómo funciona?' },
        { href: '/blog', label: 'Blog' },
        { href: '/docs', label: 'Documentación' },
        { href: '/tutorials', label: 'Tutoriales' },
      ],
    },
    {
      title: 'Empresa',
      links: [
        { href: '/about', label: 'Nosotros' },
        { href: '/careers', label: 'Carreras' },
        { href: '/contact', label: 'Contacto' },
        { href: '/partners', label: 'Partners' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacidad' },
        { href: '/terms', label: 'Términos' },
        { href: '/cookies', label: 'Cookies' },
        { href: '/security', label: 'Seguridad' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/learngo',
      icon: 'fab fa-linkedin-in',
      color: 'hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/learngo',
      icon: 'fab fa-twitter',
      color: 'hover:bg-blue-400'
    },
    {
      name: 'GitHub',
      href: 'https://github.com/learngo',
      icon: 'fab fa-github',
      color: 'hover:bg-gray-700'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/learngo',
      icon: 'fab fa-instagram',
      color: 'hover:bg-pink-600'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/learngo',
      icon: 'fab fa-youtube',
      color: 'hover:bg-red-600'
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white mt-auto relative overflow-hidden">
      {/* Efecto de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Sección principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                LearnGo!
              </h3>
            </div>
            <p className="text-gray-300 text-lg mb-6 max-w-md leading-relaxed">
              Transformamos la manera de aprender con tecnología innovadora. 
              <span className="block mt-2 text-blue-300 font-semibold">
                ¡Aprende más rápido, recuerda por más tiempo!
              </span>
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 bg-gray-800 rounded-xl ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                  aria-label={`Síguenos en ${social.name}`}
                >
                  <i className={`${social.icon} text-white group-hover:text-white transition-colors duration-300`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links por sección */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-4">
            {footerSections.map((section, index) => (
              <div 
                key={section.title} 
                className="space-y-4 transform hover:translate-x-1 transition-transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                  <i className="fas fa-chevron-right text-blue-400 text-xs mr-2"></i>
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-circle text-blue-500 text-[6px] mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></i>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                          {link.external && (
                            <i className="fas fa-external-link-alt text-xs ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                          )}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                        >
                          <i className="fas fa-circle text-blue-500 text-[6px] mr-3 opacity-0 group-hover:opacity-100 transition-all duration-300"></i>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">
                            {link.label}
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Línea separadora con efecto */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">

          </div>
        </div>

        {/* Copyright y enlaces legales */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400">
            <i className="fas fa-copyright text-sm"></i>
            <p className="text-sm">
              {currentYear} <span className="text-blue-300 font-semibold">LearnGo!</span> Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            {['privacy', 'terms', 'cookies'].map((item) => (
              <Link 
                key={item}
                href={`/${item}`} 
                className="text-gray-400 hover:text-white text-sm transition-all duration-200 flex items-center group"
              >
                <i className="fas fa-shield-alt text-blue-400 text-xs mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                {item === 'privacy' ? 'Privacidad' : 
                 item === 'terms' ? 'Términos' : 'Cookies'}
              </Link>
            ))}
          </div>
        </div>

        {/* Badge de innovación */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-2 bg-blue-600/20 backdrop-blur-sm rounded-full px-4 py-2 border border-blue-500/30">
            <i className="fas fa-rocket text-blue-300 animate-bounce"></i>
            <span className="text-blue-200 text-sm font-medium">
              Innovando en educación desde 2025
            </span>
          </div>
        </div>
      </div>

      {/* Efectos de partículas decorativas */}
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </footer>
  );
};

export default Footer;