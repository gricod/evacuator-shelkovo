/* ===== Scroll Reveal Animation ===== */
(function () {
    'use strict';

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function (el) {
        observer.observe(el);
    });

    /* ===== Header scroll effect ===== */
    var header = document.getElementById('header');
    var stickyBar = document.getElementById('stickyBar');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;

        // Header background
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Sticky bar on mobile
        if (stickyBar && scrollY > 400) {
            stickyBar.classList.add('visible');
        } else if (stickyBar) {
            stickyBar.classList.remove('visible');
        }

        lastScroll = scrollY;
    }, { passive: true });

    /* ===== Mobile menu ===== */
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        nav.querySelectorAll('.header__link').forEach(function (link) {
            link.addEventListener('click', function () {
                burger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ===== FAQ accordion ===== */
    document.querySelectorAll('.faq__question').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var item = btn.closest('.faq__item');
            var isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq__item.active').forEach(function (openItem) {
                openItem.classList.remove('active');
                openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            // Open clicked (if it was closed)
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ===== Smooth scroll for anchor links ===== */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ===== Yandex Metrika goals (if counter exists) ===== */
    function trackGoal(goalName) {
        if (typeof ym === 'function') {
            ym(window.YM_COUNTER_ID || 0, 'reachGoal', goalName);
        }
    }

    // Track WhatsApp clicks
    document.querySelectorAll('[href*="wa.me"]').forEach(function (el) {
        el.addEventListener('click', function () {
            trackGoal('whatsapp_click');
        });
    });

    // Track Telegram clicks
    document.querySelectorAll('[href*="t.me"]').forEach(function (el) {
        el.addEventListener('click', function () {
            trackGoal('telegram_click');
        });
    });

    // Track phone clicks
    document.querySelectorAll('[href^="tel:"]').forEach(function (el) {
        el.addEventListener('click', function () {
            trackGoal('phone_click');
        });
    });

})();
