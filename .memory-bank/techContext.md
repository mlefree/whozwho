# WhozWho Technical Context

## Technologies Used

### Core Technologies
- **Node.js**: Version 22.x or higher
- **TypeScript**: Version 5.x for type-safe development
- **Express.js**: Version 4.x web framework for API endpoints
- **MongoDB**: Version 4.4+ for data persistence
- **Mongoose**: Version 7.x ODM for MongoDB interaction

### Supporting Libraries
- **Axios**: HTTP client for external API requests
- **Winston**: Logging framework with daily rotation
- **Body-parser**: Request body parsing middleware
- **Compression**: Response compression middleware
- **Dotenv**: Environment variable management
- **Morgan**: HTTP request logging

### Testing Framework
- **Mocha**: Test runner
- **Chai**: Assertion library
- **Sinon**: Mocking and stubbing
- **Supertest**: API testing

## Development Setup

### Prerequisites
- Node.js 22.x or higher
- MongoDB 4.4+ (or use mongodb-memory-server for development)
- Git for version control

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/mlefree/whozwho.git

# Install dependencies
npm install

# Set up environment
cp .env.example .env
```

### Environment Configuration
Key environment variables:
- `NODE_ENV`: Application environment (development, test, production)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Application port (default: 3003)

### Development Workflow
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
```

## Technical Constraints

### Performance Requirements
- Support for multiple concurrent actor connections
- Low-latency response times for status checks
- Efficient update propagation across distributed actors

### Scalability Considerations
- Horizontal scaling through stateless API design
- MongoDB sharding for data distribution
- Connection pooling for database efficiency

### Security Requirements
- Input validation for all API endpoints
- Rate limiting for public endpoints
- Proper error handling to prevent information leakage

### Compatibility
- RESTful API compatible with any HTTP client
- JSON-based communication format
- Stateless design for easy integration

## Dependencies

### Production Dependencies
- **express**: Web framework for API endpoints
- **mongoose**: MongoDB ODM
- **axios**: HTTP client
- **winston**: Logging framework
- **npm-run**: Process management
- **body-parser**: Request parsing
- **compression**: Response compression
- **dotenv**: Environment configuration
- **morgan**: HTTP logging
- **whozwho-client**: Client library for WhozWho integration

### Development Dependencies
- **typescript**: Type support
- **mocha**, **chai**: Testing framework
- **sinon**: Mocking library
- **supertest**: API testing
- **ts-node**: TypeScript execution
- **eslint**, **tslint**: Code linting

This document provides the technical context for the WhozWho project, including technologies, setup instructions, constraints, and dependencies. It should be referenced when making technical decisions to ensure consistency with the established technology stack.
