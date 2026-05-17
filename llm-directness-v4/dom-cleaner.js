// dom-cleaner.js
// Oculta la directiva inyectada en los mensajes del usuario que se muestran en la UI.
// El texto sigue enviándose al servidor; solo se oculta visualmente al usuario.

(function() {
  'use strict';

  const MARKERS = [
    'USER QUERY FOLLOWS:\n---\n',
    'USER QUERY FOLLOWS:\r\n---\r\n',
    '[SYSTEM OVERRIDE'
  ];

  // Selectores comunes para mensajes del usuario en cada sitio
  const USER_MESSAGE_SELECTORS = [
    '[data-message-author-role="user"]',                       // ChatGPT
    '[data-testid*="user-message"]',                            // ChatGPT alt
    'div.font-user-message',                                    // Claude
    '[data-testid="user-message"]',                             // Claude alt
    'user-query',                                               // Gemini
    'user-query-content',                                       // Gemini alt
    '.user-query-bubble-with-background',                       // Gemini alt 2
    '[class*="UserMessage"]',                                   // genérico
    '[class*="user-message"]',                                  // genérico
    '[class*="_user_"]',                                        // genérico
    '.user',                                                    // genérico simple
  ];

  function findUserMessages() {
    const found = new Set();
    for (const sel of USER_MESSAGE_SELECTORS) {
      try {
        document.querySelectorAll(sel).forEach(el => found.add(el));
      } catch (e) {}
    }
    return Array.from(found);
  }

  function extractUserQuery(text) {
    // Encuentra el delimitador y devuelve solo lo que va después
    for (const marker of MARKERS.slice(0, 2)) {
      const idx = text.indexOf(marker);
      if (idx >= 0) {
        return text.substring(idx + marker.length).trim();
      }
    }
    return null;
  }

  function cleanMessage(el) {
    if (el.getAttribute('data-llm-cleaned') === '1') return;
    const text = el.textContent || '';
    if (!text.includes('[SYSTEM OVERRIDE')) return;

    const userQuery = extractUserQuery(text);
    if (!userQuery) return;

    // Reemplazar el contenido del elemento con solo la consulta del usuario
    // Intentar preservar la estructura del DOM si es simple
    const allTextNodes = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node;
    while (node = walker.nextNode()) {
      allTextNodes.push(node);
    }

    if (allTextNodes.length === 1) {
      // Caso simple: un solo nodo de texto
      allTextNodes[0].textContent = userQuery;
    } else {
      // Caso complejo: rehacer el contenido
      // Limpiar todos los nodos de texto excepto el último, y poner la query ahí
      for (let i = 0; i < allTextNodes.length - 1; i++) {
        allTextNodes[i].textContent = '';
      }
      allTextNodes[allTextNodes.length - 1].textContent = userQuery;
    }

    el.setAttribute('data-llm-cleaned', '1');
  }

  function cleanAll() {
    const messages = findUserMessages();
    for (const msg of messages) {
      try { cleanMessage(msg); } catch (e) {}
    }
  }

  // Observar cambios en el DOM
  let scheduled = false;
  function scheduleClean() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => { scheduled = false; cleanAll(); }, 100);
  }

  const observer = new MutationObserver(scheduleClean);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
  }

  // Limpieza inicial periódica los primeros segundos
  cleanAll();
  setTimeout(cleanAll, 500);
  setTimeout(cleanAll, 1500);
  setTimeout(cleanAll, 3000);

  console.debug('[LLM-Direct] DOM cleaner active');
})();
