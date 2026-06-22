/**
 * ПГУТИ - Основной JavaScript файл
 * Модульная структура с единой точкой входа
 */

(function() {
    'use strict';

    // ===== ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM =====
    document.addEventListener('DOMContentLoaded', () => {
        initMobileMenu();
        initSmoothScroll();
        initHeroSlider();
        initCounters();
        initScrollAnimations();
        initFooterExpand();
        initLoadMore();
    });

    // ===== МОБИЛЬНОЕ МЕНЮ =====
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const dropdownItems = document.querySelectorAll('.has-dropdown');
        const BREAKPOINT = 900;

        if (!mobileToggle || !navMenu) return;

        // Переключение мобильного меню
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Переключение подменю на мобильных
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (!link) return;

            link.addEventListener('click', (e) => {
                if (window.innerWidth <= BREAKPOINT) {
                    e.preventDefault();
                    toggleDropdown(item, dropdownItems);
                }
            });

            // Подменю для mega-menu
            initMegaMenuSubmenus(item, BREAKPOINT);
        });

        // Закрытие меню при клике вне
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav')) {
                closeMobileMenu(navMenu, mobileToggle, dropdownItems);
            }
        });

        // Сброс при ресайзе
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > BREAKPOINT) {
                    closeMobileMenu(navMenu, mobileToggle, dropdownItems);
                }
            }, 250);
        });
    }

    function toggleDropdown(item, allItems) {
        allItems.forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
    }

    function initMegaMenuSubmenus(item, breakpoint) {
        const megaColumns = item.querySelectorAll('.mega-menu-column');
        
        megaColumns.forEach(column => {
            const columnLink = column.querySelector('.dropdown-link');
            const submenu = column.querySelector('.submenu');
            
            if (columnLink && submenu) {
                columnLink.addEventListener('click', (e) => {
                    if (window.innerWidth <= breakpoint) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        megaColumns.forEach(other => {
                            if (other !== column) other.classList.remove('active');
                        });
                        column.classList.toggle('active');
                    }
                });
            }
        });
    }

    function closeMobileMenu(navMenu, mobileToggle, dropdownItems) {
        navMenu.classList.remove('active');
        mobileToggle?.classList.remove('active');
        dropdownItems.forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.mega-menu-column').forEach(col => {
            col.classList.remove('active');
        });
    }

    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (!href || href.length <= 1) return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ===== HERO SLIDER =====
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slider .slide');
        if (slides.length === 0) return;

        new HeroSlider({
            slides,
            dots: document.querySelectorAll('.hero-slider .dot'),
            progressBar: document.getElementById('sliderProgress'),
            prevBtn: document.getElementById('prevSlide'),
            nextBtn: document.getElementById('nextSlide'),
            pauseBtn: document.getElementById('pauseBtn'),
            duration: 6000
        });
    }

    class HeroSlider {
        constructor(config) {
            this.slides = config.slides;
            this.dots = config.dots;
            this.progressBar = config.progressBar;
            this.prevBtn = config.prevBtn;
            this.nextBtn = config.nextBtn;
            this.pauseBtn = config.pauseBtn;
            this.duration = config.duration;
            
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            this.interval = null;
            this.isPlaying = true;
            this.isAnimating = false;
            this.userInteracted = false;

            this.init();
        }

        init() {
            this.bindEvents();
            this.startAutoplay();
        }

        bindEvents() {
            // Точки навигации
            this.dots.forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const target = parseInt(e.target.dataset.slide);
                    if (target !== this.currentSlide && !this.isAnimating) {
                        this.userInteracted = true;
                        this.goToSlide(target);
                        this.stopAutoplay();
                    }
                });
            });

            // Стрелки
            this.prevBtn?.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.userInteracted = true;
                    this.prevSlide();
                    this.stopAutoplay();
                }
            });

            this.nextBtn?.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.userInteracted = true;
                    this.nextSlide();
                    this.stopAutoplay();
                }
            });

            // Кнопка паузы
            this.pauseBtn?.addEventListener('click', () => this.toggleAutoplay());

            // Пауза при наведении
            const slider = document.querySelector('.hero-slider');
            if (slider) {
                slider.addEventListener('mouseenter', () => {
                    if (this.isPlaying && !this.userInteracted) this.pauseProgress();
                });
                slider.addEventListener('mouseleave', () => {
                    if (this.isPlaying && !this.userInteracted) this.resumeProgress();
                });
            }
        }

        goToSlide(index, direction = 'next') {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const current = this.slides[this.currentSlide];
            const next = this.slides[index];

            current.classList.remove('active');
            this.dots[this.currentSlide]?.classList.remove('active');

            if (direction === 'next') {
                current.classList.add('prev');
                next.classList.add('next');
            } else {
                current.classList.add('next');
                next.classList.add('prev');
            }

            void next.offsetWidth; // Force reflow

            setTimeout(() => {
                next.classList.add('active');
                next.classList.remove('next', 'prev');
                current.classList.remove('prev', 'next');
                this.dots[index]?.classList.add('active');
                this.currentSlide = index;

                setTimeout(() => { this.isAnimating = false; }, 800);
            }, 50);

            this.restartProgress();
        }

        nextSlide() {
            const next = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(next, 'next');
        }

        prevSlide() {
            const prev = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prev, 'prev');
        }

        startAutoplay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            
            this.isPlaying = true;
            this.updatePauseIcon();
            this.restartProgress();
            
            if (!this.userInteracted) {
                this.interval = setInterval(() => this.nextSlide(), this.duration);
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
                this.stopAutoplay();
            } else {
                this.userInteracted = false;
                this.startAutoplay();
            }
        }

        restartProgress() {
            if (!this.progressBar) return;
            this.progressBar.classList.remove('running');
            this.progressBar.style.width = '0%';
            void this.progressBar.offsetWidth;
            
            if (this.isPlaying && !this.userInteracted) {
                requestAnimationFrame(() => {
                    this.progressBar.classList.add('running');
                });
            }
        }

        pauseProgress() {
            if (!this.progressBar) return;
            const width = window.getComputedStyle(this.progressBar).width;
            this.progressBar.classList.remove('running');
            this.progressBar.style.width = width;
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

    // ===== АНИМАЦИЯ СЧЁТЧИКОВ =====
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        if (counters.length === 0) return;

        const animate = (counter) => {
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
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ===== АНИМАЦИИ ПРИ СКРОЛЛЕ =====
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.stat-item, .news-card, .program-card');
        if (elements.length === 0) return;

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

        elements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ===== FOOTER: РАСКРЫВАЮЩИЙСЯ БЛОК (ИСПРАВЛЕНО) =====
    function initFooterExpand() {
        const toggleBtn = document.querySelector('.footer-read-more');
        const expandContent = document.getElementById('about-expand'); // Переименовано
        const textSpan = toggleBtn?.querySelector('.read-more-text');

        if (!toggleBtn || !expandContent) {
            console.warn('Footer expand: элементы не найдены');
            return;
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                collapseExpand(expandContent, toggleBtn, textSpan);
            } else {
                toggleExpand(expandContent, toggleBtn, textSpan);
            }
        });
    }

    function collapseExpand(block, btn, textSpan) {
        // Фиксируем текущую высоту для плавного сворачивания
        block.style.maxHeight = block.scrollHeight + 'px';
        block.offsetHeight; // Force reflow
        
        block.style.maxHeight = '0px';
        block.classList.remove('is-open');
        
        btn.setAttribute('aria-expanded', 'false');
        block.setAttribute('aria-hidden', 'true');
        if (textSpan) textSpan.textContent = 'читать далее..';
    }

    function toggleExpand(block, btn, textSpan) {
        block.classList.add('is-open');
        block.style.maxHeight = block.scrollHeight + 'px';
        
        btn.setAttribute('aria-expanded', 'true');
        block.setAttribute('aria-hidden', 'false');
        if (textSpan) textSpan.textContent = 'свернуть..';

        // После завершения анимации снимаем фиксированную высоту
        const onTransitionEnd = () => {
            if (btn.getAttribute('aria-expanded') === 'true') {
                block.style.maxHeight = 'none';
            }
            block.removeEventListener('transitionend', onTransitionEnd);
        };
        block.addEventListener('transitionend', onTransitionEnd);
    }

    // ===== BLOG: LOAD MORE =====
    function initLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const hiddenCards = document.querySelectorAll('.blog-card[data-hidden="true"]');
        const cardsToShow = 3;
        let currentIndex = 0;

        if (!loadMoreBtn || hiddenCards.length === 0) return;

        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const nextCards = Array.from(hiddenCards).slice(currentIndex, currentIndex + cardsToShow);
            
            nextCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.removeAttribute('data-hidden');
                    
                    // Анимация появления
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.offsetHeight; // Force reflow
                    
                    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            currentIndex += cardsToShow;
            
            if (currentIndex >= hiddenCards.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

})();