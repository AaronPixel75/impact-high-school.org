
document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.main-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');

            // Accessibility
            const isExpanded = nav.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    // --- Slideshow ---
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;

        const nextSlide = () => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        };

        // Change slide every 5 seconds
        setInterval(nextSlide, 5000);
    }

    // --- Stats Counters ---
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false; // Ensure animation only happens once

    const animateCounters = () => {
        counters.forEach(counter => {
            const innerText = counter.innerText;
            const target = parseInt(innerText.replace(/[^0-9]/g, '')); // Remove non-numeric chars for calculation
            const suffix = innerText.replace(/[0-9]/g, ''); // Keep suffix like '%' or '+'

            let count = 0;
            const speed = 2000 / target; // Adjust speed based on target size

            const updateCount = () => {
                const increment = target / 200; // 200 steps
                if (count < target) {
                    count += increment;

                    // Format number (conditionally round or keep decimals if needed, here we round)
                    counter.innerText = Math.ceil(count) + suffix;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCount();
        });
    };

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .stat-item, .hero-content');

    // Initial state for animated elements (handled in CSS usually, but enforcing here if needed)
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate In
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Trigger stats animation if we hit the stats section
                if (entry.target.classList.contains('stat-item') && !hasAnimated) {
                    // Logic to check if all stats are visible or just trigger once for the section
                    // Simplified: We trigger each stat as it appears, but the counter logic implies a global trigger. 
                    // Let's attach a specific observer for 'stats-grid' or just run it per item.
                    // For now, let's just let the 'stat-item' fade in, 
                    // and strictly trigger the counting only when the section is in view.
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Separate observer for the stats counting to ensure it starts when the section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Dynamic Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Lightbox Functionality ---
    const lightbox = document.querySelector('.lightbox');
    if (lightbox) {
        const lightboxImg = document.querySelector('.lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        const galleryItems = document.querySelectorAll('.gallery-item, .news-card'); // Added news-card if they have images we want to zoom

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
            }
        });
    }
    // --- 3D Tilt Effect for Cards ---
    const tiltCards = document.querySelectorAll('.feature-card, .news-card, .stat-item');

    // Only enable tilt on non-touch devices or larger screens to prevent scroll interference
    if (window.matchMedia("(min-width: 992px)").matches) {
        tiltCards.forEach(card => {
            // Set initial transition for smooth entry/exit
            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation based on mouse position (max 10 degrees)
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                // Apply 3D transform
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.boxShadow = `${-rotateY}px ${rotateX + 10}px 30px rgba(0,0,0,0.2)`;
            });

            card.addEventListener('mouseleave', () => {
                // Reset transform
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                card.style.boxShadow = ''; // Reset to CSS default
                card.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease'; // Smooth return
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease'; // Fast response on enter
            });
        });
    }

    // --- Timeline Scroll Reveal ---
    const timelineItems = document.querySelectorAll('.timeline-item');

    const revealTimeline = () => {
        timelineItems.forEach(item => {
            const windowHeight = window.innerHeight;
            const elementTop = item.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                item.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealTimeline);
    revealTimeline(); // Trigger once on load

    // --- Testimonial Carousel ---
    const testimonials = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');

    if (testimonials.length > 0) {
        let currentTestimonial = 0;

        function showTestimonial(n) {
            testimonials.forEach(t => t.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));

            currentTestimonial = (n + testimonials.length) % testimonials.length;

            testimonials[currentTestimonial].classList.add('active');
            dots[currentTestimonial].classList.add('active');
        }

        // Auto advance every 5 seconds
        setInterval(() => {
            showTestimonial(currentTestimonial + 1);
        }, 5000);

        // Dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });
    }

    // --- Curriculum Tabs (Academics Page) ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // --- FAQ Accordion (Contact Page) ---
    const accordions = document.querySelectorAll('.accordion-header');

    accordions.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // Toggle active state
            header.classList.toggle('active');

            // Toggle max-height for animation
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = 0;
            }

            // Optional: Close other open items
            accordions.forEach(otherHeader => {
                if (otherHeader !== header && otherHeader.classList.contains('active')) {
                    otherHeader.classList.remove('active');
                    otherHeader.nextElementSibling.style.maxHeight = 0;
                }
            });
        });
    });
});
