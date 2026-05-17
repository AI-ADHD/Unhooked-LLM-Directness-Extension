document.getElementById('btn-chatgpt').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'setup_chatgpt' }, (resp) => {
    if (resp && resp.ok) window.close();
  });
});

document.getElementById('btn-gemini').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'setup_gemini' }, (resp) => {
    if (resp && resp.ok) window.close();
  });
});

document.getElementById('btn-claude').addEventListener('click', async () => {
  const resp = await chrome.runtime.sendMessage({ action: 'get_directive' });
  if (resp && resp.directive) {
    await navigator.clipboard.writeText(resp.directive);
    const btn = document.getElementById('btn-claude');
    btn.textContent = '✓ Copiado al portapapeles';
    setTimeout(() => {
      btn.textContent = '📋 Copiar directiva para Claude';
    }, 2000);
  }
});

// Toggle de inyección
const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

chrome.storage.local.get('inject_enabled', (data) => {
  const enabled = data.inject_enabled !== false;
  toggle.checked = enabled;
  updateStatus(enabled);
});

toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  await chrome.storage.local.set({ inject_enabled: enabled });
  updateStatus(enabled);

  // Notificar a las pestañas abiertas
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url && (
      tab.url.includes('chatgpt.com') || tab.url.includes('claude.ai') ||
      tab.url.includes('gemini.google.com') || tab.url.includes('deepseek.com') ||
      tab.url.includes('perplexity.ai') || tab.url.includes('grok.com') ||
      tab.url.includes('copilot.microsoft.com') || tab.url.includes('meta.ai')
    )) {
      try {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          world: 'MAIN',
          func: (en) => {
            try { localStorage.setItem('__llm_direct_enabled', en ? 'true' : 'false'); } catch (e) {}
            window.dispatchEvent(new CustomEvent('__llm_direct_toggle', { detail: { enabled: en } }));
          },
          args: [enabled]
        });
      } catch (e) {}
    }
  }
});

function updateStatus(enabled) {
  status.textContent = 'Estado: ' + (enabled ? 'ACTIVA' : 'PAUSADA');
  status.style.color = enabled ? '#0f0' : '#888';
}
