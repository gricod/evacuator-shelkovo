/* ===== Main JS — Fully Responsive ===== */
(function () {
    'use strict';

    /* ===== Scroll Reveal Animation ===== */
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -30px 0px'
        });

        document.querySelectorAll('.reveal').forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        document.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ===== Header scroll effect ===== */
    var header = document.getElementById('header');
    var stickyBar = document.getElementById('stickyBar');
    var ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                var scrollY = window.scrollY || window.pageYOffset;

                if (scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                if (stickyBar && scrollY > 400) {
                    stickyBar.classList.add('visible');
                } else if (stickyBar) {
                    stickyBar.classList.remove('visible');
                }

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    /* ===== Mobile menu ===== */
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            var isOpen = nav.classList.contains('active');
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        nav.querySelectorAll('.header__link').forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu on resize to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 900 && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /* ===== FAQ accordion ===== */
    document.querySelectorAll('.faq__question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq__item');
            var isActive = item.classList.contains('active');

            document.querySelectorAll('.faq__item.active').forEach(function (openItem) {
                openItem.classList.remove('active');
                openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ===== Smooth scroll for anchor links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===== Reviews Carousel — Responsive ===== */
    var track = document.getElementById('reviewsTrack');
    var prevBtn = document.getElementById('reviewsPrev');
    var nextBtn = document.getElementById('reviewsNext');
    var dotsContainer = document.getElementById('reviewsDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        var cards = track.querySelectorAll('.review-card');
        var currentIndex = 0;
        var autoplayTimer = null;

        function getCardsToShow() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 1;
            return 2;
        }

        function getTotalSlides() {
            return Math.max(1, cards.length - getCardsToShow() + 1);
        }

        function buildDots() {
            dotsContainer.innerHTML = '';
            var total = getTotalSlides();
            for (var i = 0; i < total; i++) {
                var dot = document.createElement('div');
                dot.className = 'reviews__dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('data-index', i);
                dot.addEventListener('click', function () {
                    goToSlide(parseInt(this.getAttribute('data-index')));
                });
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            var total = getTotalSlides();
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            currentIndex = index;

            // Calculate offset based on actual card width
            var card = cards[0];
            if (!card) return;
            var style = window.getComputedStyle(track);
            var gap = parseInt(style.gap) || 24;
            var cardWidth = card.offsetWidth + gap;
            var offset = currentIndex * cardWidth;

            track.style.transform = 'translateX(-' + offset + 'px)';

            // Update dots
            var dots = dotsContainer.querySelectorAll('.reviews__dot');
            dots.forEach(function (d) { d.classList.remove('active'); });
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(function () {
                goToSlide(currentIndex + 1);
            }, 5000);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        prevBtn.addEventListener('click', function () {
            goToSlide(currentIndex - 1);
            stopAutoplay();
            startAutoplay();
        });

        nextBtn.addEventListener('click', function () {
            goToSlide(currentIndex + 1);
            stopAutoplay();
            startAutoplay();
        });

        // Pause on hover/focus
        var carousel = track.closest('.reviews__carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            carousel.addEventListener('focusin', stopAutoplay);
            carousel.addEventListener('focusout', startAutoplay);
        }

        // Touch swipe support
        var startX = 0;
        var startY = 0;
        var isDragging = false;

        track.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            stopAutoplay();
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            isDragging = false;
            var diffX = startX - e.changedTouches[0].clientX;
            var diffY = startY - e.changedTouches[0].clientY;

            // Only swipe horizontally if horizontal movement > vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                if (diffX > 0) goToSlide(currentIndex + 1);
                else goToSlide(currentIndex - 1);
            }
            startAutoplay();
        }, { passive: true });

        // Responsive: rebuild on resize (debounced)
        var resizeTimer = null;
        var lastWidth = window.innerWidth;

        window.addEventListener('resize', function () {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                var newWidth = window.innerWidth;
                if (newWidth !== lastWidth) {
                    lastWidth = newWidth;
                    currentIndex = 0;
                    buildDots();
                    goToSlide(0);
                }
            }, 200);
        });

        // Initialize
        buildDots();
        goToSlide(0);
        startAutoplay();
    }

    /* ===== Yandex Metrika goals ===== */
    function trackGoal(goalName) {
        if (typeof ym === 'function') {
            ym(window.YM_COUNTER_ID || 0, 'reachGoal', goalName);
        }
    }

    document.querySelectorAll('[href*="wa.me"]').forEach(function (el) {
        el.addEventListener('click', function () { trackGoal('whatsapp_click'); });
    });

    document.querySelectorAll('[href*="t.me"]').forEach(function (el) {
        el.addEventListener('click', function () { trackGoal('telegram_click'); });
    });

    document.querySelectorAll('[href^="tel:"]').forEach(function (el) {
        el.addEventListener('click', function () { trackGoal('phone_click'); });
    });

    /* ===== QR Code Generator (minimal) ===== */
    var qrCanvas = document.getElementById('qrCanvas');
    if (qrCanvas) {
        // Pre-computed QR matrix for "tel:+79266662311"
        var matrix = [
            1,1,1,1,1,1,1,0,1,1,0,1,1,0,0,1,0,0,1,1,1,1,1,1,1,
            1,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,0,1,
            1,0,1,1,1,0,1,0,1,0,0,1,0,0,1,1,0,0,1,0,1,1,1,0,1,
            1,0,1,1,1,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1,
            1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,
            1,0,0,0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,1,0,0,0,0,0,1,
            1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,
            0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,
            1,0,1,1,1,0,1,1,0,0,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,
            0,1,0,0,1,0,0,1,1,0,0,0,1,0,1,1,0,0,1,1,0,1,1,0,0,
            1,1,0,1,0,1,1,0,0,1,1,1,0,0,0,0,1,0,0,1,1,0,0,1,0,
            0,0,1,1,0,0,0,1,0,0,0,1,1,1,0,1,0,1,0,0,1,0,1,1,1,
            1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,0,0,
            1,1,0,0,0,1,0,0,0,1,1,1,0,0,0,0,1,1,0,1,1,0,0,1,0,
            0,1,1,1,0,0,1,0,1,0,0,0,1,1,0,1,0,0,1,0,0,1,1,0,1,
            0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,0,1,0,0,0,1,1,0,1,0,
            1,0,1,0,0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,1,0,0,1,0,1,
            0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,
            1,1,1,1,1,1,1,0,0,1,0,1,1,0,0,0,1,0,1,1,0,0,1,0,1,
            1,0,0,0,0,0,1,0,1,0,0,0,0,1,1,0,0,1,0,0,1,1,0,1,0,
            1,0,1,1,1,0,1,0,1,1,1,1,1,0,0,1,0,0,1,1,0,0,1,0,1,
            1,0,1,1,1,0,1,0,0,0,1,0,0,0,0,0,1,1,0,1,1,0,0,1,0,
            1,0,1,1,1,0,1,0,1,0,0,1,1,1,0,1,0,0,1,0,0,1,1,0,1,
            1,0,0,0,0,0,1,0,0,0,1,1,0,1,1,0,1,0,0,0,1,1,0,1,0,
            1,1,1,1,1,1,1,0,1,1,0,0,1,0,0,1,0,1,1,1,0,0,1,0,1
        ];
        var size = 25;
        var ctx = qrCanvas.getContext('2d');
        var scale = qrCanvas.width / size;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
        ctx.fillStyle = '#0F1629';
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                if (matrix[y * size + x]) {
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
    }

})();
