# Release Process Documentation

⚠️ IMPORTANT: DO NOT PUSH ANY CHANGES OR TAGS UNTIL EXPLICITLY ASKED TO "RELEASE"
This includes:

- No git push
- No git push --tags
- No npm publish
- No manual releases
  Wait for the explicit "release" command before pushing anything.

## Patch Version Release Steps

### Prerequisites

- Make sure you have all dependencies installed
- Ensure you're starting from an up-to-date master branch
- Verify system date is correct:
  ```bash
  date "+%Y-%m-%d"  # Verify this matches expected release date
  ```

### Step-by-Step Process

⚠️ If any task fails, you must:

- NOT proceed with any further steps
- NOT try to fix or set the environment manually
- Alert the team and request guidance

1. **Initial Verification**
   ```bash
   npm test
   ```
   This command runs the test suite. Do not proceed if any tests fail.

2. **Documentation Sync**
   Ensure all documentation is up-to-date with recent changes:
    - README.md
    - specs/*.md files
    - CHANGELOG.md (use system date for release date)

5. **Version Control**
   ```bash
   git add .
   git commit -m "release: patch version X.Y.Z with [explanation of changes]"
   git tag -a vX.Y.Z -m "Version X.Y.Z"
   git push
   git push --tags
   ```
   Replace X.Y.Z with the actual version number and provide a clear explanation of changes.

## For all Version Release Steps (Patch or Release)

### Important Notes

- Always run and verify tests before pushing
- Document all significant changes in the commit message
- Monitor the merge process for any conflicts

### Post-Release Verification

- Verify the release is properly tagged

### Version Management Best Practices

- Always check the current version in package.json before starting the release process
- Use `npm run bump` to increment the version number automatically
- Ensure version numbers are consistent across:
    - package.json
    - git tags
    - CHANGELOG.md entries
- Never manually edit version numbers

### CHANGELOG Management

- Keep the [Unreleased] section at the top of CHANGELOG.md
- Move unreleased changes to a new version section during release
- Include the current date in ISO format (YYYY-MM-DD)
- Organize changes under appropriate categories:
    - Added
    - Changed
    - Fixed
    - Dependencies
    - Technical Details

### Common Pitfalls to Avoid

- Don't push any changes before receiving explicit "release" command
- Don't create tags with placeholder version numbers (X.Y.Z)
- Don't forget to push both commits and tags (only after "release" command)
- Don't manually publish to npm
- Don't bypass CI process

### Recovery Procedures

If incorrect version numbers are used:

1. Delete the incorrect tag locally and remotely:
   ```bash
   git tag -d <incorrect_tag>
   git push origin :<incorrect_tag>
   ```
2. Update version numbers in all relevant files
3. Create new tag with correct version
4. Push changes and new tag

If merge conflicts occur:

1. Document the conflicting files
2. Resolve conflicts locally
3. Commit the resolution with a clear message
4. Push the changes
5. Verify the merge was successful

### Directory Navigation

- Return to the root directory for git operations
- Use absolute paths when necessary to avoid confusion

### Future Improvements

- Consider automating version consistency checks
- Add pre-commit hooks for version validation
- Implement automated changelog updates
- Add automated testing of the release process
- Consider implementing a release automation script 
