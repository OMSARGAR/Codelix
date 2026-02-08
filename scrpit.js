        // Initialize AOS animations
        AOS.init({
            duration: 1000,
            once: false,
            offset: 100,
            easing: 'ease-out-cubic'
        });
        
        // DOM elements
        const themeToggle = document.getElementById('themeToggle');
        const particleCanvas = document.getElementById('particleCanvas');
        const navbarCollapse = document.getElementById('navbarNav');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navLinks = document.querySelectorAll('.nav-link');
        const demoDashboard = document.getElementById('demoDashboard');
        const paginationDots = document.getElementById('paginationDots');
        const aiAssistant = document.getElementById('aiAssistant');
        
        // Navigation state
        let currentSection = 'home';
        
        // Initialize on load
        document.addEventListener('DOMContentLoaded', function() {
            initParticles();
            initStatsCounter();
            initNavigation();
            initSmoothScrolling();
            initFAQ();
            initPagination();
            
            // Initialize typing animation
            setTimeout(() => {
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.style.width = '100%';
                    setTimeout(() => {
                        typingText.style.animation = 'none';
                        typingText.style.borderRight = 'none';
                    }, 3500);
                }
            }, 500);
            
            // Ensure navbar is visible on desktop
            if (window.innerWidth >= 992) {
                navbarCollapse.classList.add('show');
            }
        });
        
        // Particle background
        function initParticles() {
            const canvas = particleCanvas;
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            // Particles array
            const particles = [];
            const particleCount = Math.min(100, Math.floor(window.innerWidth / 10));
            
            // Create particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, ${Math.random() * 0.5 + 0.1})`
                });
            }
            
            // Draw particles
            function drawParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    
                    // Update position
                    p.x += p.speedX;
                    p.y += p.speedY;
                    
                    // Bounce off edges
                    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
                    
                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = p.color;
                    ctx.fill();
                    
                    // Draw connections
                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                        
                        if (distance < 100) {
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - distance / 100)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
                
                requestAnimationFrame(drawParticles);
            }
            
            drawParticles();
            
            // Resize handler
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }
        
        // Stats counter animation
        function initStatsCounter() {
            const statNumbers = document.querySelectorAll('.stat-number[data-count]');
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const suffix = stat.getAttribute('data-suffix') || '';
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + suffix;
                }, 16);
            });
        }
        
        // Navigation initialization
        function initNavigation() {
            // Update active nav link on click
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Only prevent default if it's a hash link
                    if (this.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        
                        // Get target section
                        const targetId = this.getAttribute('href').substring(1);
                        const targetSection = document.getElementById(targetId);
                        
                        if (targetSection) {
                            // Smooth scroll to section
                            window.scrollTo({
                                top: targetSection.offsetTop - 80,
                                behavior: 'smooth'
                            });
                            
                            // Update active nav link
                            navLinks.forEach(l => l.classList.remove('active'));
                            this.classList.add('active');
                            
                            // Update pagination dots
                            updatePagination(targetId);
                        }
                        
                        // Close navbar on mobile only if it's open
                        if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                            navbarToggler.click();
                        }
                    }
                });
            });
            
            // Load saved theme preference
            const savedTheme = localStorage.getItem('codelix-theme');
            if (savedTheme) {
                document.documentElement.setAttribute('data-theme', savedTheme);
                if (savedTheme === 'light' && themeToggle) {
                    themeToggle.checked = true;
                }
            }
            
            // Theme toggle event listener
            if (themeToggle) {
                themeToggle.addEventListener('change', toggleTheme);
            }
        }
        
        // Smooth scrolling initialization
        function initSmoothScrolling() {
            // Handle all anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Skip if it's just "#"
                    if (href === '#') return;
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Scroll to target
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Update URL hash without scrolling
                        history.pushState(null, null, href);
                        
                        // Update active nav
                        navLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                        
                        // Update pagination
                        updatePagination(targetId);
                    }
                });
            });
        }
        
        // FAQ initialization
        function initFAQ() {
            // Initialize first FAQ as open
            const firstAnswer = document.getElementById('faq-answer-1');
            const firstIcon = document.getElementById('faq-icon-1');
            if (firstAnswer && firstIcon) {
                firstAnswer.classList.add('active');
                firstIcon.classList.add('active');
            }
        }
        
        // Pagination initialization
        function initPagination() {
            const dots = document.querySelectorAll('.pagination-dot');
            
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    const sectionId = this.getAttribute('data-section');
                    const targetSection = document.getElementById(sectionId);
                    
                    if (targetSection) {
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Update navigation
                        navLinks.forEach(l => {
                            if (l.getAttribute('href') === `#${sectionId}`) {
                                l.classList.add('active');
                            } else {
                                l.classList.remove('active');
                            }
                        });
                        
                        updatePagination(sectionId);
                    }
                });
            });
            
            // Scroll event listener for updating active dot
            window.addEventListener('scroll', updatePaginationOnScroll);
        }
        
        // Update pagination on scroll
        function updatePaginationOnScroll() {
            const sections = ['home', 'about', 'trusted', 'love', 'pricing', 'help'];
            let current = 'home';
            
            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        current = sectionId;
                        break;
                    }
                }
            }
            
            if (current !== currentSection) {
                currentSection = current;
                updatePagination(current);
            }
        }
        
        // Update pagination dots
        function updatePagination(sectionId) {
            const dots = document.querySelectorAll('.pagination-dot');
            dots.forEach(dot => {
                if (dot.getAttribute('data-section') === sectionId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        // Toggle FAQ accordion
        function toggleFAQ(index) {
            const answer = document.getElementById(`faq-answer-${index}`);
            const icon = document.getElementById(`faq-icon-${index}`);
            
            if (answer && icon) {
                const isActive = answer.classList.contains('active');
                
                // Close all FAQs
                document.querySelectorAll('.faq-answer').forEach(el => {
                    el.classList.remove('active');
                });
                document.querySelectorAll('.faq-icon').forEach(el => {
                    el.classList.remove('active');
                });
                
                // If it wasn't active, open this one
                if (!isActive) {
                    answer.classList.add('active');
                    icon.classList.add('active');
                }
            }
        }
        
        // Toggle dark/light theme
        function toggleTheme() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            
            // Save preference to localStorage
            localStorage.setItem('codelix-theme', newTheme);
            
            // Show notification
            showNotification(`Switched to ${newTheme} mode`, 'info');
        }
        
        // Show demo dashboard
        function showDemo() {
            demoDashboard.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        // Hide demo dashboard
        function hideDemo() {
            demoDashboard.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        // Toggle AI Assistant
        function toggleAI() {
            if (aiAssistant.style.display === 'block') {
                aiAssistant.style.display = 'none';
            } else {
                aiAssistant.style.display = 'block';
            }
        }
        
        // Demo Editor Functions
        function selectFile(filename) {
            document.querySelectorAll('.file-item').forEach(item => {
                item.classList.remove('active');
            });
            event.target.closest('.file-item').classList.add('active');
            document.getElementById('currentFile').textContent = filename;
        }
        
        function createNewFile() {
            const filename = prompt('Enter new file name (with extension):', 'newfile.js');
            if (filename) {
                const fileTree = document.getElementById('fileTree');
                const newFile = document.createElement('div');
                newFile.className = 'file-item';
                newFile.innerHTML = `<i class="fas fa-file-code text-primary"></i><span>${filename}</span>`;
                newFile.onclick = () => selectFile(filename);
                fileTree.appendChild(newFile);
                showNotification(`Created new file: ${filename}`, 'success');
            }
        }
        
        function createNewFolder() {
            const foldername = prompt('Enter new folder name:', 'new-folder');
            if (foldername) {
                showNotification(`Created new folder: ${foldername}`, 'success');
            }
        }
        
        function changeLanguage(lang) {
            const languageNames = {
                'javascript': 'JavaScript',
                'python': 'Python',
                'java': 'Java',
                'cpp': 'C++',
                'typescript': 'TypeScript',
                'php': 'PHP',
                'ruby': 'Ruby',
                'go': 'Go',
                'rust': 'Rust'
            };
            document.getElementById('currentLanguage').textContent = languageNames[lang] || lang;
            showNotification(`Switched to ${languageNames[lang] || lang}`, 'info');
        }
        
        function runCode() {
            showNotification('Running code... Check console for output', 'info');
        }
        
        function shareCode() {
            const shareUrl = window.location.href.split('#')[0] + '#demo';
            navigator.clipboard.writeText(shareUrl).then(() => {
                showNotification('Share link copied to clipboard!', 'success');
            });
        }
        
        function downloadCode() {
            showNotification('Downloading code as ZIP file...', 'success');
        }
        
        function startVideoCall() {
            showNotification('Starting video call...', 'info');
        }
        
        function screenShare() {
            showNotification('Screen sharing started', 'info');
        }
        
        function sendMessage() {
            const input = document.getElementById('chatInput');
            const message = input.value.trim();
            if (message) {
                const chatMessages = document.getElementById('chatMessages');
                const newMessage = document.createElement('div');
                newMessage.className = 'message-bubble user';
                newMessage.innerHTML = `<div class="fw-bold">You</div><div>${message}</div>`;
                chatMessages.appendChild(newMessage);
                input.value = '';
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate AI response after delay
                setTimeout(() => {
                    const aiResponse = document.createElement('div');
                    aiResponse.className = 'message-bubble other';
                    aiResponse.innerHTML = `<div class="fw-bold">AI Assistant</div><div>I can help with that! Try using the AI panel for code suggestions.</div>`;
                    chatMessages.appendChild(aiResponse);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 1000);
            }
        }
        
        function askAI() {
            const input = document.getElementById('aiInput');
            const question = input.value.trim();
            if (question) {
                const aiMessages = document.querySelector('.ai-messages');
                const userMsg = document.createElement('div');
                userMsg.className = 'message-bubble user';
                userMsg.innerHTML = `<div class="fw-bold">You</div><div>${question}</div>`;
                aiMessages.appendChild(userMsg);
                
                input.value = '';
                
                // Simulate AI thinking
                setTimeout(() => {
                    const aiResponse = document.createElement('div');
                    aiResponse.className = 'message-bubble other';
                    aiResponse.innerHTML = `<div class="fw-bold">Codelix AI</div><div>Here's a suggestion for your code:\n\`\`\`javascript\n// AI generated code\nfunction optimizedSolution() {\n  // Your optimized code here\n}\n\`\`\`</div>`;
                    aiMessages.appendChild(aiResponse);
                    aiMessages.scrollTop = aiMessages.scrollHeight;
                }, 1500);
            }
        }
        
        function formatCode() {
            showNotification('Code formatted successfully', 'success');
        }
        
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            });
        }
        
        // Show notification
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `position-fixed top-4 end-4 p-4 rounded glass-card border-start border-4 ${type === 'success' ? 'border-success' : type === 'error' ? 'border-danger' : 'border-primary'}`;
            notification.style.zIndex = '9999';
            notification.style.maxWidth = '350px';
            notification.style.minWidth = '300px';
            notification.style.transform = 'translateX(400px)';
            notification.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            notification.innerHTML = `
                <div class="d-flex">
                    <div class="me-3">
                        <i class="fas fa-${type === 'success' ? 'check-circle text-success' : type === 'error' ? 'exclamation-circle text-danger' : 'info-circle text-primary'} fa-2x"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="fw-bold mb-1">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notification'}</h6>
                        <div style="color: var(--gray)">${message}</div>
                    </div>
                    <button type="button" class="btn-close btn-close-white ms-2 align-self-start" onclick="this.parentElement.parentElement.remove()"></button>
                </div>
            `;
            
            // Add to body
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 10);
            
            // Remove after 4 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.transform = 'translateX(400px)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 500);
                }
            }, 4000);
        }
        
        // Handle navbar toggler for mobile
        document.addEventListener('click', function(e) {
            // If clicking outside navbar on mobile when it's open
            if (window.innerWidth < 992 && 
                navbarCollapse.classList.contains('show') &&
                !e.target.closest('.navbar') &&
                !e.target.closest('.navbar-toggler')) {
                navbarToggler.click();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Ensure navbar is visible on desktop
            if (window.innerWidth >= 992) {
                navbarCollapse.classList.add('show');
            }
        });
    
