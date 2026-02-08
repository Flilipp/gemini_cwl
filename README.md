# Project: CensorCraft

# https://censouircraft.web.app/

**Free, open-source, and 100% private automatic censorship tool that works in your browser.**

[![Project Status: MVP Complete](https://img.shields.io/badge/status-MVP%20complete-green.svg)](https://github.com/Flilipp/gemini_cwl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## What is this?

Project CensorCraft is a response to community needs - a simple, free, and effective tool for censoring photos and videos without having to install complicated software or send private files to external servers.

Everything you do happens **locally on your device**. Your files never leave your computer.

## 🎉 Ready to Use!

**MVP is now available!** You can use CensorCraft right now:

1. Open `index.html` in your browser
2. Drag an image or click "Choose Image"
3. AI will automatically detect people and censor them
4. Download the censored image!

📚 **Documentation:**
- [INSTRUCTIONS.md](INSTRUCTIONS.md) - how to use the app
- [DEVELOPER.md](DEVELOPER.md) - technical documentation
- [FEATURES.md](FEATURES.md) - complete feature list

## ✨ Key Features (Implemented!)

*   ✅ **Automatic Detection:** Artificial intelligence automatically recognizes NSFW content and body parts to censor.
*   ✅ **Smart Model Loading:** AI models load only when needed (lazy loading) with automatic error handling and retries.
*   ✅ **Mobile Optimization:** Automatic performance adjustment for mobile devices for smooth operation.
*   ✅ **Extensive Censorship Styles:** 11 different styles - bars, pixelation, blur, emoji, gradients, patterns, and more!
*   ✅ **Customizable Censorship:** Custom color, texture, and adjustable transparency for each style.
*   ✅ **Full Manual Control:** Drawing mode - mark your own areas to censor (rectangles and arcs).
*   ✅ **Advanced Editing:** Image adjustments, filters, transformations, undo/redo.
*   ✅ **Client-Side Processing:** 100% privacy. The app works in your browser, and your files are never sent anywhere.
*   ✅ **Free and Open-Source:** Forever, for everyone. No ads, no subscriptions.

## 🚀 How Does It Work? (Technology)

The magic happens thanks to the **TensorFlow.js** library. It allows running artificial intelligence models directly in the browser. This means all the "heavy lifting" related to image analysis is done by your computer or phone, not by our server (because we don't need one!).

**New improvements:**
- **Lazy Loading:** AI models load only when needed, saving bandwidth
- **Retry Logic:** Automatic retry on connection errors
- **Mobile Optimization:** Lighter models (MobileNetV1 0.5x) and smaller canvas sizes on mobile devices
- **Smart Detection:** Intelligent memory and performance management

## 💖 Want to Help? You're in the Right Place!

This project is created by the community, for the community. Every contribution is worth its weight in gold, even if you're not a programmer!

**How you can contribute:**

1.  ⭐ **Star this repository!** - This increases its visibility.
2.  💡 **Share an idea** - Open a new discussion in the [Issues](https://github.com/twoj-nick/twoje-repo/issues) tab and describe a feature you're missing.
3.  🐛 **Report a bug** - If something doesn't work, let us know in [Issues](https://github.com/twoj-nick/twoje-repo/issues).
4.  💻 **Write code** - If you know HTML, CSS, or JavaScript, this is the perfect place to start:
    *   Fork this repository.
    *   Make your changes.
    *   Create a Pull Request with a description of what you did.

**Join us on Discord:** [Insert link to your Discord server here when you create one]

## 📋 Quick Start

### Users

1. Download the repository or clone: `git clone https://github.com/Flilipp/gemini_cwl.git`
2. Open the `index.html` file in your browser
3. Done! See [INSTRUCTIONS.md](INSTRUCTIONS.md) for more details

### Developers

```bash
# Clone the repository
git clone https://github.com/Flilipp/gemini_cwl.git
cd gemini_cwl

# Run local server (optional)
python -m http.server 8080

# Open in browser
# http://localhost:8080
```

See [DEVELOPER.md](DEVELOPER.md) for technical documentation.

## 🗺️ Roadmap

*   **[✅] Phase 1: MVP (Minimum Viable Product)** - COMPLETE!
    *   ✅ Create basic interface for uploading images (+ drag & drop).
    *   ✅ Implement AI model for detection (COCO-SSD + TensorFlow.js).
    *   ✅ Add three censorship options (black bar, pixelation, blur).
    *   ✅ Option to download censored image.
    *   ✅ Manual drawing mode for censorship areas.
*   **[✅] Phase 2: Feature Expansion** - COMPLETE!
    *   ✅ Add more censorship styles (emoji, white bar).
    *   ✅ Introduce advanced manual editing tools Adobe-style:
        *   ✅ Brightness, contrast, saturation adjustment
        *   ✅ Color filters (grayscale, sepia, inversion)
        *   ✅ Transformations (rotation, flip, cropping)
        *   ✅ Artistic effects (vignette, temperature, sharpness)
        *   ✅ Undo/redo system
        *   ✅ Tabbed interface for better organization
*   **[ ] Phase 3: Further Development**
    *   Support for video and GIF files.
    *   Performance optimization.

## 📜 License

This project is released under the MIT license. This means you can do whatever you want with it, as long as you keep the original license information.
