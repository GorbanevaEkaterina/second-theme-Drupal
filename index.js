document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownItems = document.querySelectorAll('.has-dropdown');

    // Переключение мобильного меню
    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Переключение подменю на мобильных устройствах
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');

        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();

                // Закрыть другие открытые подменю
                dropdownItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                    }
                });

                item.classList.toggle('active');
            }
        });
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.main-nav')) {
            navMenu.classList.remove('active');
            mobileToggle?.classList.remove('active');
        }
    });

    // Сброс состояния при изменении размера окна
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 900) {
                navMenu.classList.remove('active');
                mobileToggle?.classList.remove('active');
                dropdownItems.forEach(item => item.classList.remove('active'));
            }
        }, 250);
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});