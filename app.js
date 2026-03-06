/**
 * Analytics Helper
 * Ready for integration with Plausible, Fathom, or similar analytics tools
 * No actual tracking is performed - this is a placeholder for future implementation
 */
const BeamAnalytics = {
    /**
     * Track a custom event
     * @param {string} eventName - Name of the event to track
     * @param {Object} properties - Additional properties to include
     */
    track(eventName, properties = {}) {
        // Ready for analytics integration
        // Examples:
        // Plausible: plausible(eventName, { props: properties })
        // Fathom: fathom.trackGoal(eventName, 0)
        // Custom: send to your own analytics endpoint

        if (window.DEBUG_ANALYTICS) {
            console.log('[Analytics]', eventName, properties);
        }
    },

    /**
     * Track a click event from a data-track element
     * @param {HTMLElement} element - The clicked element
     */
    trackClick(element) {
        const action = element.dataset.action || 'click';
        const label = element.dataset.label || element.textContent?.trim() || 'unknown';
        const section = element.closest('[data-section]')?.dataset.section || 'unknown';

        this.track('click', {
            action,
            label,
            section
        });
    },

    /**
     * Track form submission
     * @param {HTMLFormElement} form - The submitted form
     */
    trackFormSubmit(form) {
        const formName = form.dataset.form || 'unknown';
        const section = form.dataset.section || element.closest('[data-section]')?.dataset.section || 'unknown';

        this.track('form_submit', {
            form: formName,
            section
        });
    },

    /**
     * Track scroll depth when a section comes into view
     * @param {string} sectionName - Name of the section
     */
    trackSectionView(sectionName) {
        this.track('section_view', {
            section: sectionName
        });
    },

    /**
     * Initialize click tracking on all data-track elements
     */
    initClickTracking() {
        document.addEventListener('click', (e) => {
            const trackable = e.target.closest('[data-track]');
            if (trackable) {
                this.trackClick(trackable);
            }
        });
    },

    /**
     * Initialize section view tracking using Intersection Observer
     */
    initSectionTracking() {
        const sections = document.querySelectorAll('[data-section]');
        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackSectionView(entry.target.dataset.section);
                    // Only track once per section
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    },

    /**
     * Initialize all analytics tracking
     */
    init() {
        this.initClickTracking();
        this.initSectionTracking();

        if (window.DEBUG_ANALYTICS) {
            console.log('[Analytics] Initialized (debug mode)');
        }
    }
};

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    BeamAnalytics.init();
});

// Expose globally for manual tracking calls
window.BeamAnalytics = BeamAnalytics;

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
                    this.startDemo();
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

// Live Counter Animation
class LiveCounter {
    constructor() {
        this.counterEl = document.getElementById('quote-counter');
        this.startValue = 50000;
        this.currentValue = this.startValue;
        this.incrementInterval = null;

        if (this.counterEl) {
            this.init();
        }
    }

    init() {
        // Start with animated count up
        this.animateCountUp();

        // Then slowly increment over time
        this.incrementInterval = setInterval(() => {
            this.incrementCounter();
        }, 8000); // Every 8 seconds
    }

    animateCountUp() {
        const duration = 2000; // 2 seconds
        const steps = 50;
        const increment = Math.floor(this.startValue / steps);
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(increment * step, this.startValue);
            this.counterEl.textContent = this.formatNumber(current);

            if (current >= this.startValue) {
                clearInterval(timer);
            }
        }, duration / steps);
    }

    incrementCounter() {
        // Random increment between 1-5
        const increment = Math.floor(Math.random() * 5) + 1;
        this.currentValue += increment;

        // Add updating class for animation
        this.counterEl.classList.add('updating');

        setTimeout(() => {
            this.counterEl.textContent = this.formatNumber(this.currentValue);
            this.counterEl.classList.remove('updating');
        }, 100);
    }

    formatNumber(num) {
        return num.toLocaleString();
    }
}

// Sticky CTA Bar
class StickyCTA {
    constructor() {
        this.stickyCta = document.getElementById('sticky-cta');
        this.heroSection = document.querySelector('.hero-gradient');
        this.isVisible = false;

        if (this.stickyCta && this.heroSection) {
            this.init();
        }
    }

    init() {
        // Create intersection observer for hero section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // When hero is NOT visible (scrolled past), show sticky CTA
                if (!entry.isIntersecting && window.scrollY > 100) {
                    this.show();
                } else {
                    this.hide();
                }
            });
        }, {
            root: null,
            threshold: 0
        });

        observer.observe(this.heroSection);

        // Also listen to scroll for more responsive behavior
        window.addEventListener('scroll', () => {
            const heroBottom = this.heroSection.getBoundingClientRect().bottom;
            if (heroBottom < 0 && !this.isVisible) {
                this.show();
            } else if (heroBottom >= 0 && this.isVisible) {
                this.hide();
            }
        });
    }

    show() {
        this.stickyCta.classList.add('visible');
        this.isVisible = true;
    }

    hide() {
        this.stickyCta.classList.remove('visible');
        this.isVisible = false;
    }
}

// Initialize live counter and sticky CTA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveCounter();
    new StickyCTA();

    // Dismiss sticky CTA
    const dismissBtn = document.getElementById('dismiss-sticky-cta');
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            const stickyCta = document.getElementById('sticky-cta');
            if (stickyCta) {
                stickyCta.classList.add('dismissed');
            }
        });
    }
});

// FAQ Accordion Enhancement
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            item.addEventListener('toggle', (e) => {
                if (item.open) {
                    // Close other items when one opens (accordion behavior)
                    this.faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.open) {
                            otherItem.open = false;
                        }
                    });
                }
            });
        });
    }
}

// Initialize FAQ accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FAQAccordion();
});

// Social Proof Counter Manager
// Easy to update - just call SocialProofCounter.updateCount(newCount)
class SocialProofCounter {
    constructor() {
        this.countEl = document.getElementById('waitlist-count');
        this.currentCount = 0;
        this.targetCount = 0; // Set this to actual waitlist count when available

        // Message templates based on count
        this.messages = {
            zero: 'Be among the first',
            few: 'Join {count} early adopters',
            growing: 'Join {count} contractors waiting',
            established: 'Join {count}+ contractors'
        };

        if (this.countEl) {
            this.init();
        }
    }

    init() {
        if (this.targetCount > 0) {
            this.animateCountUp();
        }
    }

    // Call this to update the count dynamically
    updateCount(newCount) {
        this.targetCount = newCount;
        this.animateCountUp();
    }

    animateCountUp() {
        const duration = 1500;
        const steps = 40;
        const increment = this.targetCount / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.min(Math.round(increment * step), this.targetCount);
            this.updateDisplay(current);

            if (current >= this.targetCount) {
                clearInterval(timer);
            }
        }, duration / steps);
    }

    updateDisplay(count) {
        if (!this.countEl) return;

        let message;
        if (count === 0) {
            message = this.messages.zero;
        } else if (count < 10) {
            message = this.messages.few.replace('{count}', count);
        } else if (count < 100) {
            message = this.messages.growing.replace('{count}', count);
        } else {
            message = this.messages.established.replace('{count}', count);
        }

        this.countEl.textContent = message;
        this.currentCount = count;
    }

    // Get current count (useful for analytics)
    getCount() {
        return this.currentCount;
    }
}

// Initialize social proof counter
const socialProofCounter = new SocialProofCounter();

// Expose globally for easy updates
window.SocialProofCounter = socialProofCounter;

// Feature Highlights - Keyboard Navigation Enhancement
class FeatureHighlightsA11y {
    constructor() {
        this.featureCards = document.querySelectorAll('.feature-highlight-card');
        this.init();
    }

    init() {
        // Make feature cards focusable and add keyboard interaction
        this.featureCards.forEach(card => {
            // Add tabindex for keyboard navigation
            card.setAttribute('tabindex', '0');

            // Add focus/blur visual feedback
            card.addEventListener('focus', () => {
                card.classList.add('ring-2', 'ring-beam-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
            });

            card.addEventListener('blur', () => {
                card.classList.remove('ring-2', 'ring-beam-500', 'ring-offset-2', 'dark:ring-offset-slate-900');
            });

            // Add keyboard activation feedback
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Simulate hover effect on keyboard activation
                    card.classList.add('feature-highlight-card-active');
                    setTimeout(() => {
                        card.classList.remove('feature-highlight-card-active');
                    }, 300);
                }
            });
        });
    }
}

// Initialize feature highlights accessibility when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeatureHighlightsA11y();
});
