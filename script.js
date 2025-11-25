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
    initParallax();
    initTerminal();
    initSmoothScroll();
});

let lenis; // Global Lenis instance

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Integrate with anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -80 // Header offset
                });
            }
        });
    });
}

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

    let animationId;
    let isVisible = true;

    function animate() {
        if (!isVisible) return;

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

        animationId = requestAnimationFrame(animate);
    }

    // Pause animation when canvas is not visible
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !animationId) {
                animate();
            }
        });
    }, { threshold: 0 });

    canvasObserver.observe(canvas);
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
}

function initTerminal() {
    const terminal = document.querySelector('.terminal-window');
    if (!terminal) return;

    const files = {
        'languages': {
            name: 'languages.json',
            type: 'json',
            content: `[
  {
    "language": "Python",
    "proficiency": "Expert",
    "usage": "Data Engineering, ETL, Scripting",
    "years_experience": 4
  },
  {
    "language": "SQL",
    "proficiency": "Advanced",
    "usage": "Data Warehousing, Analytics",
    "dialects": ["Snowflake", "PostgreSQL", "MySQL"]
  },
  {
    "language": "JavaScript",
    "proficiency": "Intermediate",
    "usage": "Frontend, Visualization",
    "frameworks": ["React", "D3.js"]
  },
  {
    "language": "Java",
    "proficiency": "Intermediate",
    "usage": "Backend Services",
    "years_experience": 2
  }
]`
        },
        'frameworks': {
            name: 'frameworks.yaml',
            type: 'yaml',
            content: `# Frontend Development
frontend:
  core:
    - name: React.js
      version: 18.x
      features: [Hooks, Context API]
    - name: Next.js
      type: SSR/SSG framework
    - Vue.js
    - Bootstrap
    - jQuery
  languages:
    - HTML5
    - CSS3 (Sass)
    - JavaScript
  tools:
    - AJAX
    - Figma (Web Designing)

# Backend & API
backend:
  runtime: Node.js (v16+)
  frameworks:
    - Express.js
    - Fastify
  database_orm:
    - Prisma
    - Mongoose

# Data Engineering
data_stack:
  processing: [Pandas, NumPy, Spark]
  orchestration: [Airflow, Prefect]
  warehousing: [Snowflake, Redshift]`
        },
        'infrastructure': {
            name: 'infrastructure.sh',
            type: 'shell',
            content: `#!/bin/bash

echo "Initializing system health check..."
sleep 0.5

# Cloud Infrastructure
check_service "AWS Cloud" "us-east-1" "Active"
check_service "Snowflake Data Cloud" "Enterprise" "Connected"

# Containerization
check_container "Docker Engine" "v24.0.2" "Running"
check_container "Kubernetes Cluster" "v1.27" "Healthy"

# CI/CD Pipelines
check_pipeline "GitHub Actions" "Build & Test" "Passing"
check_pipeline "Terraform State" "Remote Backend" "Locked"

echo "----------------------------------------"
echo "System Status: ALL SYSTEMS OPERATIONAL"
echo "Ready for deployment."`
        }
    };

    const codeDisplay = document.getElementById('code-display');
    const lineNumbers = document.querySelector('.line-numbers');
    const fileItems = document.querySelectorAll('.file-item');
    const tab = document.querySelector('.tab');

    let currentTypeInterval = null;

    function loadFile(fileKey) {
        const file = files[fileKey];
        if (!file) return;

        // Update active states
        fileItems.forEach(item => {
            if (item.dataset.file === fileKey) item.classList.add('active');
            else item.classList.remove('active');
        });

        // Update tab
        tab.innerHTML = `
            <span class="file-icon ${file.type}">${getFileIcon(file.type)}</span>
            ${file.name}
            <span class="tab-close">×</span>
        `;
        tab.dataset.file = fileKey;

        // Clear previous typing
        if (currentTypeInterval) clearInterval(currentTypeInterval);

        // Reset display
        codeDisplay.innerHTML = '';
        lineNumbers.innerHTML = '<span>1</span>'; // Start with line 1


        // Start typing effect
        typeContent(file.content, file.type);
    }

    function getFileIcon(type) {
        if (type === 'json') return '{}';
        if (type === 'yaml') return '!';
        if (type === 'shell') return '$_';
        return '';
    }

    function updateLineNumbers(content) {
        const lines = content.split('\n').length;
        lineNumbers.innerHTML = Array(lines).fill(0).map((_, i) => `<span>${i + 1}</span>`).join('');
    }

    function typeContent(content, type) {
        let i = 0;
        let currentLine = 1;
        // Faster typing for better UX
        const speed = 15;

        currentTypeInterval = setInterval(() => {
            if (i < content.length) {
                const char = content.charAt(i);
                codeDisplay.textContent += char;

                // Add new line number when a newline character is typed
                if (char === '\n') {
                    currentLine++;
                    const span = document.createElement('span');
                    span.textContent = currentLine;
                    lineNumbers.appendChild(span);
                }

                i++;

                // Auto scroll to bottom
                const codeArea = document.querySelector('.code-area');
                codeArea.scrollTop = codeArea.scrollHeight;
            } else {
                clearInterval(currentTypeInterval);
                applySyntaxHighlighting(codeDisplay, type);
            }
        }, speed);
    }

    function applySyntaxHighlighting(element, type) {
        let html = element.textContent;

        if (type === 'json') {
            html = html.replace(/"([^"]+)":/g, '<span class="token-key">"$1":</span>')
                .replace(/"([^"]+)"(?!\s*:)/g, '<span class="token-string">"$1"</span>')
                .replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
        } else if (type === 'yaml') {
            html = html.replace(/^(\s*)([\w.-]+):/gm, '$1<span class="token-key">$2:</span>')
                .replace(/- (.+)$/gm, '- <span class="token-string">$1</span>');
        } else if (type === 'shell') {
            html = html.replace(/(#.+)$/gm, '<span class="token-comment">$1</span>')
                .replace(/"([^"]+)"/g, '<span class="token-string">"$1"</span>')
                .replace(/\b(check_service)\b/g, '<span class="token-function">$1</span>');
        }

        element.innerHTML = html;
    }

    // Event Listeners
    fileItems.forEach(item => {
        item.addEventListener('click', () => {
            const fileKey = item.dataset.file;
            loadFile(fileKey);
        });
    });

    // Initialize with first file when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadFile('languages');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(terminal);
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
        if (lenis) {
            lenis.scrollTo(0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.querySelector('.form-status'); // now correctly selected
    const loadingSpan = form.querySelector('.btn-loading');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadingSpan.style.display = 'inline-block';
        statusDiv.textContent = ''; // clear previous messages

        const formData = new FormData(form);
        try {
            const recaptchaToken = formData.get('g-recaptcha-response');
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            const responseJson = await response.json();
            if (response.ok) {
                statusDiv.textContent = '✅ Message sent successfully!';
                statusDiv.className = 'form-status success';
                form.reset();
            } else {
                // Show error from Formspree if available
                const errorMsg = responseJson.error || 'Something went wrong. Please try again.';
                throw new Error(errorMsg);
            }
        } catch (err) {
            statusDiv.textContent = '❌ Something went wrong. Please try again.';
            statusDiv.className = 'form-status error';
        } finally {
            loadingSpan.style.display = 'none';
        }
    });
}

function initParallax() {
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');

    window.addEventListener('scroll', () => {
        const scroll = window.pageYOffset;
        if (scroll < 800) {
            heroContent.style.transform = `translateY(${scroll * 0.4}px)`;
            heroContent.style.opacity = 1 - scroll / 700;
        }
    });
}
