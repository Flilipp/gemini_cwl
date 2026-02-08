// CensorCraft - Main Application with Advanced Editing Features
class CensorCraft {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.cocoModel = null;  // For person detection
        this.nsfwModel = null;  // For NSFW detection
        this.image = null;
        this.originalImage = null;
        this.censorAreas = [];
        this.isDrawing = false;
        this.drawMode = false;
        this.cropMode = false;
        this.startX = 0;
        this.startY = 0;
        
        // Image adjustments
        this.adjustments = {
            brightness: 0,
            contrast: 100,
            saturation: 100,
            sharpness: 0,
            vignette: 0,
            temperature: 0,
            colorFilter: 'none',
            rotation: 0,
            flipH: false,
            flipV: false
        };
        
        // History for undo/redo
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 20;
        
        // NSFW categories for detection
        this.nsfwCategories = [
            { id: 'Porn', label: 'Pornografia', description: 'Wyraźne treści seksualne' },
            { id: 'Hentai', label: 'Hentai', description: 'Animowane treści dla dorosłych' },
            { id: 'Sexy', label: 'Prowokacyjne', description: 'Sugestywne, ale nie jednoznaczne' }
        ];
        
        // COCO-SSD object categories (for person/object detection mode)
        this.cocoCategories = [
            'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
            'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat',
            'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack',
            'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
            'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
            'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
            'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake',
            'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop',
            'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven', 'toaster', 'sink',
            'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
        ];
        
        // Detection mode: 'nsfw' or 'objects'
        this.detectionMode = 'nsfw';
        
        // Selected NSFW categories to censor (default: all explicit content)
        this.selectedNSFWCategories = new Set(['Porn', 'Hentai']);
        
        // Selected object categories (for object mode)
        this.selectedCategories = new Set(['person']);
        
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
        
        // New controls
        this.brightnessSlider = document.getElementById('brightness');
        this.brightnessLabel = document.getElementById('brightnessLabel');
        this.contrastSlider = document.getElementById('contrast');
        this.contrastLabel = document.getElementById('contrastLabel');
        this.saturationSlider = document.getElementById('saturation');
        this.saturationLabel = document.getElementById('saturationLabel');
        this.sharpnessSlider = document.getElementById('sharpness');
        this.sharpnessLabel = document.getElementById('sharpnessLabel');
        this.vignetteSlider = document.getElementById('vignette');
        this.vignetteLabel = document.getElementById('vignetteLabel');
        this.temperatureSlider = document.getElementById('temperature');
        this.temperatureLabel = document.getElementById('temperatureLabel');
        
        this.undoBtn = document.getElementById('undoBtn');
        this.redoBtn = document.getElementById('redoBtn');
        this.cropBtn = document.getElementById('cropBtn');
        this.flipHorizontalBtn = document.getElementById('flipHorizontal');
        this.flipVerticalBtn = document.getElementById('flipVertical');
        this.resetAdjustmentsBtn = document.getElementById('resetAdjustments');
        
        // Category modal elements
        this.categoryModal = document.getElementById('categoryModal');
        this.configureCategoriesBtn = document.getElementById('configureCategoriesBtn');
        this.closeCategoryModal = document.getElementById('closeCategoryModal');
        this.saveCategoriesBtn = document.getElementById('saveCategoriesBtn');
        this.selectAllCategoriesBtn = document.getElementById('selectAllCategories');
        this.deselectAllCategoriesBtn = document.getElementById('deselectAllCategories');
        this.categoryGrid = document.getElementById('categoryGrid');
        
        // Detection mode selector
        this.detectionModeSelect = document.getElementById('detectionMode');
        
        // Initialize category grid
        this.initializeCategoryGrid();
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

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Censor controls
        this.detectBtn.addEventListener('click', () => this.detectAndCensor());
        this.clearBtn.addEventListener('click', () => this.clearCensorship());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.newImageBtn.addEventListener('click', () => this.reset());
        this.drawModeBtn.addEventListener('click', () => this.toggleDrawMode());
        
        // Canvas drawing
        this.overlayCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.overlayCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.overlayCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.overlayCanvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Adjustment sliders
        this.areaPercentageSlider.addEventListener('input', (e) => {
            this.areaPercentageLabel.textContent = e.target.value + '%';
        });
        
        this.confidenceSlider.addEventListener('input', (e) => {
            this.confidenceLabel.textContent = e.target.value + '%';
        });

        this.brightnessSlider.addEventListener('input', (e) => {
            this.adjustments.brightness = parseInt(e.target.value);
            this.brightnessLabel.textContent = e.target.value;
            this.applyAdjustments();
        });

        this.contrastSlider.addEventListener('input', (e) => {
            this.adjustments.contrast = parseInt(e.target.value);
            this.contrastLabel.textContent = e.target.value + '%';
            this.applyAdjustments();
        });

        this.saturationSlider.addEventListener('input', (e) => {
            this.adjustments.saturation = parseInt(e.target.value);
            this.saturationLabel.textContent = e.target.value + '%';
            this.applyAdjustments();
        });

        this.sharpnessSlider.addEventListener('input', (e) => {
            this.adjustments.sharpness = parseInt(e.target.value);
            this.sharpnessLabel.textContent = e.target.value;
            this.applyAdjustments();
        });

        this.vignetteSlider.addEventListener('input', (e) => {
            this.adjustments.vignette = parseInt(e.target.value);
            this.vignetteLabel.textContent = e.target.value + '%';
            this.applyAdjustments();
        });

        this.temperatureSlider.addEventListener('input', (e) => {
            this.adjustments.temperature = parseInt(e.target.value);
            this.temperatureLabel.textContent = e.target.value;
            this.applyAdjustments();
        });

        // Effect buttons
        document.querySelectorAll('[data-effect]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const effect = e.target.dataset.effect;
                this.applyColorFilter(effect);
                // Update active state
                document.querySelectorAll('[data-effect]').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Rotation buttons
        document.querySelectorAll('[data-rotate]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const degrees = parseInt(e.target.dataset.rotate);
                this.rotateImage(degrees);
            });
        });

        // Transform buttons
        this.flipHorizontalBtn.addEventListener('click', () => this.flipImage('horizontal'));
        this.flipVerticalBtn.addEventListener('click', () => this.flipImage('vertical'));
        this.cropBtn.addEventListener('click', () => this.toggleCropMode());

        // History buttons
        this.undoBtn.addEventListener('click', () => this.undo());
        this.redoBtn.addEventListener('click', () => this.redo());

        // Reset button
        this.resetAdjustmentsBtn.addEventListener('click', () => this.resetAdjustments());
        
        // Category modal event listeners
        this.configureCategoriesBtn.addEventListener('click', () => this.openCategoryModal());
        this.closeCategoryModal.addEventListener('click', () => this.closeCategoryModalHandler());
        this.saveCategoriesBtn.addEventListener('click', () => this.closeCategoryModalHandler());
        this.selectAllCategoriesBtn.addEventListener('click', () => this.selectAllCategories());
        this.deselectAllCategoriesBtn.addEventListener('click', () => this.deselectAllCategories());
        
        // Detection mode change
        this.detectionModeSelect.addEventListener('change', (e) => {
            this.detectionMode = e.target.value;
            this.updateUIForDetectionMode();
            this.initializeCategoryGrid();
            this.updateCategoryDisplay();
        });
        
        // Close modal when clicking outside
        this.categoryModal.addEventListener('click', (e) => {
            if (e.target === this.categoryModal) {
                this.closeCategoryModalHandler();
            }
        });
    }
    
    updateUIForDetectionMode() {
        const areaPercentageGroup = document.getElementById('areaPercentageGroup');
        const categoriesHint = document.getElementById('categoriesHint');
        const modalTitle = document.getElementById('modalTitle');
        const modalButtons = document.getElementById('modalButtons');
        
        if (this.detectionMode === 'nsfw') {
            // NSFW mode - hide area percentage (whole image is censored)
            areaPercentageGroup.style.display = 'none';
            categoriesHint.textContent = 'Wybierz które treści NSFW mają być cenzurowane';
            modalTitle.textContent = 'Wybierz Kategorie NSFW do Cenzury';
            modalButtons.style.display = 'block';
        } else {
            // Object detection mode - show area percentage
            areaPercentageGroup.style.display = 'block';
            categoriesHint.textContent = 'Wybierz które obiekty mają być cenzurowane';
            modalTitle.textContent = 'Wybierz Obiekty do Cenzury';
            modalButtons.style.display = 'block';
        }
    }
    
    initializeCategoryGrid() {
        this.categoryGrid.innerHTML = '';
        
        if (this.detectionMode === 'nsfw') {
            // Show NSFW categories
            this.nsfwCategories.forEach(category => {
                const item = document.createElement('div');
                item.className = 'category-item';
                if (this.selectedNSFWCategories.has(category.id)) {
                    item.classList.add('selected');
                }
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `category-${category.id}`;
                checkbox.checked = this.selectedNSFWCategories.has(category.id);
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.innerHTML = `<strong>${category.label}</strong><br><small style="color: #666;">${category.description}</small>`;
                
                checkbox.addEventListener('change', () => {
                    this.toggleNSFWCategory(category.id);
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                });
                
                item.addEventListener('click', (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
                
                item.appendChild(checkbox);
                item.appendChild(label);
                this.categoryGrid.appendChild(item);
            });
        } else {
            // Show object categories
            const translations = {
                'person': 'osoba',
                'bicycle': 'rower',
                'car': 'samochód',
                'motorcycle': 'motocykl',
                'airplane': 'samolot',
                'bus': 'autobus',
                'train': 'pociąg',
                'truck': 'ciężarówka',
                'boat': 'łódź',
                'traffic light': 'światła',
                'fire hydrant': 'hydrant',
                'stop sign': 'znak stop',
                'parking meter': 'parkometr',
                'bench': 'ławka',
                'bird': 'ptak',
                'cat': 'kot',
                'dog': 'pies',
                'horse': 'koń',
                'sheep': 'owca',
                'cow': 'krowa',
                'elephant': 'słoń',
                'bear': 'niedźwiedź',
                'zebra': 'zebra',
                'giraffe': 'żyrafa',
                'backpack': 'plecak',
                'umbrella': 'parasol',
                'handbag': 'torebka',
                'tie': 'krawat',
                'suitcase': 'walizka',
                'cell phone': 'telefon'
            };
            
            this.cocoCategories.forEach(category => {
                const item = document.createElement('div');
                item.className = 'category-item';
                if (this.selectedCategories.has(category)) {
                    item.classList.add('selected');
                }
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `category-${category.replace(/\s+/g, '-')}`;
                checkbox.checked = this.selectedCategories.has(category);
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                const displayName = translations[category] || category;
                label.textContent = displayName;
                
                checkbox.addEventListener('change', () => {
                    this.toggleCategory(category);
                    if (checkbox.checked) {
                        item.classList.add('selected');
                    } else {
                        item.classList.remove('selected');
                    }
                });
                
                item.addEventListener('click', (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
                
                item.appendChild(checkbox);
                item.appendChild(label);
                this.categoryGrid.appendChild(item);
            });
        }
    }
    
    openCategoryModal() {
        this.categoryModal.style.display = 'flex';
    }
    
    closeCategoryModalHandler() {
        this.categoryModal.style.display = 'none';
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    async loadModel() {
        try {
            this.showLoading(true);
            console.log('Ładowanie modeli AI...');
            
            // Load both models in parallel
            const [cocoModel, nsfwModel] = await Promise.all([
                cocoSsd.load(),
                nsfwjs.load()
            ]);
            
            this.cocoModel = cocoModel;
            this.nsfwModel = nsfwModel;
            
            console.log('Modele załadowane pomyślnie!');
            this.showLoading(false);
            
            // Update category display after loading
            this.updateCategoryDisplay();
        } catch (error) {
            console.error('Błąd ładowania modeli:', error);
            alert('Nie udało się załadować modeli AI. Sprawdź połączenie internetowe.');
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
                this.originalImage = img;
                this.displayImage();
                this.uploadSection.style.display = 'none';
                this.editorSection.style.display = 'block';
                this.saveState();
                
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

        this.renderImage();
    }

    renderImage() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        this.ctx.save();
        
        // Apply transformations
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.translate(centerX, centerY);
        
        if (this.adjustments.flipH) {
            this.ctx.scale(-1, 1);
        }
        if (this.adjustments.flipV) {
            this.ctx.scale(1, -1);
        }
        
        this.ctx.translate(-centerX, -centerY);
        
        // Draw image
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        
        // Restore context
        this.ctx.restore();
        
        // Apply filters and effects
        this.applyFilters();
        
        // Reapply censorship
        this.applyCensorship();
    }

    applyFilters() {
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Apply brightness, contrast, saturation, temperature
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Brightness
            r += this.adjustments.brightness;
            g += this.adjustments.brightness;
            b += this.adjustments.brightness;
            
            // Contrast (normalize to -100 to +100 range)
            const contrastValue = this.adjustments.contrast - 100;
            const contrastFactor = (259 * (contrastValue + 255)) / (255 * (259 - contrastValue));
            r = contrastFactor * (r - 128) + 128;
            g = contrastFactor * (g - 128) + 128;
            b = contrastFactor * (b - 128) + 128;
            
            // Saturation
            const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
            const satFactor = this.adjustments.saturation / 100;
            r = gray + satFactor * (r - gray);
            g = gray + satFactor * (g - gray);
            b = gray + satFactor * (b - gray);
            
            // Temperature
            if (this.adjustments.temperature !== 0) {
                r += this.adjustments.temperature * 0.5;
                b -= this.adjustments.temperature * 0.5;
            }
            
            // Color filter
            if (this.adjustments.colorFilter === 'grayscale') {
                const avg = (r + g + b) / 3;
                r = g = b = avg;
            } else if (this.adjustments.colorFilter === 'sepia') {
                const tr = 0.393 * r + 0.769 * g + 0.189 * b;
                const tg = 0.349 * r + 0.686 * g + 0.168 * b;
                const tb = 0.272 * r + 0.534 * g + 0.131 * b;
                r = tr;
                g = tg;
                b = tb;
            } else if (this.adjustments.colorFilter === 'invert') {
                r = 255 - r;
                g = 255 - g;
                b = 255 - b;
            }
            
            // Clamp values
            data[i] = Math.max(0, Math.min(255, r));
            data[i + 1] = Math.max(0, Math.min(255, g));
            data[i + 2] = Math.max(0, Math.min(255, b));
        }
        
        this.ctx.putImageData(imageData, 0, 0);
        
        // Apply vignette
        if (this.adjustments.vignette > 0) {
            this.applyVignette();
        }
        
        // Apply sharpness
        if (this.adjustments.sharpness > 0) {
            this.applySharpen();
        }
    }

    applyVignette() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxDist
        );
        
        const opacity = this.adjustments.vignette / 100;
        gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(0.6, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${opacity})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    applySharpen() {
        // Simple sharpening using unsharp mask simulation
        const amount = this.adjustments.sharpness / 100;
        if (amount > 0) {
            // Create temporary canvas to avoid drawing canvas onto itself
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(this.canvas, 0, 0);
            
            this.ctx.filter = `contrast(${100 + amount * 20}%)`;
            this.ctx.drawImage(tempCanvas, 0, 0);
            this.ctx.filter = 'none';
        }
    }

    applyAdjustments() {
        this.renderImage();
    }

    applyColorFilter(filter) {
        this.adjustments.colorFilter = filter;
        this.saveState();
        this.applyAdjustments();
    }

    rotateImage(degrees) {
        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // For 90 and 270 degrees, swap width and height
        if (degrees === 90 || degrees === 270) {
            tempCanvas.width = this.canvas.height;
            tempCanvas.height = this.canvas.width;
        } else {
            tempCanvas.width = this.canvas.width;
            tempCanvas.height = this.canvas.height;
        }
        
        // Rotate
        tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
        tempCtx.rotate(degrees * Math.PI / 180);
        tempCtx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);
        
        // Update canvas
        this.canvas.width = tempCanvas.width;
        this.canvas.height = tempCanvas.height;
        this.overlayCanvas.width = tempCanvas.width;
        this.overlayCanvas.height = tempCanvas.height;
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Create new image from canvas
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.saveState();
        };
        img.src = this.canvas.toDataURL();
    }

    flipImage(direction) {
        if (direction === 'horizontal') {
            this.adjustments.flipH = !this.adjustments.flipH;
        } else {
            this.adjustments.flipV = !this.adjustments.flipV;
        }
        this.saveState();
        this.renderImage();
    }

    toggleCropMode() {
        this.cropMode = !this.cropMode;
        const wrapper = document.querySelector('.canvas-wrapper');
        
        if (this.cropMode) {
            wrapper.classList.add('draw-mode');
            this.cropBtn.textContent = '🛑 Anuluj Przycinanie';
            this.cropBtn.style.background = '#dc3545';
            this.cropBtn.style.color = 'white';
        } else {
            wrapper.classList.remove('draw-mode');
            this.cropBtn.textContent = '✂️ Przytnij Obraz';
            this.cropBtn.style.background = '';
            this.cropBtn.style.color = '';
        }
    }

    resetAdjustments() {
        this.adjustments.brightness = 0;
        this.adjustments.contrast = 100;
        this.adjustments.saturation = 100;
        this.adjustments.sharpness = 0;
        this.adjustments.vignette = 0;
        this.adjustments.temperature = 0;
        this.adjustments.colorFilter = 'none';
        
        // Update UI
        this.brightnessSlider.value = 0;
        this.brightnessLabel.textContent = '0';
        this.contrastSlider.value = 100;
        this.contrastLabel.textContent = '100%';
        this.saturationSlider.value = 100;
        this.saturationLabel.textContent = '100%';
        this.sharpnessSlider.value = 0;
        this.sharpnessLabel.textContent = '0';
        this.vignetteSlider.value = 0;
        this.vignetteLabel.textContent = '0%';
        this.temperatureSlider.value = 0;
        this.temperatureLabel.textContent = '0';
        
        document.querySelectorAll('[data-effect]').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-effect="none"]').classList.add('active');
        
        this.saveState();
        this.applyAdjustments();
    }

    async detectAndCensor() {
        if (this.detectionMode === 'nsfw') {
            await this.detectNSFW();
        } else {
            await this.detectObjects();
        }
    }
    
    async detectNSFW() {
        if (!this.nsfwModel) {
            alert('Model NSFW nie jest jeszcze załadowany. Proszę czekać...');
            return;
        }

        this.showLoading(true);
        
        try {
            // NSFWJS classifies the entire image
            const predictions = await this.nsfwModel.classify(this.canvas);
            console.log('Predykcje NSFW:', predictions);
            
            // Find predictions matching selected categories
            const nsfwDetected = predictions.filter(p => 
                this.selectedNSFWCategories.has(p.className)
            );
            
            if (nsfwDetected.length === 0) {
                const categoriesText = Array.from(this.selectedNSFWCategories)
                    .map(cat => this.nsfwCategories.find(c => c.id === cat)?.label || cat)
                    .join(', ');
                alert(`Nie wykryto treści NSFW (${categoriesText}) na tym zdjęciu.`);
            } else {
                // NSFW model classifies whole image, so censor the entire image
                // or we can censor based on confidence threshold
                const highestNSFW = nsfwDetected[0];
                const confidenceThreshold = this.confidenceSlider.value / 100;
                
                if (highestNSFW.probability >= confidenceThreshold) {
                    // Censor entire image
                    this.censorAreas.push({
                        x: 0,
                        y: 0,
                        width: this.canvas.width,
                        height: this.canvas.height
                    });
                    
                    this.saveState();
                    this.applyCensorship();
                    
                    const categoryLabel = this.nsfwCategories.find(c => c.id === highestNSFW.className)?.label || highestNSFW.className;
                    alert(`Wykryto treści: ${categoryLabel} (${Math.round(highestNSFW.probability * 100)}% pewności)`);
                } else {
                    alert(`Wykryto treści NSFW, ale poniżej progu pewności (${Math.round(highestNSFW.probability * 100)}% < ${Math.round(confidenceThreshold * 100)}%)`);
                }
            }
        } catch (error) {
            console.error('Błąd wykrywania NSFW:', error);
            alert('Wystąpił błąd podczas wykrywania treści NSFW.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async detectObjects() {
        if (!this.cocoModel) {
            alert('Model wykrywania obiektów nie jest jeszcze załadowany. Proszę czekać...');
            return;
        }

        this.showLoading(true);
        
        try {
            const predictions = await this.cocoModel.detect(this.canvas);
            console.log('Wykryto obiekty:', predictions);

            const confidenceThreshold = this.confidenceSlider.value / 100;
            const detectedObjects = predictions.filter(p => 
                this.selectedCategories.has(p.class) && p.score >= confidenceThreshold
            );
            
            if (detectedObjects.length === 0) {
                const categoriesText = Array.from(this.selectedCategories).join(', ');
                alert(`Nie wykryto żadnych obiektów (${categoriesText}) na zdjęciu z wybranym poziomem pewności.`);
            } else {
                const areaPercentage = this.areaPercentageSlider.value / 100;
                
                detectedObjects.forEach(obj => {
                    const [x, y, w, h] = obj.bbox;
                    const censorHeight = h * areaPercentage;
                    const censorY = y;
                    
                    this.censorAreas.push({
                        x: x,
                        y: censorY,
                        width: w,
                        height: censorHeight
                    });
                });
                
                this.saveState();
                this.applyCensorship();
            }
        } catch (error) {
            console.error('Błąd wykrywania:', error);
            alert('Wystąpił błąd podczas wykrywania.');
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

    handleMouseDown(e) {
        const rect = this.overlayCanvas.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        
        if (this.drawMode || this.cropMode) {
            this.isDrawing = true;
        }
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        const rect = this.overlayCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Draw preview rectangle
        this.overlayCtx.strokeStyle = this.cropMode ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
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

    handleMouseUp(e) {
        if (!this.isDrawing) return;
        
        this.isDrawing = false;
        const rect = this.overlayCanvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const width = endX - this.startX;
        const height = endY - this.startY;

        if (Math.abs(width) > 10 && Math.abs(height) > 10) {
            if (this.cropMode) {
                this.cropImage(
                    Math.min(this.startX, endX),
                    Math.min(this.startY, endY),
                    Math.abs(width),
                    Math.abs(height)
                );
                this.toggleCropMode();
            } else if (this.drawMode) {
                this.censorAreas.push({
                    x: Math.min(this.startX, endX),
                    y: Math.min(this.startY, endY),
                    width: Math.abs(width),
                    height: Math.abs(height)
                });
                this.saveState();
                this.applyCensorship();
            }
        }
        
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }

    cropImage(x, y, width, height) {
        // Create temp canvas with cropped area
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = width;
        tempCanvas.height = height;
        
        // Copy cropped area
        tempCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
        
        // Update main canvas
        this.canvas.width = width;
        this.canvas.height = height;
        this.overlayCanvas.width = width;
        this.overlayCanvas.height = height;
        this.ctx.drawImage(tempCanvas, 0, 0);
        
        // Create new image from canvas
        const img = new Image();
        img.onload = () => {
            this.image = img;
            // Clear censor areas after crop (inform user via console)
            if (this.censorAreas.length > 0) {
                console.log('Uwaga: Obszary cenzury zostały wyczyszczone po przycięciu obrazu.');
            }
            this.censorAreas = [];
            this.saveState();
        };
        img.src = this.canvas.toDataURL();
    }

    applyCensorship() {
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
                const pixelIndex = (y * area.width + x) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                
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
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        const padding = 30;
        const x = Math.max(0, area.x - padding);
        const y = Math.max(0, area.y - padding);
        const width = Math.min(this.canvas.width - x, area.width + padding * 2);
        const height = Math.min(this.canvas.height - y, area.height + padding * 2);
        
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(this.canvas, x, y, width, height, 0, 0, width, height);
        
        this.ctx.filter = 'blur(25px)';
        this.ctx.drawImage(tempCanvas, 0, 0, width, height, x, y, width, height);
        this.ctx.filter = 'none';
    }

    emojiArea(area, index) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
        
        const emojiSize = Math.min(area.width, area.height) * 0.6;
        this.ctx.font = `${emojiSize}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const emojis = ['😎', '🙈', '🤐', '🤫', '😶', '🫣'];
        const emoji = emojis[index % emojis.length];
        
        this.ctx.fillText(emoji, area.x + area.width / 2, area.y + area.height / 2);
    }

    clearCensorship() {
        this.censorAreas = [];
        this.saveState();
        this.renderImage();
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    saveState() {
        // Remove any states after current index
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add current state
        const state = {
            imageData: this.canvas.toDataURL(),
            censorAreas: JSON.parse(JSON.stringify(this.censorAreas)),
            adjustments: JSON.parse(JSON.stringify(this.adjustments))
        };
        
        this.history.push(state);
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            // Keep historyIndex at the end since we removed the oldest item
            // historyIndex stays the same (pointing to the last item)
        } else {
            this.historyIndex++;
        }
        
        this.updateHistoryButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
            this.updateHistoryButtons();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
            this.updateHistoryButtons();
        }
    }

    restoreState(state) {
        const img = new Image();
        img.onload = () => {
            this.image = img;
            this.censorAreas = JSON.parse(JSON.stringify(state.censorAreas));
            this.adjustments = JSON.parse(JSON.stringify(state.adjustments));
            
            // Update UI sliders
            this.brightnessSlider.value = this.adjustments.brightness;
            this.brightnessLabel.textContent = this.adjustments.brightness;
            this.contrastSlider.value = this.adjustments.contrast;
            this.contrastLabel.textContent = this.adjustments.contrast + '%';
            this.saturationSlider.value = this.adjustments.saturation;
            this.saturationLabel.textContent = this.adjustments.saturation + '%';
            this.sharpnessSlider.value = this.adjustments.sharpness;
            this.sharpnessLabel.textContent = this.adjustments.sharpness;
            this.vignetteSlider.value = this.adjustments.vignette;
            this.vignetteLabel.textContent = this.adjustments.vignette + '%';
            this.temperatureSlider.value = this.adjustments.temperature;
            this.temperatureLabel.textContent = this.adjustments.temperature;
            
            this.displayImage();
        };
        img.src = state.imageData;
    }

    updateHistoryButtons() {
        this.undoBtn.disabled = this.historyIndex <= 0;
        this.redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
    
    toggleCategory(category) {
        if (this.selectedCategories.has(category)) {
            this.selectedCategories.delete(category);
        } else {
            this.selectedCategories.add(category);
        }
        this.updateCategoryDisplay();
    }
    
    selectAllCategories() {
        this.selectedCategories = new Set(this.cocoCategories);
        this.updateCategoryCheckboxes();
        this.updateCategoryDisplay();
    }
    
    deselectAllCategories() {
        this.selectedCategories.clear();
        this.updateCategoryCheckboxes();
        this.updateCategoryDisplay();
    }
    
    updateCategoryCheckboxes() {
        this.cocoCategories.forEach(category => {
            const checkbox = document.getElementById(`category-${category.replace(/\s+/g, '-')}`);
            if (checkbox) {
                checkbox.checked = this.selectedCategories.has(category);
            }
        });
    }
    
    updateCategoryDisplay() {
        const display = document.getElementById('selectedCategoriesDisplay');
        if (display) {
            const count = this.selectedCategories.size;
            if (count === 0) {
                display.textContent = 'Brak wybranych kategorii';
                display.style.color = '#e74c3c';
            } else if (count === this.cocoCategories.length) {
                display.textContent = 'Wszystkie kategorie wybrane';
                display.style.color = '#27ae60';
            } else {
                const categories = Array.from(this.selectedCategories).slice(0, 3).join(', ');
                const remaining = count > 3 ? ` (+${count - 3} więcej)` : '';
                display.textContent = `${categories}${remaining}`;
                display.style.color = '#3498db';
            }
        }
    }

    reset() {
        this.censorAreas = [];
        this.image = null;
        this.originalImage = null;
        this.fileInput.value = '';
        this.uploadSection.style.display = 'block';
        this.editorSection.style.display = 'none';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        // Reset adjustments
        this.resetAdjustments();
        
        // Reset history
        this.history = [];
        this.historyIndex = -1;
        this.updateHistoryButtons();
        
        if (this.drawMode) {
            this.toggleDrawMode();
        }
        if (this.cropMode) {
            this.toggleCropMode();
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
