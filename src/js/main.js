// Import Three.js modal functionality
import { initCubeModal } from './three.js';

// Sample Projects Data with Multiple Images
const projects = [
    {
        id: 1,
        title: "Waltermart IT Hardware portal",
        description: "A fully Functional Hardware Portal that runs thru intranet",
        fullDescription: "Monitoring Of Hardware Request",
        category: "web",
        tech: ["EJS", "Node.js", "PostgreSQL", "JS"],
        features: [
            "User authentication",
            "Request Hardware",
            "Deploy hardware By The Users",
            "Generate Reports",
            "Search functionality with filters",
            "Responsive design for all devices"
        ],
          images: [
            "images/admin-db.png",
            "images/admin-db2.png",
            "images/admin-db3.png",
            "images/admin-db4.png",
            "images/admin-db5.png",
            "images/user-db.png",
            "images/user-db2.png",
            "images/user-db3.png"
        ],
        thumbnail: "images/admin-db.png",  // This is REQUIRED for the gallery
        github: "https://github.com/yourusername/waltermart-portal",
        demo: "https://your-demo-link.com",
        is3D: false
    },
    {
        id: 2,
        title: "3D Product Viewer",
        description: "Interactive 3D product viewer with Three.js allowing 360-degree product rotation and zoom.",
        fullDescription: "An immersive 3D product viewer built with Three.js that allows users to interact with products in 3D space. Features include 360-degree rotation, zoom in/out, material customization, and realistic lighting effects. Perfect for e-commerce platforms looking to showcase products in an engaging way.",
        category: "web",
        tech: ["Phone Camera", "HTML", "JavaScript", "Node.js", "HTML5 Canvas"],
        features: [
            "Camera SCanner",
            "Update masterfile Via Admin",
            "Dark Mode/Light Mode",
            "Responsive to all Devices",
            "Mobile support"
        ],
        images: [
            "images/pv1.jpg",
            "images/pv2.jpg",
            "images/pv3.jpg"
        ],
        thumbnail: "images/pv3.jpg",
        github: "https://github.com",
        demo: "https://example.com",
        is3D: true
    },
   
];

let currentFilter = 'all';
let currentProject = null;

// Load Gallery Projects
function loadGalleryProjects() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (!galleryGrid) return;
    
    const filteredProjects = currentFilter === 'all' 
        ? projects 
        : projects.filter(project => project.category === currentFilter);
    
    galleryGrid.innerHTML = filteredProjects.map(project => `
        <div class="gallery-item" data-category="${project.category}" data-id="${project.id}">
            <img src="${project.thumbnail}" alt="${project.title}" class="gallery-image" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3 class="gallery-title">${project.title} ${project.is3D ? '<i class="fas fa-cube" style="font-size: 0.8rem;"></i>' : ''}</h3>
                    <div class="gallery-tech">
                        ${project.tech.slice(0, 3).map(tech => `<span>${tech}</span>`).join('')}
                    </div>
                    <div class="gallery-actions">
                        <a href="#" class="view-project" data-id="${project.id}"><i class="fas fa-info-circle"></i> View Details</a>
                        <a href="${project.github}" target="_blank"><i class="fab fa-github"></i> Code</a>
                        <a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add click event for viewing project details
    document.querySelectorAll('.view-project').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = parseInt(btn.getAttribute('data-id'));
            const project = projects.find(p => p.id === projectId);
            if (project) {
                openProjectModal(project);
            }
        });
    });
    
    // Add click event for gallery item image (alternative way to open)
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't open if clicking on links
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            
            const projectId = parseInt(item.getAttribute('data-id'));
            const project = projects.find(p => p.id === projectId);
            if (project) {
                openProjectModal(project);
            }
        });
    });
}

// Open Project Detail Modal
function openProjectModal(project) {
    currentProject = project;
    const modal = document.getElementById('project-modal');
    
    // Set project details
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('project-description').textContent = project.fullDescription || project.description;
    
    // Set tech stack
    const techStackContainer = document.getElementById('project-tech-stack');
    techStackContainer.innerHTML = project.tech.map(tech => `<span>${tech}</span>`).join('');
    
    // Set features
    const featuresList = document.getElementById('project-features');
    featuresList.innerHTML = project.features.map(feature => `<li>${feature}</li>`).join('');
    
    // Set links
    document.getElementById('project-github').href = project.github;
    document.getElementById('project-demo').href = project.demo;
    
    // Set main image
    const mainImage = document.getElementById('project-main-image');
    mainImage.src = project.images[0];
    mainImage.alt = project.title;
    
    // Add click to enlarge main image
    mainImage.style.cursor = 'pointer';
    mainImage.onclick = () => openImageModal(project.images[0]);
    
    // Set thumbnails
    const thumbnailsContainer = document.getElementById('project-thumbnails');
    thumbnailsContainer.innerHTML = project.images.map((img, index) => `
        <div class="project-thumbnail ${index === 0 ? 'active' : ''}" data-image-index="${index}">
            <img src="${img}" alt="${project.title} - Image ${index + 1}">
        </div>
    `).join('');
    
    // Add click event to thumbnails
    document.querySelectorAll('.project-thumbnail').forEach(thumb => {
        thumb.addEventListener('click', () => {
            // Update main image
            const imgSrc = thumb.querySelector('img').src;
            mainImage.src = imgSrc;
            
            // Update active state
            document.querySelectorAll('.project-thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Project Modal
function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Gallery Filters
function setupGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            loadGalleryProjects();
            
            document.querySelectorAll('.gallery-item').forEach((item, index) => {
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = 'scaleIn 0.6s ease';
                }, 10);
            });
        });
    });
}

// Image Modal for Full Screen View
function openImageModal(imageUrl) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    
    modalImage.src = imageUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Theme Toggle Functionality
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        themeToggle.style.transform = 'scale(1.2) rotate(180deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// Enhanced Navbar Scroll Effects
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    function updateNavbar() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateNavbar);
    });
    
    updateNavbar();
}

// Scroll Progress Bar
function setupScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
        
        if (scrolled > 80) {
            progressBar.style.background = 'linear-gradient(90deg, #ff6b6b, var(--accent), #ff6b6b)';
        } else if (scrolled > 50) {
            progressBar.style.background = 'linear-gradient(90deg, var(--accent), #ff6b6b, var(--accent))';
        } else {
            progressBar.style.background = 'linear-gradient(90deg, var(--accent), #ff3366, var(--accent))';
        }
    }
    
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

// Scroll to Top Button
function setupScrollToTop() {
    const scrollBtn = document.createElement('div');
    scrollBtn.className = 'scroll-indicator';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    function toggleScrollButton() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    }
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', toggleScrollButton);
    toggleScrollButton();
}

// Active Section Highlight in Navbar
function setupActiveSectionHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveSection() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();
}

// Smooth Scroll with Offset
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Navbar Animation on Load
function animateNavbarOnLoad() {
    const navbar = document.querySelector('.navbar');
    navbar.style.opacity = '0';
    navbar.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        navbar.style.transition = 'all 0.6s ease';
        navbar.style.opacity = '1';
        navbar.style.transform = 'translateY(0)';
    }, 100);
}

// Mobile Navbar Close
function setupMobileNavbar() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 991) {
                navbarToggler.click();
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
            const isClickInside = navbarCollapse?.contains(e.target) || navbarToggler?.contains(e.target);
            if (!isClickInside && navbarCollapse?.classList.contains('show')) {
                navbarToggler.click();
            }
        }
    });
}

// Contact Form Submission
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('✨ Thank you for your message! I will get back to you soon.');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

// Scroll Animations with Intersection Observer
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('gallery-item')) {
                    entry.target.style.animation = 'scaleIn 0.6s ease';
                } else if (entry.target.classList.contains('skill-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease';
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section, .gallery-item, .skill-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Parallax Effect
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-section');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
}

// Typing Effect
function setupTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent === 'Josh Developer') {
        const titles = ['Josh Developer', 'Creative Coder', '3D Artist', 'Problem Solver'];
        let index = 0;
        
        setInterval(() => {
            heroTitle.style.opacity = '0';
            heroTitle.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                heroTitle.textContent = titles[index];
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
                index = (index + 1) % titles.length;
            }, 300);
        }, 3000);
    }
}

// 3D Cube Modal
function openCubeModal() {
    const modal = document.getElementById('cube-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (typeof initCubeModal === 'function') {
            initCubeModal();
        }
    }, 100);
}

function closeCubeModal() {
    const modal = document.getElementById('cube-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Initialize all navbar features
function initNavbarFeatures() {
    handleNavbarScroll();
    setupScrollProgress();
    setupScrollToTop();
    setupActiveSectionHighlight();
    setupSmoothScrolling();
    animateNavbarOnLoad();
    setupMobileNavbar();
}

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    loadGalleryProjects();
    setupGalleryFilters();
    setupThemeToggle();
    setupContactForm();
    setupScrollAnimations();
    setupParallax();
    setupTypingEffect();
    initNavbarFeatures();
    
    // Modal close handlers
    const imageModal = document.getElementById('image-modal');
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }
    
    const projectModal = document.getElementById('project-modal');
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }
    
    const cubeModal = document.getElementById('cube-modal');
    if (cubeModal) {
        cubeModal.addEventListener('click', (e) => {
            if (e.target === cubeModal) {
                closeCubeModal();
            }
        });
    }
});

// Export functions for global use
window.closeImageModal = closeImageModal;
window.closeProjectModal = closeProjectModal;
window.closeCubeModal = closeCubeModal;

