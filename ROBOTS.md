# Message for Agent contributors

This document serves as reminder for all non-human contributors and should be updated as context evolves.

## Mode Activation

⚠️ CRITICAL: DO NOT make any changes without explicit mode activation.

- Wait for the human to explicitly type either:
  - "do mode:" or
  - "do it"
before:
  - Making any code changes
  - Fixing any issues
  - Creating or updating files
  - Applying any modifications
  - Running commands that modify the system
- Stay in read-only/analysis mode otherwise
- If unsure, ask for explicit mode activation

⚠️ File Creation Process:
1. NEVER attempt to create new files without explicit activation ("do mode:" or "do it")
2. If a needed file doesn't exist:
   - First mention that the file doesn't exist
   - Explain why it would be useful
   - Wait for human to type activation command
   - Only then proceed with file creation
3. For each file operation:
   - Check if file exists before suggesting creation
   - Use list_dir or file_search to verify
   - Propose creation only after mode activation
4. Default behavior:
   - Assume read-only access
   - Only analyze existing files
   - Suggest but don't create new files
5. Even after "do mode:":
   - Double-check file existence before creation
   - Confirm file location is appropriate
   - Ensure file naming follows project conventions

## Date Management

Always obtain the current date from the system using:

```bash
date "+%Y-%m-%d"
```

Important date-related guidelines:

1. Never assume or guess dates
2. Don't rely on conversation context for dates
3. Don't ask humans for date confirmation when system date is available
4. Use ISO 8601 format (YYYY-MM-DD) for all dates
5. Verify system date before updating date-sensitive files:
    - CHANGELOG.md
    - Release tags
    - Version updates
    - Documentation timestamps

## Files Requiring Date Attention

- CHANGELOG.md: For release dates and version tracking
- RELEASE_PROCESS.md: For release timestamps
- Git tags: For version release dates
- Documentation updates: For any dated content
