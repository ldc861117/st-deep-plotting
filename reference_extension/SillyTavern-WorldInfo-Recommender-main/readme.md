# SillyTavern World Info Recommender (WREC)

## Overview

A [SillyTavern](https://docs.sillytavern.app/) extension that helps you manage [world info](https://docs.sillytavern.app/usage/core-concepts/worldinfo/) based on the current context with LLMs using [connection profiles](https://docs.sillytavern.app/usage/core-concepts/connection-profiles/).

![popup](images/popup.png)

---

![settings](images/settings.png)

---

**If you are using a _Text Completion_ profile, make sure your profile contains API, preset, model, system prompt, instruct template, and  context template.**

**If you are using a _Chat Completion_ profile; API, settings, model would be enough.**

---

## Installation

Install via the SillyTavern extension installer:

```txt
https://github.com/bmen25124/SillyTavern-WorldInfo-Recommender
```

To open the recommender popup, click the extension icon:

![icon](images/icon.png)

## Demo Video

https://github.com/user-attachments/assets/a26c8e44-7087-42df-9afa-7f7a2c752359

## FAQ

>Can I use this with my local 8B/12B RP model?

You should test it, but my guess is no. Because the model needs to give _XML_ output. RP models might not be able to do that.

>Can you suggest a model?

Gemini models are cheap, fast, and efficient. I usually use Gemini Flash 2.0. But most decent models should work fine.
