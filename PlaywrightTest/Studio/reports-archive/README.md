# Test Reports Archive

This directory contains archived test results organized by execution date, time, and test name.

## Format

Each report folder follows the naming convention:
```
YYYY-MM-DD_HH-MM-SS_test-name
```

**Example:** `2026-02-24_14-30-45_publish-application`

## What's Inside Each Report

- `html-report/` - Interactive HTML test report (open `index.html` in browser)
- `test-results/` - Detailed test results in machine-readable format

## View Reports

1. Using npm script:
   ```bash
   npm run reports:list
   ```

2. Open HTML report directly:
   ```bash
   open reports-archive/2026-02-24_14-30-45_publish-application/html-report/index.html
   ```

## Clean Up Old Reports

Remove reports older than 7 days:
```bash
npm run reports:clean
```

Remove reports older than specific days:
```bash
node scripts/cleanOldReports.js 3
```

## Run Tests with Automatic Report Storage

```bash
# Test entire studio suite
npm run test:studio:report:headed

# Test settings suite
npm run test:settings:report:headed

# Test specific test (publish)
npm run test:publish

# Test specific test (login)
npm run test:login-simple

# Test specific test (open application)
npm run test:open-app
```

These commands automatically create organized reports in this directory.
