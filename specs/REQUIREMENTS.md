# Project Requirements

> This document serves as the foundation for development and should be updated as requirements evolve or new providers
> are added to the system.

## System Overview

WhozWho is an actor-based system for managing distributed updates and role assignments.

## Technical Requirements

### Development Environment

- Node.js version 22.x
- MongoDB version 4.4+
- TypeScript version 5.x
- Express version 4.x

### Infrastructure

- Support for distributed system architecture
- MongoDB database connectivity
- RESTful API endpoints
- Environment-based configuration (.env)

## Functional Requirements

### 1. Actor Management

- Dynamic actor registration capability
- Lifecycle tracking for all actors
- Real-time status monitoring
- Actor presence registration via `/hi` endpoint
- Actor role status querying via `/actors` endpoint

### 2. Role Assignment

- Smart principal role determination
- Weight-based role assignment
- Activity-based role assignment
- Dynamic role reassignment capabilities

### 3. Update Coordination

- Distributed update propagation
- Advice system implementation
- Support for various advice types:
    - UPDATE: Version updates coordination
    - Future planned types:
        - Configuration changes
        - Role reassignments
        - System-wide state changes
        - Resource allocation
        - Performance optimizations

### 4. Status Tracking

- Real-time status monitoring
- System health tracking
- Actor state monitoring
- Status endpoint (`/status`) for system state

### 5. Error Handling

- Comprehensive error management
- Error recovery mechanisms
- Robust error reporting
- Graceful failure handling

## API Requirements

### Endpoints

1. Actor Management:
    - `POST /hi` - Register actor's presence and status
    - `POST /actors` - Query actor's role status
    - `GET /status` - Get system status

2. Advice Management:
    - `POST /advices` - Suggest advice to actor's categories
    - `GET /advices` - Get last advices
    - `PUT /advices/:adviceId` - Update advice status

## Testing Requirements

- Comprehensive test coverage
- Integration test suite
- Unit test suite
- Support for specific test suite execution
- CI/CD integration via GitHub Actions

## Security Requirements

- Environment-based configuration
- Secure MongoDB connection
- Protected API endpoints
- Safe error handling and logging

## Performance Requirements

- Real-time status updates
- Efficient distributed communication
- Scalable actor management
- Optimized update propagation

## Documentation Requirements

- Maintained README with current features and setup
- Updated CHANGELOG following Keep a Changelog format
- Semantic versioning adherence
- Technical documentation in specs/
- Clear release process documentation
- API endpoint documentation

## Contribution Requirements

1. Code Standards:
    - TypeScript compliance
    - Linting rules adherence
    - Code formatting standards

2. Process:
    - Feature branch workflow
    - Pull request reviews
    - Test coverage for new features
    - Documentation updates

## Monitoring Requirements

- Actor system health monitoring
- Status management system
- Performance metrics tracking
- Error rate monitoring

---

Note: This document should be updated as new requirements emerge or existing ones evolve. 
