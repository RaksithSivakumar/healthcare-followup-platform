# 🏥 Proactive AI Chatbot for Post-Discharge Patient Follow-Up & Early Complication Detection

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.18-green?style=for-the-badge&logo=mongodb)
![Groq AI](https://img.shields.io/badge/Groq%20AI-Llama%203.3%2070B-orange?style=for-the-badge)

**An intelligent healthcare platform leveraging AI to provide proactive patient monitoring, early complication detection, and personalized post-discharge care.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Key Features Explained](#-key-features-explained)
- [Security & Privacy](#-security--privacy)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This project is a comprehensive healthcare management system designed to bridge the gap between hospital discharge and full patient recovery. By combining advanced AI technology with intuitive user interfaces, the platform enables:

- **Proactive Patient Monitoring**: Continuous tracking of patient symptoms, vitals, and recovery progress
- **Early Complication Detection**: AI-powered analysis to identify potential health issues before they escalate
- **Personalized Care**: Context-aware recommendations based on patient medical history
- **Seamless Communication**: Multi-channel interaction between patients and healthcare providers

The system serves both **patients** and **healthcare providers**, offering tailored dashboards and features for each user type.

---

## ✨ Features

### 👤 Patient Features

- **🤖 AI-Powered Chatbot**
  - 24/7 health assistance with empathetic, supportive responses
  - Multi-language support (English, Tamil, Hindi, Malayalam, Kannada, Telugu)
  - Voice interaction capabilities
  - Image analysis for wound tracking and visual symptom assessment

- **📊 Symptom Tracking & Analysis**
  - Daily symptom logging with intensity ratings
  - AI-generated health summaries and insights
  - Personalized recommendations based on medical history
  - Risk level assessment (low/medium/high)

- **📈 Progress Monitoring**
  - Visual recovery timeline and charts
  - Pain and mood tracking
  - Achievement badges and motivational feedback
  - Health trend analysis

- **📋 Reports & Documentation**
  - Weekly and monthly health reports
  - Exportable data for healthcare providers
  - Visit history and medical records access

### 👨‍⚕️ Doctor Features

- **👥 Patient Management**
  - Comprehensive patient database
  - Add, import, and export patient records
  - Patient profile with complete medical history

- **🔔 Real-Time Monitoring**
  - Live patient vitals dashboard
  - Risk score calculations
  - Alert system for critical changes
  - Trend analysis and visualizations

- **🔔 Notification System**
  - Critical alerts for abnormal vitals
  - Medication adherence tracking
  - Symptom escalation notifications
  - Appointment reminders

- **💬 Doctor-Patient Communication**
  - Direct messaging interface
  - AI-assisted chat for patient queries
  - Quick response templates

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript 5.0
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1.9
- **Components**: Radix UI (Accessible, unstyled components)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Theming**: next-themes (Dark/Light mode support)

### Backend
- **Runtime**: Node.js 20.x
- **API**: Next.js API Routes
- **Database**: MongoDB 6.18.0
- **AI/ML**: Groq SDK (Llama 3.3 70B Versatile)

### Security & Privacy
- **PHI Redaction**: Custom implementation for Protected Health Information
- **Session Management**: Secure token-based authentication
- **Content Safety**: Toxicity checks and hallucination guardrails

### Additional Tools
- **Markdown Rendering**: react-markdown with GFM support
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB database (local or cloud)
- Groq API key ([Get one here](https://console.groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Healthcare_FollowUp.git
   cd Healthcare_FollowUp
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

4. **Set up environment variables**
   
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

5. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

---

## 🏗 Architecture

### Project Structure

```
Healthcare_FollowUp/
├── frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── groq/           # AI analysis endpoint
│   │   │   ├── patients/       # Patient management APIs
│   │   │   ├── symptoms/       # Symptom tracking APIs
│   │   │   └── reports/        # Report generation APIs
│   │   ├── chat/               # Chat interface page
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── doctor/             # Doctor-specific pages
│   │   ├── symptom-check/      # Symptom logging page
│   │   └── progress/           # Progress tracking page
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── chat/               # Chat interface components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── doctor/             # Doctor dashboard components
│   │   ├── progress/           # Progress tracking components
│   │   ├── symptom-check/      # Symptom checker components
│   │   └── ui/                 # Reusable UI components
│   ├── lib/                    # Utility functions
│   │   ├── phi.ts              # PHI redaction utilities
│   │   ├── parse-ai-summary.ts # AI response parsing
│   │   └── utils.ts            # General utilities
│   └── public/                 # Static assets
└── README.md
```

### Data Flow

1. **Patient Input** → Symptom logging, chat messages, or health assessments
2. **API Processing** → Data validation, PHI redaction, MongoDB storage
3. **AI Analysis** → Groq API processes patient data with medical context
4. **Response Generation** → Structured health insights and recommendations
5. **Dashboard Update** → Real-time visualization and monitoring

### Key Components

- **Chat Interface**: Real-time AI conversation with voice and image support
- **Symptom Checker**: Structured symptom logging with AI analysis
- **Patient Dashboard**: Personalized health overview and quick actions
- **Doctor Dashboard**: Patient monitoring and management tools
- **Notification System**: Alert management for healthcare providers

---

## 🔑 Key Features Explained

### AI-Powered Health Analysis

The system uses **Groq's Llama 3.3 70B** model to provide:

- **Contextual Analysis**: Incorporates patient medical history from recent visits
- **Personalized Recommendations**: Tailored advice based on conditions and diseases
- **Risk Assessment**: Automatic risk level calculation (low/medium/high)
- **Structured Output**: Consistent formatting with health summaries, insights, and action items

### PHI Protection

Built-in privacy protection includes:

- **Automatic Redaction**: Names, emails, phone numbers, locations, and IDs
- **Safety Checks**: Toxicity detection and hallucination prevention
- **Secure Storage**: Encrypted session management

### Multi-Language Support

Voice and text support for:
- English (en-IN)
- Tamil (ta-IN)
- Hindi (hi-IN)
- Malayalam (ml-IN)
- Kannada (kn-IN)
- Telugu (te-IN)

---

## 🔒 Security & Privacy

- **PHI Redaction**: All user inputs are scanned and redacted before AI processing
- **Session Management**: Secure token-based authentication
- **Content Safety**: Multi-layer safety checks for AI responses
- **Data Encryption**: MongoDB connection with secure API versioning
- **Input Validation**: Zod schema validation for all API endpoints

---

## 📡 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Patient Endpoints

- `GET /api/patients` - Get all patients (doctor only)
- `POST /api/patients` - Get specific patient by ID
- `POST /api/patients/add` - Add new patient
- `GET /api/patients/me` - Get current patient data
- `GET /api/patients/doctor-patients` - Get doctor's patients

### Symptom Tracking

- `GET /api/symptoms` - Get patient symptom logs
- `POST /api/symptoms` - Create new symptom log entry

### AI Analysis

- `POST /api/groq` - Get AI health analysis
  ```json
  {
    "feeling": "Good",
    "painLevel": 2,
    "newSymptoms": false,
    "medicationTaken": true,
    "symptomsText": "Feeling better today",
    "userId": "optional_user_id"
  }
  ```

### Reports

- `GET /api/reports` - Generate patient reports

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint for code quality
- Write meaningful commit messages
- Test all new features thoroughly
- Update documentation as needed


## 🙏 Acknowledgments

- **Groq** for providing fast AI inference capabilities
- **Next.js Team** for the excellent framework
- **Radix UI** for accessible component primitives
- **MongoDB** for robust database solutions

---

## 📧 Contact & Support

For questions, issues, or contributions:

- **Issues**: [GitHub Issues](https://github.com/RaksithSivakumar/Healthcare_FollowUp.git)
- **Email**: risivandev@gmail.com

---

<div align="center">

**Built with ❤️ for better healthcare outcomes**

⭐ Star this repo if you find it helpful!

</div>

