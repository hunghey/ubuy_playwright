# Test Execution Runbook & Cheat Sheet

This guide provides a comprehensive reference for common CLI commands and workflows for executing tests within this Playwright automation framework.

## Table of Contents

- [Test Execution](#test-execution)
- [Reporting](#reporting)
- [Debugging](#debugging)
- [Advanced Options](#advanced-options)
- [Troubleshooting](#troubleshooting)

## Test Execution

### Run All Tests (Headless Mode)

Execute all tests in the project in headless mode (default behavior). This is the standard mode for CI/CD pipelines and automated test runs.

```bash
npx playwright test
```

**Output**: Tests run in the background without opening browser windows. Results are displayed in the terminal and saved to the HTML report.

---

### Run in UI Mode

Launches the interactive Playwright UI mode, providing a visual interface for running and debugging tests. This mode is ideal for test development and exploratory testing.

```bash
npx playwright test --ui
```

**Features**:

- Visual test tree with pass/fail indicators
- Real-time test execution with browser preview
- Step-by-step test execution
- Test filtering and search capabilities
- Screenshot and trace viewing

---

### Run in Debug Mode

Opens the Playwright Inspector for detailed step-by-step debugging. The browser will pause at each action, allowing you to inspect the page state and debug issues.

```bash
npx playwright test --debug
```

**Usage Tips**:

- Use browser DevTools alongside the inspector
- Step through actions one at a time
- Inspect selectors and page state
- Modify test code on the fly

---

### Run Specific Test File

Execute only the tests defined in a specific test file. Useful for running a single test suite during development.

```bash
npx playwright test tests/functional/auth/auth.spec.ts
```

**Example Output**:

```
Running 4 tests using 1 worker
  ✓ tests/functional/auth/auth.spec.ts:62:3 › TC1: Should successfully register...
  ✓ tests/functional/auth/auth.spec.ts:87:3 › TC2: Should show error when registering...
  ✓ tests/functional/auth/auth.spec.ts:97:3 › TC3: Should show error when logging in...
  ✓ tests/functional/auth/auth.spec.ts:106:3 › TC4: Should successfully login and delete...
```

---

### Run Tests by Tag or Name (Grep)

Execute specific test cases matching a name pattern or tag. This is useful for running a subset of tests that share a common identifier.

```bash
npx playwright test -g "TC2"
```

**Examples**:

```bash
# Run tests containing "TC2" in the name
npx playwright test -g "TC2"

# Run tests containing "login" in the name
npx playwright test -g "login"

# Run tests containing "register" in the name
npx playwright test -g "register"
```

**Note**: The `-g` flag uses pattern matching, so partial matches will be included.

---

### Run Tests in Specific Browser

Execute tests in a specific browser. By default, tests run in Chromium, but you can target other browsers.

```bash
# Run in Chromium (default)
npx playwright test --project=chromium

# Run in Firefox (if configured)
npx playwright test --project=firefox

# Run in WebKit (if configured)
npx playwright test --project=webkit
```

---

### Run Tests with Specific Workers

Control the number of parallel workers for test execution. Useful for debugging parallel execution issues or optimizing performance.

```bash
# Run with a single worker (sequential execution)
npx playwright test --workers=1

# Run with multiple workers (parallel execution)
npx playwright test --workers=4
```

---

## Reporting

### View HTML Report

Opens the locally generated HTML report in your default browser. The report includes detailed test results, screenshots, traces, and execution timelines.

```bash
npx playwright show-report
```

**Report Features**:

- Test execution summary with pass/fail counts
- Detailed test results with execution time
- Screenshots captured on failure
- Trace viewer for debugging failed tests
- Timeline visualization of test execution

**Note**: The report is generated automatically after each test run and stored in the `playwright-report/` directory.

---

### Generate Report Only (Without Running Tests)

If you have existing test results, you can view the report without re-running tests:

```bash
npx playwright show-report
```

This command will open the most recent report from the `playwright-report/` directory.

---

## Debugging

### Run with Trace

Enable trace collection for debugging. Traces capture a complete execution log that can be viewed in the Trace Viewer.

```bash
npx playwright test --trace on
```

**View Trace**:

```bash
npx playwright show-trace trace.zip
```

---

### Run with Screenshots

Force screenshot capture for all tests (not just failures):

```bash
npx playwright test --screenshot=on
```

**Screenshot Options**:

- `on` - Capture screenshots for all tests
- `only-on-failure` - Capture screenshots only when tests fail (default)
- `off` - Disable screenshots

---

### Run with Video Recording

Record video of test execution:

```bash
npx playwright test --video on
```

**Video Options**:

- `on` - Record video for all tests
- `on-first-retry` - Record video only when retrying failed tests
- `retain-on-failure` - Keep videos only for failed tests
- `off` - Disable video recording

---

## Advanced Options

### Run Tests in Headed Mode

Execute tests with visible browser windows (useful for debugging):

```bash
npx playwright test --headed
```

---

### Run Tests with Specific Timeout

Set a custom timeout for test execution:

```bash
npx playwright test --timeout=60000
```

---

### Run Tests and Update Snapshots

Update visual regression test snapshots:

```bash
npx playwright test --update-snapshots
```

---

### List All Available Tests

List all tests without executing them:

```bash
npx playwright test --list
```

---

### Run Tests with Retries

Configure the number of retries for failed tests:

```bash
npx playwright test --retries=2
```

---

## Troubleshooting

### Common Issues and Solutions

#### "Command not found" Error

**Problem**: `npx playwright test` command is not recognized.

**Solutions**:

1. Ensure you have run `npm install` in the project root directory
2. Verify you are in the correct project directory
3. Check that Node.js and npm are properly installed:
   ```bash
   node --version
   npm --version
   ```

---

#### Browser Installation Issues

**Problem**: Tests fail with browser-related errors.

**Solution**: Reinstall Playwright browsers:

```bash
npx playwright install
```

For a specific browser:

```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

---

#### Tests Fail with Timeout Errors

**Problem**: Tests timeout before completing.

**Solutions**:

1. Increase the timeout in `playwright.config.ts`:
   ```typescript
   use: {
     actionTimeout: 30000,
     navigationTimeout: 30000,
   }
   ```
2. Run tests with a longer timeout:
   ```bash
   npx playwright test --timeout=60000
   ```

---

#### CSV File Not Found

**Problem**: Tests fail with "CSV file does not exist" error.

**Solution**: Ensure the `data/created_users.csv` file exists. The framework will create it automatically on first run, but you can also create it manually with the header:

```csv
name,email,password,status
```

---

#### Port Already in Use (EADDRINUSE: address already in use ::1:9323)

**Problem**: Error `EADDRINUSE: address already in use ::1:9323` indicates that port 9323 (the default port for viewing Playwright HTML reports) is being used by another program.

**Solutions**:

1. **Close the existing Playwright report server:**
   - If you have a Playwright report already open in your browser, close it
   - The report server may still be running in the background
   - Try running `npx playwright show-report` again after a few seconds

2. **Find and kill the process using port 9323 (Windows):**

   ```powershell
   # Find the process using port 9323
   netstat -ano | findstr :9323

   # Note the PID from the output, then kill the process
   taskkill /PID <PID> /F
   ```

   **Example:**

   ```powershell
   # If netstat shows PID 12345
   taskkill /PID 12345 /F
   ```

3. **Use a different port for the report:**

   ```bash
   npx playwright show-report --port 9324
   ```

4. **Restart your terminal/command prompt:**
   - Sometimes the port is held by a zombie process
   - Closing and reopening your terminal may release it

5. **Check for multiple Node.js processes:**

   ```powershell
   # List all Node.js processes
   tasklist | findstr node

   # Kill all Node.js processes (use with caution)
   taskkill /IM node.exe /F
   ```

---

#### Environment Variables Not Loading

**Problem**: Environment variables are not being read.

**Solution**:

1. Ensure `.env` file exists in the root directory
2. Verify `dotenv` is properly configured in your configuration files
3. Check that variable names match what's expected in the code

---

## Quick Reference

| Command                                       | Description                    |
| --------------------------------------------- | ------------------------------ |
| `npx playwright test`                         | Run all tests (headless)       |
| `npx playwright test --ui`                    | Run tests in UI mode           |
| `npx playwright test --debug`                 | Run tests in debug mode        |
| `npx playwright test tests/auth/auth.spec.ts` | Run specific test file         |
| `npx playwright test -g "TC2"`                | Run tests matching pattern     |
| `npx playwright show-report`                  | View HTML test report          |
| `npx playwright test --headed`                | Run tests with visible browser |
| `npx playwright test --workers=1`             | Run tests sequentially         |
| `npx playwright test --list`                  | List all available tests       |

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-test)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
