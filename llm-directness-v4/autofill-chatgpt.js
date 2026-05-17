// autofill-chatgpt.js
// Se ejecuta en chatgpt.com. Si encuentra un flag en storage, intenta abrir
// el modal de Personalization y rellenar el campo de "anything else".

(async function() {
  'use strict';

  const flag = await chrome.storage.local.get('autofill_chatgpt');
  if (!flag.autofill_chatgpt) return;

  const DIRECTIVE = flag.autofill_chatgpt;

  // Borrar flag para no reintentar
  await chrome.storage.local.remove('autofill_chatgpt');

  // Esperar a que cargue la UI
  await sleep(2000);

  // Notificar al usuario
  showBanner('Intentando configurar Custom Instructions automáticamente...');

  try {
    await openSettingsModal();
    await sleep(1500);
    await navigateToPersonalization();
    await sleep(1500);
    await openCustomInstructions();
    await sleep(1500);

    const filled = await fillTextareas(DIRECTIVE);
    if (!filled) {
      showBanner('No se encontró el campo. Pega manualmente la directiva (ya en portapapeles).', true);
      copyToClipboard(DIRECTIVE);
      return;
    }

    await sleep(500);
    const saved = await clickSave();
    if (saved) {
      showBanner('Custom Instructions guardadas correctamente ✓', false, 'green');
    } else {
      showBanner('Campo rellenado pero no se pudo guardar. Haz clic en Guardar manualmente.', true);
    }
  } catch (e) {
    showBanner('Autofill falló: ' + e.message + '. Texto copiado al portapapeles.', true);
    copyToClipboard(DIRECTIVE);
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function copyToClipboard(text) {
    try { navigator.clipboard.writeText(text); } catch (e) {}
  }

  function showBanner(msg, isError, color) {
    const existing = document.getElementById('llm-autofill-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'llm-autofill-banner';
    const bgColor = color === 'green' ? '#0a0' : (isError ? '#a00' : '#06c');
    banner.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${bgColor}; color: white; padding: 12px 20px;
      border-radius: 8px; font-family: sans-serif; font-size: 14px;
      z-index: 9999999; max-width: 80%; text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    banner.textContent = msg;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 8000);
  }

  // Intenta abrir el menú de usuario y settings
  async function openSettingsModal() {
    // Probar URL directa primero
    if (!location.hash.includes('settings')) {
      location.hash = '#settings/Personalization';
      await sleep(1000);
    }
    // Si el modal no apareció, intentar clicks
    if (!findModal()) {
      const userMenuSelectors = [
        '[data-testid="profile-button"]',
        'button[aria-label*="profile"]',
        'button[aria-label*="account"]',
        'button[aria-haspopup="menu"]'
      ];
      for (const sel of userMenuSelectors) {
        const btn = document.querySelector(sel);
        if (btn) { btn.click(); await sleep(500); break; }
      }
      const settingsItems = Array.from(document.querySelectorAll('[role="menuitem"], button'));
      const settings = settingsItems.find(el => /settings|configuración|ajustes/i.test(el.textContent || ''));
      if (settings) { settings.click(); await sleep(1000); }
    }
  }

  function findModal() {
    const candidates = document.querySelectorAll('[role="dialog"], [aria-modal="true"]');
    for (const c of candidates) {
      if (c.offsetParent !== null) return c;
    }
    return null;
  }

  async function navigateToPersonalization() {
    const modal = findModal();
    if (!modal) return;
    const tabs = modal.querySelectorAll('[role="tab"], button, [role="menuitem"]');
    for (const tab of tabs) {
      if (/personalization|personalización/i.test(tab.textContent || '')) {
        tab.click();
        return;
      }
    }
  }

  async function openCustomInstructions() {
    const modal = findModal();
    if (!modal) return;
    const buttons = modal.querySelectorAll('button, a');
    for (const btn of buttons) {
      const txt = (btn.textContent || '').toLowerCase();
      if (txt.includes('custom instructions') || 
          txt.includes('customize chatgpt') || 
          txt.includes('personalizar')) {
        btn.click();
        return;
      }
    }
  }

  async function fillTextareas(directive) {
    const modal = findModal() || document;
    const textareas = modal.querySelectorAll('textarea');
    if (textareas.length === 0) return false;

    let filled = false;
    // Estrategia: rellenar el último textarea visible (usualmente "anything else")
    // o cualquier textarea vacío
    for (let i = textareas.length - 1; i >= 0; i--) {
      const ta = textareas[i];
      if (ta.offsetParent === null) continue;
      if (ta.value && ta.value.trim().length > 100) continue; // ya tiene contenido largo

      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
      nativeSetter.call(ta, directive);
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      filled = true;
      break;
    }
    return filled;
  }

  async function clickSave() {
    const modal = findModal() || document;
    const buttons = modal.querySelectorAll('button');
    for (const btn of buttons) {
      const txt = (btn.textContent || '').toLowerCase().trim();
      if (txt === 'save' || txt === 'guardar' || txt === 'save changes') {
        if (btn.disabled) return false;
        btn.click();
        return true;
      }
    }
    return false;
  }
})();
