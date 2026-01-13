# 🎨 Healthcare Follow-Up - Frontend Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-38bdf8?style=for-the-badge&logo=tailwind-css)

**Modern, responsive frontend application for proactive patient follow-up and healthcare management**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Components](#-components)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Components](#-components)
- [Styling & Theming](#-styling--theming)
- [State Management](#-state-management)
- [API Integration](#-api-integration)
- [Development Guidelines](#-development-guidelines)
- [Build & Deployment](#-build--deployment)

---

## 🎯 Overview

This is the frontend application for the **Proactive AI Chatbot for Post-Discharge Patient Follow-Up & Early Complication Detection** system. Built with Next.js 15 and React 19, it provides an intuitive, accessible, and responsive user interface for both patients and healthcare providers.

### Key Highlights

- ⚡ **Server-Side Rendering** with Next.js App Router
- 🎨 **Modern UI** with Tailwind CSS and Radix UI components
- 🌙 **Dark/Light Mode** support
- 📱 **Fully Responsive** design
- ♿ **Accessible** components following WCAG guidelines
- 🚀 **Optimized Performance** with code splitting and lazy loading

---

## ✨ Features

### User Interface Features

- **🎨 Modern Design System**
  - Consistent component library built on Radix UI
  - Customizable theme with dark/light mode
  - Smooth animations with Framer Motion
  - Responsive layouts for all screen sizes

- **💬 Interactive Chat Interface**
  - Real-time AI conversation
  - Voice input/output support
  - Image upload and analysis
  - Multi-language support (6 Indian languages)
  - Markdown rendering for AI responses

- **📊 Data Visualization**
  - Interactive charts with Recharts
  - Health trend analysis
  - Progress tracking visualizations
  - Real-time monitoring dashboards

- **📝 Form Management**
  - React Hook Form for efficient form handling
  - Zod schema validation
  - Real-time validation feedback
  - Accessible form components

### Patient Features

- **Dashboard**: Personalized health overview with quick actions
- **Chat**: AI-powered health assistant interface
- **Symptom Checker**: Structured symptom logging with AI analysis
- **Progress Tracker**: Visual recovery timeline and achievements
- **Reports**: Weekly/monthly health reports with export options
- **Settings**: User preferences and account management

### Doctor Features

- **Doctor Dashboard**: Patient monitoring and management overview
- **Patient Management**: Add, view, and manage patient records
- **Real-Time Monitoring**: Live vitals and risk score tracking
- **Notifications**: Alert system for critical patient changes
- **Patient Records**: Complete medical history access
- **Communication**: Direct messaging with patients

---

## 🛠 Tech Stack

### Core Framework

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.0** - Type-safe development

### UI & Styling

- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **next-themes** - Theme management (dark/light mode)

### Forms & Validation

- **React Hook Form 7.60.0** - Performant form library
- **Zod 3.25.67** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Data Visualization

- **Recharts** - Composable charting library
- **date-fns 4.1.0** - Date manipulation utilities

### Content & Markdown

- **react-markdown 10.1.0** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown support
- **react-syntax-highlighter** - Code syntax highlighting

### Additional Libraries

- **groq-sdk 0.30.0** - Groq AI integration
- **mongodb 6.18.0** - Database client
- **sonner** - Toast notifications
- **react-day-picker** - Date picker component

### Development Tools

- **TypeScript** - Type checking
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm**, **yarn**, or **pnpm** package manager
- **MongoDB** connection string
- **Groq API** key

### Installation

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the `frontend` directory:
   ```env
   # MongoDB Configuration
   MONGO_URI=your_mongodb_connection_string
   MONGO_DB=your_database_name

   # Groq AI Configuration
   GROQ_API_KEY=your_groq_api_key

   # Session Configuration (optional)
   SESSION_SECRET=your_session_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes (server-side)
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── signup/
│   │   │   ├── me/
│   │   │   └── seed/
│   │   ├── groq/                 # AI analysis endpoint
│   │   ├── mongodb/              # MongoDB connection test
│   │   ├── patients/             # Patient management APIs
│   │   │   ├── add/
│   │   │   ├── doctor-patients/
│   │   │   ├── export/
│   │   │   ├── import/
│   │   │   ├── me/
│   │   │   ├── visits/
│   │   │   └── route.ts
│   │   ├── symptoms/             # Symptom tracking APIs
│   │   ├── reports/              # Report generation APIs
│   │   └── predict/              # Prediction endpoints
│   ├── chat/                     # Chat interface page
│   ├── dashboard/                # Main dashboard page
│   ├── doctor/                   # Doctor-specific pages
│   │   ├── add-patient/
│   │   ├── add-patients/
│   │   ├── chat/
│   │   ├── monitoring/
│   │   ├── notifications/
│   │   ├── patients/
│   │   │   └── [pid]/            # Dynamic patient detail page
│   │   ├── records/
│   │   └── page.tsx
│   ├── login/                    # Login page
│   ├── signup/                   # Signup page
│   ├── progress/                 # Progress tracking page
│   ├── reports/                  # Reports page
│   ├── settings/                 # Settings page
│   ├── symptom-check/            # Symptom logging page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── auth/                     # Authentication components
│   │   └── auth-provider.tsx
│   ├── chat/                     # Chat interface components
│   │   ├── chat-interface.tsx
│   │   ├── chat-message.tsx
│   │   ├── voice-recorder.tsx
│   │   ├── image-analysis.tsx
│   │   ├── markdown-renderer.tsx
│   │   └── typing-indicator.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── patient-dashboard.tsx
│   │   ├── doctor-dashboard.tsx
│   │   ├── ai-insights-card.tsx
│   │   ├── health-chart.tsx
│   │   ├── wellness-widget.tsx
│   │   └── floating-assistant.tsx
│   ├── doctor/                   # Doctor dashboard components
│   │   ├── patient-management.tsx
│   │   ├── patient-monitoring.tsx
│   │   ├── notification-system.tsx
│   │   ├── patient-records.tsx
│   │   └── add-patient-form.tsx
│   ├── layout/                   # Layout components
│   │   ├── main-layout.tsx
│   │   ├── doctor-layout.tsx
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── layout-wrapper.tsx
│   ├── progress/                 # Progress tracking components
│   │   ├── progress-tracker.tsx
│   │   ├── progress-charts.tsx
│   │   ├── recovery-timeline.tsx
│   │   ├── pain-mood-tracker.tsx
│   │   └── achievement-badges.tsx
│   ├── reports/                  # Report components
│   │   ├── reports-system.tsx
│   │   ├── weekly-report.tsx
│   │   ├── monthly-report.tsx
│   │   └── export-options.tsx
│   ├── symptom-check/            # Symptom checker components
│   │   ├── symptom-checker.tsx
│   │   ├── symptom-logger.tsx
│   │   ├── symptom-history.tsx
│   │   ├── ai-analysis-panel.tsx
│   │   └── image-comparison.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   └── ... (more UI components)
│   └── theme-provider.tsx        # Theme context provider
├── lib/                          # Utility functions
│   ├── phi.ts                    # PHI redaction utilities
│   ├── parse-ai-summary.ts       # AI response parsing
│   ├── date-utils.ts             # Date manipulation utilities
│   └── utils.ts                  # General utilities (cn, etc.)
├── public/                       # Static assets
│   ├── doctor-avatar.png
│   ├── patient-avatar.png
│   └── ... (other assets)
├── styles/                       # Additional styles
│   ├── globals.css
│   └── chat-animations.css
├── middleware.ts                 # Next.js middleware
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── components.json               # shadcn/ui configuration
└── package.json                  # Dependencies and scripts
```

---

## 🧩 Components

### Component Architecture

The application follows a component-based architecture with clear separation of concerns:

#### Layout Components
- **Main Layout**: Base layout wrapper for all pages
- **Doctor Layout**: Specialized layout for doctor dashboard
- **Header**: Navigation header with user menu
- **Sidebar**: Navigation sidebar with menu items

#### Feature Components

**Chat Components**
- `ChatInterface`: Main chat container with message handling
- `ChatMessage`: Individual message display component
- `VoiceRecorder`: Voice input recording functionality
- `ImageAnalysis`: Image upload and analysis display
- `MarkdownRenderer`: Renders AI markdown responses

**Dashboard Components**
- `PatientDashboard`: Patient overview with health metrics
- `DoctorDashboard`: Doctor's patient monitoring overview
- `HealthChart`: Visual health data representation
- `AIInsightsCard`: AI-generated health insights display

**Symptom Checker Components**
- `SymptomChecker`: Main symptom logging interface
- `SymptomLogger`: Symptom input form
- `AIAnalysisPanel`: AI analysis results display
- `SymptomHistory`: Historical symptom data view

**Progress Components**
- `ProgressTracker`: Main progress tracking interface
- `ProgressCharts`: Visual progress representations
- `RecoveryTimeline`: Timeline view of recovery milestones
- `PainMoodTracker`: Pain and mood logging interface

### UI Components (shadcn/ui)

The project uses [shadcn/ui](https://ui.shadcn.com/) components built on Radix UI:

- **Form Components**: Button, Input, Textarea, Select, Checkbox, Radio
- **Layout Components**: Card, Separator, Tabs, Scroll Area
- **Feedback Components**: Dialog, Toast, Tooltip, Progress
- **Navigation Components**: Dropdown Menu, Navigation Menu

All UI components are located in `components/ui/` and can be customized via Tailwind CSS.

---

## 🎨 Styling & Theming

### Tailwind CSS

The project uses Tailwind CSS 4.1.9 with a custom configuration:

- **Custom Colors**: Primary, secondary, accent colors
- **Dark Mode**: Automatic dark mode support
- **Animations**: Custom animation utilities
- **Responsive Design**: Mobile-first approach

### Theme System

The application supports both light and dark themes using `next-themes`:

```tsx
import { ThemeProvider } from "@/components/theme-provider"

// In your layout
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

### Custom Styles

- **Global Styles**: `app/globals.css` - Base styles and CSS variables
- **Chat Animations**: `styles/chat-animations.css` - Chat-specific animations
- **Component Styles**: Inline Tailwind classes with component-level styling

### CSS Variables

The project uses CSS variables for theming:

```css
--background
--foreground
--primary
--secondary
--accent
--muted
--border
--radius
```

---

## 🔄 State Management

### Client-Side State

- **React Hooks**: `useState`, `useEffect`, `useContext` for local state
- **Context API**: 
  - `AuthProvider`: Authentication state management
  - `ThemeProvider`: Theme state management

### Server-Side State

- **Next.js API Routes**: Server-side data fetching
- **Server Components**: React Server Components for data fetching
- **MongoDB Integration**: Direct database queries in API routes

### Data Fetching Patterns

```tsx
// Client-side fetching
const response = await fetch('/api/patients/me')
const data = await response.json()

// Server-side in API routes
export async function GET(request: NextRequest) {
  const client = await getMongoClient()
  // ... database operations
}
```

---

## 🔌 API Integration

### API Routes Structure

All API routes are located in `app/api/`:

#### Authentication APIs
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Patient APIs
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Get specific patient
- `POST /api/patients/add` - Add new patient
- `GET /api/patients/me` - Get current patient data

#### Symptom APIs
- `GET /api/symptoms` - Get symptom logs
- `POST /api/symptoms` - Create symptom log

#### AI Analysis API
- `POST /api/groq` - Get AI health analysis

### API Client Pattern

```tsx
// Example API call
const response = await fetch('/api/groq', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    feeling: 'Good',
    painLevel: 2,
    newSymptoms: false,
    medicationTaken: true,
    symptomsText: 'Feeling better today',
    userId: user?.id
  })
})

const data = await response.json()
```

---

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, type all components and functions
- **Component Structure**: Functional components with hooks
- **Naming Conventions**:
  - Components: PascalCase (`PatientDashboard.tsx`)
  - Utilities: camelCase (`parseAiSummary.ts`)
  - Constants: UPPER_SNAKE_CASE

### Component Guidelines

1. **Use TypeScript interfaces** for props:
   ```tsx
   interface ComponentProps {
     title: string
     onAction: () => void
   }
   ```

2. **Extract reusable logic** into custom hooks:
   ```tsx
   function usePatientData() {
     // Custom hook logic
   }
   ```

3. **Keep components focused** - Single Responsibility Principle

4. **Use server components** when possible for better performance

### File Organization

- One component per file
- Co-locate related files (component + styles + tests)
- Use index files for cleaner imports

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

---

## 🏗 Build & Deployment

### Development Build

```bash
npm run dev
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

Creates an optimized production build and starts the production server.

### Build Output

- `.next/` - Next.js build output
- Static assets optimized and minified
- Server-side code bundled
- Client-side code code-split automatically

### Deployment Options

**Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

**Other Platforms**
- Docker containerization
- Node.js hosting (Railway, Render, etc.)
- Static export (if applicable)

### Environment Variables

Ensure all required environment variables are set in your deployment platform:

- `MONGO_URI`
- `MONGO_DB`
- `GROQ_API_KEY`
- `SESSION_SECRET` (optional)

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Module not found errors**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**TypeScript errors**
```bash
# Restart TypeScript server in your IDE
# Or run type check
npx tsc --noEmit
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

## 🤝 Contributing

When contributing to the frontend:

1. Follow the existing code style
2. Write TypeScript types for all new code
3. Test components in both light and dark modes
4. Ensure responsive design works on mobile
5. Update documentation for new features

---

## 📧 Support

For frontend-specific questions or issues:

- **Issues**: [GitHub Issues](https://github.com/RaksithSivakumar/Healthcare_FollowUp/issues)
- **Email**: risivandev@gmail.com

---

<div align="center">

**Built with ❤️ using Next.js and React**

⭐ Star this repo if you find it helpful!

</div>
