# WhozWho Product Context

## Why This Project Exists
WhozWho was created to solve the complex challenges of managing distributed systems where multiple actors need to coordinate, maintain roles, and propagate updates efficiently. In distributed environments, determining which node should take leadership roles and ensuring all nodes receive proper updates are critical challenges that WhozWho addresses.

## Problems It Solves

### Distributed Leadership
- Eliminates the "split-brain" problem in distributed systems by providing clear role assignment
- Resolves conflicts when multiple actors claim the same role
- Provides automatic failover when principal actors become unavailable

### Update Coordination
- Ensures all actors in a distributed system receive necessary updates
- Prevents version conflicts across the system
- Manages the update lifecycle from proposal to completion

### System Monitoring
- Provides real-time visibility into actor status and health
- Detects and reports on actor failures
- Maintains system-wide status awareness

## How It Should Work

### Actor Registration Flow
1. Actors register with the system via the `/hi` endpoint
2. System evaluates actor characteristics and assigns appropriate roles
3. Actors periodically check in to maintain their status
4. Role transitions occur automatically based on actor health and activity

### Update Propagation Flow
1. Updates are proposed through the advice system
2. Principal actors validate and approve updates
3. Updates are propagated to all relevant actors
4. Actors report back on update status
5. System maintains consistency across the network

### Error Handling
1. System detects actor failures through missed check-ins
2. Automatic role reassignment occurs when needed
3. Recovery procedures are initiated for failed actors
4. System maintains stability during recovery

## User Experience Goals

### For System Administrators
- Simple, intuitive API for monitoring system health
- Clear visibility into actor roles and statuses
- Straightforward update management
- Minimal manual intervention required

### For Application Developers
- Easy integration with existing systems
- Predictable behavior during role transitions
- Reliable update propagation
- Comprehensive error handling

### For End Users
- Seamless experience even during system updates
- No service interruptions during role transitions
- Consistent performance across the system
- High availability and reliability

This document builds upon the core requirements defined in projectbrief.md and provides context for how WhozWho addresses real-world distributed system challenges.
