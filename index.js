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
    '1293 AD': 'the-masamune-nihonto',
    '1332 AD': 'glimpses-of-huitzilopochtli',
    '1575 AD': 'the-fury-of-horomatangi',
    '1642 AD': 'an-empire-of-miracles',
    '1780 AD': 'the-formation-of-the-council',
    '1787 AD': 'the-great-breach',
    '1788 - 1790 AD': 'a-new-age',
    '1791 AD': 'the-first-resurrectionist',

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
        { date: '770 AD', title: 'The Rise of the Dragon', top: '3100px', left: '20%' },
        { date: '1293 AD', title: 'The Masamune Nihonto', top: '3500px', left: '65%' },
        { date: '1332 AD', title: 'Glimpses of Huitzilopochtli', top: '3700px', left: '45%' },
        { date: '1575 AD', title: 'The Fury of Horomatangi', top: '3900px', left: '25%' },
        { date: '1642 AD', title: 'An Empire of Miracles', top: '4100px', left: '35%' },
        { date: '1780 AD', title: 'The Formation of the Council', top: '4300px', left: '65%' },
        { date: '1787 AD', title: 'The Great Breach', top: '4400px', left: '55%' },
        { date: '1788 - 1790 AD', title: 'A New Age', top: '4500px', left: '35%' },
        { date: '1791 AD', title: 'The First Resurrectionist', top: '4600px', left: '25%' },

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
function initializeTimeline() {
    // Hide all info panels initially
    hideAllInfoPanels();
    
    // On mobile, start with info container hidden
    if (isMobile()) {
        infoContainer.style.display = 'none';
    }
    
    // Create clickable dots
    initializeEventDots();
    
    // Add click event listener using event delegation
    timelineContainer.addEventListener('click', handleTimelineClick);
    
    // Handle window resize to manage mobile/desktop transitions
    window.addEventListener('resize', handleResize);
    
    // Optional: Show first event by default
    // showInfoPanel('old-malifaux');
    // document.querySelector('[data-date="????"]')?.classList.add('active');
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
    document.addEventListener('DOMContentLoaded', initializeTimeline);
} else {
    initializeTimeline();
}
