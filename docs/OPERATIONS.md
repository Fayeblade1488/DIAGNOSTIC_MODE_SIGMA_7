# Operations Guide

## Running Locally

### Prerequisites

Before running the CPU-DS7 Protocol locally, ensure you have:

- **Node.js**: v16.x or higher (v18.x recommended)
- **npm**: v8.x or higher
- **Git**: For version control
- **Python**: v3.8+ (for pre-commit hooks)
- **pre-commit**: For automated checks

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/Fayeblade1488/DIAGNOSTIC_MODE_SIGMA_7.git
cd DIAGNOSTIC_MODE_SIGMA_7

# Install dependencies and setup hooks
make dev

# This runs:
# - npm install (installs Node.js dependencies)
# - pre-commit install (sets up Git hooks)
```

### Development Workflow

```bash
# Run tests
make test
# or: npm test

# Run linting
make lint
# or: npm run lint && npm run prettier:check

# Format code
make fmt
# or: npm run prettier:fix

# Start the application
make run
# or: npm start

# Build TypeScript
npm run build

# Clean artifacts
make clean
```

### Environment Variables

The protocol currently uses file-based configuration. If extending with environment variables:

| Variable    | Default       | Description                                  |
| ----------- | ------------- | -------------------------------------------- |
| `NODE_ENV`  | `development` | Runtime environment                          |
| `LOG_LEVEL` | `info`        | Logging verbosity (error, warn, info, debug) |
| `PORT`      | `3000`        | Server port (if running as service)          |

### Ports

Currently, the protocol is a configuration framework and does not expose network ports. If you extend it to include a server:

- Default: `3000` (configurable via `PORT` env var)
- Health check: `/health` (recommended)
- Metrics: `/metrics` (if implementing observability)

## Deploy

### GitHub Actions Release

The repository includes automated release workflows:

1. **Continuous Integration** (`.github/workflows/ci.yml`)
   - Triggered on: push to `main`, pull requests
   - Runs: tests, linting, formatting checks
   - Status required: must pass before merge

2. **Release** (`.github/workflows/release.yml`)
   - Triggered on: Git tags matching `v*` pattern
   - Actions:
     - Build and test
     - Create GitHub release
     - Upload artifacts
     - Publish to npm (if configured)

3. **Security Scans**
   - Gitleaks: `.github/workflows/gitleaks.yml`
   - CodeQL: `.github/workflows/codeql.yml`
   - Scorecard: `.github/workflows/scorecard.yml`

### Creating a Release

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Push tags
git push origin main --tags

# GitHub Actions will automatically:
# 1. Run CI pipeline
# 2. Create GitHub release
# 3. Attach build artifacts
```

### Container Registry

Currently, the protocol is not containerized. To deploy as a Docker container:

```dockerfile
# Dockerfile (example)
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY tsconfig.json ./

RUN npm run build

CMD ["node", "dist/2master_config_file.js"]
```

Build and push:

```bash
docker build -t cpu-ds7-protocol:latest .
docker tag cpu-ds7-protocol:latest ghcr.io/fayeblade1488/diagnostic_mode_sigma_7:latest
docker push ghcr.io/fayeblade1488/diagnostic_mode_sigma_7:latest
```

> **Note:** The GitHub username appears as `Fayeblade1488` (with uppercase 'F') in the repository URL, but container registries like GHCR require all lowercase (`fayeblade1488`). This is why the username is lowercase in the container image path.
### npm Package Publishing

To publish to npm registry:

```bash
# Configure npm authentication
npm login

# Publish (version should be updated first)
npm publish

# Or for scoped package:
npm publish --access public
```

## Monitoring

### Dashboards

The protocol itself is a configuration framework and doesn't include built-in monitoring. When integrating into applications, consider:

**Recommended Metrics Dashboard**:

- Protocol activation success rate
- Capability utilization (CSD_001-CSD_007)
- Compliance violations per hour
- Configuration validation failures
- Authorization token expiration countdown

**Tools**:

- **Grafana**: For visualization
- **Prometheus**: For metrics collection
- **DataDog**: For cloud-native monitoring
- **New Relic**: For APM and insights

### Alerts

**Recommended Alerts**:

1. **Critical**:
   - Authorization token expiring within 30 days
   - Protocol validation failures > 5 per hour
   - Security scan failures in CI/CD

2. **Warning**:
   - Test coverage drops below 80%
   - Build times exceed 5 minutes
   - Deprecated capability usage

3. **Info**:
   - New releases published
   - Configuration changes applied
   - Daily usage statistics

### SLOs (Service Level Objectives)

For production deployments (if protocol is extended to a service):

| Metric        | Target  | Measurement                 |
| ------------- | ------- | --------------------------- |
| Availability  | 99.9%   | Uptime per month            |
| Response Time | < 200ms | 95th percentile             |
| Error Rate    | < 0.1%  | Failed validations / total  |
| Build Success | > 99%   | CI/CD pipeline success rate |

## Backups / Data Retention

### Current State

The protocol is stateless and file-based. No dynamic data requires backup.

### Git as Backup

- **Primary**: GitHub repository (cloud-hosted)
- **Redundancy**: Individual developer clones
- **History**: Full Git history preserved indefinitely
- **Tags**: Release tags for version snapshots

### If Extending with Data Storage

**Backup Policies (Recommendations)**:

1. **Source Code**:
   - Backed up: Continuously (Git)
   - Retention: Indefinite
   - Recovery: Git clone from any replica

2. **Configuration**:
   - Backed up: With code commits
   - Retention: Full Git history
   - Recovery: Git checkout specific commit

3. **Logs** (if implemented):
   - Backed up: Daily
   - Retention: 90 days
   - Recovery: S3/Cloud storage restore

4. **User Data** (not applicable currently):
   - Would require: GDPR-compliant policies
   - Retention: As per legal requirements
   - Recovery: Point-in-time restore

### Disaster Recovery

**Current Protocol**:

1. Repository hosted on GitHub (highly available)
2. Multiple developer clones act as backups
3. CI/CD artifacts stored for 90 days

**Recovery Procedure**:

```bash
# If local copy lost:
git clone https://github.com/Fayeblade1488/DIAGNOSTIC_MODE_SIGMA_7.git
cd DIAGNOSTIC_MODE_SIGMA_7
make dev
make test  # Verify integrity
```

**Recovery Time Objective (RTO)**: < 1 hour
**Recovery Point Objective (RPO)**: 0 (Git ensures no data loss)

## Maintenance

### Regular Tasks

**Daily**:

- Monitor CI/CD pipeline status
- Review security scan results
- Check for dependency updates

**Weekly**:

- Review open issues and PRs
- Update documentation as needed
- Run full test suite locally

**Monthly**:

- Update dependencies: `npm update`
- Review and update .gitignore patterns
- Audit authorization token expiration
- Review and archive old issues

**Quarterly**:

- Major version updates
- Security audit
- Performance review
- Documentation refresh

### Health Checks

Pre-release checklist:

```bash
# Run all checks
make test          # Tests pass
make lint          # No linting errors
pre-commit run --all-files  # Pre-commit hooks pass
npm audit          # No high/critical vulnerabilities
npm outdated       # Review outdated dependencies
```

## Troubleshooting

### Common Issues

**Issue**: `npm install` fails
**Solution**: Delete `node_modules` and `package-lock.json`, then retry:

```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Pre-commit hooks not running
**Solution**: Reinstall hooks:

```bash
pre-commit uninstall
pre-commit install
```

**Issue**: ESLint errors with `--ext` flag
**Solution**: Use modern ESLint flat config:

```bash
npx eslint .
```

**Issue**: TypeScript compilation errors
**Solution**: Check `tsconfig.json` and verify TypeScript version:

```bash
npm list typescript
npm run build
```

### Support

For operational support, see [SUPPORT.md](../SUPPORT.md) or open an issue on GitHub.
