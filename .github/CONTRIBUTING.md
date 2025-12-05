# Contributing to FluentPDF-AI-Powered-Speech-Synthesis-Web-App

We welcome contributions to the `FluentPDF-AI-Powered-Speech-Synthesis-Web-App`! To ensure a high-quality, consistent, and professional codebase, please adhere to the following guidelines.

## 1. Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to `chirag127@example.com`.

## 2. How to Contribute

### 2.1. Reporting Bugs

If you find a bug, please report it by opening a new issue on GitHub. Include as much detail as possible:

*   A clear, descriptive title.
*   Steps to reproduce the bug.
*   Your environment (browser, OS, etc.).
*   Screenshots or error logs if applicable.

### 2.2. Feature Requests

We welcome feature requests! Please open a new issue to discuss your idea before starting any development. This helps us ensure alignment and avoid duplicated effort.

### 2.3. Pull Requests (PRs)

Contributions are made via GitHub Pull Requests.

1.  **Fork the repository.**
2.  **Clone your fork** to your local machine:
    bash
    git clone https://github.com/chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App
    cd FluentPDF-AI-Powered-Speech-Synthesis-Web-App
    
3.  **Create a new branch** for your feature or bug fix:
    bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/your-bug-fix
    
4.  **Make your changes.** Ensure your code adheres to the project's standards (see Section 3).
5.  **Test your changes.** Run the provided test suites to ensure no regressions are introduced.
6.  **Commit your changes** with clear, concise messages:
    bash
    git commit -m "feat: Add new PDF processing algorithm"
    # or
    git commit -m "fix: Resolve audio playback issue on Safari"
    
7.  **Push your branch** to your fork:
    bash
    git push origin feature/your-feature-name
    
8.  **Open a Pull Request** on the `chirag127/FluentPDF-AI-Powered-Speech-Synthesis-Web-App` repository. Please provide a clear description of your changes and reference any related issues.

## 3. Development Standards & Guidelines

This project aims for **Zero-Defect, High-Velocity, Future-Proof** development. Adherence to the following principles is mandatory:

*   **Architectural Adherence:** The project is structured using modern web standards and AI integration patterns. Refer to the project's `README.md` and `AGENTS.md` for detailed architectural directives and tech stack information.
*   **Code Quality:**
    *   **Linting & Formatting:** All code must pass linting and formatting checks enforced by **Ruff**. Run `ruff check --fix .` and `ruff format .` locally before committing.
    *   **Testing:** All new code must be accompanied by relevant unit or integration tests. Ensure tests are run and pass using `pytest`.
    *   **Type Safety:** Embrace strict typing where applicable (e.g., TypeScript if it were used, or thorough type hinting in Python if applicable to future components).
    *   **DRY (Don't Repeat Yourself):** Avoid redundant code. Use functions, classes, or modules to abstract common logic.
    *   **SOLID Principles:** Where applicable, adhere to SOLID principles for robust and maintainable object-oriented design.
*   **Documentation:** Keep code well-commented, especially for complex logic or non-obvious behavior. Ensure `README.md` and `AGENTS.md` are kept up-to-date with significant changes.

## 4. Technical Stack & Tools (Late 2025 Standards)

This project is built with a focus on modern web technologies and AI integration. While the core is HTML, CSS, and JavaScript, future development may leverage or interface with:

*   **Language:** HTML, CSS, JavaScript (ESNext).
*   **Framework/Bundler:** (Considered: Vite for future front-end components).
*   **AI Integration:** Utilizes AI models for advanced text extraction and natural speech synthesis. Specific APIs and models should be referenced in `AGENTS.md`.
*   **Package Management:** npm/yarn for front-end assets.
*   **Linting/Formatting:** Standard web linters (e.g., ESLint, Prettier, or equivalents for JavaScript/TypeScript).
*   **Testing:** Modern JavaScript testing frameworks (e.g., Vitest, Jest) for front-end logic, and potentially Playwright for E2E testing.
*   **Deployment:** CI/CD pipelines configured via GitHub Actions (see `.github/workflows/ci.yml`).

## 5. AI AGENT INTERACTIONS

Refer to the `AGENTS.md` file for detailed instructions on how AI agents interact with this project, including specific API endpoints, model preferences, and verification commands.

## 6. Reporting Security Vulnerabilities

If you discover a security vulnerability, please follow our security policy: please do NOT report security vulnerabilities on the public GitHub issue tracker. Instead, please email `chirag127-security@example.com`.

We will promptly investigate and address all validated security concerns. We appreciate your efforts in making this project more secure.

---