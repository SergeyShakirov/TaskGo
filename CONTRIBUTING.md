# Contributing to TaskGo

Thank you for considering contributing to TaskGo! This document outlines the process for contributing to this project.

## Development Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/SergeyShakirov/TaskGo.git
cd TaskGo
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

3. **Setup environment**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

4. **Initialize database**
```bash
cd backend && npm run db:setup && cd ..
```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Maintain strict type checking
- Use interfaces over types where appropriate
- Document complex types and interfaces

### React Native
- Follow React hooks patterns
- Use functional components over class components
- Implement proper error boundaries
- Follow React Native performance best practices

### Backend
- Use Express.js patterns and middleware
- Implement proper error handling
- Follow RESTful API conventions
- Use Sequelize ORM for database operations

### Testing
- Write unit tests for all new features
- Maintain test coverage above 80%
- Use Jest for testing framework
- Mock external dependencies properly

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style guidelines
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Ensure tests pass** by running `npm test` and `cd backend && npm test`
6. **Create a pull request** with a clear description

### Pull Request Requirements

- [ ] Code follows project style guidelines
- [ ] Tests are added for new features
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] No merge conflicts

## Issue Reporting

When reporting issues, please include:

- **Environment details** (OS, Node.js version, React Native version)
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** or error logs if applicable
- **Device/emulator** information for mobile issues

## Feature Requests

For new features:

- Check if the feature already exists or is planned
- Provide a clear use case and rationale
- Consider the impact on existing functionality
- Be open to discussion and alternative approaches

## Development Workflow

### Frontend Development
```bash
# Start Metro Bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run tests
npm test
```

### Backend Development
```bash
cd backend

# Development server with hot reload
npm run dev

# Run tests
npm test

# Build TypeScript
npm run build
```

### Database Management
```bash
cd backend

# Reset database
npm run db:reset

# Setup PostgreSQL (production)
npm run db:postgres:setup

# Start PostgreSQL with Docker
npm run docker:up
```

## Code Review Process

- All code changes require review
- Reviews focus on code quality, functionality, and maintainability
- Address review feedback promptly
- Maintain respectful and constructive communication

## Release Process

1. Version bumping follows semantic versioning
2. Release notes are generated for each release
3. Testing is performed on multiple platforms
4. Documentation is updated for new releases

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct

## Questions?

If you have questions about contributing:

- Check the documentation in `/docs`
- Look through existing issues and discussions
- Create a new issue with the `question` label
- Reach out to maintainers

Thank you for contributing to TaskGo! 🚀
