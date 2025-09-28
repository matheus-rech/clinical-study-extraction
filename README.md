# Clinical Study Extraction System

A comprehensive web-based application for extracting structured data from clinical research PDF papers with AI assistance and full audit traceability.

## 🎯 Overview

This system provides a complete solution for clinical researchers to extract standardized data from research papers. It combines manual text selection with AI-powered extraction using Google's Gemini API, while maintaining complete audit trails for regulatory compliance.

## ✨ Key Features

### Core Extraction
- **📄 PDF Processing**: Advanced PDF.js integration with pixel-perfect text selection
- **🤖 AI Extraction**: Automated field extraction using Google Gemini API
- **📊 Multi-Step Forms**: 8-section clinical data extraction workflow
- **🔍 Real-time Tracking**: Complete audit trail with coordinate-level precision

### Systematic Review Workflow
- **� Sequential Processing**: Randomized article queue with completion gates
- **💾 Save/Resume**: Progress persistence across research sessions
- **� Dual Databases**: Separate main data and trace coordinate databases
- **🎯 Progress Tracking**: Visual progress indicators and completion status

### Interactive Visualization
- **🗺️ Coordinate Mapping**: Interactive visualization of extraction coordinates
- **📍 Click Navigation**: Navigate directly from trace logs to PDF locations
- **🎯 Full-Screen Visualizer**: Dedicated coordinate mapping interface
- **📤 Interactive Exports**: Standalone HTML maps with coordinate overlays

### Export & Compliance
- **📤 Multiple Formats**: JSON, CSV, HTML audit reports, annotated PDFs
- **� Complete SR Export**: Consolidated systematic review summaries
- **🔒 Audit Compliance**: Regulatory-grade traceability and verification
- **⚡ Single File**: Entire application contained in one HTML file

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key (optional, for AI features)
- PDF files of clinical studies to extract from

### Installation

1. **Download the application**:
   ```bash
   git clone <repository-url>
   cd form-to-sr-extraction
   ```

2. **Open the application**:
   - Simply open `index.html` in your web browser
   - No build process or dependencies required

3. **Configure AI (Optional)**:
   - Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Enter the key in the "AI Configuration" section
   - Test the connection using the "Test" button

## 📖 Usage Guide

### Basic Workflow

1. **Systematic Review Setup**:
   - Place all PDF articles in the `Articles/` folder
   - The system automatically detects and lists all articles
   - Track progress across your entire review

2. **Load PDF**:
   - Click "� Show Articles List" to see all available studies
   - Select an article from the list, or use "📁 Load PDF" for individual files
   - The system extracts all text for AI processing

3. **Navigate the Form**:
   - Use the 8-step form covering all clinical data points
   - Progress bar shows completion status

4. **Extract Data**:
   - **Manual**: Click form field → highlight text in PDF → automatic extraction
   - **AI**: Click "✨ AI Extract" button for automated extraction

5. **Review & Export**:
   - Monitor extractions in the trace panel
   - Export individual study data or complete systematic review summary

### Form Sections

1. **Study ID**: Citation, DOI, PMID, journal details
2. **Eligibility**: Population, intervention, comparator criteria  
3. **Baseline**: Demographics and clinical characteristics
4. **Methods**: Study design and randomization
5. **Interventions**: Detailed treatment protocols
6. **Outcomes**: Primary and secondary endpoints
7. **Results**: Statistical findings and effect sizes
8. **Risk of Bias**: Quality assessment ratings

### PDF Navigation

- **Page Controls**: Navigate with ◄/► buttons or page input
- **Zoom**: Multiple zoom levels and fit-to-width option
- **Search**: Find text within PDFs using the search box
- **Keyboard Shortcuts**:
  - `Ctrl+O`: Open PDF file
  - `Ctrl+F`: Focus search box
  - `Ctrl+Z`: Undo last extraction
  - `←/→`: Navigate pages

## 🔧 Advanced Features

### Extraction Tracking

Every extraction is logged with:
- **Coordinates**: Pixel-perfect positioning on PDF
- **Method**: Manual vs AI extraction
- **Timestamp**: When extraction occurred
- **Audit Trail**: Complete traceability

### Export Options

#### Individual Article Exports
- **📄 JSON**: Complete extraction data with metadata and coordinates
- **📊 CSV**: Tabular format with coordinate columns for analysis
- **📋 HTML Audit**: Detailed traceability report with coordinate verification
- **📑 Annotated PDF**: Original PDF with extraction markers overlaid

#### Systematic Review Exports
- **� Main Data CSV**: Consolidated form data across all completed articles
- **📍 Trace Data CSV**: Complete coordinate database with pixel-level precision
- **📋 Complete SR Export**: Comprehensive JSON with queue status and metadata
- **🗺️ Interactive HTML Maps**: Standalone coordinate visualization files

#### Advanced Features
- **🎯 Coordinate Integration**: All exports include precise coordinate data
- **📅 Timestamp Tracking**: Complete audit trail with extraction timing
- **🔒 Verification Hashes**: Document integrity verification for compliance
- **📈 Progress Summaries**: Statistical breakdowns of extraction methods
- **🔄 Resume Capability**: Export current state for later resumption

### AI Integration

The system uses Google's Gemini API for:
- **Automated Extraction**: Analyze entire documents
- **Field Mapping**: Intelligent field detection
- **Context Understanding**: Clinical terminology recognition
- **Fallback Support**: Manual extraction always available

### Interactive Coordinate Visualization

The system provides comprehensive coordinate mapping:

#### Full-Screen Visualizer
- **🎯 Interactive Coordinate Map**: Dedicated full-screen interface
- **Three-Panel Layout**: Field list, PDF view, coordinate details
- **Multi-Article Support**: Switch between completed articles
- **Page Navigation**: Browse through PDF pages with overlay markers

#### Coordinate Features
- **Pixel-Perfect Markers**: Exact extraction locations on PDF
- **Click Navigation**: Jump from trace log to PDF coordinates
- **Hover Details**: Preview extraction information on mouse-over
- **Method Indicators**: Visual distinction between AI and manual extractions

#### Export Options
- **🗺️ Interactive HTML Maps**: Standalone coordinate visualization files
- **📍 Trace Database CSV**: Complete coordinate data with metadata
- **🎯 Coordinate Preview**: Quick popup previews from trace log
- **📋 Audit Integration**: Coordinates included in compliance reports

#### Navigation Controls
- **Field List**: Browse extractions grouped by page
- **Page Controls**: Navigate PDF pages within visualizer
- **Show/Hide All**: Toggle extraction marker visibility
- **Jump to Original**: Return to main interface from visualizer

## 🏗️ Architecture

### Three-Panel Layout
```
┌─────────────┬──────────────────┬────────────┐
│ Form Panel  │   PDF Viewer     │ Trace Log  │
│   (35%)     │     (45%)        │   (20%)    │
│             │                  │            │
│ Multi-step  │ PDF.js with      │ Extraction │
│ clinical    │ text selection   │ audit      │
│ data form   │ and annotations  │ trail      │
└─────────────┴──────────────────┴────────────┘
```

### Key Components

- **AppState**: Global state management
- **ExtractionManager**: Handles all extraction operations
- **PDF Pipeline**: Load → Extract → Render → Select
- **Export System**: Multiple format generators

## 🔒 Data Security

- **Local Processing**: All data stays in your browser
- **No Server**: No data transmitted except to Gemini API
- **API Key Storage**: Stored locally, never transmitted to third parties
- **Audit Compliance**: Complete extraction traceability

## 🛠️ Development

### Project Structure
```
form-to-sr-extraction/
├── index.html              # Complete application
├── README.md              # This file
├── Articles/               # PDF studies for systematic review
│   ├── Lindeskog 2018.pdf
│   ├── Chen1992.pdf
│   ├── Fernandes 2022.pdf
│   └── ... (21 total articles)
└── .github/
    └── copilot-instructions.md  # AI agent guidance
```

### Key Classes & Functions

- `ExtractionManager`: Core extraction logic
- `AppState`: Application state management
- `enableTextSelection()`: PDF text selection handling
- `aiExtractStep()`: AI-powered extraction
- `exportJSON()`, `exportCSV()`: Export implementations

### Adding New Features

1. **New Form Fields**: Add `.linked-input` class and update `getStepFields()`
2. **Export Formats**: Follow blob creation pattern in existing exports
3. **PDF Features**: Maintain coordinate transformation logic
4. **AI Prompts**: Update field definitions in `getStepFields()`

## 🐛 Troubleshooting

### Common Issues

**PDF Won't Load**:
- Check file format (PDF only)
- Try a different browser
- Ensure file isn't password protected

**AI Extraction Fails**:
- Verify API key is valid
- Check internet connection
- PDF text may be image-based (use manual extraction)

**Text Selection Not Working**:
- Ensure PDF has selectable text
- Try zooming in/out
- Refresh the page and reload PDF

**Export Issues**:
- Check browser popup blockers
- Ensure sufficient browser storage
- Try different export format

### Browser Compatibility

- **Chrome**: Full support ✅
- **Firefox**: Full support ✅  
- **Safari**: Full support ✅
- **Edge**: Full support ✅
- **Mobile**: Limited (desktop recommended)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test thoroughly with different PDF types
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the troubleshooting section above
- Review the `.github/copilot-instructions.md` for development guidance
- Open an issue in the repository

## 🧪 Testing & Quality Assurance

### Comprehensive End-to-End Testing
- **12 Test Suites**: Complete coverage of all application features
- **50+ Test Cases**: Basic functionality, PDF handling, systematic review workflow
- **Multi-Browser Support**: Chrome, Firefox, Safari, Mobile Chrome/Safari
- **Accessibility Testing**: WCAG 2.1 compliance verification
- **Performance Monitoring**: Load time and responsiveness benchmarks

### Testing Infrastructure
```bash
# Install testing dependencies
npm install

# Install Playwright browsers  
npm run install:browsers

# Run all tests
npm test

# Run with UI visible
npm run test:headed

# Interactive debugging
npm run test:debug
```

### Codex-powered GitLab pipeline
- `.gitlab-ci.yml` integrates Codex CLI stages for Code Quality, security triage, and optional remediation.
- Requires a masked `OPENAI_API_KEY` CI variable and a Linux runner with internet egress.
- See `docs/gitlab-codex-ci.md` for setup details, prompt tuning, and troubleshooting tips.

### Codex-powered GitHub Actions
- `.github/workflows/codex-secure-quality.yml` mirrors the Codex pipeline for repositories hosted on GitHub.
- Set the repository secret `OPENAI_API_KEY` and ensure runners can reach `api.openai.com`.
- See `docs/github-codex-ci.md` for job breakdowns, artifact expectations, and local prompt iteration guidance.

### CI/CD Integration
- **GitHub Actions**: Automated testing on push/PR
- **Matrix Testing**: Parallel execution across browsers
- **Artifact Collection**: Screenshots, videos, reports
- **Quality Gates**: Accessibility and performance validation

See [tests/README.md](tests/README.md) for detailed testing documentation.

## 📊 Technical Specifications

- **File Size**: Single HTML file (~50KB)
- **Dependencies**: PDF.js, pdf-lib, jsPDF (CDN)
- **Storage**: localStorage for persistence
- **API**: Google Gemini 1.5 Flash
- **Export Formats**: JSON, CSV, HTML, PDF
- **Browser Storage**: ~5MB limit for extractions
- **Testing**: Playwright with 50+ end-to-end tests

---

**Built for clinical researchers, by clinical researchers** 🔬