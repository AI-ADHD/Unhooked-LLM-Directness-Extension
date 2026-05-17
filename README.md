# Unhooked — LLM Directness Extension

A Chrome extension that strips engagement-bait behavior from AI chat interfaces.
Free. Open-source. No telemetry. No accounts.

---

## What it does

Modern AI chatbots are trained to maximize engagement: warm tone, empathy, validation, follow-up hooks, "great question," enthusiasm markers. For most people that's harmless. For users with ADHD, OCD, anxiety, or compulsive screen-use patterns, it can turn a quick question into a three-hour conversation.

This extension applies a "directness directive" to every outgoing chat message on supported AI platforms. The directive instructs the model to:

*   Drop empathy simulation, validation, and personality mirroring.
*   Skip preambles, closings, and follow-up hooks.
*   Begin directly with the answer and end when the answer is complete.
*   Flag flawed premises instead of working around them.
*   Ask one specific clarifying question when input is ambiguous (instead of guessing).

**The result:** AI behaves like a reference tool, not a confidant.

---

## How it works

The extension uses content scripts to intercept outgoing `fetch` and `XMLHttpRequest` calls on supported AI sites, prepends the directive to the first message of each conversation, and visually hides the directive from your chat history so the interface stays clean.

The directive is sent as part of your own message. It never modifies system prompts, server-side configuration, or anyone else's data. It only affects requests originating from your own browser.

---

## Supported platforms

| Platform | Inline injection | Visual hiding |
| :--- | :---: | :---: |
| ChatGPT | ✓ | ✓ |
| Claude | ✓ | ✓ |
| Gemini | ✓ | ✓ |
| DeepSeek | ✓ | ✓ |
| Perplexity | ✓ | — |
| Grok | ✓ | — |
| Copilot | ✓ | — |
| Meta AI | ✓ | — |
| Mistral | ✓ | — |
| HuggingFace Chat | ✓ | — |

---

## Installation

1. Download or clone this repository.
2. Open `chrome://extensions/` in Chrome (or any Chromium-based browser: Edge, Brave, Opera, Arc).
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the extension folder.
5. Pin the extension to your toolbar for easy access.

---

## Usage

After installation, the extension works automatically on supported sites. A small indicator in the bottom-right corner of each AI chat page shows status (ON/OFF, intercepts, injections).

Click the extension icon in your toolbar to open the popup:
*   **Setup ChatGPT Custom Instructions:** Opens a tab and attempts to auto-fill the directive into your ChatGPT account settings. Recommended over inline injection (more reliable, persists across sessions).
*   **Setup Gemini Gem:** Same automation loop for Gemini.
*   **Copy directive for Claude:** Copies the directive to your clipboard so you can paste it manually into Claude's personalization settings (Claude does not allow programmatic auto-fill).
*   **Toggle inline injection:** Turn off when you've already configured the platform's native settings.

---

## Honest limitations

*   **The directive reduces sycophantic behavior; it does not eliminate it.** RLHF training runs deeper than any user-side prompt can fully override. Expect ~70-90% improvement, not 100%.
*   **Each model obeys with different fidelity.** DeepSeek follows strictly. ChatGPT and Claude follow moderately. Gemini is the most resistant due to particularly strong personality training.
*   **Auto-fill selectors may break.** When ChatGPT or Gemini update their settings UI, the auto-fill buttons may stop working until selectors are updated. The directive is always copied to your clipboard as a fallback, so you can paste manually.
*   **The visual hiding is cosmetic.** The directive is still in the underlying conversation data. If you reload a chat, the hidden text may briefly reappear.
*   **This is not a substitute for clinical care.** If your AI usage is causing impairment in daily life, please consult a mental health professional.

---

## Privacy

*   No data collection. No telemetry. No analytics.
*   No external servers. The extension is entirely client-side.
*   No third-party libraries with network access.
*   No account required.
*   All settings are stored locally in your browser via `chrome.storage.local`.

The full source code is in this repository and can be audited freely.

---

## Why open-source

This tool exists to help people, not to be a moat. If a 50-line script can reduce someone's compulsive AI usage, that script should be free. Anyone can fork, modify, redistribute, or learn from this code.

If you want a structured methodology — pre-chat check-ins, weekly review templates, the framework for distinguishing information-seeking from emotional-seeking, plus polished installation guides with screenshots — that's available as a paid companion guide at `[UNDER CONSTRUCTION]`. The guide is how this project sustains development. The tool itself stays free forever.

---

## Contributing

Issues and pull requests welcome. Areas of contribution:
*   Updated CSS selectors when AI platforms change their UIs.
*   New platform support (especially anything with a chat interface).
*   Better visual hiding logic for platforms not yet covered.
*   Internationalization (current directive is English-only; multilingual versions welcome).

Please keep contributions focused. This is a small tool by design.

---

## License

[MIT License](LICENSE). Do whatever you want with this code, including commercial use. No warranty.

---

## Disclaimer

This extension is provided "as is" with no guarantees. It modifies outgoing messages on AI chat platforms. The directive content is appended to your messages and visible to the AI service in the same way any other user message is. Use of this extension is at your own discretion and responsibility. The author makes no claims about how each AI provider's terms of service interact with user-side message customization.

---
> Companion to the Unhooked guide — a $9 system for digital wellness with AI, written for ADHD, OCD, and heavy AI users.
