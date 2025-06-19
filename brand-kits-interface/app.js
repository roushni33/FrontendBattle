// Brand data from the application
const brandData = {
  "brands": [
    {
      "id": "ecorp",
      "name": "ECorp",
      "icon_color": "#10b981",
      "checked": false
    },
    {
      "id": "icorp", 
      "name": "ICorp",
      "icon_color": "#f59e0b",
      "checked": false
    },
    {
      "id": "agency",
      "name": "The Agency", 
      "icon_color": "#ef4444",
      "checked": true
    }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize brand cards
    initializeBrandCards();
    
    // Set up event listeners
    setupEventListeners();
    
    // Add smooth entrance animations
    addEntranceAnimations();
});

function initializeBrandCards() {
    brandData.brands.forEach(brand => {
        const card = document.querySelector(`[data-brand-id="${brand.id}"]`);
        const checkbox = document.getElementById(`${brand.id}-checkbox`);
        
        if (card && checkbox) {
            // Set initial checkbox state
            checkbox.checked = brand.checked;
            
            // Update card appearance based on checked state
            updateCardAppearance(card, brand.checked);
            
            // Update icon color
            const iconPath = card.querySelector('.brand-icon svg path');
            if (iconPath) {
                iconPath.setAttribute('fill', brand.icon_color);
            }
        }
    });
}

function setupEventListeners() {
    // Checkbox change handlers
    document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Card click handlers (to toggle checkbox)
    document.querySelectorAll('.brand-card').forEach(card => {
        card.addEventListener('click', handleCardClick);
    });
    
    // Menu icon handlers
    document.querySelectorAll('.menu-icon').forEach(menuIcon => {
        menuIcon.addEventListener('click', handleMenuClick);
    });
    
    // Keyboard accessibility
    document.querySelectorAll('.brand-checkbox').forEach(checkbox => {
        checkbox.addEventListener('keydown', handleKeyDown);
    });
}

function handleCheckboxChange(event) {
    const checkbox = event.target;
    const brandId = checkbox.id.replace('-checkbox', '');
    const card = document.querySelector(`[data-brand-id="${brandId}"]`);
    
    // Update brand data
    const brand = brandData.brands.find(b => b.id === brandId);
    if (brand) {
        brand.checked = checkbox.checked;
    }
    
    // Update card appearance
    updateCardAppearance(card, checkbox.checked);
    
    // Add feedback animation
    addCheckboxFeedback(checkbox);
    
    // Log the change for debugging
    console.log(`Brand ${brandId} ${checkbox.checked ? 'selected' : 'deselected'}`);
}

function handleCardClick(event) {
    // Don't trigger if clicking on checkbox or menu icon
    if (event.target.closest('.checkbox-container') || event.target.closest('.menu-icon')) {
        return;
    }
    
    const card = event.currentTarget;
    const brandId = card.getAttribute('data-brand-id');
    const checkbox = document.getElementById(`${brandId}-checkbox`);
    
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    }
}

function handleMenuClick(event) {
    event.stopPropagation();
    
    const menuIcon = event.currentTarget;
    const card = menuIcon.closest('.brand-card');
    const brandId = card.getAttribute('data-brand-id');
    const brand = brandData.brands.find(b => b.id === brandId);
    
    // Add click animation
    addMenuClickAnimation(menuIcon);
    
    // Simulate menu action (in a real app, this would open a menu)
    showMenuFeedback(brand.name);
}

function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const checkbox = event.target;
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    }
}

function updateCardAppearance(card, isChecked) {
    if (!card) return;
    
    if (isChecked) {
        card.classList.add('brand-card--checked');
        card.style.transform = 'translateY(-1px)';
        
        // Add subtle glow effect
        setTimeout(() => {
            card.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
        }, 100);
    } else {
        card.classList.remove('brand-card--checked');
        card.style.transform = '';
        card.style.boxShadow = '';
    }
}

function addCheckboxFeedback(checkbox) {
    checkbox.style.transform = 'scale(1.1)';
    checkbox.style.transition = 'transform 0.1s ease-out';
    
    setTimeout(() => {
        checkbox.style.transform = 'scale(1)';
    }, 100);
}

function addMenuClickAnimation(menuIcon) {
    menuIcon.style.transform = 'scale(0.9)';
    menuIcon.style.transition = 'transform 0.1s ease-out';
    
    setTimeout(() => {
        menuIcon.style.transform = 'scale(1)';
    }, 100);
}

function showMenuFeedback(brandName) {
    // Create a temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = `${brandName} settings`;
    feedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(139, 92, 246, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(feedback);
    
    // Animate in
    setTimeout(() => {
        feedback.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 1500);
}

function addEntranceAnimations() {
    const title = document.querySelector('.brand-kits-title');
    const cards = document.querySelectorAll('.brand-card');
    
    // Animate title
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        title.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 200);
    }
    
    // Animate cards with stagger
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 400 + (index * 100));
    });
}

// Enhanced hover effects
function addHoverEffects() {
    document.querySelectorAll('.brand-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('brand-card--checked')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });
}

// Add floating animation to icons
function addIconAnimations() {
    const icons = document.querySelectorAll('.brand-icon');
    
    icons.forEach((icon, index) => {
        icon.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });
}

// CSS animation for floating effect
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { 
            transform: translateY(0px); 
        }
        50% { 
            transform: translateY(-3px); 
        }
    }
    
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1); 
        }
        50% { 
            transform: scale(1.05); 
        }
    }
`;
document.head.appendChild(style);

// Initialize enhanced effects after DOM is loaded
setTimeout(() => {
    addHoverEffects();
    addIconAnimations();
}, 500);

// Utility function to get current brand states
function getBrandStates() {
    return brandData.brands.map(brand => ({
        id: brand.id,
        name: brand.name,
        checked: brand.checked
    }));
}

// Export for potential external use
window.brandKits = {
    getBrandStates,
    brandData
};