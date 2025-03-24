# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2025-03-24

### Fixed
- Fixed API endpoint issues
- Resolved test failures across all scenarios
- Corrected Content-Type header fields in responses
- Fixed actor registration and role verification
- Resolved advice distribution and update cycle issues

## [1.0.0] - 2025-03-22

### Added
- Comprehensive requirements documentation in `specs/REQUIREMENTS.md`
- Actor-based system core functionality
- Dynamic actor registration and lifecycle tracking
- Role assignment system with weight and activity-based determination
- Distributed update propagation with advice system
- Real-time status monitoring capabilities
- RESTful API endpoints for actor and advice management
- Environment-based configuration system
- Comprehensive error handling and recovery mechanisms

### Technical
- Node.js 22.x support
- TypeScript 5.x implementation
- Express 4.x framework integration
- MongoDB 4.4+ database integration
- GitHub Actions CI/CD workflow
- Test suite with integration and unit tests

### Documentation
- Initial README with features, setup, and architecture
- Technical specifications in `specs/` directory
- Release process documentation
- API endpoints documentation
- Contribution guidelines

[Unreleased]: https://github.com/mlefree/whozwho/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/mlefree/whozwho/compare/v1.0.0...v1.0.3
[1.0.0]: https://github.com/mlefree/whozwho/releases/tag/v1.0.0
