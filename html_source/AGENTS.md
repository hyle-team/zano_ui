# AI Agent Guidelines (Zano Project)

This document provides architectural context, coding standards, and project-specific rules for AI agents working on the Zano GUI.

## 🚫 Context Exclusion Rules
To minimize noise and focus on relevant code, **IGNORE** the following directories and files:
- **Build/Config artifacts:** `.angular/`, `.gemini/`, `.idea/`, `.vscode/`, `node_modules/`, `dist/`.
- **E2E Tests:** `e2e/` (unless explicitly asked for E2E tasks).
- **External/Legacy:** `html_source/` (this contains the final build output).
- **Scripts:** `index-html-transform.js`, `ngcc.config.js`, `update-build-time.js`.

## 🛠 Tech Stack
- **Framework:** Angular 14.2.10
- **Language:** TypeScript 4.8.4
- **Styling:** Stylus (`.styl`), Angular Material
- **State Management:** Reactive Store (RxJS-based) in `src/app/store/`
- **Backend:** Qt-based backend accessed via `QWebChannel`
- **Formatting:** Prettier + ESLint

## 🏗 Key Architectural Patterns

### 1. Backend Communication (`BackendService`)
The application acts as a GUI for a C++/Qt core.
- **Bridge:** Interaction happens through `mediator_object` exposed via `BackendService`.
- **Data Integrity:** ALWAYS use `BigNumber.js` for financial values. Avoid native JS `number` for crypto values.
- **Serialization:** Use `JSONBigNumber` for parsing backend responses.

### 2. Variables & Global State
- **`VariablesService`**: Central service for current wallet state (`current_wallet`) and app settings.
- **State Updates:** State is pushed from the backend and synchronized via RxJS subjects in the `Store`.

### 3. Template Standards
- **Localization:** All UI strings must use the `| translate` pipe (`ngx-translate`).
- **Custom Pipes:** Use `| intToMoney` for crypto amounts.
- **Loading UI:** Use `<ng-template #skeletonTemplate>` for loading states.

## 📝 Coding Rules

### TypeScript & RxJS
- **Clean Up:** Use `takeUntil(this.destroy$)` or the `async` pipe.
- **Typing:** Strict typing is mandatory. Interfaces go in `src/app/api/models/`.

### Styling (Stylus)
- Use `.styl` files.
- Use utility classes (e.g., `text-ellipsis`, `border-radius-0_8-rem`).

## 🚀 Development Workflow
- `npm run format`: Run `npx prettier --write .` before submitting changes.

## ⚠️ Important Considerations
- **Wallet Loading:** Always verify `variablesService.current_wallet.loaded` before rendering wallet-specific data.
- **Project Structure:** Focus primarily on `src/app/` for logic and `src/assets/i18n/` for translations.
