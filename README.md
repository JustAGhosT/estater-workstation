# Estate-First SA Genealogy Research Workstation

A production-ready research platform for South African estate files with advanced form extraction, provenance tracking, and collaborative review capabilities.

## ✨ Features

### 🔍 Archive Navigator
- **MHG Resolution**: Paste references like `2322/60` to instantly locate estate packets
- **Smart Page Detection**: Automatic J294 form page range suggestions  
- **Multi-source Support**: TAB estate files (1951-1962 focus for MVP)

### 👁️ Advanced Document Viewer
- **Deep-zoom Interface**: OpenSeadragon-powered viewer with smooth navigation
- **Thumbnail Sidebar**: Quick page overview with suggested page indicators
- **Keyboard Navigation**: Arrow keys for efficient page browsing
- **Responsive Design**: Optimized for various screen sizes

### 🤖 AI-Powered Extraction
- **Form-Aware OCR**: Specialized J294 estate form recognition
- **Confidence Scoring**: Visual indicators for extraction reliability
- **Bounding Box Provenance**: Precise field-to-image mapping
- **Real-time Validation**: Instant feedback on data quality

### ✅ Review & Approval Workflow
- **Collaborative Editing**: Multi-user review capabilities
- **Confidence-Based UI**: Color-coded fields (green >90%, yellow 70-90%, red <70%)
- **Field-Level Citations**: Complete provenance chain for every data point
- **Audit Trail**: Comprehensive change tracking

### 📤 Export & Integration
- **Provenance Packages**: JSON + PDF + thumbnails for complete documentation
- **Citation Standards**: Genealogy-compliant source referencing
- **Multiple Formats**: JSON for APIs, PDF for human readers
- **Archive-Ready**: Professional documentation standards

### 👥 Security & Collaboration
- **RBAC System**: Researcher, Reviewer, and Admin roles
- **Immutable Audit**: Complete action logging with timestamps
- **User-Scoped Access**: Secure credential management
- **Real-time Metrics**: Performance and quality dashboards

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker Desktop (for local development services)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository>
   cd estate-workstation
   corepack enable
   pnpm install
   ```

2. **Start development services**
   ```bash
   docker-compose up -d
   # Starts: Postgres, Neo4j, MinIO, OpenSearch, Jaeger
   ```

3. **Configure environment**
   ```bash
   # Create .env.local in root directory
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_APP_NAME=Estate Workstation (Dev)
   ```

4. **Start the application**
   ```bash
   pnpm run dev
   ```

5. **Access the workstation**
   - Web Interface: http://localhost:3000
   - API Documentation: http://localhost:3001/api/docs

### Demo Workflow

1. **Sign In**: Use any email address (demo mode)
2. **Navigate**: Enter MHG `2322/60` to load sample packet
3. **Extract**: Click "Extract J294" to process forms
4. **Review**: Edit low-confidence fields (highlighted in red)
5. **Approve**: Save to knowledge graph
6. **Export**: Download provenance package

## 📊 Key Metrics

### Performance Targets
- **P95 Tile Load**: < 300ms
- **MHG → Approved**: ≤ 5 minutes median
- **Extraction Success**: ≥ 99% accuracy
- **User Satisfaction**: > 4.5/5 rating

### Quality Indicators  
- **Confidence Thresholds**: Auto-accept >90%, review 70-90%, flag <70%
- **Audit Coverage**: 100% action tracking
- **Error Recovery**: < 1% data loss incidents

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Next.js 14**: Modern React framework with SSR
- **Tailwind CSS**: Utility-first styling with design system
- **React Query**: Server state management and caching
- **OpenSeadragon**: High-performance image viewing

### Backend Services
- **API Gateway**: NestJS with OpenAPI documentation
- **Document Processing**: Microservice architecture
- **Graph Database**: Neo4j for relationship modeling
- **Object Storage**: MinIO S3-compatible storage

### Data Flow
```
MHG Input → Archive Connector → Document Viewer → 
AI Extraction → Human Review → Graph Storage → Export
```

### External Integrations
- **Archive Connectors**: FamilySearch OAuth + signed URLs
- **OCR Extraction**: Specialized form processing service
- **Entity Graph**: Knowledge base for genealogy data

## 🔐 Security & Privacy

### Data Protection
- **No Credential Storage**: User-scoped authentication only
- **TLS Everywhere**: End-to-end encryption in production
- **Row-Level Security**: Database access controls
- **Rate Limiting**: API protection and abuse prevention

### Compliance
- **Source TOS Respect**: All access user-initiated
- **Audit Requirements**: Government-grade logging
- **Privacy by Design**: Minimal data retention
- **Vulnerability Reporting**: security@yourdomain.tld

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] Archive Navigator for TAB 1951-1962
- [x] J294 extraction with confidence scoring  
- [x] Review workflow with provenance
- [x] Basic export functionality
- [x] RBAC and audit framework

### Phase 2: Enhancement
- [ ] Additional form types (J193, J175)
- [ ] Kinship path calculation
- [ ] Merge candidate detection
- [ ] Advanced search capabilities
- [ ] Mobile-optimized interface

### Phase 3: Scale
- [ ] Multi-archive support
- [ ] Collaborative workspaces
- [ ] API for external tools
- [ ] Machine learning improvements
- [ ] Enterprise SSO integration

## 🤝 Contributing

### Development Workflow
1. **Feature Branches**: One PR per feature
2. **ADR Documentation**: Architecture decisions recorded
3. **Schema Versioning**: No breaking changes without bumps
4. **Testing**: All changes must include tests
5. **Quality Gates**: Lint, test, build before merge

### Code Standards
- **TypeScript**: Strict mode with comprehensive typing
- **ESLint**: Consistent code style enforcement  
- **Testing**: Vitest for units, Playwright for E2E
- **Documentation**: JSDoc for public APIs

### Repository Structure
```
estate-workstation/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components  
│   ├── contexts/      # React state management
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Pure utility functions
│   └── types/         # TypeScript definitions
├── docs/              # Architecture and API docs
├── tests/             # Test suites and fixtures
└── docker/           # Development environment
```

## 📝 License

Proprietary software for genealogy research institutions. Contact licensing@yourdomain.tld for usage terms.

---

**Estate Research Workstation** - Transforming genealogy research with AI-powered document analysis and collaborative workflows.