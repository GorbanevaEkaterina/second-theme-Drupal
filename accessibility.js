// === Управление версией для слабовидящих ===
(function() {
    const html = document.documentElement;
    const body = document.body;

    // Элементы управления
    const fontSizeBtns = document.querySelectorAll('.font-size-btn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const imagesToggle = document.getElementById('imagesToggle');

    // Восстановление настроек из localStorage
    const savedFontSize = localStorage.getItem('accessibilityFontSize') || 'medium';
    const savedTheme = localStorage.getItem('accessibilityTheme') || 'default';
    const savedImages = localStorage.getItem('accessibilityImages') !== 'false';

    // Применение сохранённых настроек
    applyFontSize(savedFontSize);
    applyTheme(savedTheme);
    applyImagesSetting(savedImages);
 if (imagesToggle) {
        imagesToggle.checked = savedImages;
    }
    // === Размер шрифта ===
    fontSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.getAttribute('data-size');
            applyFontSize(size);
            localStorage.setItem('accessibilityFontSize', size);

            // Обновление активной кнопки
            fontSizeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function applyFontSize(size) {
        html.setAttribute('data-font-size', size);
    }

    // === Цветовая схема ===
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            applyTheme(theme);
            localStorage.setItem('accessibilityTheme', theme);

            // Обновление активной кнопки
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    function applyTheme(theme) {
        body.setAttribute('data-theme', theme);
    }

    // === Показ/скрытие изображений ===
    if (imagesToggle) {
        imagesToggle.addEventListener('change', (e) => {
            const showImages = e.target.checked;
            applyImagesSetting(showImages);
            localStorage.setItem('accessibilityImages', showImages);
        });
    }

    function applyImagesSetting(show) {
        if (show) {
            body.classList.remove('images-hidden');
        } else {
            body.classList.add('images-hidden');
        }
    }

    // === Горячие клавиши ===
    document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+Plus - увеличить шрифт
        if (e.ctrlKey && e.shiftKey && (e.key === '+' || e.key === '=')) {
            e.preventDefault();
            increaseFontSize();
        }

        // Ctrl+Shift+Minus - уменьшить шрифт
        if (e.ctrlKey && e.shiftKey && e.key === '-') {
            e.preventDefault();
            decreaseFontSize();
        }

        // Ctrl+Shift+C - сменить цветовую схему
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.key === 'с' || e.key === 'С')) {
            e.preventDefault();
            cycleTheme();
        }
    });

    function increaseFontSize() {
        const currentSize = html.getAttribute('data-font-size') || 'medium';
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(currentSize);
        if (currentIndex < sizes.length - 1) {
            const newSize = sizes[currentIndex + 1];
            applyFontSize(newSize);
            localStorage.setItem('accessibilityFontSize', newSize);
            updateFontSizeButtons(newSize);
        }
    }

    function decreaseFontSize() {
        const currentSize = html.getAttribute('data-font-size') || 'medium';
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(currentSize);
        if (currentIndex > 0) {
            const newSize = sizes[currentIndex - 1];
            applyFontSize(newSize);
            localStorage.setItem('accessibilityFontSize', newSize);
            updateFontSizeButtons(newSize);
        }
    }

    function cycleTheme() {
        const currentTheme = body.getAttribute('data-theme') || 'default';
        const themes = ['default', 'inverted', 'brown'];
        const currentIndex = themes.indexOf(currentTheme);
        const newTheme = themes[(currentIndex + 1) % themes.length];
        applyTheme(newTheme);
        localStorage.setItem('accessibilityTheme', newTheme);
        updateThemeButtons(newTheme);
    }

    function updateFontSizeButtons(activeSize) {
        fontSizeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-size') === activeSize);
        });
    }

    function updateThemeButtons(activeTheme) {
        themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === activeTheme);
        });
    }
})();