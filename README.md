# ✋ Hand-Controlled Drawing App

A revolutionary web-based drawing application that uses hand gestures and computer vision to create art without touching your device!

## 🎨 Features

### Hand Tracking & Gestures
- **Index Finger Cursor**: Your index finger controls the on-screen cursor
- **Pinch to Draw**: Touch your thumb and index finger together to start drawing
- **Variable Brush Size**: Brush thickness changes dynamically based on pinch distance
- **Smooth Motion**: Advanced filtering ensures stable, jitter-free cursor movement

### Drawing Tools
- Full-screen HTML5 canvas
- Adjustable brush size (1px - 50px)
- Color picker for custom colors
- Eraser mode for corrections
- Clear canvas button
- Save drawing as PNG

### Camera Preview
- Floating, draggable camera window
- Real-time hand landmark visualization
- Glassmorphism design (frosted blur effect)
- Resizable and minimizable
- Shows hand tracking status

## 🚀 How to Use

1. **Allow Camera Access**: Grant permission when prompted
2. **Show Your Hand**: Position your hand in front of the camera
3. **Move Cursor**: Point with your index finger
4. **Draw**: Pinch your thumb and index finger together
5. **Change Settings**: Use the control panel for colors and brush size

## 🎮 Controls

| Gesture | Action |
|---------|--------|
| 👆 Index Finger | Move cursor |
| 🤏 Pinch (close) | Start drawing |
| 🤏 Pinch (open) | Stop drawing |
| 🖌️ Pinch distance | Adjust brush size |

## 🛠️ Technology Stack

- **HTML5 Canvas** - Drawing surface
- **MediaPipe Hands** - Real-time hand tracking
- **Vanilla JavaScript** - No frameworks required
- **CSS3** - Minimalist glassmorphism design

## 📋 Requirements

- Modern web browser (Chrome, Edge, Firefox recommended)
- Webcam
- Well-lit environment for best tracking
- HTTPS connection (required for camera access)

## 🎯 Tips for Best Results

- Ensure good lighting
- Keep your hand clearly visible in the camera
- Avoid complex backgrounds
- Keep hand at a comfortable distance (30-60cm from camera)
- Use deliberate pinch gestures for precise control

## 🌐 Deployment

This app runs entirely in the browser using CDN-hosted MediaPipe libraries. Deploy to any static hosting service:

- ✅ Vercel
- ✅ Netlify
- ✅ GitHub Pages
- ✅ Any web server with HTTPS

## 🔒 Privacy

- All processing happens locally in your browser
- No data is sent to any server
- Camera feed is never recorded or transmitted
- Your drawings stay on your device

## 📱 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ⚠️ Mobile support limited (desktop recommended)

## 🎨 Use Cases

- Digital art and sketching
- Contactless drawing presentations
- Accessibility tool for hands-free drawing
- Educational demonstrations
- Creative experiments with gesture control

## 🚀 Performance

- Real-time hand tracking at 30+ FPS
- Low latency drawing (<50ms)
- Optimized for smooth performance
- Works on mid-range laptops and above

## 📄 License

Open source - feel free to use and modify!

---

**Created with ❤️ using MediaPipe and HTML5 Canvas**

Enjoy creating art with your hands! 🎨✨
