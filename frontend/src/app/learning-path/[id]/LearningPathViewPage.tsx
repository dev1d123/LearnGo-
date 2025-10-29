'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, BookOpen, Target, Trophy, Award, Brain } from 'lucide-react';
import { getLearningPathById } from '@/resources/files/mockLearningPaths';
import type { LearningPath, Module, Session } from '@/types/LearningPath';

export default function LearningPathViewPage() {
  const params = useParams();
  const router = useRouter();
  const [pathData, setPathData] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cargar learning path desde mock data
    const loadLearningPath = async () => {
      setIsLoading(true);
      
      // Simular delay de carga
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const pathId = params?.id as string;
      const data = getLearningPathById(pathId);
      
      if (data) {
        setPathData(data);
        // Expandir el primer módulo por defecto
        setExpandedModules(new Set([data.modules[0]?.id]));
      }
      
      setIsLoading(false);
    };

    loadLearningPath();
  }, [params?.id]);

  // Toggle módulo expandido/colapsado
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Navegar a sesión
  const handleSessionClick = (moduleId: string, sessionId: string) => {
    // TODO: Implementar navegación a la página de práctica de sesión
    console.log(`Navegar a sesión: ${sessionId} del módulo: ${moduleId}`);
    router.push(`/learning-path/${params?.id}/session/${sessionId}`);
  };

  // Navegar a evaluación final
  const handleAssessmentClick = () => {
    console.log('Navegar a evaluación final del Learning Path');
    router.push(`/learning-path/${params?.id}/assessment`);
  };

  // Calcular progreso del learning path
  const calculatePathProgress = () => {
    if (!pathData) return 0;
    const totalSessions = pathData.modules.reduce((acc, m) => acc + m.sessions.length, 0);
    if (totalSessions === 0) return 0;
    const sessionsWithContent = pathData.modules.reduce((acc, m) => 
      acc + m.sessions.filter(s => s.topics.length > 0).length, 0
    );
    return Math.round((sessionsWithContent / totalSessions) * 100);
  };

  // Calcular progreso de un módulo
  const calculateModuleProgress = (module: Module) => {
    if (module.sessions.length === 0) return 0;
    const sessionsWithContent = module.sessions.filter(s => s.topics.length > 0).length;
    return Math.round((sessionsWithContent / module.sessions.length) * 100);
  };

  // Calcular total de sesiones
  const getTotalSessions = () => {
    if (!pathData) return 0;
    return pathData.modules.reduce((acc, mod) => acc + mod.sessions.length, 0);
  };

  // Calcular sesiones completadas
  const getCompletedSessions = () => {
    if (!pathData) return 0;
    return pathData.modules.reduce((acc: number, mod: Module) => 
      acc + mod.sessions.filter((s: Session) => s.topics.length > 0).length, 0
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando Learning Path...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Learning Path no encontrado</h2>
          <p className="text-gray-600">El Learning Path que buscas no existe o fue eliminado.</p>
        </div>
      </div>
    );
  }

  const pathProgress = calculatePathProgress();
  const totalSessions = getTotalSessions();
  const completedSessions = getCompletedSessions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header con información del Learning Path */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {pathData.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{pathData.description}</p>
              
              {/* Metadatos */}
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {pathData.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {pathData.modules.length} Módulos
                </span>
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {totalSessions} Sesiones
                </span>
              </div>
            </div>
          </div>

          {/* Progreso General del Learning Path */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso General</span>
              <span className="text-sm font-bold text-gray-800">{pathProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${pathProgress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{completedSessions} de {totalSessions} sesiones completadas</span>
              {pathProgress === 100 && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <Trophy className="w-4 h-4" />
                  ¡Completado!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lista de Módulos */}
        <div className="space-y-4">
          {pathData.modules.map((module) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleProgress = calculateModuleProgress(module);
            
            return (
              <div
                key={module.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
              >
                {/* Header del Módulo */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Icono de estado con ícono de libro */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      moduleProgress === 100
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                    }`}>
                      {moduleProgress === 100 ? (
                        <Trophy className="w-6 h-6" />
                      ) : (
                        <BookOpen className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Información del módulo */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {module.name}
                        </h3>
                        {moduleProgress === 100 && (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{module.description}</p>
                      
                      {/* Barra de progreso del módulo */}
                      <div className="mt-3 max-w-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">
                            {module.sessions.filter(s => s.topics.length > 0).length}/{module.sessions.length} sesiones
                          </span>
                          <span className="text-xs font-medium text-gray-700">{moduleProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              moduleProgress === 100
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600'
                            }`}
                            style={{ width: `${moduleProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icono de expandir/colapsar */}
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Lista de Sesiones (colapsable con animación) */}
                <div 
                  className={`border-t border-gray-200 bg-gray-50 overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 space-y-2">
                    {module.sessions.map((session, index) => (
                      <div
                        key={session.id}
                        className={`transform transition-all duration-300 ease-out ${
                          isExpanded 
                            ? 'translate-y-0 opacity-100' 
                            : '-translate-y-4 opacity-0'
                        }`}
                        style={{ 
                          transitionDelay: isExpanded ? `${index * 50}ms` : '0ms' 
                        }}
                      >
                        <button
                          onClick={() => handleSessionClick(module.id, session.id)}
                          className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
                        >
                          {/* Icono de estado de sesión */}
                          <div className="flex-shrink-0">
                            {session.topics.length > 0 ? (
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300 group-hover:text-blue-500 transition-colors" />
                            )}
                          </div>

                          {/* Información de sesión */}
                          <div className="flex-1 text-left">
                            <h4 className={`font-medium ${
                              session.topics.length > 0 ? 'text-gray-700' : 'text-gray-800'
                            } group-hover:text-blue-600 transition-colors`}>
                              {session.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                            
                            {/* Contador de temas */}
                            {session.topics.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span className="font-medium">{session.topics.length} temas</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Duración */}
                          <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration}</span>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sección de Evaluación Final */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Icono y texto */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Evalúa tus Conocimientos
                </h3>
                <p className="text-purple-100 text-sm md:text-base">
                  Pon a prueba todo lo que has aprendido con una evaluación completa del Learning Path. 
                  Demuestra tu dominio del tema y obtén tu certificación.
                </p>
                
                {/* Estadísticas rápidas */}
                <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Brain className="w-4 h-4 text-purple-100" />
                    <span className="text-sm text-white font-medium">Evaluación Integral</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-purple-100" />
                    <span className="text-sm text-white font-medium">~30 minutos</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Trophy className="w-4 h-4 text-purple-100" />
                    <span className="text-sm text-white font-medium">Certificado al aprobar</span>
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleAssessmentClick}
                  className="group relative px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Comenzar Evaluación
                    <ChevronDown className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>

            {/* Barra de progreso de preparación */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Preparación para la evaluación</span>
                <span className="text-sm font-bold text-white">{pathProgress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${pathProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-purple-100 mt-2">
                {pathProgress >= 80 
                  ? '¡Estás listo para la evaluación! Has completado la mayor parte del contenido.' 
                  : pathProgress >= 50
                  ? 'Buen progreso. Completa más sesiones para estar mejor preparado.'
                  : 'Sigue avanzando en los módulos para estar mejor preparado para la evaluación.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer con estadísticas */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas de Progreso</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600">{pathData.modules.length}</div>
              <div className="text-sm text-gray-600 mt-1">Módulos Totales</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-3xl font-bold text-purple-600">{completedSessions}</div>
              <div className="text-sm text-gray-600 mt-1">Sesiones Completadas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-3xl font-bold text-green-600">{pathProgress}%</div>
              <div className="text-sm text-gray-600 mt-1">Progreso Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
