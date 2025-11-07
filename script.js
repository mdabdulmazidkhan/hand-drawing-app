// Canvas setup
const drawingCanvas = document.getElementById('drawingCanvas');
const drawingCtx = drawingCanvas.getContext('2d');
const handCanvas = document.getElementById('handCanvas');
const handCtx = handCanvas.getContext('2d');
const videoElement = document.getElementById('videoElement');

// UI Elements
const cursor = document.getElementById('cursor');
const colorPicker = document.getElementById('colorPicker');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const startBtn = document.getElementById('startBtn');
const instructions = document.getElementById('instructions');
const cameraPreview = document.getElementById('cameraPreview');
const toggleCamera = document.getElementById('toggleCamera');
const statusDot = document.getElementById('drawingStatus');
const statusText = document.getElementById('statusText');

// Drawing state
let isDrawing = false;
let isEraser = false;
let currentColor = '#000000';
let brushSize = 5;
let lastX = 0;
let lastY = 0;

// Smooth cursor tracking
let smoothX = 0;
let smoothY = 0;
const smoothFactor = 0.5;

// Hand tracking state
let indexTip = null;
let thumbTip = null;

// Resize canvas
function resizeCanvas() {
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// MediaPipe Hands setup
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults(onHandsResults);

// Camera setup
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
});

// Calculate distance between two points
function calculateDistance(point1, point2) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Process hand detection results
function onHandsResults(results) {
    // Clear hand canvas
    handCtx.save();
    handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Draw hand landmarks
        drawConnectors(handCtx, landmarks, HAND_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 2
        });
        drawLandmarks(handCtx, landmarks, {
            color: '#FF0000',
            lineWidth: 1,
            radius: 3
        });
        
        // Get index finger tip (landmark 8) and thumb tip (landmark 4)
        indexTip = landmarks[8];
        thumbTip = landmarks[4];
        
        // Convert to canvas coordinates
        const canvasX = (1 - indexTip.x) * drawingCanvas.width; // Mirror X
        const canvasY = indexTip.y * drawingCanvas.height;
        
        // Smooth cursor movement
        smoothX += (canvasX - smoothX) * smoothFactor;
        smoothY += (canvasY - smoothY) * smoothFactor;
        
        // Update cursor position
        cursor.style.left = smoothX + 'px';
        cursor.style.top = smoothY + 'px';
        
        // Check pinch gesture (thumb and index finger distance)
        const pinchDistance = calculateDistance(indexTip, thumbTip);
        const pinchThreshold = 0.05; // Adjust sensitivity
        
        if (pinchDistance < pinchThreshold) {
            // Pinching - start/continue drawing
            if (!isDrawing) {
                isDrawing = true;
                lastX = smoothX;
                lastY = smoothY;
                cursor.classList.add('drawing');
                statusDot.classList.add('drawing');
                statusText.textContent = 'Drawing...';
            }
            
            // Draw line
            drawingCtx.beginPath();
            drawingCtx.moveTo(lastX, lastY);
            drawingCtx.lineTo(smoothX, smoothY);
            
            // Variable brush size based on pinch distance
            const dynamicSize = Math.max(1, Math.min(brushSize * (1 + pinchDistance * 10), 50));
            drawingCtx.lineWidth = dynamicSize;
            
            if (isEraser) {
                drawingCtx.globalCompositeOperation = 'destination-out';
                drawingCtx.strokeStyle = 'rgba(0,0,0,1)';
            } else {
                drawingCtx.globalCompositeOperation = 'source-over';
                drawingCtx.strokeStyle = currentColor;
            }
            
            drawingCtx.stroke();
            
            lastX = smoothX;
            lastY = smoothY;
        } else {
            // Not pinching - stop drawing
            if (isDrawing) {
                isDrawing = false;
                cursor.classList.remove('drawing');
                statusDot.classList.remove('drawing');
                statusText.textContent = 'Tracking';
            }
            lastX = smoothX;
            lastY = smoothY;
        }
        
        statusDot.classList.add('active');
    } else {
        statusDot.classList.remove('active', 'drawing');
        statusText.textContent = 'No hand detected';
    }
    
    handCtx.restore();
}

// UI Controls
brushSizeInput.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value);
    brushSizeValue.textContent = brushSize;
    cursor.style.width = (brushSize * 2) + 'px';
    cursor.style.height = (brushSize * 2) + 'px';
});

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    isEraser = false;
    eraserBtn.style.background = '#667eea';
    cursor.style.borderColor = currentColor;
});

eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    if (isEraser) {
        eraserBtn.style.background = '#ef4444';
        cursor.style.borderColor = '#ef4444';
    } else {
        eraserBtn.style.background = '#667eea';
        cursor.style.borderColor = currentColor;
    }
});

clearBtn.addEventListener('click', () => {
    if (confirm('Clear the entire canvas?')) {
        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    }
});

saveBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'hand-drawing-' + Date.now() + '.png';
    link.href = drawingCanvas.toDataURL();
    link.click();
});

startBtn.addEventListener('click', () => {
    instructions.classList.add('hidden');
    camera.start();
    statusText.textContent = 'Starting camera...';
});

// Camera preview controls
let isCameraMinimized = false;
toggleCamera.addEventListener('click', () => {
    isCameraMinimized = !isCameraMinimized;
    if (isCameraMinimized) {
        cameraPreview.classList.add('minimized');
        toggleCamera.textContent = '+';
    } else {
        cameraPreview.classList.remove('minimized');
        toggleCamera.textContent = '−';
    }
});

// Make camera preview draggable
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

const cameraHeader = document.querySelector('.camera-header');

cameraHeader.addEventListener('mousedown', (e) => {
    if (e.target === toggleCamera) return;
    isDragging = true;
    dragOffsetX = e.clientX - cameraPreview.offsetLeft;
    dragOffsetY = e.clientY - cameraPreview.offsetTop;
    cameraPreview.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newX = e.clientX - dragOffsetX;
        const newY = e.clientY - dragOffsetY;
        cameraPreview.style.left = newX + 'px';
        cameraPreview.style.top = newY + 'px';
        cameraPreview.style.right = 'auto';
        cameraPreview.style.bottom = 'auto';
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        cameraPreview.style.transition = 'all 0.3s ease';
    }
});

// Resize camera preview
let isResizing = false;
const resizeHandle = document.querySelector('.resize-handle');

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    e.stopPropagation();
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        const rect = cameraPreview.getBoundingClientRect();
        const newWidth = e.clientX - rect.left;
        const newHeight = e.clientY - rect.top;
        
        if (newWidth > 200 && newHeight > 150) {
            cameraPreview.style.width = newWidth + 'px';
            cameraPreview.style.height = newHeight + 'px';
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

// Set hand canvas size
function updateHandCanvasSize() {
    const rect = videoElement.getBoundingClientRect();
    handCanvas.width = rect.width;
    handCanvas.height = rect.height;
}

videoElement.addEventListener('loadedmetadata', updateHandCanvasSize);
window.addEventListener('resize', updateHandCanvasSize);

// Initial status
statusText.textContent = 'Click "Start Drawing" to begin';
