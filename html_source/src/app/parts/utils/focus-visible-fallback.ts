export function setupFocusVisibleFallback(): void {
    const handleFirstTab = (e: KeyboardEvent): void => {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');

            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
            window.addEventListener('touchstart', handleMouseDownOnce);
        }
    };

    const handleMouseDownOnce = (): void => {
        document.body.classList.remove('user-is-tabbing');
        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.removeEventListener('touchstart', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    };

    window.addEventListener('keydown', handleFirstTab);
}
