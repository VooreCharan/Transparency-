# TruthTrack - Product Transparency Platform

A comprehensive AI-powered web application that collects detailed product information through dynamic, intelligent questioning and generates structured Product Transparency Reports. Built to support ethical, health-first decision-making through enhanced product disclosure.

## 🚀 Live Demo



## 📋 Features

### Core Functionality
- **Multi-step Product Submission Form** with conditional logic
- **AI-Powered Dynamic Question Generation** based on product category
- **Intelligent Transparency Scoring** with detailed breakdowns
- **Professional PDF Report Generation**
- **Comprehensive Product Database** with search and filtering
- **Responsive Design** optimized for all devices

### AI-Powered Features
- **Dynamic Question Engine**: Generates category-specific questions using OpenAI GPT
- **Smart Scoring Algorithm**: Evaluates transparency across multiple dimensions
- **Automated Insights**: AI-generated recommendations and key findings
- **Fallback Logic**: Continues functioning without AI services using predefined questions

### Technical Features
- **Full-Stack Architecture**: React frontend with Supabase backend
- **Real-time Database**: PostgreSQL with Row Level Security (RLS)
- **Edge Functions**: Serverless AI services for question generation and scoring
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: shadcn/ui components with custom design system

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query** for state management
- **Lucide React** for icons

### Backend & Database
- **Supabase** (PostgreSQL database + Edge Functions)
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates

### AI Services
- **OpenAI GPT-4o-mini** for question generation
- **Custom scoring algorithms** for transparency analysis
- **Intelligent categorization** for product-specific questions

### Development Tools
- **Vite** for fast development and building
- **ESLint** for code quality
- **TypeScript** for type safety

## 🏗 Project Structure

```
/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui base components
│   │   ├── Header.tsx       # Navigation header
│   │   ├── ProductForm.tsx  # Multi-step form component
│   │   └── AIServiceStatus.tsx # AI configuration status
│   ├── pages/               # Route components
│   │   ├── Index.tsx        # Landing page
│   │   ├── Submit.tsx       # Product submission page
│   │   ├── Reports.tsx      # Reports listing page
│   │   └── NotFound.tsx     # 404 page
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client and types
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   └── assets/              # Static assets
├── supabase/
│   ├── functions/           # Edge Functions (AI services)
│   │   ├── generate-questions/      # AI question generation
│   │   ├── calculate-transparency-score/  # AI scoring
│   │   └── generate-pdf-report/     # PDF generation
│   └── config.toml         # Supabase configuration
└── public/                  # Static files
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend services)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd truthtrack-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase** (already configured in this project)
   - Database tables are pre-configured
   - RLS policies are already set up
   - Edge functions are included

4. **Configure AI Services** (Optional)
   - Add OpenAI API key to Supabase Edge Function Secrets
   - Key name: `OPENAI_API_KEY`
   - Without API key, app uses fallback question generation

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open application**
   - Navigate to `http://localhost:8080`

### Deployment

#### Manual Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting provider
3. Ensure environment variables are configured

## 🔧 Configuration

### Environment Variables
The application uses Supabase for backend services. Configuration is handled automatically, but you can customize:

- **OPENAI_API_KEY**: For enhanced AI features (set in Supabase Edge Function Secrets)
- **Database**: Pre-configured with sample data structure

### AI Service Configuration
1. **With OpenAI API Key**:
   - Enhanced question generation
   - Advanced transparency scoring
   - AI-powered insights

2. **Without API Key** (Fallback Mode):
   - Category-based question templates
   - Rule-based scoring algorithm
   - Standard recommendations

## 📊 Database Schema

### Tables
- **products**: Core product information
- **questions**: Generated questions for each product
- **answers**: User responses to questions
- **transparency_reports**: Generated analysis reports

### Key Relationships
```sql
products (1) → (many) questions
products (1) → (many) answers
products (1) → (1) transparency_reports
questions (1) → (many) answers
```

## 🤖 AI Service Documentation

### Edge Functions

#### 1. Generate Questions (`/generate-questions`)
- **Input**: Product data (name, category, brand, description)
- **Output**: Array of tailored questions
- **AI Model**: GPT-4o-mini
- **Fallback**: Category-specific question templates

#### 2. Calculate Transparency Score (`/calculate-transparency-score`)
- **Input**: Product ID with answers
- **Output**: Detailed scoring breakdown and recommendations
- **Metrics**: Completeness, Quality, Transparency Level, Category-Specific
- **Range**: 0-100 points

#### 3. Generate PDF Report (`/generate-pdf-report`)
- **Input**: Product ID
- **Output**: HTML content for PDF conversion
- **Features**: Professional styling, detailed breakdown, actionable insights

## 📱 Usage Guide

### Submitting a Product
1. Navigate to `/submit`
2. Fill in basic product information
3. AI generates tailored questions based on category
4. Answer detailed questions about transparency
5. Receive comprehensive transparency report

### Viewing Reports
1. Navigate to `/reports`
2. Browse all generated reports
3. Search by product name, brand, or category
4. View detailed scores and insights
5. Download PDF reports

### Understanding Scores
- **80-100**: Excellent transparency
- **60-79**: Good transparency with room for improvement
- **Below 60**: Needs significant transparency improvements

## 🎯 Sample Product Entry

```json
{
  "name": "Organic Green Tea",
  "brand": "Pure Nature Co.",
  "category": "Food & Beverages",
  "description": "Premium organic green tea sourced from sustainable farms",
  "questions_generated": [
    "What certifications does this product have?",
    "List all ingredients and their sources",
    "What is the country of origin?",
    "Are there any allergens present?",
    "What is the shelf life and storage requirements?"
  ],
  "transparency_score": 87,
  "key_findings": [
    "Comprehensive organic certification provided",
    "Clear ingredient sourcing information",
    "Sustainable farming practices documented"
  ]
}
```

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Input validation** on all forms
- **SQL injection protection** via Supabase
- **XSS protection** through React's built-in escaping
- **CORS configuration** for API security

## 🎨 Design System

The application uses a custom design system built on Tailwind CSS:

- **Colors**: Professional blue and green palette for trust
- **Typography**: Inter font family for readability
- **Components**: Consistent shadcn/ui component styling
- **Responsive**: Mobile-first design approach
- **Accessibility**: WCAG 2.1 AA compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the TruthTrack platform for promoting product transparency and consumer trust.

## 🚀 AI Tools Usage Reflection

### How AI Tools Enhanced Development

Throughout the development process, AI tools were strategically integrated to maximize efficiency and accuracy:

1. **Code Generation**: AI assistants helped rapidly prototype components and generate boilerplate code
2. **Database Design**: AI suggested optimal table structures and relationships for transparency data
3. **Question Generation**: GPT models create contextually relevant questions based on product categories
4. **Scoring Algorithms**: AI helps analyze response quality and calculate meaningful transparency scores
5. **Error Handling**: AI tools suggested robust error handling patterns and edge cases

### Architecture Principles

The platform was built following these core principles:

1. **Modularity**: Each component serves a specific purpose with clear interfaces
2. **Scalability**: Database and API design supports growing product submissions
3. **Transparency**: The platform itself demonstrates transparency through open architecture
4. **User-Centric**: Every feature designed with end-user experience in mind
5. **AI-Augmented**: Human oversight combined with AI efficiency for optimal results

### Product Transparency Logic

The transparency scoring considers multiple factors:
- **Information Completeness**: How thoroughly questions are answered
- **Detail Quality**: Depth and specificity of responses
- **Transparency Indicators**: Presence of certifications, testing, and disclosure
- **Category Relevance**: Industry-specific requirements and standards
- **Continuous Improvement**: Recommendations for enhancing transparency

This comprehensive approach ensures meaningful, actionable transparency insights that build genuine consumer trust.
- **Transparency Indicators**: Presence of certifications, testing, and disclosure
- **Category Relevance**: Industry-specific requirements and standards
- **Continuous Improvement**: Recommendations for enhancing transparency

This comprehensive approach ensures meaningful, actionable transparency insights that build genuine consumer trust.
