document.addEventListener('DOMContentLoaded', () => {
    // ===== МОБИЛЬНОЕ МЕНЮ =====
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

        // Для mega-menu колонок — подменю
        const megaColumns = item.querySelectorAll('.mega-menu-column');
        megaColumns.forEach(column => {
            const columnLink = column.querySelector('.dropdown-link');
            if (columnLink && column.querySelector('.submenu')) {
                columnLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= 900) {
                        e.preventDefault();
                        e.stopPropagation();

                        megaColumns.forEach(other => {
                            if (other !== column) {
                                other.classList.remove('active');
                            }
                        });

                        column.classList.toggle('active');
                    }
                });
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
                document.querySelectorAll('.mega-menu-column').forEach(col => {
                    col.classList.remove('active');
                });
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

    // ===== HERO SLIDER =====
    class HeroSlider {
        constructor() {
            this.slides = document.querySelectorAll('.hero-slider .slide');
            this.dots = document.querySelectorAll('.hero-slider .dot');
            this.progressBar = document.getElementById('sliderProgress');
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            this.interval = null;
            this.slideDuration = 6000;
            this.isPlaying = true;
            this.isAnimating = false;
            this.userInteracted = false;

            if (this.slides.length === 0) {
                console.warn('HeroSlider: слайды не найдены');
                return;
            }

            console.log('HeroSlider: найдено слайдов =', this.totalSlides);
            this.init();
        }

        init() {
            // Клик по точкам — ОТКЛЮЧАЕТ автоперелистывание
            this.dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const targetSlide = parseInt(e.target.dataset.slide);
                    if (targetSlide !== this.currentSlide && !this.isAnimating) {
                        this.userInteracted = true;
                        this.goToSlide(targetSlide);
                        this.stopAutoplay();
                    }
                });
            });

            // Стрелки — ОТКЛЮЧАЮТ автоперелистывание
            document.getElementById('prevSlide')?.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.userInteracted = true;
                    this.prevSlide();
                    this.stopAutoplay();
                }
            });

            document.getElementById('nextSlide')?.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.userInteracted = true;
                    this.nextSlide();
                    this.stopAutoplay();
                }
            });

            // Кнопка паузы/воспроизведения
            document.getElementById('pauseBtn')?.addEventListener('click', () => {
                this.toggleAutoplay();
            });

            // Пауза при наведении (визуальная, не останавливает автоплей)
            const slider = document.querySelector('.hero-slider');
            if (slider) {
                slider.addEventListener('mouseenter', () => {
                    if (this.isPlaying && !this.userInteracted) {
                        this.pauseProgress();
                    }
                });

                slider.addEventListener('mouseleave', () => {
                    if (this.isPlaying && !this.userInteracted) {
                        this.resumeProgress();
                    }
                });
            }

            // Запускаем автоперелистывание
            this.startAutoplay();
            console.log('HeroSlider: автоперелистывание запущено');
        }

        goToSlide(index, direction = 'next') {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const currentSlide = this.slides[this.currentSlide];
            const nextSlide = this.slides[index];

            // Убираем active у текущего
            currentSlide.classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');

            // Определяем направление
            if (direction === 'next') {
                currentSlide.classList.add('prev');
                nextSlide.classList.add('next');
            } else {
                currentSlide.classList.add('next');
                nextSlide.classList.add('prev');
            }

            // Force reflow
            void nextSlide.offsetWidth;

            // Показываем следующий слайд
            setTimeout(() => {
                nextSlide.classList.add('active');
                nextSlide.classList.remove('next', 'prev');
                currentSlide.classList.remove('prev', 'next');
                this.dots[index].classList.add('active');

                this.currentSlide = index;

                setTimeout(() => {
                    this.isAnimating = false;
                }, 800);
            }, 50);

            // Перезапуск прогресс-бара
            this.restartProgress();
        }

        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextIndex, 'next');
        }

        prevSlide() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex, 'prev');
        }

        startAutoplay() {
            // Очищаем существующий интервал
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            
            this.isPlaying = true;
            this.updatePauseIcon();
            this.restartProgress();
            
            // Автоперелистывание только если пользователь НЕ взаимодействовал
            if (!this.userInteracted) {
                this.interval = setInterval(() => {
                    this.nextSlide();
                }, this.slideDuration);
            }
        }

        stopAutoplay() {
            this.isPlaying = false;
            this.updatePauseIcon();
            
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            
            this.pauseProgress();
        }

        toggleAutoplay() {
            if (this.isPlaying) {
                // Останавливаем
                this.stopAutoplay();
            } else {
                // Запускаем — сбрасываем флаг взаимодействия
                this.userInteracted = false;
                this.startAutoplay();
            }
        }

        // ===== ПРОГРЕСС-БАР =====
        restartProgress() {
            if (!this.progressBar) return;

            // Сбрасываем transition
            this.progressBar.classList.remove('running');
            this.progressBar.style.width = '0%';

            // Force reflow
            void this.progressBar.offsetWidth;

            // Запускаем анимацию только если автоплей активен
            if (this.isPlaying && !this.userInteracted) {
                requestAnimationFrame(() => {
                    this.progressBar.classList.add('running');
                });
            }
        }

        pauseProgress() {
            if (!this.progressBar) return;

            // Получаем текущую ширину
            const computedWidth = window.getComputedStyle(this.progressBar).width;
            this.progressBar.classList.remove('running');
            this.progressBar.style.width = computedWidth;
        }

        resumeProgress() {
            if (!this.progressBar || !this.isPlaying || this.userInteracted) return;
            this.progressBar.classList.add('running');
        }

        updatePauseIcon() {
            const pause = document.querySelector('.pause-icon');
            const play = document.querySelector('.play-icon');
            if (pause && play) {
                pause.style.display = this.isPlaying ? 'block' : 'none';
                play.style.display = this.isPlaying ? 'none' : 'block';
            }
        }
    }

    // Запуск слайдера
    new HeroSlider();

    // ===== АНИМАЦИЯ СЧЁТЧИКОВ =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.target);
            if (isNaN(target)) return;

            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString('ru-RU');
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target.toLocaleString('ru-RU');
                }
            };
            update();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }
    animateCounters();

    // ===== ПЛАВНОЕ ПОЯВЛЕНИЕ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.stat-item, .news-card, .program-card');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
    initScrollAnimations();
});
