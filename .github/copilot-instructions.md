<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# TaskGo Project Instructions for GitHub Copilot

This is a cross-platform mobile application for service marketplace with AI assistant built using React Native and Node.js.

## Project Structure

- **Frontend**: React Native with TypeScript
- **Backend**: Node.js/Express with TypeScript
- **AI Integration**: OpenAI GPT API for generating detailed technical specifications
- **Document Export**: Word document generation functionality

## Key Features

- AI-powered technical specification generation from brief descriptions
- Time and cost estimation
- Word document export
- Client-contractor approval system
- Cross-platform mobile support (iOS/Android)

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Implement comprehensive error handling
- Write tests for all new features (target 80% coverage)
- Use async/await instead of promises where possible

### API Design

- Follow RESTful conventions
- Include proper request/response validation
- Implement rate limiting and security measures
- Use proper HTTP status codes
- Structure responses with consistent format: `{ success: boolean, data: T, message?: string }`

### AI Integration

- Use OpenAI GPT models for text generation
- Implement fallback responses for API failures
- Parse and validate AI responses properly
- Handle rate limits and API errors gracefully

### Mobile Development

- Use React Native navigation best practices
- Implement proper loading states and error boundaries
- Follow platform-specific design guidelines
- Ensure good performance and smooth animations

### Testing

- Write unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React Native screens
- Mock external dependencies in tests

### Documentation

- Comment complex business logic
- Update README for significant changes
- Document API endpoints with examples
- Include setup instructions for new developers

When generating code, prioritize:

1. Type safety with TypeScript
2. Error handling and user feedback
3. Performance optimization
4. Accessibility considerations
5. Clean, maintainable code structure
