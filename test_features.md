# Test Plan for New Features

## Features to Test

### ✅ Interface
- [ ] Tabs switch correctly (Censorship, Adjustments, Effects, Transformations)
- [ ] Each tab shows appropriate controls
- [ ] Buttons are responsive and look good

### ✅ Image Adjustments
- [ ] Brightness: slider works, value updates
- [ ] Contrast: slider works, value updates
- [ ] Saturation: slider works, value updates
- [ ] Sharpness: slider works, value updates
- [ ] Reset Adjustments: restores default values

### ✅ Effects
- [ ] Grayscale Filter: image becomes monochromatic
- [ ] Sepia Filter: image gets vintage look
- [ ] Inversion Filter: colors are inverted
- [ ] Vignette: image edges darken
- [ ] Temperature: image becomes warmer/cooler

### ✅ Transformations
- [ ] Rotate 90°: image rotates 90° to the right
- [ ] Rotate 180°: image rotates upside down
- [ ] Rotate 270°: image rotates 270° (or 90° to the left)
- [ ] Horizontal flip: image flips like a mirror
- [ ] Vertical flip: image flips top-bottom
- [ ] Cropping: can select and crop area

### ✅ History
- [ ] Undo button disabled at start
- [ ] After change, Undo activates
- [ ] Undo restores previous state
- [ ] Redo restores undone change
- [ ] History works for all types of changes

### ✅ Censorship (existing features)
- [ ] Automatic detection still works
- [ ] Drawing mode still works
- [ ] All censorship styles work
- [ ] Clear Censorship still works

### ✅ General
- [ ] Image download saves all changes
- [ ] New Image resets everything
- [ ] No errors in JavaScript console
- [ ] Application doesn't freeze

## Testing Instructions

1. Open `index.html` in browser
2. Open Developer Console (F12) and check for errors
3. Upload test image
4. Go through each tab and test controls
5. Try combinations of different effects
6. Check if Undo/Redo works correctly
7. Download final image and check if it contains all changes

## Known Limitations

- AI model may not work without internet connection (CDN)
- Very large images may be slower
- History limited to 20 steps (memory conservation)

## Test Results

Date: ___________
Tester: ___________

### Summary
- All features work: [ ] YES [ ] NO
- Found bugs: ___________
- Improvement suggestions: ___________
