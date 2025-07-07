# TaskGo - AI-Powered Service Marketplace

TaskGo is a cross-platform mobile application for service marketplace with AI assistant that generates detailed technical specifications from brief task descriptions.

## 🚀 Features

### ✅ Implemented

- **AI-Powered Task Generation**: OpenAI integration for generating detailed specifications
- **Cross-Platform Mobile App**: React Native with TypeScript
- **Professional Document Export**: Word document generation with proper formatting
- **Modern UI/UX**: Tab navigation with multiple screens
- **Approval Workflow**: Client/contractor approval system
- **Comprehensive Testing**: Unit and integration tests
- **RESTful API**: Node.js/Express backend with TypeScript

### 📱 Mobile Screens

- **Task Creation**: AI-powered specification generation
- **Task List**: View and manage all tasks
- **Task Details**: Comprehensive task information
- **Approval**: Review and approve specifications
- **Profile**: User management and settings

### 🤖 AI Capabilities

- Detailed technical specification generation
- Time and cost estimation
- Requirements analysis
- Deliverables identification
- Milestone suggestions
- Complexity analysis

### 📄 Document Export

- Professional Word documents (.docx)
- Formatted technical specifications
- Client/contractor signature sections
- Download functionality

## 🛠 Technology Stack

### Frontend

- **React Native** 0.80.1
- **TypeScript**
- **React Navigation** (Stack & Tabs)
- **Axios** for API communication
- **React Native Vector Icons**

### Backend

- **Node.js** with **Express**
- **TypeScript**
- **OpenAI API** for AI generation
- **docx** for Word document generation
- **Security**: CORS, Helmet, Rate Limiting

### Testing

- **Jest** for unit/integration testing
- **React Native Testing Library**
- **Comprehensive test coverage**

## 📦 Installation

### Prerequisites

- Node.js 16+
- React Native development environment
- OpenAI API key (optional for demo)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npm run dev
```

### Frontend Setup

```bash
npm install --legacy-peer-deps
npm start
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
npm test
```

## 🔧 API Endpoints

### AI Endpoints

- `POST /api/ai/generate-description` - Generate task specification
- `POST /api/ai/estimate` - Estimate time and cost
- `POST /api/ai/suggest-improvements` - Task improvement suggestions
- `POST /api/ai/analyze-complexity` - Complexity analysis

### Export Endpoints

- `POST /api/export/word` - Generate Word document
- `GET /api/export/download/:filename` - Download files

## 📊 Project Status

### ✅ Completed Features

- ✅ Project setup and configuration
- ✅ Backend API with OpenAI integration
- ✅ Frontend mobile app with navigation
- ✅ AI-powered task generation
- ✅ Word document export functionality
- ✅ Multiple screen interfaces
- ✅ Comprehensive testing suite
- ✅ Error handling and validation
- ✅ Professional UI/UX design

### 🔄 In Progress

- User authentication system
- Database integration
- Real-time features

### 📋 Roadmap

- [ ] User authentication (JWT)
- [ ] Database integration (MongoDB)
- [ ] Real-time chat system
- [ ] Payment integration
- [ ] Push notifications
- [ ] Rating and review system
- [ ] Advanced analytics
- [ ] Multi-language support

## 🏗 Architecture

The application follows a clean architecture pattern:

- **Frontend**: React Native with TypeScript for cross-platform mobile development
- **Backend**: Node.js/Express API with TypeScript for business logic
- **AI Integration**: OpenAI GPT for intelligent content generation
- **Document Generation**: Professional Word document creation
- **Testing**: Comprehensive test suite for reliability

For detailed architecture information, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 🧪 Testing

The project includes comprehensive testing:

- **Backend Tests**: API endpoints, services, and controllers
- **Frontend Tests**: Components, hooks, and services
- **Integration Tests**: Full workflow testing
- **Mock Testing**: External API dependencies

## 📝 Documentation

- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Backend API](http://localhost:3001)
- [Health Check](http://localhost:3001/health)
- [AI API Documentation](http://localhost:3001/api/ai)

---

**TaskGo** - Transforming brief ideas into detailed technical specifications with AI power! 🚀
