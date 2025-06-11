// Performance-optimized timeline interaction script

// Cache DOM elements for better performance
const timelineContainer = document.querySelector('.timeline-container');
const infoContainer = document.querySelector('.info-container');
const timelineInfoPanels = document.querySelectorAll('.timeline-info');

// Map dates to their corresponding info panel IDs for quick lookup
const dateToInfoMap = {
    '????': 'old-malifaux',
    '???': 'the-tyrant-war',
    '6000 BC': 'the-falling-star',
    '5400 BC': 'the-journey-east',
    '500 BC': 'blood-of-my-blood',
    '220 AD': 'the-living-forest',
    '770 AD': 'the-rise-of-the-dragon',
    '6000 BC': 'the-falling-star',
    '5400 BC': 'the-journey-east',
    '500 BC': 'blood-of-my-blood',
    '220 AD': 'the-living-forest',
    '770 AD': 'the-rise-of-the-dragon'
};

// Track currently active event to avoid unnecessary updates
let currentActiveEvent = null;

// Create and position clickable dots dynamically
function initializeEventDots() {
    const eventPositions = [
        { date: '????', title: 'Old Malifaux', top: '90px', left: '45%' },
        { date: '???', title: 'The Tyrant War', top: '170px', left: '55%' },
        { date: '6000 BC', title: 'The Falling Star', top: '430px', left: '15%' },
        { date: '5400 BC', title: 'The Journey East', top: '675px', left: '60%' },
        { date: '500 BC', title: 'Blood of My Blood', top: '2640px', left: '10%' },
        { date: '220 AD', title: 'The Living Forest', top: '2900px', left: '65%' },
        { date: '770 AD', title: 'The Rise of the Dragon', top: '3100px', left: '20%' }
    ];

    eventPositions.forEach(event => {
        const dot = document.createElement('div');
        dot.className = 'timeline-event-dot';
        dot.dataset.date = event.date;
        
        // Create date and title elements
        const dateElement = document.createElement('div');
        dateElement.className = 'dot-date';
        dateElement.textContent = event.date;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'dot-title';
        titleElement.textContent = event.title;
        
        // Add both elements to the dot
        dot.appendChild(dateElement);
        dot.appendChild(titleElement);
        
        // Apply positioning
        dot.style.position = 'absolute';
        dot.style.top = event.top;
        if (event.left) {
            dot.style.left = event.left;
        } else {
            dot.style.right = event.right;
        }
        
        timelineContainer.appendChild(dot);
    });
}

// Hide all info panels initially
function hideAllInfoPanels() {
    timelineInfoPanels.forEach(panel => {
        panel.style.display = 'none';
        panel.classList.remove('active');
    });
}

// Show specific info panel with smooth transition
function showInfoPanel(infoId) {
    // Don't reload if same event
    if (currentActiveEvent === infoId) return;
    
    const targetPanel = document.getElementById(infoId);
    if (!targetPanel) return;
    
    // Hide all panels first
    hideAllInfoPanels();
    
    // Show target panel with fade effect
    targetPanel.style.display = 'block';
    targetPanel.style.opacity = '0';
    targetPanel.style.transform = 'translateY(20px)';
    
    // Force reflow then animate
    requestAnimationFrame(() => {
        targetPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        targetPanel.style.opacity = '1';
        targetPanel.style.transform = 'translateY(0)';
        targetPanel.classList.add('active');
    });
    
    currentActiveEvent = infoId;
}

// Remove active state from all event dots
function clearActiveStates() {
    document.querySelectorAll('.timeline-event-dot').forEach(dot => {
        dot.classList.remove('active');
    });
}

// Handle click events using event delegation for better performance
function handleTimelineClick(event) {
    const clickedDot = event.target.closest('.timeline-event-dot');
    if (!clickedDot) return;
    
    const clickedDate = clickedDot.dataset.date;
    const infoId = dateToInfoMap[clickedDate];
    
    if (infoId) {
        // Update visual states
        clearActiveStates();
        clickedDot.classList.add('active');
        
        // Show corresponding info panel
        showInfoPanel(infoId);
        
        // Optional: Log for debugging
        console.log(`Showing info for: ${clickedDate} -> ${infoId}`);
    }
}

// Initialize the timeline functionality
function initializeTimeline() {
    // Hide all info panels initially
    hideAllInfoPanels();
    
    // Create clickable dots
    initializeEventDots();
    
    // Add click event listener using event delegation
    timelineContainer.addEventListener('click', handleTimelineClick);
    
    // Optional: Show first event by default
    // showInfoPanel('the-falling-star');
    // document.querySelector('[data-date="6000 BC"]')?.classList.add('active');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimeline);
} else {
    initializeTimeline();
}

// Performance monitoring (remove in production)
if (window.performance) {
    window.addEventListener('load', () => {
        console.log('Timeline fully loaded in:', window.performance.now(), 'ms');
    });
}