// autofill-gemini.js
// Se ejecuta en gemini.google.com. Si encuentra flag en storage, intenta
// rellenar el formulario de creación de Gem.

(async function() {
  'use strict';

  const flag = await chrome.storage.local.get('autofill_gemini');
  if (!flag.autofill_gemini) return;

  const DIRECTIVE = flag.autofill_gemini;
  await chrome.storage.local.remove('autofill_gemini');

  await sleep(2500);

  showBanner('Configurando Gem "Direct Mode" automáticamente...');

  try {
    // Buscar inputs/textareas
    await sleep(1500);
    const filled = await fillGemForm(DIRECTIVE);

    if (!filled) {
      showBanner('No se encontraron los campos. Copiado al portapapeles para pegar.', true);
      copyToClipboard(DIRECTIVE);
      return;
    }

    await sleep(800);
    const saved = await clickSaveGem();
    if (saved) {
      showBanner('Gem guardado correctamente. Selecciónalo antes de chatear.', false, 'green');
    } else {
      showBanner('Formulario relleno. Haz clic en Guardar manualmente.', true);
    }
  } catch (e) {
    showBanner('Autofill falló: ' + e.message + '. Texto en portapapeles.', true);
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

  async function fillGemForm(directive) {
    // Gemini usa varios <input> y <textarea> o contenteditable
    const nameInput = findVisible('input[aria-label*="ame"], input[placeholder*="ame"], input[type="text"]');
    if (nameInput) {
      setNativeValue(nameInput, 'Direct Mode');
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Buscar el campo de instrucciones (suele ser un textarea grande o contenteditable)
    const instructionsField = findInstructionsField();
    if (!instructionsField) return false;

    if (instructionsField.tagName === 'TEXTAREA') {
      setNativeValue(instructionsField, directive);
      instructionsField.dispatchEvent(new Event('input', { bubbles: true }));
      instructionsField.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // contenteditable
      instructionsField.focus();
      instructionsField.innerText = directive;
      instructionsField.dispatchEvent(new InputEvent('input', { bubbles: true, data: directive, inputType: 'insertText' }));
    }

    return true;
  }

  function findInstructionsField() {
    // Probar varios selectores
    const candidates = [
      ...document.querySelectorAll('textarea'),
      ...document.querySelectorAll('[contenteditable="true"]'),
      ...document.querySelectorAll('[role="textbox"]')
    ];
    // Filtrar visibles y de tamaño grande (instrucciones es el campo más grande)
    const visible = candidates.filter(el => el.offsetParent !== null);
    if (visible.length === 0) return null;
    // Ordenar por área visible descendente
    visible.sort((a, b) => (b.offsetHeight * b.offsetWidth) - (a.offsetHeight * a.offsetWidth));
    return visible[0];
  }

  function findVisible(selector) {
    const els = document.querySelectorAll(selector);
    for (const el of els) if (el.offsetParent !== null) return el;
    return null;
  }

  function setNativeValue(element, value) {
    const setter = element.tagName === 'TEXTAREA'
      ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
      : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(element, value);
  }

  async function clickSaveGem() {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const txt = (btn.textContent || '').toLowerCase().trim();
      if (txt === 'save' || txt === 'guardar' || txt === 'update' || txt === 'actualizar') {
        if (btn.disabled || btn.offsetParent === null) continue;
        btn.click();
        return true;
      }
    }
    return false;
  }
})();
