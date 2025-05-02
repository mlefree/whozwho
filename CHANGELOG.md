# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reduced data retention period from 30 days to 60 minutes for actor, advice, and status records
- Enhanced update process to only trigger when it's the last actor to be updated
- Improved release process documentation in README.md

### Added

- New method `OnGoingAdvicesCount()` to track pending advice records
- New test case for registering actors with same ID but different category

## [1.1.9] - 2025-05-01

### Changed

- Updated dependencies
- Improved system stability

## [1.1.8] - 2025-05-01

### Changed

- Improved CI workflow stability
- Updated dependencies

## [1.1.7] - 2025-04-29

### Changed

- Enhanced CI process
- Fixed minor issues

## [1.1.6] - 2025-04-27

### Changed

- Continued improvements to CI workflow
- Updated build process

## [1.1.5] - 2025-04-25

### Changed

- Updated CI workflow to use new tag naming convention (app.v$VERSION)

## [1.1.0] - 2025-04-22

### Added

- Enhanced actor management capabilities
- Improved admin controls
- Updated environment configurations

### Technical

- Updated dependencies
- Improved test coverage

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

[Unreleased]: https://github.com/mlefree/whozwho/compare/v1.1.9...HEAD

[1.1.9]: https://github.com/mlefree/whozwho/compare/v1.1.8...v1.1.9

[1.1.8]: https://github.com/mlefree/whozwho/compare/v1.1.7...v1.1.8

[1.1.7]: https://github.com/mlefree/whozwho/compare/v1.1.6...v1.1.7

[1.1.6]: https://github.com/mlefree/whozwho/compare/v1.1.5...v1.1.6

[1.1.5]: https://github.com/mlefree/whozwho/compare/v1.1.0...v1.1.5

[1.1.0]: https://github.com/mlefree/whozwho/compare/v1.0.3...v1.1.0

[1.0.3]: https://github.com/mlefree/whozwho/compare/v1.0.0...v1.0.3

[1.0.0]: https://github.com/mlefree/whozwho/releases/tag/v1.0.0
