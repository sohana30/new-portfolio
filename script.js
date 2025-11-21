document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollAnimations();
    document.getElementById('current-year').textContent = new Date().getFullYear();
    initMobileNav();
    initSkillBars();
    initHeaderScroll();
    initActiveNav();
    initScrollToTop();
    initContactForm();
});

function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Configuration
    const particleCount = 50;
    const connectionDistance = 150;
    const particleSpeed = 0.5;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#8b5cf6';
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('section, .content-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Terminal Typing Effect
    const terminal = document.querySelector('.terminal-window');
    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startTypingEffect();
                typeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (terminal) {
        typeObserver.observe(terminal);
    }
}

function startTypingEffect() {
    const outputs = document.querySelectorAll('.type-effect');

    outputs.forEach((output, index) => {
        const text = output.getAttribute('data-text');
        output.textContent = ''; // Clear initial content
        output.style.opacity = 1;

        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    output.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // After typing completes, replace [OK] with styled spans
                    if (output.classList.contains('script-output')) {
                        output.innerHTML = output.textContent.replace(/\[OK\]/g, '<span class="success">[OK]</span>');
                    }
                }
            }, 5); // Typing speed - faster for better engagement
        }, index * 600); // Delay between each block - shorter for better flow
    });
}


function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const menuOverlay = document.querySelector('.menu-overlay');
    const links = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
            menuOverlay.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.getAttribute('data-progress');

                // Animate the progress bar
                setTimeout(() => {
                    progressBar.style.width = progress + '%';
                }, 100);

                // Add in-view class
                entry.target.classList.add('in-view');

                // Stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// Active Navigation Link
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initScrollToTop() {
    const scrollBtn = document.getElementById('scroll-top');

    if (!scrollBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.querySelector('.form-status');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        statusDiv.className = 'form-status';
        statusDiv.textContent = '';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                statusDiv.className = 'form-status success';
                statusDiv.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                form.reset();
            } else {
                // Error
                statusDiv.className = 'form-status error';
                statusDiv.textContent = '✗ Oops! Something went wrong. Please try again.';
            }
        } catch (error) {
            // Network error
            statusDiv.className = 'form-status error';
            statusDiv.textContent = '✗ Network error. Please check your connection and try again.';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}
