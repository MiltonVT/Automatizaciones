#!/usr/bin/env node

/**
 * Run Playwright tests with organized report directories
 * Usage: node scripts/runTestWithReports.js <test-file> <test-name> [playwright-args]
 * Example: node scripts/runTestWithReports.js studio publish --headed
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getReportPath, ensureReportsArchiveDir } = require('./generateReportName');

function runTest(testFile, testName, additionalArgs = []) {
  // Ensure reports archive directory exists
  ensureReportsArchiveDir();
  
  // Get unique report path
  const reportPath = getReportPath(testName);
  
  // Create the test results directory
  const testResultsDir = path.join(reportPath, 'test-results');
  const htmlReportDir = path.join(reportPath, 'html-report');
  
  console.log(`📁 Report directory: ${reportPath}`);
  console.log(`⏱️  Timestamp: ${new Date().toISOString()}`);
  console.log(`🧪 Test: ${testName || 'all tests'}`);
  console.log(`📄 File: ${testFile}`);
  console.log('---\n');
  
  // Build playwright command
  const testSpec = testFile.includes('.spec.ts') 
    ? `src/tests/${testFile}.spec.ts`
    : `src/tests/${testFile}.spec.ts`;
  
  const playwrightArgs = [
    'test',
    testSpec,
    `--reporter=html=${htmlReportDir}`,
    ...additionalArgs,
  ];
  
  // Add grep if test name is provided
  if (testName && testName !== 'all') {
    playwrightArgs.push('--grep', testName);
  }
  
  const command = `npx ${playwrightArgs.join(' ')}`;
  console.log(`🚀 Running: ${command}\n`);
  
  try {
    // Execute the test command
    execSync(command, {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log(`\n✅ Tests completed successfully!`);
    console.log(`📁 Results saved in: ${reportPath}`);
    console.log(`📊 View report: ${path.join(htmlReportDir, 'index.html')}`);
    process.exit(0);
  } catch (err) {
    console.log(`\n❌ Tests failed or ended with error`);
    console.log(`📁 Results saved in: ${reportPath}`);
    process.exit(1);
  }
}

