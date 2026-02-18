// Dark mode initialization
const html = document.documentElement;
const toggle = document.getElementById('dark-mode-toggle');
const toggleMobile = document.getElementById('dark-mode-toggle-mobile');

// Check for saved preference or system preference
const savedTheme = localStorage.getItem('beam-theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    html.classList.add('dark');
}

// Toggle handler for desktop
if (toggle) {
    toggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('beam-theme', isDark ? 'dark' : 'light');
    });
}

// Toggle handler for mobile
if (toggleMobile) {
    toggleMobile.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('beam-theme', isDark ? 'dark' : 'light');
    });
}

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('beam-theme')) {
        if (e.matches) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
});

// Handle form submission via AJAX to Formspree
document.querySelectorAll('form[action^="https://formspree"]').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const button = this.querySelector('button');
        const originalText = button.textContent;

        // Disable button while submitting
        button.textContent = 'Submitting...';
        button.disabled = true;

        // Submit to Formspree
        fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                button.textContent = 'Got it! We\'ll be in touch 🎉';
                this.reset();
            } else {
                button.textContent = 'Oops! Try again';
            }
        })
        .catch(error => {
            button.textContent = 'Oops! Try again';
        })
        .finally(() => {
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 3000);
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Interactive Quote Preview Animation
class QuotePreviewDemo {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.isAnimating = false;
        this.lineItems = [
            { name: 'Bathroom leak repair', price: 85.00 },
            { name: 'Pipe replacement (2m)', price: 34.00 },
            { name: 'Callout fee', price: 45.00 }
        ];
        this.currentTotal = 0;
        
        this.init();
    }
    
    init() {
        const startButton = document.getElementById('start-demo');
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.startDemo();
                }
            });
        }
        
        // Auto-start on desktop after 2 seconds
        if (window.innerWidth >= 768) {
            setTimeout(() => {
                if (!this.isAnimating && this.currentStep === 1) {
                    // Don't auto-start, let user click
                }
            }, 2000);
        }
    }
    
    async startDemo() {
        this.isAnimating = true;
        this.showStepIndicator();
        
        // Step 2: Add customer info
        await this.delay(500);
        this.goToStep(2);
        await this.typeCustomerInfo();
        await this.delay(800);
        
        // Step 3: Add line items one by one
        this.goToStep(3);
        await this.delay(500);
        await this.addLineItems();
        await this.delay(600);
        
        // Step 4: Show final quote with total
        this.goToStep(4);
        await this.animateTotal();
        await this.delay(400);
        await this.showPDFBadge();
        
        // Reset after 5 seconds
        await this.delay(5000);
        this.resetDemo();
    }
    
    showStepIndicator() {
        const indicator = document.getElementById('step-indicator');
        if (indicator) {
            indicator.style.opacity = '1';
            indicator.classList.add('animate-fade-in');
        }
    }
    
    updateStepIndicator(step) {
        const stepNum = document.getElementById('current-step');
        if (stepNum) {
            stepNum.textContent = step;
        }
    }
    
    goToStep(step) {
        // Hide all steps
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepEl = document.getElementById(`step${i}`);
            if (stepEl) {
                stepEl.classList.add('hidden');
                stepEl.classList.remove('visible');
            }
        }
        
        // Show current step
        const currentStepEl = document.getElementById(`step${step}`);
        if (currentStepEl) {
            currentStepEl.classList.remove('hidden');
            currentStepEl.classList.add('visible', 'animate-fade-in');
        }
        
        this.updateStepIndicator(step);
        this.currentStep = step;
    }
    
    async typeCustomerInfo() {
        const nameEl = document.getElementById('customer-name');
        const addressEl = document.getElementById('customer-address');
        
        if (nameEl && addressEl) {
            await this.typeText(nameEl, 'Mrs. Johnson', 40);
            await this.delay(300);
            await this.typeText(addressEl, '42 Oak Street, Manchester', 30);
        }
    }
    
    async addLineItems() {
        const container = document.getElementById('line-items-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 0; i < this.lineItems.length; i++) {
            await this.delay(700);
            const item = this.lineItems[i];
            const itemEl = document.createElement('div');
            itemEl.className = 'flex justify-between text-xs line-item-row';
            itemEl.innerHTML = `
                <span class="text-gray-600 dark:text-gray-200">${item.name}</span>
                <span class="font-medium">£${item.price.toFixed(2)}</span>
            `;
            container.appendChild(itemEl);
            
            // Trigger animation
            await this.delay(50);
            itemEl.classList.add('visible');
        }
    }
    
    async animateTotal() {
        const totalEl = document.getElementById('final-total');
        if (!totalEl) return;
        
        const targetTotal = 164.00;
        const steps = 20;
        const increment = targetTotal / steps;
        
        for (let i = 0; i <= steps; i++) {
            const current = increment * i;
            totalEl.textContent = `£${current.toFixed(2)}`;
            totalEl.classList.add('animate-count-up');
            await this.delay(40);
        }
        
        // Final value
        totalEl.textContent = `£${targetTotal.toFixed(2)}`;
    }
    
    async showPDFBadge() {
        const badge = document.getElementById('pdf-badge');
        if (badge) {
            badge.classList.remove('hidden');
            badge.classList.add('animate-checkmark', 'animate-pulse-green');
        }
    }
    
    resetDemo() {
        this.currentStep = 1;
        this.isAnimating = false;
        this.currentTotal = 0;
        
        // Reset step indicator
        const indicator = document.getElementById('step-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
        }
        
        // Go back to step 1
        this.goToStep(1);
        
        // Clear dynamic content
        const container = document.getElementById('line-items-container');
        if (container) {
            container.innerHTML = '';
        }
        
        const nameEl = document.getElementById('customer-name');
        const addressEl = document.getElementById('customer-address');
        if (nameEl) nameEl.textContent = '';
        if (addressEl) addressEl.textContent = '';
        
        const totalEl = document.getElementById('final-total');
        if (totalEl) totalEl.textContent = '£0.00';
        
        const badge = document.getElementById('pdf-badge');
        if (badge) {
            badge.classList.add('hidden');
            badge.classList.remove('animate-checkmark', 'animate-pulse-green');
        }
        
        // Remove animation classes
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepEl = document.getElementById(`step${i}`);
            if (stepEl) {
                stepEl.classList.remove('animate-fade-in');
            }
        }
    }
    
    async typeText(element, text, speed = 50) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.delay(speed);
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuotePreviewDemo();
});

class ScrollReveal {
    constructor() {
        this.init();
    }
    
    init() {
        // Create Intersection Observer
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px 0px -50px 0px', // trigger slightly before element enters
            threshold: 0.1 // trigger when 10% visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Only animate once
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-stagger').forEach(el => {
            observer.observe(el);
        });
    }
}

// Initialize scroll reveal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal();
});
