# Clinical Study Extraction System - AI Agent Instructions

## Project Overview
This is a comprehensive clinical data extraction web application that processes PDF research papers and extracts structured data with AI assistance. The system includes advanced systematic review workflow management, interactive coordinate visualization, and dual database architecture for complete audit compliance. The entire application is contained in `index.html` as a self-contained system.

## Systematic Review Architecture

### Sequential Processing Workflow
- **Randomized Queue**: Fisher-Yates shuffle algorithm for article randomization
- **Completion Gates**: Sequential processing prevents article skipping
- **Progress Persistence**: Save/resume functionality across research sessions
- **Dual Database System**: Separate main data and coordinate trace databases

### Queue Management
```javascript
AppState = {
    baseArticles: [...],           // Original 21 articles
    randomizedQueue: [...],        // Shuffled processing order
    currentQueueIndex: 0,          // Current position in queue
    articleProgress: {},           // Progress tracking per article
    completedArticles: [],         // Finished articles list
    mainDatabase: [],              // Form data storage
    traceDatabase: []              // Coordinate data storage
}
```

## Architecture & Key Components

### Three-Panel Layout System
- **Form Panel (35%)**: Multi-step form with 8 sections for clinical data
- **PDF Panel (45%)**: PDF.js-powered viewer with text selection and annotation
- **Trace Panel (20%)**: Real-time extraction logging and audit trail

### Critical State Management Pattern
```javascript
const AppState = {
    pdfDoc: null,           // PDF.js document object
    currentPage: 1,         // Current PDF page
    activeField: null,      // Currently selected form field ID
    extractions: [],        // All extraction records
    pdfText: '',           // Full document text for AI processing
    pageTexts: {},         // Text indexed by page number
}
```

### Extraction Manager Class Pattern
The `ExtractionManager` class handles all data extraction operations:
- Maintains extraction history with undo capability
- Tracks field mappings and coordinates
- Manages localStorage persistence
- Provides audit trail functionality

## Development Workflows

### PDF Processing Pipeline
1. Load PDF → Extract all text → Render with text layer → Enable selection
2. Text selection creates bounding boxes with precise coordinates
3. Extractions are immediately logged with full traceability

### AI Integration (Gemini API)
- Uses Google's Gemini API for automated field extraction
- Prompts include field definitions and document context
- API key stored in localStorage with validation
- Fallback to manual extraction if AI fails

## Project-Specific Conventions

### Form Field Linking Pattern
All extractable fields use `.linked-input` class and specific data attributes:
```html
<input type="text" id="doi" name="doi" class="linked-input">
```

### Visual State Management
- `.active-extraction`: Highlights currently selected field
- `.has-extraction`: Marks fields with extracted data
- `.extraction-marker`: PDF overlay showing extraction locations

### Coordinate System
Extraction coordinates use PDF.js viewport coordinates:
```javascript
{
    x: number,     // Left position in pixels
    y: number,     // Top position in pixels  
    width: number, // Width in pixels
    height: number // Height in pixels
}
```

### Interactive Coordinate Visualization System

#### Visualizer Architecture
- **Full-Screen Modal**: Dedicated coordinate mapping interface
- **Three-Panel Layout**: Field list (300px) | PDF viewer (flex) | Details (300px)
- **Multi-Article Support**: Switch between current and completed articles
- **Real-Time Sync**: Coordinate previews from trace log entries

#### Coordinate Mapping Patterns
```javascript
const VizState = {
    currentArticle: null,          // Selected article for visualization
    currentPage: 1,                // Current page in visualizer
    activeExtractions: new Set(),  // Currently visible extractions
    hoveredExtraction: null        // Mouse-over extraction details
}
```

#### Navigation Integration
- **Click-to-Navigate**: Trace log entries jump to PDF coordinates
- **Hover Previews**: Instant coordinate popup previews
- **Cross-Reference**: Bi-directional navigation between main and visualizer
- **Marker Synchronization**: Visual highlighting across interfaces

## Critical Integration Points

### PDF.js Text Layer
Text selection requires precise coordinate mapping between canvas and text layers. The `enableTextSelection()` function handles mouse events and coordinate calculations.

### Export System
Four export formats supported:
- **JSON**: Complete extraction data with metadata
- **CSV**: Tabular format for analysis
- **HTML Audit**: Detailed traceability report
- **Annotated PDF**: Original PDF with extraction markers (uses pdf-lib)

### Validation & Error Handling
- Form validation uses `.validation-status` indicators
- Status messages via `showStatus()` function
- Graceful fallbacks for API failures

## Development Guidelines

### When Adding New Form Fields
1. Add `.linked-input` class for extractability
2. Include validation status container
3. Update `getStepFields()` for AI extraction
4. Test coordinate mapping on PDF selection
5. Ensure field appears in systematic review validation

### When Modifying PDF Rendering
- Maintain text layer opacity for selection
- Preserve coordinate transformation logic
- Test marker positioning after changes
- Verify visualizer coordinate accuracy
- Test across different PDF zoom levels

### When Extending Systematic Review Features
- Maintain sequential processing integrity
- Update both main and trace databases
- Preserve randomization seed for reproducibility
- Test save/resume functionality
- Validate completion gate logic

### When Adding Visualization Features
- Follow VizState pattern for state management
- Maintain coordinate precision across scaling
- Test multi-article switching
- Ensure marker synchronization
- Validate export compatibility

### When Extending Export Features
- Follow the blob creation pattern in existing exports
- Include metadata and timestamp information
- Maintain audit trail integrity
- Add coordinate data to all relevant exports
- Test with both current and completed articles

## Testing Considerations

### PDF Processing
- Test with various PDF formats and text encodings
- Verify coordinate accuracy across different zoom levels
- Validate text selection with complex layouts
- Test marker positioning after zoom changes

### Systematic Review Workflow
- Validate randomization algorithm consistency
- Test save/resume across browser sessions
- Verify completion gates prevent article skipping
- Test progress persistence in localStorage
- Validate database integrity across articles

### Interactive Visualization
- Test coordinate accuracy in visualizer vs main interface
- Verify marker positioning across different article types
- Test multi-article switching and data persistence
- Validate export functionality for interactive maps
- Test hover and click interactions

### AI Integration
- Validate AI extraction with edge cases
- Test fallback to manual extraction
- Verify API error handling
- Test with different document lengths

### Data Persistence
- Ensure localStorage persistence works correctly
- Test data recovery after browser restart
- Validate database export/import functionality
- Test with localStorage size limits

## Performance Notes

### PDF Processing
- PDF text extraction is done once on load and cached
- Large PDFs are limited to 30,000 characters for AI processing
- Text layers are preserved for coordinate accuracy

### Memory Management
- Undo stack is limited to 50 operations to prevent memory issues
- Extraction markers are cleaned up on page navigation
- Visualizer state is isolated to prevent memory leaks

### Storage Optimization
- localStorage is used for all persistence (5MB browser limit)
- Coordinate data is compressed for storage efficiency
- Database exports clear unused data

### Rendering Performance
- PDF pages are rendered on-demand
- Markers are virtualized for large extraction sets
- Visualizer uses efficient coordinate scaling
- Search highlights are optimized for large documents