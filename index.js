// Performance-optimized timeline interaction script

// Cache DOM elements for better performance
const timelineContainer = document.querySelector('.timeline-container');
const infoContainer = document.querySelector('.info-container');
const timelineInfoPanels = document.querySelectorAll('.timeline-info');

// Global variables to store loaded data
let eventData = [];
let dateToInfoMap = {};

// Track currently active event to avoid unnecessary updates
let currentActiveEvent = null;

// Load event data from JSON file
async function loadEventData() {
    try {
        const response = await fetch('events.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        eventData = data.events;
        
        // Build the date to info map dynamically
        dateToInfoMap = {};
        eventData.forEach(event => {
            dateToInfoMap[event.date] = event.infoId;
        });
        
        return true;
    } catch (error) {
        console.error('Error loading event data:', error);
        return false;
    }
}

// Create and position clickable dots dynamically
function initializeEventDots() {
    eventData.forEach(event => {
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

// Hide info container on mobile
function hideInfoContainer() {
    if (isMobile()) {
        infoContainer.style.display = 'none';
        currentActiveEvent = null;
        clearActiveStates();
    }
}

// Show info container on mobile
function showInfoContainer() {
    if (isMobile()) {
        infoContainer.style.display = 'block';
    }
}

// Check if we're on mobile/small screen
function isMobile() {
    return window.innerWidth <= 768;
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
    
    if (clickedDot) {
        // Clicked on an event dot
        const clickedDate = clickedDot.dataset.date;
        const infoId = dateToInfoMap[clickedDate];
        
        if (infoId) {
            // Update visual states
            clearActiveStates();
            clickedDot.classList.add('active');
            
            // Show info container on mobile if hidden
            showInfoContainer();
            
            // Show corresponding info panel
            showInfoPanel(infoId);

        }
    } else {
        // Clicked on empty timeline area
        if (isMobile()) {
            // On mobile, hide the info container when clicking empty areas
            hideInfoContainer();
        }
    }
}

// Initialize the timeline functionality
async function initializeTimeline() {
    // Hide all info panels initially
    hideAllInfoPanels();
    
    // On mobile, start with info container hidden
    if (isMobile()) {
        infoContainer.style.display = 'none';
    }
    
    // Load event data
    if (await loadEventData()) {
        // Create clickable dots
        initializeEventDots();
        
        // Add click event listener using event delegation
        timelineContainer.addEventListener('click', handleTimelineClick);
        
        // Handle window resize to manage mobile/desktop transitions
        window.addEventListener('resize', handleResize);
        
        // Optional: Show first event by default
        // showInfoPanel('old-malifaux');
        // document.querySelector('[data-date="????"]')?.classList.add('active');
    } else {
        console.error('Failed to load event data. Timeline will not function.');
    }
}

// Handle window resize events
function handleResize() {
    if (!isMobile()) {
        // On desktop, always show info container
        infoContainer.style.display = 'block';
    } else if (!currentActiveEvent) {
        // On mobile, hide info container if no event is active
        infoContainer.style.display = 'none';
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeTimeline());
} else {
    initializeTimeline();
}
