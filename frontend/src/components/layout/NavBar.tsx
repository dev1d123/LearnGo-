// src/components/layout/Header/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efecto para detectar scroll y cambiar estilo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navegación principal
  const mainNavItems = [
    { name: 'Summarizer', href: '/summarizer', icon: 'fas fa-file-alt' },
    { name: 'Practice', href: '/practice', icon: 'fas fa-dumbbell' },
    { name: 'Flashcards', href: '/flashcards', icon: 'fas fa-layer-group' },
    { name: 'LearningPath', href: '/learning-path', icon: 'fas fa-road' },
    { name: 'Learn&Play', href: '/learn-play', icon: 'fas fa-gamepad' },
  ];

  // Menú desplegable
  const dropdownItems = [
    { name: 'Community', href: '/community', icon: 'fas fa-users' },
    { name: 'MindMapper IA', href: '/mindmapper', icon: 'fas fa-brain' },
    { name: 'IA Analytics', href: '/analytics', icon: 'fas fa-chart-line' },
    { name: 'Exam', href: '/exam', icon: 'fas fa-file-signature' },
  ];

  // Cerrar menú móvil al hacer clic en un enlace
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-3 group"
              onClick={handleNavClick}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LearnGo!
              </span>
            </Link>
          </div>

          {/* Navegación Desktop - Centro */}
          <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:px-8">
            <div className="flex space-x-1 bg-gray-100/80 rounded-2xl p-1.5 backdrop-blur-sm">
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-white transition-all duration-300 group relative"
                >
                  <i className={`${item.icon} text-sm group-hover:text-blue-500 transition-colors duration-300`}></i>
                  <span className="font-medium text-sm">{item.name}</span>
                  
                  {/* Efecto de subrayado animado */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-500 transform -translate-x-1/2 group-hover:w-3/4 transition-all duration-300"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Navegación Desktop - Derecha */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            
            {/* Dropdown Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-gray-100/80">
                <i className="fas fa-ellipsis-h text-sm"></i>
                <span className="font-medium">More</span>
                <i className="fas fa-chevron-down text-xs transform group-hover:rotate-180 transition-transform duration-300"></i>
              </button>

              {/* Dropdown Content */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="p-2">
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 group"
                    >
                      <i className={`${item.icon} text-blue-500 group-hover:scale-110 transition-transform duration-300`}></i>
                      <span className="font-medium flex-1">{item.name}</span>
                      <i className="fas fa-arrow-right text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="w-px h-6 bg-gray-300/50"></div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all duration-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <span className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                }`}></span>
                <span className={`absolute w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute w-5 h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4 mt-2">
            
            {/* Main Navigation Mobile */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                Main Features
              </h3>
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group"
                >
                  <i className={`${item.icon} text-blue-500 w-5 text-center group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="font-medium flex-1">{item.name}</span>
                  <i className="fas fa-chevron-right text-xs text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300"></i>
                </Link>
              ))}
            </div>

            {/* Dropdown Items Mobile */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                More Tools
              </h3>
              {dropdownItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group"
                >
                  <i className={`${item.icon} text-purple-500 w-5 text-center group-hover:scale-110 transition-transform duration-300`}></i>
                  <span className="font-medium flex-1">{item.name}</span>
                  <i className="fas fa-arrow-right text-xs text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"></i>
                </Link>
              ))}
            </div>

            {/* Auth Buttons Mobile */}
            <div className="flex space-x-3 pt-4 border-t border-gray-200/50">
              <Link
                href="/login"
                onClick={handleNavClick}
                className="flex-1 text-center px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-100/80 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={handleNavClick}
                className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;