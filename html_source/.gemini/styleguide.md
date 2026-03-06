# Professional Guide: Angular 14 | Chrome 68 | Qt Environment

## 1. Environment & Runtime Constraints
- **Runtime:** Qt WebEngine (Embedded Chrome 68).
- **CSS Constraint:** NO `@media` queries support. Do not use them for responsive design.
- **Responsiveness:** Use Flexbox/Grid with percentage widths or HostListeners to calculate dimensions in JS if necessary.
- **JS Engine:** Chrome 68 (ES2018). Avoid `?.`, `??`, and `array.flat()` unless polyfilled.
- **Rendering:** Be cautious with `position: fixed` and `z-index` in Qt containers; prefer `flex` layouts for stable rendering.

## 2. Angular 14 Professional Standards
- **Strictly Typed Forms:** Use `FormControl<string>`, `FormGroup<MyInterface>`.
- **Forbidden:** Never use `UntypedFormControl` or `UntypedFormGroup`.
- **DI Pattern:** Use constructor for clean, modern dependency injection.
- **Architecture:** Follow the LIFT principle (Locate, Identify, Flat, T-Dry).
- **Change Detection:** Always use `ChangeDetectionStrategy.OnPush` to minimize CPU usage in the Qt environment.

## 3. RxJS & State Management
- **Memory:** Strict `takeUntil(this.destroy$)` pattern in `ngOnDestroy`.
- **Streams:** Use `shareReplay(1)` for multicasting data from API to multiple UI elements.
- **State:** Use `BehaviorSubject` in services for lightweight state management.

## 4. UI & Styling (Qt-Specific)
- **Layout:** Since `@media` is broken, use a "Container-first" approach.
- **CSS Units:** Avoid `vh` and `vw` if the Qt window is resizable (can cause jitter); prefer `%` or `flex-grow`.
- **Methodology:** BEM (Block Element Modifier).
- **Scrollbars:** Use simple CSS scrollbar styling, as Qt WebEngine often has issues with default OS scrollbars.

## 5. Coding Behavior for Gemini
- **Role:** Act as a Senior Angular Architect specialized in Embedded Systems (Qt).
- **Constraint Check:** Before providing any CSS, ensure it does not contain `@media` blocks.
- **Code Style:** Clean, modular, and performance-oriented.

## 6. Security & Navigation (Qt Specific)
- **File System Access:** Prevent accidental directory listings. All internal links must point to specific `.html` files or assets.
- **Protocol Handling:** Use URL interceptors to block `file://` protocol access to sensitive folders like `AppData`.
- **Navigation Policy:** Implement a navigation guard to ensure that any request not matching the application's internal routes is cancelled or opened in the default system browser, not inside the Qt WebView.
