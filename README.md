# 🎭 WhozWho

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tests](https://github.com/yourusername/whozwho/actions/workflows/test.yml/badge.svg)](https://github.com/yourusername/whozwho/actions/workflows/test.yml)

> An actor-based system for managing distributed updates and role assignments.

## 🌟 Features

- **🎭 Actor Management**: Dynamic actor registration and lifecycle tracking
- **👑 Role Assignment**: Smart principal role determination based on weight and activity
- **🔄 Update Coordination**: Distributed update propagation with advice system
- **🎯 Status Tracking**: Real-time status monitoring of actors
- **🔒 Robust Error Handling**: Comprehensive error management and recovery

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (v4.4+)
- TypeScript (v4+)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/whozwho.git

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

## 🎯 API Endpoints

### Actor Management

```http
POST /v1/hi
# Register actor's presence and status

POST /v1/actors
# Query actor's role status

GET /v1/status
# Get system status
```

### Update Management

```http
POST /v1/advices
# Request update advice

GET /v1/advices
# Get pending advices

PUT /v1/advices/:adviceId
# Update advice status
```

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

---

<p align="center">Made with ❤️ by Your Team</p>
