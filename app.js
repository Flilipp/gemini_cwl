// CensorCraft - Main Application with Advanced Editing Features

// Constants
const ARC_BOUNDING_BOX_PADDING = 20;

class CensorCraft {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.overlayCanvas = document.getElementById('overlayCanvas');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        this.bodyPixModel = null;  // For body part segmentation
        this.nsfwModel = null;     // For NSFW content detection
        this.image = null;
        this.originalImage = null;
        this.censorAreas = [];
        this.isDrawing = false;
        this.drawMode = false;
        this.cropMode = false;
        this.arcMode = false;
        this.arcPoints = [];
        this.customTexture = null;
        this.startX = 0;
        this.startY = 0;
        
        // Model loading state
        this.modelsLoading = false;
        this.bodyPixLoading = false;
        this.nsfwLoading = false;
        this.isMobile = this.isMobileUserAgent();
        
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
        
        // Body parts for Beta community censorship
        // BodyPix part indices reference:
        // 0,1: left/right face | 2,3: left/right upper arm back | 4,5: left/right upper arm front
        // 6,7: left/right lower arm back | 8,9: left/right lower arm front | 10,11: left/right hand
        // 12,13: torso front/back | 14,15: left/right upper leg front | 16,17: left/right upper leg back
        // 18,19: left/right lower leg front | 20,21: left/right lower leg back | 22,23: left/right foot
        this.bodyParts = [
            { id: 'face', label: 'Twarz', description: 'Cała twarz', bodyPixParts: [0, 1] },
            { id: 'eyes', label: 'Oczy', description: 'Tylko oczy (górna część twarzy)', bodyPixParts: [0, 1], customMask: 'upper-face' },  // Will use custom logic for upper portion
            { id: 'chest', label: 'Piersi/Klatka', description: 'Obszar klatki piersiowej', bodyPixParts: [12] },  // torso front only
            { id: 'hands', label: 'Ręce/Dłonie', description: 'Dłonie i przedramiona', bodyPixParts: [6, 7, 8, 9, 10, 11] },  // arms and hands
            { id: 'armpits', label: 'Pachy', description: 'Obszar pod pachami', bodyPixParts: [4, 5] },  // upper arm front
            { id: 'navel', label: 'Brzuch/Pępek', description: 'Brzuch i okolice pępka', bodyPixParts: [12], customMask: 'lower-torso' },  // Lower part of torso front
            { id: 'genitals', label: 'Genitalia', description: 'Obszar intymny', bodyPixParts: [14, 15, 16, 17] },  // upper legs (groin area)
            { id: 'feet', label: 'Stopy', description: 'Stopy', bodyPixParts: [22, 23] },  // feet only
            { id: 'legs', label: 'Nogi', description: 'Całe nogi (bez stóp)', bodyPixParts: [14, 15, 16, 17, 18, 19, 20, 21] },  // all leg parts
            { id: 'buttocks', label: 'Pośladki', description: 'Tyłek', bodyPixParts: [13, 16, 17] }  // torso back + upper legs back
        ];
        
        // Detection mode: 'nsfw' or 'bodyparts'
        this.detectionMode = 'nsfw';
        
        // Selected NSFW categories to censor (default: explicit content)
        this.selectedNSFWCategories = new Set(['Porn', 'Hentai']);
        
        // Selected body parts to censor (default: none initially for Beta users to choose)
        this.selectedBodyParts = new Set([]);
        
        // Censorship settings
        this.censorColor = '#000000';
        this.censorOpacity = 1.0;
        
        // Pattern configuration
        this.patternConfig = {
            stripeWidth: 10,
            stripeColor1: '#000000',
            stripeColor2: '#FFFFFF',
            dotSize: 8,
            dotSpacing: 15,
            dotColor: '#000000',
            gridSize: 20,
            gridColor: '#000000'
        };
        
        // Mobile auto-detection threshold (in pixels)
        this.MAX_MOBILE_AUTO_DETECT_PIXELS = 1000000;  // 1 megapixel
        
        // Gradient colors (can be customized later)
        this.gradientColors = [
            'rgba(0, 0, 0, {opacity})',
            'rgba(128, 0, 128, {opacity})',
            'rgba(255, 0, 255, {opacity})'
        ];
        
        this.initializeElements();
        this.attachEventListeners();
        // Don't load models immediately - use lazy loading instead
    }
    
    isMobileUserAgent() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    isMobileDevice() {
        // Dynamic check that considers current window size
        return this.isMobileUserAgent() || window.innerWidth <= 768;
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
        
        // New censorship controls
        this.censorColorPicker = document.getElementById('censorColor');
        this.censorOpacitySlider = document.getElementById('censorOpacity');
        this.opacityLabel = document.getElementById('opacityLabel');
        this.colorPickerSection = document.getElementById('colorPickerSection');
        this.opacitySection = document.getElementById('opacitySection');
        
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
        
        // Custom texture elements
        this.textureInput = document.getElementById('textureInput');
        this.uploadTextureBtn = document.getElementById('uploadTextureBtn');
        this.textureUploadSection = document.getElementById('textureUploadSection');
        this.textureHint = document.getElementById('textureHint');
        
        // Arc mode button
        this.arcModeBtn = document.getElementById('arcModeBtn');
        
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
        
        if (this.arcModeBtn) {
            this.arcModeBtn.addEventListener('click', () => this.toggleArcMode());
        }
        
        // Custom texture upload
        if (this.uploadTextureBtn && this.textureInput) {
            this.uploadTextureBtn.addEventListener('click', () => this.textureInput.click());
            this.textureInput.addEventListener('change', (e) => this.handleTextureSelect(e));
        }
        
        // Censor style change - show/hide texture upload section
        if (this.censorStyleSelect && this.textureUploadSection) {
            this.censorStyleSelect.addEventListener('change', (e) => {
                const style = e.target.value;
                
                // Show texture upload section
                if (style === 'texture') {
                    this.textureUploadSection.style.display = 'block';
                } else {
                    this.textureUploadSection.style.display = 'none';
                }
                
                // Show color picker for colorbar
                if (style === 'colorbar') {
                    this.colorPickerSection.style.display = 'block';
                } else {
                    this.colorPickerSection.style.display = 'none';
                }
                
                // Show opacity control for applicable styles
                if (['colorbar', 'gradient', 'pattern-stripes', 'pattern-dots', 'pattern-grid'].includes(style)) {
                    this.opacitySection.style.display = 'block';
                } else {
                    this.opacitySection.style.display = 'none';
                }
                
                // Re-apply censorship with new style
                if (this.censorAreas.length > 0) {
                    this.renderImage();
                    this.applyCensorship();
                }
            });
        }
        
        // Canvas drawing - Mouse events
        this.overlayCanvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.overlayCanvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.overlayCanvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.overlayCanvas.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Canvas drawing - Touch events for mobile devices
        this.overlayCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling while drawing
            this.handleMouseDown(e);
        }, { passive: false });
        this.overlayCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling while drawing
            this.handleMouseMove(e);
        }, { passive: false });
        this.overlayCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleMouseUp(e);
        }, { passive: false });
        this.overlayCanvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.handleMouseUp(e);
        }, { passive: false });
        
        // Adjustment sliders
        if (this.areaPercentageSlider && this.areaPercentageLabel) {
            this.areaPercentageSlider.addEventListener('input', (e) => {
                this.areaPercentageLabel.textContent = e.target.value + '%';
            });
        }
        
        this.confidenceSlider.addEventListener('input', (e) => {
            this.confidenceLabel.textContent = e.target.value + '%';
        });
        
        // New censorship controls
        if (this.censorColorPicker) {
            this.censorColorPicker.addEventListener('input', (e) => {
                this.censorColor = e.target.value;
                if (this.censorAreas.length > 0) {
                    this.renderImage();
                    this.applyCensorship();
                }
            });
        }
        
        if (this.censorOpacitySlider && this.opacityLabel) {
            this.censorOpacitySlider.addEventListener('input', (e) => {
                this.censorOpacity = parseInt(e.target.value) / 100;
                this.opacityLabel.textContent = e.target.value + '%';
                if (this.censorAreas.length > 0) {
                    this.renderImage();
                    this.applyCensorship();
                }
            });
        }

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
            // Show body part categories
            this.bodyParts.forEach(bodyPart => {
                const item = document.createElement('div');
                item.className = 'category-item';
                if (this.selectedBodyParts.has(bodyPart.id)) {
                    item.classList.add('selected');
                }
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `category-${bodyPart.id}`;
                checkbox.checked = this.selectedBodyParts.has(bodyPart.id);
                
                const label = document.createElement('label');
                label.htmlFor = checkbox.id;
                label.innerHTML = `<strong>${bodyPart.label}</strong><br><small style="color: #666;">${bodyPart.description}</small>`;
                
                checkbox.addEventListener('change', () => {
                    this.toggleBodyPart(bodyPart.id);
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
        // This is now deprecated - use ensureModelLoaded instead
        await this.ensureModelsLoaded();
    }
    
    async ensureBodyPixLoaded() {
        if (this.bodyPixModel) return this.bodyPixModel;
        if (this.bodyPixLoading) {
            // Wait for ongoing load
            while (this.bodyPixLoading && !this.bodyPixModel) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.bodyPixModel;
        }
        
        this.bodyPixLoading = true;
        try {
            console.log('Ładowanie modelu BodyPix...');
            
            // Mobile-optimized settings
            const config = this.isMobileDevice() ? {
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.5,      // Lighter for mobile
                quantBytes: 2
            } : {
                architecture: 'MobileNetV1',
                outputStride: 16,
                multiplier: 0.75,     // Better quality for desktop
                quantBytes: 2
            };
            
            this.bodyPixModel = await this.retryLoad(
                () => bodyPix.load(config), 
                3,
                1000,
                'BodyPix'
            );
            console.log('Model BodyPix załadowany!');
            return this.bodyPixModel;
        } catch (error) {
            console.error('Błąd ładowania modelu BodyPix:', error);
            throw error;
        } finally {
            this.bodyPixLoading = false;
        }
    }
    
    async ensureNSFWLoaded() {
        if (this.nsfwModel) return this.nsfwModel;
        if (this.nsfwLoading) {
            // Wait for ongoing load
            while (this.nsfwLoading && !this.nsfwModel) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.nsfwModel;
        }
        
        this.nsfwLoading = true;
        try {
            console.log('Ładowanie modelu NSFW...');
            // Use bundled MobileNetV2 model which is included in the nsfwjs package
            // This avoids CDN issues with the default load() call
            this.nsfwModel = await this.retryLoad(
                () => nsfwjs.load('MobileNetV2'), 
                3,
                1000,
                'NSFW'
            );
            console.log('Model NSFW załadowany!');
            return this.nsfwModel;
        } catch (error) {
            console.error('Błąd ładowania modelu NSFW:', error);
            throw error;
        } finally {
            this.nsfwLoading = false;
        }
    }
    
    async ensureModelsLoaded() {
        if (this.modelsLoading) return;
        this.modelsLoading = true;
        
        try {
            this.showLoading(true, 'Ładowanie modeli AI...');
            
            // Load models based on detection mode to save bandwidth
            if (this.detectionMode === 'nsfw') {
                await this.ensureNSFWLoaded();
            } else {
                await this.ensureBodyPixLoaded();
            }
            
            this.showLoading(false);
            this.updateCategoryDisplay();
        } catch (error) {
            console.error('Błąd ładowania modeli:', error);
            this.showLoading(false);
            throw error;
        } finally {
            this.modelsLoading = false;
        }
    }
    
    async retryLoad(loadFn, maxRetries = 3, delayMs = 1000, modelName = 'Model') {
        for (let i = 0; i < maxRetries; i++) {
            let timeoutId;
            try {
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => reject(new Error(`${modelName} load timeout after 30s`)), 30000);
                });
                const result = await Promise.race([loadFn(), timeoutPromise]);
                clearTimeout(timeoutId);
                return result;
            } catch (error) {
                if (timeoutId) clearTimeout(timeoutId);
                console.warn(`Próba ${i + 1}/${maxRetries} nie powiodła się:`, error.message);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
            }
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
                
                // Disable auto-detection on mobile if image is large
                const shouldAutoDetect = this.autoDetectCheckbox.checked && 
                    (!this.isMobileDevice() || (img.width * img.height < this.MAX_MOBILE_AUTO_DETECT_PIXELS));
                
                if (shouldAutoDetect) {
                    setTimeout(() => this.detectAndCensor(), 500);
                } else if (this.isMobileDevice() && this.autoDetectCheckbox.checked) {
                    console.log('Auto-detection wyłączone dla dużych obrazów na urządzeniach mobilnych');
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayImage() {
        // Resize canvas to fit image while maintaining aspect ratio
        // More aggressive limits for mobile
        const maxWidth = this.isMobileDevice() ? 600 : 800;
        const maxHeight = this.isMobileDevice() ? 450 : 600;
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
            await this.detectBodyParts();
        }
    }
    
    async detectNSFW() {
        this.showLoading(true, 'Ładowanie modelu NSFW...');
        
        try {
            // Ensure NSFW model is loaded
            await this.ensureNSFWLoaded();
            
            this.showLoading(true, 'Wykrywanie treści NSFW...');
            
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
            let errorMessage = 'Wystąpił błąd podczas wykrywania treści NSFW.';
            if (error.message && error.message.includes('fetch')) {
                errorMessage += '\n\nProblem z połączeniem sieciowym. Sprawdź połączenie internetowe i spróbuj ponownie.';
            } else if (error.message) {
                errorMessage += `\n\nSzczegóły: ${error.message}`;
            }
            alert(errorMessage);
        } finally {
            this.showLoading(false);
        }
    }
    
    async detectBodyParts() {
        if (this.selectedBodyParts.size === 0) {
            alert('Wybierz przynajmniej jedną część ciała do cenzury.');
            return;
        }

        this.showLoading(true, 'Ładowanie modelu BodyPix...');
        
        try {
            // Ensure BodyPix model is loaded
            await this.ensureBodyPixLoaded();
            
            this.showLoading(true, 'Wykrywanie części ciała...');
            
            // Perform body part segmentation
            const segmentation = await this.bodyPixModel.segmentPersonParts(this.canvas);
            console.log('Segmentacja części ciała:', segmentation);
            
            if (!segmentation || segmentation.allPoses.length === 0) {
                alert('Nie wykryto osoby na zdjęciu.');
                this.showLoading(false);
                return;
            }
            
            // Get all body part IDs we want to censor
            const partsToCensor = new Set();
            this.selectedBodyParts.forEach(partId => {
                const bodyPart = this.bodyParts.find(p => p.id === partId);
                if (bodyPart) {
                    bodyPart.bodyPixParts.forEach(pixPart => partsToCensor.add(pixPart));
                }
            });
            
            // Create mask from segmentation data
            const { width, height, data } = segmentation;
            const imageData = this.ctx.getImageData(0, 0, width, height);
            
            // Find bounding boxes for selected body parts
            const partMasks = {};
            for (let i = 0; i < data.length; i++) {
                const partId = data[i];
                if (partId >= 0 && partsToCensor.has(partId)) {
                    if (!partMasks[partId]) {
                        partMasks[partId] = {
                            minX: width,
                            minY: height,
                            maxX: 0,
                            maxY: 0,
                            pixels: []
                        };
                    }
                    const x = i % width;
                    const y = Math.floor(i / width);
                    partMasks[partId].minX = Math.min(partMasks[partId].minX, x);
                    partMasks[partId].minY = Math.min(partMasks[partId].minY, y);
                    partMasks[partId].maxX = Math.max(partMasks[partId].maxX, x);
                    partMasks[partId].maxY = Math.max(partMasks[partId].maxY, y);
                    partMasks[partId].pixels.push({x, y});
                }
            }
            
            // Add censor areas for detected body parts
            Object.values(partMasks).forEach(mask => {
                if (mask.pixels.length > 0) {
                    this.censorAreas.push({
                        x: mask.minX,
                        y: mask.minY,
                        width: mask.maxX - mask.minX,
                        height: mask.maxY - mask.minY
                    });
                }
            });
            
            if (this.censorAreas.length === 0) {
                alert('Nie wykryto wybranych części ciała na zdjęciu.');
            } else {
                this.saveState();
                this.applyCensorship();
                alert(`Wykryto i ocenzurowano ${Object.keys(partMasks).length} części ciała.`);
            }
        } catch (error) {
            console.error('Błąd wykrywania części ciała:', error);
            alert('Wystąpił błąd podczas wykrywania części ciała.');
        } finally {
            this.showLoading(false);
        }
    }

    toggleDrawMode() {
        // Disable arc mode if active
        if (this.arcMode) {
            this.toggleArcMode();
        }
        
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

    toggleArcMode() {
        // Disable draw mode if active
        if (this.drawMode) {
            this.toggleDrawMode();
        }
        
        this.arcMode = !this.arcMode;
        const wrapper = document.querySelector('.canvas-wrapper');
        
        if (this.arcMode) {
            wrapper.classList.add('draw-mode');
            this.arcModeBtn.textContent = '🛑 Zakończ Rysowanie Łuków';
            this.arcModeBtn.style.background = '#dc3545';
            this.arcModeBtn.style.color = 'white';
            this.arcModeBtn.style.borderColor = '#dc3545';
            // Clear previous arc points
            this.arcPoints = [];
            alert('Tryb rysowania łuków: Klikaj aby dodać punkty, rysuj łuki między nimi. Kliknij ponownie aby zakończyć.');
        } else {
            wrapper.classList.remove('draw-mode');
            this.arcModeBtn.textContent = '🌙 Rysuj Łuki i Krzywe';
            this.arcModeBtn.style.background = '';
            this.arcModeBtn.style.color = '';
            this.arcModeBtn.style.borderColor = '';
            
            // If we have arc points, create censored area from them
            if (this.arcPoints.length >= 2) {
                this.createArcCensorArea();
            }
            this.arcPoints = [];
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        }
    }

    handleTextureSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    this.customTexture = img;
                    this.textureHint.textContent = `Wybrano: ${file.name}`;
                    this.textureHint.style.color = '#28a745';
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // Helper method to get proper canvas coordinates from mouse/touch events
    // This accounts for canvas scaling (CSS size vs actual canvas pixel dimensions)
    getCanvasCoordinates(e) {
        const rect = this.overlayCanvas.getBoundingClientRect();
        const scaleX = this.overlayCanvas.width / rect.width;
        const scaleY = this.overlayCanvas.height / rect.height;
        
        // Get the client coordinates from mouse or touch event
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            // Touch event (touchstart, touchmove)
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            // Touch end/cancel event (touchend, touchcancel)
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        // Calculate position relative to canvas and scale to actual canvas coordinates
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        
        return { x, y };
    }

    handleMouseDown(e) {
        const coords = this.getCanvasCoordinates(e);
        this.startX = coords.x;
        this.startY = coords.y;
        
        if (this.arcMode) {
            // Add point for arc drawing
            this.arcPoints.push({ x: this.startX, y: this.startY });
            this.drawArcPreview();
        } else if (this.drawMode || this.cropMode) {
            this.isDrawing = true;
        }
    }

    handleMouseMove(e) {
        if (!this.isDrawing) return;

        const coords = this.getCanvasCoordinates(e);
        const currentX = coords.x;
        const currentY = coords.y;

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
        const coords = this.getCanvasCoordinates(e);
        const endX = coords.x;
        const endY = coords.y;

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
            } else if (style === 'colorbar') {
                this.colorbarArea(area);
            } else if (style === 'gradient') {
                this.gradientArea(area);
            } else if (style === 'pattern-stripes') {
                this.stripesArea(area);
            } else if (style === 'pattern-dots') {
                this.dotsArea(area);
            } else if (style === 'pattern-grid') {
                this.gridArea(area);
            } else if (style === 'pixelate') {
                this.pixelateArea(area);
            } else if (style === 'blur') {
                this.blurArea(area);
            } else if (style === 'emoji') {
                this.emojiArea(area, index);
            } else if (style === 'texture') {
                this.textureArea(area);
            }
        });
    }
    
    colorbarArea(area) {
        this.ctx.globalAlpha = this.censorOpacity;
        this.ctx.fillStyle = this.censorColor;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
        this.ctx.globalAlpha = 1.0;
    }
    
    gradientArea(area) {
        const gradient = this.ctx.createLinearGradient(
            area.x, area.y, 
            area.x + area.width, area.y + area.height
        );
        
        // Apply gradient colors with opacity
        this.gradientColors.forEach((color, index) => {
            const stop = index / (this.gradientColors.length - 1);
            const colorWithOpacity = color.replace('{opacity}', this.censorOpacity);
            gradient.addColorStop(stop, colorWithOpacity);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }
    
    stripesArea(area) {
        this.ctx.globalAlpha = this.censorOpacity;
        const stripeWidth = this.patternConfig.stripeWidth;
        
        for (let x = area.x; x < area.x + area.width; x += stripeWidth * 2) {
            this.ctx.fillStyle = this.patternConfig.stripeColor1;
            this.ctx.fillRect(x, area.y, stripeWidth, area.height);
            this.ctx.fillStyle = this.patternConfig.stripeColor2;
            this.ctx.fillRect(x + stripeWidth, area.y, stripeWidth, area.height);
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    dotsArea(area) {
        this.ctx.globalAlpha = this.censorOpacity;
        this.ctx.fillStyle = this.patternConfig.dotColor;
        const dotSize = this.patternConfig.dotSize;
        const spacing = this.patternConfig.dotSpacing;
        
        for (let y = area.y; y < area.y + area.height; y += spacing) {
            for (let x = area.x; x < area.x + area.width; x += spacing) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    gridArea(area) {
        this.ctx.globalAlpha = this.censorOpacity;
        this.ctx.strokeStyle = this.patternConfig.gridColor;
        this.ctx.lineWidth = 2;
        const gridSize = this.patternConfig.gridSize;
        
        // Vertical lines
        for (let x = area.x; x <= area.x + area.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, area.y);
            this.ctx.lineTo(x, area.y + area.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = area.y; y <= area.y + area.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(area.x, y);
            this.ctx.lineTo(area.x + area.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1.0;
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

    textureArea(area) {
        if (!this.customTexture) {
            // Fallback to black bar if no texture uploaded
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(area.x, area.y, area.width, area.height);
            return;
        }
        
        // Create pattern from texture
        const pattern = this.ctx.createPattern(this.customTexture, 'repeat');
        if (!pattern) {
            // Fallback to black bar if pattern creation fails
            console.warn('Failed to create pattern from texture, using black bar instead');
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(area.x, area.y, area.width, area.height);
            return;
        }
        
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(area.x, area.y, area.width, area.height);
    }

    drawArcPreview() {
        this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        
        if (this.arcPoints.length === 0) return;
        
        // Draw all points
        this.overlayCtx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.arcPoints.forEach(point => {
            this.overlayCtx.beginPath();
            this.overlayCtx.arc(point.x, point.y, 5, 0, Math.PI * 2);
            this.overlayCtx.fill();
        });
        
        // Draw curves between points
        if (this.arcPoints.length >= 2) {
            this.overlayCtx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
            this.overlayCtx.lineWidth = 3;
            this.overlayCtx.beginPath();
            this.overlayCtx.moveTo(this.arcPoints[0].x, this.arcPoints[0].y);
            
            // Use quadratic curves for smooth arcs
            for (let i = 1; i < this.arcPoints.length; i++) {
                if (i < this.arcPoints.length - 1) {
                    // Calculate control point as midpoint between current and next point
                    const xc = (this.arcPoints[i].x + this.arcPoints[i + 1].x) / 2;
                    const yc = (this.arcPoints[i].y + this.arcPoints[i + 1].y) / 2;
                    this.overlayCtx.quadraticCurveTo(this.arcPoints[i].x, this.arcPoints[i].y, xc, yc);
                } else {
                    // Last point
                    this.overlayCtx.lineTo(this.arcPoints[i].x, this.arcPoints[i].y);
                }
            }
            
            this.overlayCtx.stroke();
        }
    }

    createArcCensorArea() {
        if (this.arcPoints.length < 2) return;
        
        // Find bounding box of all arc points with padding
        let minX = this.arcPoints[0].x;
        let maxX = this.arcPoints[0].x;
        let minY = this.arcPoints[0].y;
        let maxY = this.arcPoints[0].y;
        
        this.arcPoints.forEach(point => {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
        });
        
        // Add padding around the arc
        minX = Math.max(0, minX - ARC_BOUNDING_BOX_PADDING);
        minY = Math.max(0, minY - ARC_BOUNDING_BOX_PADDING);
        maxX = Math.min(this.canvas.width, maxX + ARC_BOUNDING_BOX_PADDING);
        maxY = Math.min(this.canvas.height, maxY + ARC_BOUNDING_BOX_PADDING);
        
        // Create censored area from bounding box
        this.censorAreas.push({
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        });
        
        this.saveState();
        this.applyCensorship();
    }

    clearCensorship() {
        this.censorAreas = [];
        this.arcPoints = [];
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
    
    toggleNSFWCategory(categoryId) {
        if (this.selectedNSFWCategories.has(categoryId)) {
            this.selectedNSFWCategories.delete(categoryId);
        } else {
            this.selectedNSFWCategories.add(categoryId);
        }
        this.updateCategoryDisplay();
    }
    
    toggleBodyPart(partId) {
        if (this.selectedBodyParts.has(partId)) {
            this.selectedBodyParts.delete(partId);
        } else {
            this.selectedBodyParts.add(partId);
        }
        this.updateCategoryDisplay();
    }
    
    selectAllCategories() {
        if (this.detectionMode === 'nsfw') {
            this.selectedNSFWCategories = new Set(this.nsfwCategories.map(c => c.id));
        } else {
            this.selectedBodyParts = new Set(this.bodyParts.map(p => p.id));
        }
        this.updateCategoryCheckboxes();
        this.updateCategoryDisplay();
    }
    
    deselectAllCategories() {
        if (this.detectionMode === 'nsfw') {
            this.selectedNSFWCategories.clear();
        } else {
            this.selectedBodyParts.clear();
        }
        this.updateCategoryCheckboxes();
        this.updateCategoryDisplay();
    }
    
    updateCategoryCheckboxes() {
        if (this.detectionMode === 'nsfw') {
            this.nsfwCategories.forEach(category => {
                const checkbox = document.getElementById(`category-${category.id}`);
                if (checkbox) {
                    checkbox.checked = this.selectedNSFWCategories.has(category.id);
                }
            });
        } else {
            this.bodyParts.forEach(part => {
                const checkbox = document.getElementById(`category-${part.id}`);
                if (checkbox) {
                    checkbox.checked = this.selectedBodyParts.has(part.id);
                }
            });
        }
    }
    
    updateCategoryDisplay() {
        const display = document.getElementById('selectedCategoriesDisplay');
        if (!display) return;
        
        if (this.detectionMode === 'nsfw') {
            const count = this.selectedNSFWCategories.size;
            if (count === 0) {
                display.textContent = 'Brak wybranych kategorii';
                display.style.color = '#e74c3c';
            } else {
                const categories = Array.from(this.selectedNSFWCategories)
                    .map(id => this.nsfwCategories.find(c => c.id === id)?.label || id)
                    .join(', ');
                display.textContent = categories;
                display.style.color = '#3498db';
            }
        } else {
            const count = this.selectedBodyParts.size;
            if (count === 0) {
                display.textContent = 'Brak wybranych części ciała';
                display.style.color = '#e74c3c';
            } else {
                const parts = Array.from(this.selectedBodyParts)
                    .map(id => this.bodyParts.find(p => p.id === id)?.label || id)
                    .slice(0, 3)
                    .join(', ');
                const remaining = count > 3 ? ` (+${count - 3} więcej)` : '';
                display.textContent = `${parts}${remaining}`;
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

    showLoading(show, message = 'Ładowanie...') {
        this.loading.style.display = show ? 'block' : 'none';
        if (show && message) {
            const loadingText = this.loading.querySelector('p');
            if (loadingText) {
                loadingText.textContent = message;
            }
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CensorCraft();
});
