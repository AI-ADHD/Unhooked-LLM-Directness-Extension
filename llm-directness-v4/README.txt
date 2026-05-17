LLM DIRECTNESS MODE - v4
=========================

NEW IN THIS VERSION:
1. INVISIBLE chat injection (visually hidden after sending)
2. Auto-configure button for ChatGPT Custom Instructions
3. Auto-configure button for Gemini Gem
4. ON/OFF toggle for automatic injection
5. Copy directive button (for Claude, manual configuration)

INSTALLATION
-----------
1. Go to chrome://extensions/ → remove previous versions (v1, v2, v3)
2. Unzip the ZIP file onto your Desktop
3. Go to chrome://extensions/ → click "Load unpacked" → select the llm-directness-v4 folder
4. REFRESH your active LLM tabs using Ctrl+F5

BASIC USAGE
-----------
1. Click the extension icon in the Chrome toolbar.
2. To configure Custom Instructions PERMANENTLY:
   - Click "Setup ChatGPT Custom Instructions" → a new tab will open, auto-fill will trigger, verify that it saved.
   - Click "Setup Gemini Gem" → identical workflow.
   - For Claude: click "Copy directive" and paste it manually into Settings → Profile → Personalization.
3. The "Automatic injection" toggle controls ongoing chat injections:
   - If you configured Custom Instructions, you can DISABLE the injection toggle (it becomes redundant).
   - If not, keep it enabled.

PLATFORM BEHAVIOR
-----------------
✓ DeepSeek: injection functional, visually hidden
✓ ChatGPT: injection + Custom Instructions (recommended: Custom Instructions only)
~ Claude: partial injection. Best practice: copy directive and paste manually
~ Gemini: injection + Gem (recommended: use the Gem)
? Perplexity, Grok, Copilot, Meta AI: injection only, untested

HONEST LIMITATIONS
------------------
- The auto-fill feature for ChatGPT and Gemini may break if they update their UI. 
  If it fails, the script copies the directive to your clipboard as a fallback for manual pasting.
- The chat "invisibility" feature is strictly cosmetic. The text IS sent to the server (otherwise, it would not work). If you reload the conversation, the text may reappear briefly.
- No model obeys the directive 100% of the time. RLHF deeply reinforces politeness training; a prompt only REDUCES it, it does not eliminate it.
- For MAXIMUM CONTROL, the most effective workflow is: configure Custom Instructions in ChatGPT, create a Gem in Gemini, and setup Project Instructions in Claude. The extension's injection feature is primarily useful for sites lacking these native options.

DIAGNOSTICS
-----------
If an issue occurs, open the developer console (F12 → Console) and look for [LLM-Direct] logs.
The bottom-right indicator status means:
- "ON | I:X | J:Y" — extension active, X intercepts, Y injections
- Yellow color = at least one successful injection completed
- Amarillo = al menos una inyeccion exitosa
