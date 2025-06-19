// Chart data from provided JSON
const chartData = [
    {"id": 1, "name": "Project A", "value": 549, "type": "refurbishment", "status": "complete"},
    {"id": 2, "name": "Project B", "value": 278, "type": "new_build", "status": "complete"},
    {"id": 3, "name": "Project C", "value": 875, "type": "refurbishment", "status": "estimate"},
    {"id": 4, "name": "Project D", "value": 617, "type": "new_build", "status": "complete"},
    {"id": 5, "name": "Project E", "value": 506, "type": "refurbishment", "status": "complete"},
    {"id": 6, "name": "Project F", "value": 36, "type": "new_build", "status": "estimate"},
    {"id": 7, "name": "Project G", "value": 185, "type": "refurbishment", "status": "complete"},
    {"id": 8, "name": "Project H", "value": 191, "type": "new_build", "status": "complete"},
    {"id": 9, "name": "Project I", "value": 122, "type": "refurbishment", "status": "estimate"},
    {"id": 10, "name": "Project J", "value": 550, "type": "new_build", "status": "complete"},
    {"id": 11, "name": "Project K", "value": 881, "type": "refurbishment", "status": "complete"},
    {"id": 12, "name": "Project L", "value": 539, "type": "new_build", "status": "estimate"},
    {"id": 13, "name": "Project M", "value": 269, "type": "refurbishment", "status": "complete"},
    {"id": 14, "name": "Project N", "value": 29, "type": "new_build", "status": "complete"},
    {"id": 15, "name": "Project O", "value": 82, "type": "refurbishment", "status": "estimate"},
    {"id": 16, "name": "Project P", "value": 44, "type": "new_build", "status": "complete"},
    {"id": 17, "name": "Project Q", "value": 109, "type": "refurbishment", "status": "complete"},
    {"id": 18, "name": "Project R", "value": 106, "type": "new_build", "status": "estimate"},
    {"id": 19, "name": "Project S", "value": 607, "type": "refurbishment", "status": "complete"},
    {"id": 20, "name": "Project T", "value": 528, "type": "new_build", "status": "complete"}
];

const targets = {
    target_2030: 500,
    target_2025: 600
};

// Global state
let currentFilters = {
    type: 'all',
    status: 'complete'
};

let tooltip = null;
let barsContainer = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');
    
    tooltip = document.getElementById('tooltip');
    barsContainer = document.getElementById('barsContainer');
    
    if (!tooltip || !barsContainer) {
        console.error('Required elements not found');
        return;
    }
    
    initializeFilters();
    renderChart();
    setupDownloadButton();
    
    console.log('Dashboard initialized successfully');
});

// Initialize filter buttons
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    console.log('Found filter buttons:', filterButtons.length);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const filterType = this.dataset.filterType;
            const filterValue = this.dataset.value;
            
            console.log('Filter clicked:', filterType, filterValue);
            
            // Update active state for buttons of the same type
            const siblingButtons = document.querySelectorAll(`[data-filter-type="${filterType}"]`);
            siblingButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filters
            currentFilters[filterType] = filterValue;
            
            console.log('Current filters:', currentFilters);
            
            // Re-render chart with new filters
            renderChart();
        });
    });
}

// Filter data based on current filters
function filterData() {
    const filtered = chartData.filter(item => {
        const typeMatch = currentFilters.type === 'all' || item.type === currentFilters.type;
        const statusMatch = item.status === currentFilters.status;
        return typeMatch && statusMatch;
    });
    
    console.log('Filtered data:', filtered.length, 'items');
    return filtered;
}

// Render the chart
function renderChart() {
    const filteredData = filterData();
    const maxValue = 1200; // Fixed max value for consistent scaling
    
    console.log('Rendering chart with', filteredData.length, 'items');
    
    // Clear existing bars
    barsContainer.innerHTML = '';
    
    if (filteredData.length === 0) {
        const noDataMsg = document.createElement('div');
        noDataMsg.textContent = 'No data matches the current filters';
        noDataMsg.style.cssText = 'text-align: center; color: var(--color-text-secondary); padding: 40px;';
        barsContainer.appendChild(noDataMsg);
        return;
    }
    
    // Create bars for filtered data
    filteredData.forEach((item, index) => {
        const bar = createBar(item, maxValue, index);
        barsContainer.appendChild(bar);
    });
    
    // Animate bars after a short delay
    setTimeout(() => {
        const bars = barsContainer.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate');
            }, index * 50);
        });
    }, 100);
}

// Create a single bar element
function createBar(data, maxValue, index) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.setAttribute('tabindex', '0');
    bar.setAttribute('role', 'button');
    bar.setAttribute('aria-label', `${data.name}: ${data.value} kgCO2e/m²`);
    
    // Calculate height percentage
    const heightPercent = Math.max((data.value / maxValue) * 100, 0.5); // Minimum 0.5% height
    bar.style.setProperty('--bar-height', `${heightPercent}%`);
    bar.style.height = `${heightPercent}%`;
    
    // Create value label
    const valueLabel = document.createElement('div');
    valueLabel.className = 'bar-value';
    valueLabel.textContent = data.value;
    bar.appendChild(valueLabel);
    
    // Store data on element for easy access
    bar.dataset.projectData = JSON.stringify(data);
    
    // Add event listeners
    addBarEventListeners(bar, data);
    
    return bar;
}

// Add event listeners to a bar
function addBarEventListeners(bar, data) {
    // Mouse events
    bar.addEventListener('mouseenter', function(e) {
        showTooltip(e, data);
    });
    
    bar.addEventListener('mousemove', function(e) {
        updateTooltipPosition(e);
    });
    
    bar.addEventListener('mouseleave', function() {
        hideTooltip();
    });
    
    // Click event
    bar.addEventListener('click', function(e) {
        e.preventDefault();
        console.log(`Selected ${data.name}: ${data.value} kgCO2e/m²`);
        
        // Visual feedback
        this.style.transform = 'scaleX(1.1) scaleY(1.02)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
    
    // Keyboard events
    bar.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
    
    bar.addEventListener('focus', function(e) {
        showTooltip(e, data);
    });
    
    bar.addEventListener('blur', function() {
        hideTooltip();
    });
}

// Tooltip functions
function showTooltip(event, data) {
    if (!tooltip) return;
    
    const tooltipName = tooltip.querySelector('.tooltip-name');
    const tooltipValue = tooltip.querySelector('.tooltip-value');
    const tooltipDetails = tooltip.querySelector('.tooltip-details');
    
    if (!tooltipName || !tooltipValue || !tooltipDetails) {
        console.error('Tooltip elements not found');
        return;
    }
    
    tooltipName.textContent = data.name;
    tooltipValue.textContent = `${data.value} kgCO2e/m²`;
    tooltipDetails.textContent = `Type: ${formatType(data.type)} • Status: ${formatStatus(data.status)}`;
    
    tooltip.classList.add('visible');
    updateTooltipPosition(event);
}

function updateTooltipPosition(event) {
    if (!tooltip || !tooltip.classList.contains('visible')) return;
    
    // Use getBoundingClientRect for accurate positioning
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let left = event.clientX + 15;
    let top = event.clientY - tooltipRect.height - 15;
    
    // Adjust if tooltip would go off-screen horizontally
    if (left + tooltipRect.width > viewportWidth) {
        left = event.clientX - tooltipRect.width - 15;
    }
    
    // Adjust if tooltip would go off-screen vertically
    if (top < 0) {
        top = event.clientY + 15;
    }
    
    // Ensure tooltip doesn't go off bottom of screen
    if (top + tooltipRect.height > viewportHeight) {
        top = viewportHeight - tooltipRect.height - 10;
    }
    
    // Ensure tooltip doesn't go off left side
    if (left < 0) {
        left = 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

// Format helper functions
function formatType(type) {
    return type === 'new_build' ? 'New Build' : 'Refurbishment';
}

function formatStatus(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

// Download functionality
function setupDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (!downloadBtn) {
        console.error('Download button not found');
        return;
    }
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const filteredData = filterData();
        downloadCSV(filteredData);
        
        // Provide visual feedback
        const originalContent = this.innerHTML;
        this.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
            Downloaded!
        `;
        this.disabled = true;
        
        setTimeout(() => {
            this.innerHTML = originalContent;
            this.disabled = false;
        }, 2000);
    });
}

// Generate and download CSV
function downloadCSV(data) {
    const headers = ['Project Name', 'Carbon Intensity (kgCO2e/m²)', 'Type', 'Status'];
    const csvContent = [
        headers.join(','),
        ...data.map(item => [
            `"${item.name}"`,
            item.value,
            `"${formatType(item.type)}"`,
            `"${formatStatus(item.status)}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon-emissions-${getCurrentFilterString()}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Get current filter string for filename
function getCurrentFilterString() {
    const typeStr = currentFilters.type === 'all' ? 'all-types' : currentFilters.type.replace('_', '-');
    const statusStr = currentFilters.status;
    return `${typeStr}-${statusStr}`;
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    hideTooltip();
});

// Global event handlers
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideTooltip();
    }
});

// Scroll handler to hide tooltip
window.addEventListener('scroll', function() {
    hideTooltip();
});

// Additional utility functions for enhanced functionality
function getProjectsAboveTarget(targetValue) {
    const filteredData = filterData();
    return filteredData.filter(item => item.value > targetValue);
}

function getAverageEmissions() {
    const filteredData = filterData();
    if (filteredData.length === 0) return 0;
    
    const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
    return Math.round(sum / filteredData.length);
}

function getEmissionsStats() {
    const filteredData = filterData();
    if (filteredData.length === 0) return null;
    
    const values = filteredData.map(item => item.value);
    const sorted = [...values].sort((a, b) => a - b);
    
    return {
        count: filteredData.length,
        min: Math.min(...values),
        max: Math.max(...values),
        median: sorted.length % 2 === 0 
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)],
        average: getAverageEmissions(),
        above2030Target: getProjectsAboveTarget(targets.target_2030).length,
        above2025Target: getProjectsAboveTarget(targets.target_2025).length
    };
}

// Enhanced error handling
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
});

// Console logging for debugging
console.log('Carbon Emissions Dashboard script loaded');
console.log('Total projects:', chartData.length);
console.log('2025 Target (600 kgCO2e/m²):', targets.target_2025);
console.log('2030 Target (500 kgCO2e/m²):', targets.target_2030);

// Export functions for potential external use
window.CarbonDashboard = {
    getEmissionsStats,
    getProjectsAboveTarget,
    getAverageEmissions,
    getCurrentFilters: () => ({ ...currentFilters }),
    getFilteredData: filterData
};