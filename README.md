# Playwright TypeScript Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-v1.56+-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-v20.0+-339933?style=flat-square&logo=node.js&logoColor=white)

## Introduction

This repository contains a professional **Hybrid Automation Framework** (API & UI) built with **Playwright** and **TypeScript**.

The framework is designed for scalability and reliability, implementing **Page Object Model (POM)**, **Custom Fixtures**, and **Data-Driven Testing**. It supports distinct testing layers: API, Functional (UI), and End-to-End (E2E) flows.

## Key Features

- **Hybrid Testing**: Unified framework for API and UI automation.
- **Page Object Model (POM)**: Enhanced with Playwright fixtures for cleaner test code.
- **Data-Driven Testing**: Integration with CSV and TypeScript-based data generators.
- **Multi-layered CI/CD**: Optimized GitHub Actions pipeline with parallel execution.
- **Automatic Reporting**: HTML and JUnit reports with trace and video on failure.

## Project Structure

```
PlaywrightMCp/
├── .github/workflows/       # CI/CD Workflows (playwright.yml)
├── config/                  # Framework & Environment configuration
├── fixtures/                # Playwright Custom Fixtures (POM initialization)
├── pages/                   # Page Object Model (POM)
│   ├── components/          # Reusable UI components (Navbar, etc.)
│   └── ...                  # Individual Page Objects
├── test-data/               # Test data management
│   ├── api/                 # API-specific test data
│   ├── ui/                  # UI-specific test data
│   ├── shared/              # Shared constants and data
│   ├── static/              # Static files for testing (e.g., uploads)
│   └── created_users.csv    # Dynamic data storage
├── tests/                   # Test Suites
│   ├── api/                 # API Contract & Functional tests
│   ├── e2e/                 # Full User flows
│   └── functional/          # Feature-level UI tests (Auth, Cart, Products)
├── utils/                   # Core utilities
│   ├── apiClient.ts         # REST API client wrapper
│   ├── csvUtils.ts          # CSV processing logic
│   └── testDataGenerator.ts # Faker-based data generation
├── playwright.config.ts     # Main Playwright configuration
└── package.json             # Project dependencies and metadata
```

## Prerequisites & Installation

### Prerequisites

- **Node.js**: v20.0 or higher (Recommended)
- **npm**: v9.0 or higher

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd PlaywrightMCp
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright Browsers:**

   ```bash
   npx playwright install chromium --with-deps
   ```

4. **Environment Configuration:**
   Create a `.env` file in the root directory or export the `BASE_URL`:
   ```bash
   BASE_URL=https://automationexercise.com
   ```

## Running Tests

### 🔌 API Tests

Fast, lightweight tests for endpoint verification and contracts.

```bash
npx playwright test tests/api/
```

### 🧪 Functional Tests

UI-based tests focused on specific features (Auth, Cart, etc.).

```bash
npx playwright test tests/functional/
```

### 🚀 E2E Tests

Full purchase flows and long user journeys.

```bash
npx playwright test tests/e2e/
```

### Miscellaneous Commands

- **Run all tests**: `npx playwright test`
- **Interactive UI Mode**: `npx playwright test --ui`
- **Debug Mode**: `npx playwright test --debug`
- **View Report**: `npx playwright show-report`

## CI/CD Pipeline

The framework uses GitHub Actions (`.github/workflows/playwright.yml`) with the following logic:

- **Push/Pull Request**: Triggers the full suite on `main`.
- **Scheduled**: Runs daily at 6 AM UTC.
- **Jobs**:
  1. **API Tests**: Independent and fast.
  2. **Functional Tests**: UI validation.
  3. **E2E Tests**: Depends on Functional tests completion.

## Technology Stack

- **Playwright**: v1.56.0
- **TypeScript**: v5.0+
- **Faker.js**: Data generation
- **CSV-Parse**: Data-driven testing
- **Dotenv**: Environment management

## Contributing

When contributing to this project, please ensure:

1. Follow the existing Page Object Model pattern
2. Maintain consistent code formatting and style
3. Add appropriate test data to CSV files when needed
4. Update documentation for any new features or changes

## License

ISC
