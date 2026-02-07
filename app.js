// CensorCraft - Main Application
class CensorCraft {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.model = null;
        this.image = null;
        this.censorAreas = [];
        this.isDrawing = false;
        this.drawMode = false;
        this.startX = 0;
        this.startY = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadModel();
    }

    initializeElements() {
        this.uploadSection = document.getElementById('uploadSection');
        this.editorSection = document.getElementById('editorSection');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.loading = document.getElementById('loading');
        this.selectFileBtn = document.getElementById('selectFileBtn');
        this.detectBtn = document.getElementById('detectBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newImageBtn = document.getElementById('newImageBtn');
        this.censorStyleSelect = document.getElementById('censorStyle');
        this.autoDetectCheckbox = document.getElementById('autoDetect');
        this.drawModeBtn = document.getElementById('drawModeBtn');
        this.areaPercentageSlider = document.getElementById('areaPercentage');
        this.areaPercentageLabel = document.getElementById('areaPercentageLabel');
        this.confidenceSlider = document.getElementById('confidenceThreshold');
        this.confidenceLabel = document.getElementById('confidenceLabel');
        this.targetAreaSelect = document.getElementById('targetArea');
    }

    attachEventListeners() {
        // File upload
        this.selectFileBtn.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            }
        });

        // Controls
        this.detectBtn.addEventListener('click', () => this.detectAndCensor());
        this.clearBtn.addEventListener('click', () => this.clearCensorship());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.newImageBtn.addEventListener('click', () => this.reset());
        this.drawModeBtn.addEventListener('click', () => this.toggleDrawMode());
        
        // Canvas drawing
        this.overlayCanvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.overlayCanvas.addEventListener('mousemove', (e) => this.draw(e));
        this.overlayCanvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
        this.overlayCanvas.addEventListener('mouseleave', (e) => this.stopDrawing(e));
        
        // Slider updates
        this.areaPercentageSlider.addEventListener('input', (e) => {
            this.areaPercentageLabel.textContent = e.target.value + '%';
        });
        
        this.confidenceSlider.addEventListener('input', (e) => {
            this.confidenceLabel.textContent = e.target.value + '%';
        });
    }

    async loadModel() {
        try {
            this.showLoading(true);
            console.log('Ładowanie modelu COCO-SSD...');
            this.model = await cocoSsd.load();
            console.log('Model załadowany pomyślnie!');
            this.showLoading(false);
        } catch (error) {
            console.error('Błąd ładowania modelu:', error);
            alert('Nie udało się załadować modelu AI. Sprawdź połączenie internetowe.');
            this.showLoading(false);
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.displayImage();
                this.uploadSection.style.display = 'none';
                this.editorSection.style.display = 'block';
                
                if (this.autoDetectCheckbox.checked) {
                    setTimeout(() => this.detectAndCensor(), 500);
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayImage() {
        // Resize canvas to fit image while maintaining aspect ratio
        const maxWidth = 800;
        const maxHeight = 600;
        let width = this.image.width;
        let height = this.image.height;

        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.overlayCanvas.width = width;
        this.overlayCanvas.height = height;

        this.ctx.drawImage(this.image, 0, 0, width, height);
    }

    async detectAndCensor() {
        if (!this.model) {
            alert('Model AI nie jest jeszcze załadowany. Proszę czekać...');
            return;
        }

        this.showLoading(true);
        
        try {
            const predictions = await this.model.detect(this.canvas);
            console.log('Wykryto obiekty:', predictions);

            // Get confidence threshold
            const confidenceThreshold = this.confidenceSlider.value / 100;
            
            // Detect people (person class) with confidence threshold
            const people = predictions.filter(p => 
                p.class === 'person' && p.score >= confidenceThreshold
            );
            
            if (people.length === 0) {
                alert('Nie wykryto żadnych osób na zdjęciu z wybranym poziomem pewności. Możesz użyć trybu ręcznego lub zmniejszyć próg pewności.');
            } else {
                // Get area percentage setting
                const areaPercentage = this.areaPercentageSlider.value / 100;
                
                // Add detected areas to censor
                people.forEach(person => {
                    const [x, y, w, h] = person.bbox;
                    
                    // Censor from top down using the area percentage slider
                    const censorHeight = h * areaPercentage;
                    const censorY = y;
                    
                    this.censorAreas.push({
                        x: x,
                        y: censorY,
                        width: w,
                        height: censorHeight
                    });
                });
                
                this.applyCensorship();
            }
        } catch (error) {
            console.error('Błąd wykrywania:', error);
            alert('Wystąpił błąd podczas wykrywania. Spróbuj ponownie.');
        } finally {
            this.showLoading(false);
        }
    }

    toggleDrawMode() {
        this.drawMode = !this.drawMode;
        const wrapper = document.querySelector('.canvas-wrapper');
        
        if (this.drawMode) {
            wrapper.classList.add('draw-mode');
            this.drawModeBtn.textContent = '🛑 Wyłącz Tryb Rysowania';
            this.drawModeBtn.style.background = '#dc3545';
            this.drawModeBtn.style.color = 'white';
            this.drawModeBtn.style.borderColor = '#dc3545';
        } else {
            wrapper.classList.remove('draw-mode');
            this.drawModeBtn.textContent = '✏️ Rysuj Obszar Cenzury';
            this.drawModeBtn.style.background = '';
            this.drawModeBtn.style.color = '';
            this.drawModeBtn.style.borderColor = '';
        }
    }

    startDrawing(e) {
        if (!this.drawMode) return;
        
        this.isDrawing = true;
        const rect = this.overlayCanvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
    }

    draw(e) {
        if (!this.isDrawing || !this.drawMode) return;

        const rect = this.overlayCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Clear overlay and redraw existing areas
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Draw preview rectangle
        this.overlayCtx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        this.overlayCtx.lineWidth = 2;
        this.overlayCtx.setLineDash([5, 5]);
        this.overlayCtx.strokeRect(
            this.startX,
            this.startY,
            currentX - this.startX,
            currentY - this.startY
        );
        this.overlayCtx.setLineDash([]);
    }

    stopDrawing(e) {
        if (!this.isDrawing || !this.drawMode) return;
        
        this.isDrawing = false;
        const rect = this.overlayCanvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - this.startX;
        const height = endY - this.startY;

        if (Math.abs(width) > 10 && Math.abs(height) > 10) {
            this.censorAreas.push({
                x: Math.min(this.startX, endX),
                y: Math.min(this.startY, endY),
                width: Math.abs(width),
                height: Math.abs(height)
            });
            
            this.applyCensorship();
        }
        
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }

    applyCensorship() {
        // Redraw original image
        this.displayImage();

        const style = this.censorStyleSelect.value;

        this.censorAreas.forEach((area, index) => {
            if (style === 'blackbar') {
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(area.x, area.y, area.width, area.height);
            } else if (style === 'whitebar') {
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(area.x, area.y, area.width, area.height);
            } else if (style === 'pixelate') {
                this.pixelateArea(area);
            } else if (style === 'blur') {
                this.blurArea(area);
            } else if (style === 'emoji') {
                this.emojiArea(area, index);
            }
        });
    }

    pixelateArea(area) {
        const pixelSize = 20;
        const imageData = this.ctx.getImageData(area.x, area.y, area.width, area.height);
        
        for (let y = 0; y < area.height; y += pixelSize) {
            for (let x = 0; x < area.width; x += pixelSize) {
                // Get average color of the pixel block
                const pixelIndex = (y * area.width + x) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                
                // Fill block with average color
                this.ctx.fillStyle = `rgb(${r},${g},${b})`;
                this.ctx.fillRect(
                    area.x + x,
                    area.y + y,
                    Math.min(pixelSize, area.width - x),
                    Math.min(pixelSize, area.height - y)
                );
            }
        }
    }

    blurArea(area) {
        // Create temporary canvas for blurring
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Add padding for blur effect
        const padding = 30;
        const x = Math.max(0, area.x - padding);
        const y = Math.max(0, area.y - padding);
        const width = Math.min(this.canvas.width - x, area.width + padding * 2);
        const height = Math.min(this.canvas.height - y, area.height + padding * 2);
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Copy area to temp canvas
        tempCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
        
        // Apply blur filter and draw back
        this.ctx.filter = 'blur(25px)';
        this.ctx.drawImage(tempCanvas, 0, 0, width, height, x, y, width, height);
        this.ctx.filter = 'none';
    }

    emojiArea(area, index) {
        // Fill with white background first
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
        
        // Draw emoji
        const emojiSize = Math.min(area.width, area.height) * 0.6;
        this.ctx.font = `${emojiSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Use deterministic emoji selection based on area index
        const emojis = ['😎', '🙈', '🤐', '🤫', '😶', '🫣'];
        const emoji = emojis[index % emojis.length];
        
        this.ctx.fillText(emoji, area.x + area.width / 2, area.y + area.height / 2);
    }

    clearCensorship() {
        this.censorAreas = [];
        this.displayImage();
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'censored-image.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    reset() {
        this.censorAreas = [];
        this.image = null;
        this.fileInput.value = '';
        this.uploadSection.style.display = 'block';
        this.editorSection.style.display = 'none';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        if (this.drawMode) {
            this.toggleDrawMode();
        }
    }

    showLoading(show) {
        this.loading.style.display = show ? 'block' : 'none';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CensorCraft();
});
