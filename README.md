# 🎭 WhozWho

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/mlefree/whozwho/test.yml?style=flat-square)](https://github.com/mlefree/whozwho/actions/workflows/test.yml)
[![Node Version](https://img.shields.io/badge/node-22.x-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-black?style=flat-square&logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green?style=flat-square&logo=mongodb)](https://www.mongodb.com)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)](CHANGELOG.md)

> An actor-based system for managing distributed updates and role assignments.

## 🌟 Features

- **🎭 Actor Management**: Dynamic actor registration and lifecycle tracking
- **👑 Role Assignment**: Smart principal role determination based on weight and activity
- **🔄 Update Coordination**: Distributed update propagation with advice system
- **🎯 Status Tracking**: Real-time status monitoring of actors
- **🔒 Robust Error Handling**: Comprehensive error management and recovery

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/mlefree/whozwho.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### Configuration

Update your `.env` file with appropriate values:

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/whozwho
PORT=3006
```

### Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## 🔄 CI/CD

The project uses GitHub Actions for continuous integration and deployment:

- **Test Workflow**: Runs on push/PR to main/master branches
  - Tests with Node.js 22.x
  - Runs the test suite
  - Builds the TypeScript application
  - Pushes compiled output to `app` branch

### Branches

- `main`: Main development branch
- `app`: Contains only the compiled TypeScript output (app/ directory, auto-updated by CI)

## 🎯 API Endpoints

### Actor Management

```http
POST /hi
# Register actor's presence and status

POST /actors
# Query actor's role status

GET /status
# Get system status
```

### Advice Management

```http
POST /advices
# Suggest advice to actor's categories

GET /advices
# Get my last advices

PUT /advices/:adviceId
# Update advice status
```

The advice system currently supports:
- `UPDATE`: Coordinate version updates across actors

More advice types are planned for future releases to handle:
- Configuration changes
- Role reassignments
- System-wide state changes
- Resource allocation
- Performance optimizations

## 🏗 Architecture

The system follows an actor-based architecture with the following key components:

- **Actor System**: Manages actor lifecycle and role assignment
- **Advice System**: Coordinates updates across distributed actors
- **Status Management**: Tracks system health and actor states

```mermaid
graph TD
    A[Actor] -->|Register| B[Actor System]
    B -->|Assign Role| A
    A -->|Request Update| C[Advice System]
    C -->|Propagate| D[Other Actors]
    B -->|Monitor| E[Status System]
```

## 🧪 Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific test suite
npm run test-mocha-integration
```

## 📦 Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `typescript`: Type support
- `npm-run`: Process management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the amazing web framework
- MongoDB team for the robust database
- The open-source community for continuous inspiration

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and [RELEASE_PROCESS.md](RELEASE_PROCESS.md) for release procedures.

Current version: 1.0.0 (Released 2025-03-22)
- Actor-based system core functionality
- Dynamic actor registration and lifecycle tracking
- Role assignment system
- Distributed update propagation
- Real-time status monitoring
- [See full release notes](CHANGELOG.md#100---2025-03-22)

---

<p align="center">Made with ❤️ by mlefree</p>
