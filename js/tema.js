// Botón de tema claro / oscuro, compartido por la herramienta y por /proceso/.
export function iniciarTema() {
  const boton = document.querySelector('.boton-tema');
  if (!boton) return;
  const raiz = document.documentElement;
  const oscuroSistema = () => window.matchMedia('(prefers-color-scheme: dark)').matches;
  const esOscuro = () => (raiz.dataset.theme ? raiz.dataset.theme === 'dark' : oscuroSistema());
  const pintar = () => {
    boton.setAttribute('aria-label', esOscuro() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    boton.setAttribute('aria-pressed', String(esOscuro()));
  };
  boton.addEventListener('click', () => {
    raiz.dataset.theme = esOscuro() ? 'light' : 'dark';
    try { localStorage.setItem('tema', raiz.dataset.theme); } catch (e) { /* sin almacenamiento */ }
    pintar();
  });
  pintar();
}
