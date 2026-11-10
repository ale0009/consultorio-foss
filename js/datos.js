// Datos de la Rúbrica Científica Integral (RCI) y del Banco de Preguntas Diagnósticas.
// Todo proviene de la investigación original (tesis, Tabla 5.6.1, Tabla 5.6.2,
// Anexo H.1 y Apéndice A). Este archivo solo contiene datos; la lógica está en motor.js.

/** Los 12 criterios C1–C12 con su descripción y descriptores ancla (score 1 y score 5). */
export const CRITERIOS = [
  { id: 'C1', nombre: 'Licencia', descripcion: 'Tipo de licencia y libertades que otorga conforme a la definición FOSS.', critico: 'Licencia propietaria o con restricciones de uso.', excelente: 'GPL / MIT / Apache sin restricciones de uso ni distribución.' },
  { id: 'C2', nombre: 'Madurez', descripcion: 'Antigüedad del proyecto y estabilidad de la versión liberada.', critico: 'Proyecto con menos de 1 año, en versión alpha o beta.', excelente: 'Proyecto con más de 5 años, versión LTS activa y mantenida.' },
  { id: 'C3', nombre: 'Comunidad', descripcion: 'Tamaño, actividad y capacidad de respuesta de la comunidad.', critico: 'Comunidad inexistente o inactiva.', excelente: 'Más de 10 000 contribuidores y soporte en múltiples canales.' },
  { id: 'C4', nombre: 'Funcionalidad', descripcion: 'Cobertura porcentual de las necesidades funcionales del usuario.', critico: 'Cubre menos del 25 % de las funcionalidades requeridas.', excelente: 'Cubre el 90 % o más de las funcionalidades requeridas.' },
  { id: 'C5', nombre: 'Usabilidad', descripcion: 'Facilidad de uso e intuitividad de la interfaz.', critico: 'Curva de aprendizaje crítica, sin tutoriales en español.', excelente: 'Interfaz intuitiva con tutoriales y soporte en español.' },
  { id: 'C6', nombre: 'Interoperabilidad', descripcion: 'Compatibilidad con estándares y sistemas de terceros.', critico: 'Formatos cerrados, sin import/export, sin API.', excelente: 'Estándares abiertos, API REST documentada, integración nativa.' },
  { id: 'C7', nombre: 'Personalización', descripcion: 'Capacidad de adaptación y extensión al contexto organizacional.', critico: 'Software cerrado a configuración, sin plugins ni extensiones.', excelente: 'Arquitectura plug-in completa, scripting y modificación libre del código.' },
  { id: 'C8', nombre: 'Documentación', descripcion: 'Calidad, disponibilidad e idioma de la documentación técnica.', critico: 'Sin documentación oficial o incompleta.', excelente: 'Manual oficial, documentación técnica y guías en español con ejemplos.' },
  { id: 'C9', nombre: 'Seguridad', descripcion: 'Historial de vulnerabilidades (CVE) y política de parches.', critico: '5 o más CVE críticos abiertos o sin parches en el último año.', excelente: 'Sin CVE críticos pendientes; parches publicados en menos de 30 días.' },
  { id: 'C10', nombre: 'Escalabilidad', descripcion: 'Capacidad de crecimiento acorde al tamaño organizacional.', critico: 'Limitado a un solo usuario o instancia, sin clustering.', excelente: 'Soporta clusters, balanceo de carga y escalado horizontal nativo.' },
  { id: 'C11', nombre: 'Ciclo de vida', descripcion: 'Sostenibilidad y continuidad del proyecto a largo plazo.', critico: 'Sin roadmap público; sin financiamiento institucional.', excelente: 'Roadmap público con releases planificadas y respaldo institucional.' },
  { id: 'C12', nombre: 'Viabilidad', descripcion: 'Viabilidad de adopción en PYME considerando el costo total de propiedad (TCO).', critico: 'TCO superior a la alternativa propietaria.', excelente: 'TCO inferior al 30 % de la alternativa propietaria.' },
];

/**
 * Las 11 categorías del Banco de Preguntas Diagnósticas con su vector de
 * ponderación w_i (orden C1…C12). CAT1: Tabla 5.6.1; CAT2–CAT11: Anexo H.1.
 */
export const CATEGORIAS = [
  { id: 'CAT1', nombre: 'Ofimática y Productividad', preguntas: 26, pesos: [0.08, 0.08, 0.08, 0.09, 0.09, 0.09, 0.08, 0.08, 0.09, 0.08, 0.08, 0.08] },
  { id: 'CAT2', nombre: 'Educativo y Formación', preguntas: 25, pesos: [0.07, 0.08, 0.09, 0.10, 0.10, 0.08, 0.08, 0.10, 0.07, 0.08, 0.08, 0.07] },
  { id: 'CAT3', nombre: 'Seguridad y Datos Críticos', preguntas: 25, pesos: [0.09, 0.08, 0.07, 0.08, 0.06, 0.07, 0.06, 0.08, 0.15, 0.08, 0.10, 0.08] },
  { id: 'CAT4', nombre: 'Infraestructura y Servidores', preguntas: 24, pesos: [0.08, 0.09, 0.07, 0.08, 0.05, 0.09, 0.07, 0.07, 0.10, 0.12, 0.10, 0.08] },
  { id: 'CAT5', nombre: 'Desarrollo y Gestión de Proyectos', preguntas: 25, pesos: [0.08, 0.08, 0.10, 0.09, 0.07, 0.10, 0.10, 0.09, 0.08, 0.07, 0.08, 0.06] },
  { id: 'CAT6', nombre: 'Comunicación y Colaboración', preguntas: 25, pesos: [0.07, 0.08, 0.10, 0.09, 0.10, 0.10, 0.07, 0.08, 0.08, 0.09, 0.07, 0.07] },
  { id: 'CAT7', nombre: 'Diseño y Multimedia', preguntas: 25, pesos: [0.07, 0.08, 0.07, 0.10, 0.11, 0.09, 0.10, 0.09, 0.06, 0.07, 0.08, 0.08] },
  { id: 'CAT8', nombre: 'Bases de Datos y Análisis', preguntas: 25, pesos: [0.08, 0.10, 0.08, 0.09, 0.06, 0.09, 0.08, 0.08, 0.10, 0.10, 0.08, 0.06] },
  { id: 'CAT9', nombre: 'Finanzas y Contabilidad', preguntas: 25, pesos: [0.08, 0.10, 0.07, 0.10, 0.09, 0.08, 0.07, 0.08, 0.10, 0.07, 0.08, 0.08] },
  { id: 'CAT10', nombre: 'Comercio Electrónico y CRM', preguntas: 26, pesos: [0.08, 0.09, 0.08, 0.10, 0.10, 0.09, 0.08, 0.07, 0.09, 0.09, 0.07, 0.06] },
  { id: 'CAT11', nombre: 'Utilidades y Herramientas del Sistema', preguntas: 24, pesos: [0.08, 0.08, 0.07, 0.10, 0.10, 0.08, 0.10, 0.08, 0.07, 0.08, 0.08, 0.08] },
];

/**
 * Ejemplo precargado: LibreOffice en CAT1 con los porcentajes de respuestas
 * afirmativas por criterio usados en el caso de prueba CP-09 de la investigación.
 * En esta demo se convierten a la escala 1–5 con la fórmula 3.2. Es un ejemplo
 * ilustrativo, no una evaluación oficial del Consultorio.
 */
export const EJEMPLO_LIBREOFFICE = {
  nombre: 'LibreOffice',
  categoria: 'CAT1',
  porcentajes: [0.95, 0.88, 0.80, 0.92, 0.85, 0.78, 0.70, 0.82, 0.75, 0.72, 0.85, 0.68],
};

/**
 * Preguntas reales del Banco (Apéndice A), criterio C4 — Funcionalidad, una por
 * categoría. En el diagnóstico se leen como "¿Su organización necesita software que…?".
 */
export const PREGUNTAS_DIAGNOSTICO = [
  { codigo: 'P108', categoria: 'CAT1', texto: '¿Permite crear y editar documentos de texto?' },
  { codigo: 'P207', categoria: 'CAT2', texto: '¿Permite crear cursos con lecciones organizadas?' },
  { codigo: 'P307', categoria: 'CAT3', texto: '¿Permite asignar permisos diferenciados por usuario?' },
  { codigo: 'P407', categoria: 'CAT4', texto: '¿Incluye herramientas de monitoreo básicas?' },
  { codigo: 'P509', categoria: 'CAT5', texto: '¿Permite guardar o administrar versiones de archivos o código?' },
  { codigo: 'P609', categoria: 'CAT6', texto: '¿Permite crear conversaciones grupales?' },
  { codigo: 'P707', categoria: 'CAT7', texto: '¿Incluye las herramientas principales para su categoría (dibujo, foto, video, etc.)?' },
  { codigo: 'P807', categoria: 'CAT8', texto: '¿Permite consultas complejas?' },
  { codigo: 'P909', categoria: 'CAT9', texto: '¿Permite emitir facturación?' },
  { codigo: 'P1007', categoria: 'CAT10', texto: '¿Permite crear una tienda en línea?' },
];
