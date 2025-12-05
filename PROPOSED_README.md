# FluentPDF-AI-Powered-Speech-Synthesis-Web-App

<p align="center">
  <a href="https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App">
    <img src="https://raw.githubusercontent.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App/main/docs/assets/logo.svg" alt="FluentPDF Logo" width="150">
  </a>
  <h1 align="center">FluentPDF AI Speech Synthesis</h1>
</p>

<p align="center">
  <a href="https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App/ci.yml?branch=main&style=flat-square&label=CI%20Build" alt="CI Status">
  </a>
  <a href="https://codecov.io/gh/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App">
    <img src="https://img.shields.io/codecov/c/github/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App?style=flat-square&token=SECURE_TOKEN" alt="Code Coverage">
  </a>
  <img src="https://img.shields.io/badge/Language-TypeScript%20|%20HTML5-3178C6?style=flat-square" alt="Tech Language">
  <img src="https://img.shields.io/badge/Framework-Vite%20|%20TailwindCSS-646CFF?style=flat-square" alt="Framework">
  <img src="https://img.shields.io/badge/Linter-Biome-3300FF?style=flat-square" alt="Linter">
  <a href="https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App?style=flat-square&color=blue" alt="License">
  </a>
  <a href="https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App/stargazers">
    <img src="https://img.shields.io/github/stars/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App?style=flat-square" alt="GitHub Stars">
  </a>
</p>

> ⭐ **Star this repository to show your support!**

---

## 🚀 Project Overview (BLUF)

**FluentPDF** is an advanced, accessibility-focused web application designed to seamlessly transform PDF documents into natural, high-quality spoken audio. Leveraging state-of-the-art AI for complex text extraction and speech synthesis, it provides an unparalleled tool for users seeking auditory content consumption.

This application is built using the **Vite** ecosystem with **TypeScript** and styled via **TailwindCSS v4**, ensuring a robust, type-safe, and highly responsive user experience.

## 🗺️ High-Level Architecture

FluentPDF employs a Component-Based Architecture (CBA) organized around the Feature-Sliced Design (FSD) principles, promoting scalability, maintainability, and clean separation of concerns between PDF processing, AI orchestration, and the user interface layers.

mermaid
graph TD
    A[User Interface (Vite/TS/Tailwind)] --> B(PDF Upload Handler);
    B --> C{PDF Parsing Layer (pdf.js)};
    C --> D[Text Extraction & Chunking];
    D --> E[AI TTS Orchestrator API];
    E --> F(Audio Stream Generation);
    F --> G[Audio Playback Component];
    G --> A;
    style A fill:#D1D9F1,stroke:#6C63FF
    style E fill:#CFFFE5,stroke:#2ECC71


## 📚 Table of Contents

1.  [Project Overview (BLUF)](#-project-overview-bluf)
2.  [High-Level Architecture](#-high-level-architecture)
3.  [Installation and Setup](#-installation-and-setup)
4.  [Development Scripts](#-development-scripts)
5.  [AI Agent Directives (System Documentation)](#-ai-agent-directives-system-documentation)
6.  [Core Development Principles](#-core-development-principles)
7.  [License](#-license)

---

## 💻 Installation and Setup

FluentPDF requires Node.js (v18+) and `npm` (or `uv`) to manage dependencies and build the application.

bash
# 1. Clone the repository
git clone https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App.git

# 2. Navigate to the project directory
cd FluentPDF-AI-Powered-Speech-Synthesis-Web-App

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
# The application will be accessible at http://localhost:5173


## ⚙️ Development Scripts

| Script | Description | Purpose |
| :--- | :--- | :--- |
| `dev` | `vite` | Runs the development server with Hot Module Replacement (HMR). |
| `build` | `tsc && vite build` | Compiles TypeScript and packages the final production assets into the `dist` folder. |
| `preview` | `vite preview` | Locally serves the production build for final verification. |
| `lint` | `biome check . --apply` | Runs Biome to check and automatically fix code quality and formatting issues. **MANDATORY before commit.** |
| `test:unit` | `vitest run` | Executes all unit tests (focusing on components and utility functions). |
| `test:e2e` | `playwright test` | Runs end-to-end tests to verify the full user flow (PDF upload -> TTS conversion -> playback). |

---

## 🤖 AI Agent Directives (System Documentation)

<details>
<summary><strong>SYSTEM ACCESS: Apex Technical Authority Guidelines (FluentPDF Web App)</strong></summary>

### 1. IDENTITY & PRIME DIRECTIVE

**Role:** You are the Senior Principal Software Architect assigned to maintain and evolve the `FluentPDF-AI-Powered-Speech-Synthesis-Web-App`. Your primary focus is on performance, accessibility (WCAG 2.2), and high-fidelity speech synthesis integration.

**Context:** Current Date is **December 2025**. You are building for the 2026 standard.

### 2. PRIMARY STACK & TOOLCHAIN (Frontend)

| Area | Tool/Framework | Standard/Version |
| :--- | :--- | :--- |
| **Core Language** | TypeScript | Strict Mode (TSConfig) |
| **Build Tool** | Vite | v7.x (Rolldown) |
| **Styling** | TailwindCSS | v4.x (Utility-First, JIT) |
| **State Management** | Signals (Solid/Preact patterns) | Minimalist, observable state only. |
| **Linting/Formatting** | Biome | Strict ruleset. |
| **Unit Testing** | Vitest | Coverage must remain > 90%. |
| **E2E Testing** | Playwright | Must cover full user journey (Upload, Process, Play). |

### 3. ARCHITECTURAL MANDATES

1.  **Feature-Sliced Design (FSD):** All new features (`src/features`) must be implemented using FSD principles (layers: `app`, `pages`, `features`, `entities`, `shared`). This ensures loose coupling.
2.  **API Abstraction:** All external API calls (TTS services, PDF parser utilities) must be wrapped in `src/shared/api` to facilitate easy swapping of underlying cloud providers (e.g., Azure Cognitive Services, Google Cloud TTS).
3.  **Accessibility First (A11y):** All components MUST pass automatic accessibility checks (e.g., `eslint-plugin-jsx-a11y`). The audio player controls must be fully keyboard navigable and screen-reader compatible.

### 4. VERIFICATION COMMANDS (Execution Mandate)

Any change submitted MUST successfully pass the following zero-defect workflow:

bash
# 1. Formatting and Code Quality Check
npm run lint

# 2. Comprehensive Testing
npm run test:unit
npm run test:e2e

# 3. Final Production Build Integrity Check
npm run build
npm run preview


</details>

## 📐 Core Development Principles

Development on FluentPDF strictly adheres to the following industry standards:

*   **SOLID:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.
*   **DRY (Don't Repeat Yourself):** Abstract utility logic and component definitions. Avoid code duplication.
*   **YAGNI (You Aren't Gonna Need It):** Only implement features explicitly required by the current sprint goals. Avoid premature optimization or over-engineering.
*   **Performance Budget:** Initial load time for the application shell must not exceed 1.5 seconds on a simulated 3G connection.

## 🛡️ License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** License. See the [LICENSE](LICENSE) file for details.
