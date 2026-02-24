#!/usr/bin/env node

/**
 * Run Playwright tests with organized report directories
 * Usage: node scripts/runTestWithReports.js <test-file> <test-name> [playwright-args]
 * Example: node scripts/runTestWithReports.js studio publish --headed
 */

const { spawn } = require('child_process');
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
  console.log('---');
  
  // Build playwright command
  const testSpec = testFile.includes('.spec.ts') 
    ? `src/tests/${testFile}.spec.ts`
    : `src/tests/${testFile}.spec.ts`;
  
  const playwrightArgs = [
    'test',
    testSpec,
    '--reporter=html=' + htmlReportDir,
    ...additionalArgs,
  ];
  
  // Add grep if test name is provided
  if (testName && testName !== 'all') {
    playwrightArgs.push('--grep', testName);
  }
  
  console.log(`🚀 Running: npx playwright ${playwrightArgs.join(' ')}\n`);
  
  // Spawn the test process
  const testProcess = spawn('npx', playwrightArgs, {
    stdio: 'inherit',
    cwd: __dirname + '/..'
  });
  
  testProcess.on('exit', (code) => {
    if (code === 0) {
      console.log(`\n✅ Tests completed successfully!`);
      console.log(`📁 Results saved in: ${reportPath}`);
      console.log(`📊 View report: ${path.join(htmlReportDir, 'index.html')}`);
    } else {
      console.log(`\n❌ Tests failed with exit code: ${code}`);
      console.log(`📁 Results saved in: ${reportPath}`);
    }
  });
  
  testProcess.on('error', (err) => {
    console.error(`❌ Failed to start test process: ${err}`);
    process.exit(1);
  });
}

// Parse command line arguments
const testFile = process.argv[2] || 'studio';
const testName = process.argv[3] || 'all';
const additionalArgs = process.argv.slice(4);

runTest(testFile, testName, additionalArgs);
