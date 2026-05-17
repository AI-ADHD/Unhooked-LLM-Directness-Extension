LLM DIRECTNESS MODE - v4
=========================

NUEVO EN ESTA VERSION:
1. Inyeccion INVISIBLE en el chat (se oculta visualmente despues de enviar)
2. Boton para auto-configurar ChatGPT Custom Instructions
3. Boton para auto-configurar Gemini Gem
4. Toggle ON/OFF de la inyeccion automatica
5. Boton para copiar directiva (Claude, configuracion manual)

INSTALACION
-----------
1. chrome://extensions/ → quitar versiones anteriores (v1, v2, v3)
2. Descomprimir el ZIP en el Escritorio
3. chrome://extensions/ → "Cargar descomprimida" → carpeta llm-directness-v4
4. RECARGAR las pestañas de los LLMs con Ctrl+F5

USO BASICO
----------
1. Click en el icono de la extension en la barra de Chrome
2. Para configurar Custom Instructions de UNA VEZ:
   - Click "Setup ChatGPT Custom Instructions" → se abre una pestaña, intenta rellenar, verifica que se guardo
   - Click "Setup Gemini Gem" → igual
   - Para Claude: click "Copiar directiva" y pega manualmente en Settings → Profile → Personalization
3. El toggle "Inyeccion automatica" controla si se sigue inyectando en el chat
   - Si configuraste Custom Instructions, puedes DESACTIVAR la inyeccion (es redundante)
   - Si no, dejalo activado

COMPORTAMIENTO POR SITIO
------------------------
✓ DeepSeek: inyeccion funciona, oculta visualmente
✓ ChatGPT: inyeccion + Custom Instructions (recomendado: solo Custom Instructions)
~ Claude: inyeccion parcial. Mejor copiar directiva y pegar manualmente
~ Gemini: inyeccion + Gem (recomendado: usar el Gem)
? Perplexity, Grok, Copilot, Meta AI: solo inyeccion, no probados

LIMITACIONES HONESTAS
---------------------
- El autofill de ChatGPT y Gemini puede fallar si actualizan su UI.
  Si falla, el script copia la directiva al portapapeles para que la
  pegues manualmente.
- La "invisibilidad" en el chat es solo visual. El texto SI se envia
  al servidor (sino, no funcionaria). Si recargas la conversacion,
  el texto puede volver a aparecer.
- Ningun modelo obedece la directiva al 100%. RLHF entrena cortesia
  a nivel profundo y un prompt solo la REDUCE, no la elimina.
- Para CONTROL TOTAL, lo mas efectivo es: configurar Custom Instructions
  en ChatGPT, crear Gem en Gemini, Project Instructions en Claude.
  La extension solo es util para sitios sin estas funciones.

DIAGNOSTICO
-----------
Si algo falla, abre la consola (F12 → Console) y busca mensajes [LLM-Direct].
El indicador inferior derecho muestra:
- "ON | I:X | J:Y" — extension activa, X intercepts, Y injections
- Amarillo = al menos una inyeccion exitosa
