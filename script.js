// Application State
let appState = {
    isLoggedIn: false,
    currentUser: null,
    userMode: 'recipient', // 'donor' or 'recipient'
    bloodRequests: [
        { 
            id: 'req_1', 
            requesterName: 'Self', 
            bloodType: 'A+', 
            quantity: 2, 
            location: 'Gulshan, Dhaka', 
            urgency: 'Urgent', 
            date: '2024-05-20', 
            status: 'Completed',
            neededByDate: '2024-05-21',
            offers: [
                { id: 'offer_1', donorId: 'd_1', donorName: 'Fahim Ahmed', donorBloodType: 'A+', donorAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', status: 'Completed' }
            ] 
        },
        { 
            id: 'req_2', 
            requesterName: 'Family Member', 
            bloodType: 'B-', 
            quantity: 1, 
            location: 'Dhanmondi, Dhaka', 
            urgency: 'High', 
            date: '2024-06-10', 
            status: 'Open',
            neededByDate: '2024-06-12',
            offers: [
                { id: 'offer_2', donorId: 'd_2', donorName: 'Anika Tabassum', donorBloodType: 'B-', donorAvatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', status: 'Pending' },
                { id: 'offer_3', donorId: 'd_3', donorName: 'Raihan Chowdhury', donorBloodType: 'O+', donorAvatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', status: 'Pending' },
            ] 
        },
        { 
            id: 'req_3', 
            requesterName: 'Self', 
            bloodType: 'O-', 
            quantity: 1, 
            location: 'Banani, Dhaka', 
            urgency: 'Medium', 
            date: '2024-06-18', 
            status: 'Open', 
            neededByDate: '2024-06-20', 
            offers: [] 
        },
    ],
    donationOpportunities: [
        {
            id: 'opp_1',
            patientName: 'Sarah Khan',
            bloodType: 'O+',
            quantity: 2,
            location: 'Dhaka Medical College Hospital',
            urgency: 'Urgent',
            distance: '2.3 km',
            neededByDate: '2024-07-08',
            hospitalName: 'Dhaka Medical College Hospital',
            hospitalAddress: 'Ramna, Dhaka 1000',
            phone: '+8801712345678',
            lat: 23.8103,
            lng: 90.4125,
            details: 'Emergency surgery required. Patient is in critical condition.'
        },
        {
            id: 'opp_2',
            patientName: 'Ahmed Rahman',
            bloodType: 'A+',
            quantity: 1,
            location: 'Square Hospital',
            urgency: 'High',
            distance: '1.8 km',
            neededByDate: '2024-07-09',
            hospitalName: 'Square Hospital',
            hospitalAddress: 'West Panthapath, Dhaka 1205',
            phone: '+8801798765432',
            lat: 23.7515,
            lng: 90.3710,
            details: 'Scheduled surgery tomorrow morning.'
        }
    ],
    users: [],
    activities: [
        { id: 1, text: 'Blood request posted', time: '2 hours ago', icon: 'fas fa-tint' },
        { id: 2, text: 'New donor matched', time: '1 day ago', icon: 'fas fa-user' }
    ]
};

// DOM Elements
const elements = {
    // Navigation
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    
    // Main content areas
    landingPage: document.getElementById('landing-page'),
    dashboard: document.getElementById('dashboard'),
    mainContent: document.getElementById('main-content'),
    
    // Hero buttons
    requestBloodBtn: document.getElementById('request-blood-btn'),
    donateBloodBtn: document.getElementById('donate-blood-btn'),
    joinBtn: document.getElementById('join-btn'),
    
    // Dashboard buttons
    newRequestBtn: document.getElementById('new-request-btn'),
    findDonorsBtn: document.getElementById('find-donors-btn'),
    
    // Modals
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    bloodRequestModal: document.getElementById('blood-request-modal'),
    
    // Modal close buttons
    loginClose: document.getElementById('login-close'),
    signupClose: document.getElementById('signup-close'),
    bloodRequestClose: document.getElementById('blood-request-close'),
    
    // Forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    bloodRequestForm: document.getElementById('blood-request-form')
};

// Utility Functions
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add animation class
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
}

function hideModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideOut 0.3s ease-out';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateLiveRequests() {
    const requestList = document.querySelector('.request-list');
    if (!requestList) return;
    
    requestList.innerHTML = appState.bloodRequests.map(request => `
        <div class="request-item">
            <div class="request-info">
                <i class="fas fa-tint request-icon"></i>
                <div class="request-details">
                    <p class="request-text">Needs <span class="blood-type blood-${request.bloodType.toLowerCase().replace('+', '-positive').replace('-', '-negative')}">${request.bloodType}</span></p>
                    <p class="request-location">in ${request.location}</p>
                </div>
            </div>
            <p class="request-time">${request.time}</p>
        </div>
    `).join('');
}

function updateDashboardActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = appState.activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon} activity-icon"></i>
            <div class="activity-details">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        </div>
    `).join('');
}

function switchToLandingPage() {
    elements.landingPage.style.display = 'block';
    elements.dashboard.style.display = 'none';
    appState.isLoggedIn = false;
    appState.currentUser = null;
}

function switchToDashboard() {
    elements.landingPage.style.display = 'none';
    elements.dashboard.style.display = 'block';
    appState.isLoggedIn = true;
    
    // Update dashboard content based on user mode
    updateDashboardContent();
    updateDashboardActivity();
}

function updateDashboardContent() {
    const dashboardContainer = document.querySelector('.dashboard .container');
    if (!dashboardContainer) return;
    
    // Clear existing content except header
    const header = dashboardContainer.querySelector('.dashboard-header');
    dashboardContainer.innerHTML = '';
    if (header) {
        dashboardContainer.appendChild(header);
    }
    
    // Add mode toggle
    const modeToggle = document.createElement('div');
    modeToggle.className = 'mode-toggle';
    modeToggle.innerHTML = `
        <div class="card" style="margin-bottom: 2rem;">
            <div class="card-content" style="padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.125rem;">Current Mode: <span style="color: var(--primary); font-weight: 700;">${appState.userMode === 'donor' ? 'Donor' : 'Recipient'}</span></h3>
                        <p style="margin: 0.5rem 0 0; color: var(--muted-foreground); font-size: 0.875rem;">
                            ${appState.userMode === 'donor' ? 'You are viewing donation opportunities in your area' : 'You are managing your blood requests'}
                        </p>
                    </div>
                    <button class="btn btn-outline" id="toggle-mode-btn">
                        Switch to ${appState.userMode === 'donor' ? 'Recipient' : 'Donor'} Mode
                    </button>
                </div>
            </div>
        </div>
    `;
    dashboardContainer.appendChild(modeToggle);
    
    // Add mode-specific content
    if (appState.userMode === 'donor') {
        renderDonorDashboard(dashboardContainer);
    } else {
        renderRecipientDashboard(dashboardContainer);
    }
    
    // Add event listener for mode toggle
    const toggleBtn = document.getElementById('toggle-mode-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleUserMode);
    }
}

function toggleUserMode() {
    appState.userMode = appState.userMode === 'donor' ? 'recipient' : 'donor';
    updateDashboardContent();
    showNotification(`Switched to ${appState.userMode} mode`);
}

function renderDonorDashboard(container) {
    const donorContent = document.createElement('div');
    donorContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Nearby Blood Requests</h3>
                <p style="color: var(--muted-foreground); margin: 0.5rem 0 0;">Help patients in need by donating blood</p>
            </div>
            <div class="card-content">
                <div class="opportunities-list">
                    ${appState.donationOpportunities.map(opp => `
                        <div class="opportunity-card" style="border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                                <div style="flex: 1; min-width: 250px;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${opp.patientName}</h4>
                                        <span class="blood-type blood-${opp.urgency.toLowerCase()}" style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700; background-color: var(--destructive); color: white;">${opp.urgency}</span>
                                    </div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
                                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                                            <i class="fas fa-tint" style="color: var(--primary);"></i>
                                            Needs: <strong>${opp.bloodType}</strong> (${opp.quantity} ${opp.quantity > 1 ? 'units' : 'unit'})
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                                            <i class="fas fa-map-marker-alt"></i>
                                            ${opp.location} (${opp.distance})
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary view-details-btn" data-opportunity-id="${opp.id}">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    container.appendChild(donorContent);
    
    // Add event listeners for view details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const oppId = e.target.closest('.view-details-btn').dataset.opportunityId;
            showOpportunityDetails(oppId);
        });
    });
}

function renderRecipientDashboard(container) {
    const recipientContent = document.createElement('div');
    recipientContent.innerHTML = `
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h3 class="card-title">My Blood Requests</h3>
                    <p style="color: var(--muted-foreground); margin: 0.5rem 0 0;">
                        ${appState.bloodRequests.length > 0 ? 'Manage your blood donation requests and offers' : 'You have no active blood requests.'}
                    </p>
                </div>
                <button class="btn btn-primary" id="new-request-dashboard-btn">
                    <i class="fas fa-plus"></i> New Request
                </button>
            </div>
            <div class="card-content">
                <div class="requests-list">
                    ${appState.bloodRequests.length > 0 ? appState.bloodRequests.map(req => `
                        <div class="request-card" style="border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1.5rem; overflow: hidden;">
                            <div style="padding: 1rem; background-color: var(--card);">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                            <span style="font-size: 1.125rem; font-weight: 600;">Request for ${req.bloodType}</span>
                                            <span class="blood-type" style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700; 
                                                background-color: ${req.status === 'Open' ? 'var(--destructive)' : req.status === 'Completed' ? 'var(--primary)' : 'var(--secondary)'}; 
                                                color: white;">${req.status}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">
                                            ${req.quantity} ${req.quantity > 1 ? 'units' : 'unit'} needed at ${req.location} by <strong>${formatDate(req.neededByDate)}</strong>
                                        </p>
                                    </div>
                                    <div style="font-size: 0.875rem; color: var(--muted-foreground);">
                                        Requested on ${req.date}
                                    </div>
                                </div>
                            </div>
                            
                            ${req.offers && req.offers.length > 0 ? `
                                <div style="padding: 1rem; border-top: 1px solid var(--border);">
                                    <h4 style="font-weight: 600; margin-bottom: 0.75rem; font-size: 0.875rem;">
                                        Offers Received (${req.offers.filter(o => o.status === 'Pending').length} Pending)
                                    </h4>
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        ${req.offers.map(offer => `
                                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: var(--radius); background-color: var(--muted); flex-wrap: wrap; gap: 1rem;">
                                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                    <div class="avatar" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; overflow: hidden; background-color: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                                        ${offer.donorAvatarUrl ? `<img src="${offer.donorAvatarUrl}" alt="${offer.donorName}" style="width: 100%; height: 100%; object-fit: cover;">` : offer.donorName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style="font-weight: 600; margin: 0;">${offer.donorName}</p>
                                                        <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">Blood Type: ${offer.donorBloodType}</p>
                                                    </div>
                                                </div>
                                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                                    ${offer.status === 'Pending' && req.status === 'Open' ? `
                                                        <button class="btn btn-primary btn-sm accept-offer-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">Accept</button>
                                                        <button class="btn btn-outline btn-sm decline-offer-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">Decline</button>
                                                    ` : ''}
                                                    ${offer.status === 'Accepted' ? `
                                                        <button class="btn btn-primary btn-sm">Chat</button>
                                                        <button class="btn btn-outline btn-sm">Contact</button>
                                                        <button class="btn btn-secondary btn-sm complete-donation-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">
                                                            <i class="fas fa-check"></i> Blood Collected
                                                        </button>
                                                    ` : ''}
                                                    ${offer.status === 'Declined' ? `
                                                        <span class="blood-type" style="background-color: var(--secondary); color: var(--secondary-foreground);">Declined</span>
                                                    ` : ''}
                                                    ${offer.status === 'Completed' ? `
                                                        <span class="blood-type" style="background-color: var(--primary);">Completed</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div style="padding: 1rem; border-top: 1px solid var(--border); text-align: center; color: var(--muted-foreground); font-size: 0.875rem;">
                                    <p>No offers received for this request yet.</p>
                                </div>
                            `}
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 4rem 1rem; color: var(--muted-foreground);">
                            <p style="margin-bottom: 1rem;">You haven't made any blood requests yet.</p>
                            <button class="btn btn-primary" id="create-first-request-btn">
                                <i class="fas fa-plus"></i> Create Your First Request
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    container.appendChild(recipientContent);
    
    // Add event listeners
    const newRequestBtn = document.getElementById('new-request-dashboard-btn');
    const createFirstBtn = document.getElementById('create-first-request-btn');
    
    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }
    if (createFirstBtn) {
        createFirstBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }
    
    // Add event listeners for offer actions
    document.querySelectorAll('.accept-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleOfferResponse(requestId, offerId, true);
        });
    });
    
    document.querySelectorAll('.decline-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleOfferResponse(requestId, offerId, false);
        });
    });
    
    document.querySelectorAll('.complete-donation-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleBloodCollected(requestId, offerId);
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showOpportunityDetails(opportunityId) {
    const opportunity = appState.donationOpportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;
    
    // Create and show opportunity details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2 class="modal-title">Donation Opportunity</h2>
                <button class="modal-close opportunity-close">&times;</button>
            </div>
            <div class="modal-body">
                <p style="color: var(--muted-foreground); margin-bottom: 1.5rem;">A patient nearby needs your help. Please review the details below.</p>
                
                <div style="display: grid; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Patient:</span>
                        <span style="font-weight: 600;">${opportunity.patientName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Blood Type:</span>
                        <span class="blood-type" style="background-color: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700;">${opportunity.bloodType}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Quantity:</span>
                        <span style="font-weight: 600;">${opportunity.quantity} ${opportunity.quantity > 1 ? 'units' : 'unit'}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Urgency:</span>
                        <span class="blood-type" style="background-color: var(--destructive); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700;">${opportunity.urgency}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Needed By:</span>
                        <span style="font-weight: 600;">${formatDate(opportunity.neededByDate)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Donation Center:</span>
                        <span style="font-weight: 600; text-align: right;">${opportunity.hospitalName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: var(--muted-foreground);">Address:</span>
                        <span style="text-align: right;">${opportunity.hospitalAddress}</span>
                    </div>
                    ${opportunity.details ? `
                        <div>
                            <span style="color: var(--muted-foreground); font-weight: 600;">Additional Details:</span>
                            <p style="margin: 0.5rem 0 0; padding: 0.75rem; background-color: var(--muted); border-radius: var(--radius);">${opportunity.details}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem; flex-wrap: wrap;">
                    <a href="tel:${opportunity.phone}" class="btn btn-outline" style="flex: 1; text-decoration: none; text-align: center;">
                        <i class="fas fa-phone"></i> Contact Recipient
                    </a>
                    <button class="btn btn-primary offer-donation-btn" data-opportunity-id="${opportunity.id}" style="flex: 1;">
                        <i class="fas fa-user-check"></i> Offer to Donate
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners
    const closeBtn = modal.querySelector('.opportunity-close');
    const offerBtn = modal.querySelector('.offer-donation-btn');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });
    
    offerBtn.addEventListener('click', () => {
        handleOfferDonation(opportunity);
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });
}

function handleOfferDonation(opportunity) {
    showNotification(`Your offer to help ${opportunity.patientName} has been sent. You will be notified when they respond.`);
    
    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: `Offered to donate to ${opportunity.patientName}`,
        time: 'Just now',
        icon: 'fas fa-heart'
    });
    
    updateDashboardActivity();
}

function handleOfferResponse(requestId, offerId, accepted) {
    appState.bloodRequests = appState.bloodRequests.map(req => {
        if (req.id === requestId) {
            const offerToUpdate = req.offers?.find(o => o.id === offerId);
            if (!offerToUpdate) return req;

            showNotification(
                `Offer ${accepted ? 'accepted' : 'declined'} from ${offerToUpdate.donorName}`,
                accepted ? 'success' : 'error'
            );
            
            const updatedOffers = req.offers?.map(offer => {
                if (offer.id === offerId) {
                    return { ...offer, status: accepted ? 'Accepted' : 'Declined' };
                }
                // if this offer is being accepted, decline other pending offers
                if(accepted && offer.status === 'Pending') {
                    return { ...offer, status: 'Declined'};
                }
                return offer;
            });
            
            const newRequestStatus = accepted ? 'Fulfilled' : req.status;

            return { ...req, offers: updatedOffers, status: newRequestStatus };
        }
        return req;
    });
    
    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: `${accepted ? 'Accepted' : 'Declined'} donation offer`,
        time: 'Just now',
        icon: accepted ? 'fas fa-check' : 'fas fa-times'
    });
    
    updateDashboardContent();
    updateDashboardActivity();
}

function handleBloodCollected(requestId, offerId) {
    appState.bloodRequests = appState.bloodRequests.map(req => {
        if (req.id === requestId) {
            const offerToComplete = req.offers?.find(o => o.id === offerId);
            if (!offerToComplete) return req;

            showNotification(`Thank you for confirming. ${offerToComplete.donorName}'s donation has been completed.`);

            const updatedOffers = req.offers?.map(offer => 
                offer.id === offerId ? { ...offer, status: 'Completed' } : offer
            );
            
            return { ...req, offers: updatedOffers, status: 'Completed' };
        }
        return req;
    });
    
    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: 'Blood donation completed',
        time: 'Just now',
        icon: 'fas fa-heart'
    });
    
    updateDashboardContent();
    updateDashboardActivity();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    return errors;
}

// Navigation Functions
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.navToggle.classList.toggle('active');
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('active');
    elements.navToggle.classList.remove('active');
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email') || document.getElementById('login-email').value,
        password: formData.get('password') || document.getElementById('login-password').value
    };
    
    const errors = validateForm(loginData, ['email', 'password']);
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }
    
    // Simulate login process
    setTimeout(() => {
        appState.currentUser = {
            id: Date.now(),
            email: loginData.email,
            name: loginData.email.split('@')[0]
        };
        
        hideModal(elements.loginModal);
        switchToDashboard();
        showNotification('Successfully logged in!');
        
        // Reset form
        event.target.reset();
    }, 500);
}

function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const signupData = {
        name: formData.get('name') || document.getElementById('signup-name').value,
        email: formData.get('email') || document.getElementById('signup-email').value,
        password: formData.get('password') || document.getElementById('signup-password').value,
        bloodType: formData.get('bloodType') || document.getElementById('signup-blood-type').value,
        location: formData.get('location') || document.getElementById('signup-location').value
    };
    
    const errors = validateForm(signupData, ['name', 'email', 'password', 'bloodType', 'location']);
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }
    
    // Simulate signup process
    setTimeout(() => {
        const newUser = {
            id: Date.now(),
            ...signupData
        };
        
        appState.users.push(newUser);
        appState.currentUser = newUser;
        
        hideModal(elements.signupModal);
        switchToDashboard();
        showNotification('Account created successfully!');
        
        // Reset form
        event.target.reset();
    }, 500);
}

function handleLogout() {
    appState.currentUser = null;
    appState.isLoggedIn = false;
    switchToLandingPage();
    showNotification('Successfully logged out!');
}

// Blood Request Functions
function handleBloodRequest(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
        bloodType: formData.get('bloodType') || document.getElementById('request-blood-type').value,
        location: formData.get('location') || document.getElementById('request-location').value,
        urgency: formData.get('urgency') || document.getElementById('request-urgency').value,
        details: formData.get('details') || document.getElementById('request-details').value
    };
    
    const errors = validateForm(requestData, ['bloodType', 'location', 'urgency']);
    
    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }
    
    // Create new blood request
    const newRequest = {
        id: Date.now(),
        ...requestData,
        time: 'Just now',
        userId: appState.currentUser?.id || null
    };
    
    appState.bloodRequests.unshift(newRequest);
    
    // Add to activity
    appState.activities.unshift({
        id: Date.now(),
        text: 'Blood request posted',
        time: 'Just now',
        icon: 'fas fa-tint'
    });
    
    hideModal(elements.bloodRequestModal);
    updateLiveRequests();
    updateDashboardActivity();
    showNotification('Blood request posted successfully!');
    
    // Reset form
    event.target.reset();
}

function findDonors() {
    if (!appState.isLoggedIn) {
        showModal(elements.loginModal);
        return;
    }
    
    // Simulate finding donors
    showNotification('Searching for compatible donors in your area...');
    
    setTimeout(() => {
        const donorCount = Math.floor(Math.random() * 10) + 1;
        showNotification(`Found ${donorCount} compatible donors nearby!`);
        
        // Add to activity
        appState.activities.unshift({
            id: Date.now(),
            text: `Found ${donorCount} compatible donors`,
            time: 'Just now',
            icon: 'fas fa-search'
        });
        
        updateDashboardActivity();
    }, 2000);
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Authentication buttons
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => showModal(elements.loginModal));
    }
    
    if (elements.signupBtn) {
        elements.signupBtn.addEventListener('click', () => showModal(elements.signupModal));
    }
    
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Hero buttons
    if (elements.requestBloodBtn) {
        elements.requestBloodBtn.addEventListener('click', () => {
            if (appState.isLoggedIn) {
                showModal(elements.bloodRequestModal);
            } else {
                showModal(elements.loginModal);
            }
        });
    }
    
    if (elements.donateBloodBtn) {
        elements.donateBloodBtn.addEventListener('click', () => showModal(elements.signupModal));
    }
    
    if (elements.joinBtn) {
        elements.joinBtn.addEventListener('click', () => showModal(elements.signupModal));
    }
    
    // Dashboard buttons
    if (elements.newRequestBtn) {
        elements.newRequestBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }
    
    if (elements.findDonorsBtn) {
        elements.findDonorsBtn.addEventListener('click', findDonors);
    }
    
    // Modal close buttons
    if (elements.loginClose) {
        elements.loginClose.addEventListener('click', () => hideModal(elements.loginModal));
    }
    
    if (elements.signupClose) {
        elements.signupClose.addEventListener('click', () => hideModal(elements.signupModal));
    }
    
    if (elements.bloodRequestClose) {
        elements.bloodRequestClose.addEventListener('click', () => hideModal(elements.bloodRequestModal));
    }
    
    // Close modals when clicking outside
    [elements.loginModal, elements.signupModal, elements.bloodRequestModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    hideModal(modal);
                }
            });
        }
    });
    
    // Form submissions
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }
    
    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', handleSignup);
    }
    
    if (elements.bloodRequestForm) {
        elements.bloodRequestForm.addEventListener('submit', handleBloodRequest);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Close any open modal
            [elements.loginModal, elements.signupModal, elements.bloodRequestModal].forEach(modal => {
                if (modal && modal.style.display === 'block') {
                    hideModal(modal);
                }
            });
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation Functions
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Live Updates
function startLiveUpdates() {
    // Update request times every minute
    setInterval(() => {
        appState.bloodRequests.forEach(request => {
            const timeMatch = request.time.match(/(\d+)([mh])/);
            if (timeMatch) {
                const value = parseInt(timeMatch[1]);
                const unit = timeMatch[2];
                
                if (unit === 'm' && value < 59) {
                    request.time = `${value + 1}m ago`;
                } else if (unit === 'm' && value >= 59) {
                    request.time = '1h ago';
                } else if (unit === 'h') {
                    request.time = `${value + 1}h ago`;
                }
            }
        });
        
        updateLiveRequests();
    }, 60000); // Update every minute
    
    // Add new random requests occasionally
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal'];
            const urgencies = ['immediate', 'urgent', 'normal'];
            
            const newRequest = {
                id: Date.now(),
                bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                time: 'Just now',
                urgency: urgencies[Math.floor(Math.random() * urgencies.length)]
            };
            
            appState.bloodRequests.unshift(newRequest);
            
            // Keep only last 10 requests
            if (appState.bloodRequests.length > 10) {
                appState.bloodRequests = appState.bloodRequests.slice(0, 10);
            }
            
            updateLiveRequests();
        }
    }, 30000); // Check every 30 seconds
}

// Initialize Application
function initializeApp() {
    console.log('Blood Donation Studio - Initializing...');
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize animations
    animateOnScroll();
    
    // Start live updates
    startLiveUpdates();
    
    // Update initial content
    updateLiveRequests();
    
    // Add CSS for modal slide out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-50px);
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Blood Donation Studio - Ready!');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        showModal,
        hideModal,
        showNotification,
        handleLogin,
        handleSignup,
        handleBloodRequest
    };
}

// Application State
let appState = {
    isLoggedIn: false,
    currentUser: null,
    currentView: 'dashboard',
    donationOpportunities: [
        {
            id: 1,
            patientName: "Jahanara Begum",
            bloodType: "O+",
            urgency: "Urgent",
            location: "Mirpur, Dhaka",
            distance: "5 km",
            hospital: "Dhaka Medical College",
            contactNumber: "+8801712345678",
            needed: "2 units",
            deadline: "Within 6 hours"
        },
        {
            id: 2,
            patientName: "Kamal Hossain",
            bloodType: "A+",
            urgency: "Medium",
            location: "Uttara, Dhaka",
            distance: "12 km",
            hospital: "United Hospital",
            contactNumber: "+8801887654321",
            needed: "1 unit",
            deadline: "Within 24 hours"
        }
    ],
    notifications: [
        {
            id: 1,
            type: "donation_accepted",
            message: "Your donation offer to Raihan Chowdhury was accepted!",
            time: "2h ago",
            read: false
        }
    ]
};

// DOM Elements
let elements = {};

// Navigation functions
function switchToView(viewName) {
    // Hide all views
    const views = ['dashboard', 'notifications-page', 'leaderboard-page'];
    views.forEach(view => {
        const element = document.getElementById(view);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Show selected view
    const targetView = document.getElementById(viewName);
    if (targetView) {
        targetView.style.display = 'block';
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    const activeLink = document.querySelector(`[href="#${viewName.replace('-page', '')}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function switchToLandingPage() {
    switchToView('dashboard');
}

function switchToNotifications() {
    switchToView('notifications-page');
}

function switchToLeaderboard() {
    switchToView('leaderboard-page');
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('RoktoSheba - Initializing...');

    // Cache DOM elements
    elements = {
        loginModal: document.getElementById('login-modal'),
        signupModal: document.getElementById('signup-modal'),
        bloodRequestModal: document.getElementById('blood-request-modal')
    };

    // Navigation event listeners
    document.addEventListener('click', function(e) {
        if (e.target.matches('.nav-link')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');

            if (href === '#home') {
                switchToLandingPage();
            } else if (href === '#notifications') {
                switchToNotifications();
            } else if (href === '#leaderboard') {
                switchToLeaderboard();
            } else if (href === '#messages') {
                // Handle messages navigation
                switchToView('dashboard');
            } else if (href === '#history') {
                // Handle history navigation
                switchToView('dashboard');
            }
        }
    });

    // Modal close handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('.modal-close') || e.target.matches('.modal')) {
            if (e.target.matches('.modal')) {
                // Only close if clicking the backdrop
                if (e.target === e.currentTarget) {
                    e.target.style.display = 'none';
                }
            } else {
                // Close button clicked
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            }
        }
    });

    console.log('RoktoSheba - Ready!');
});

// DOM Elements
const elements = {
    // Navigation
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    loginBtn: document.getElementById('login-btn'),
    signupBtn: document.getElementById('signup-btn'),
    logoutBtn: document.getElementById('logout-btn'),

    // Main content areas
    landingPage: document.getElementById('landing-page'),
    dashboard: document.getElementById('dashboard'),
    notificationsPage: document.getElementById('notifications-page'),
    mainContent: document.getElementById('main-content'),

    // Hero buttons
    requestBloodBtn: document.getElementById('request-blood-btn'),
    donateBloodBtn: document.getElementById('donate-blood-btn'),
    joinBtn: document.getElementById('join-btn'),

    // Dashboard buttons
    newRequestBtn: document.getElementById('new-request-btn'),
    findDonorsBtn: document.getElementById('find-donors-btn'),

    // Modals
    loginModal: document.getElementById('login-modal'),
    signupModal: document.getElementById('signup-modal'),
    bloodRequestModal: document.getElementById('blood-request-modal'),

    // Modal close buttons
    loginClose: document.getElementById('login-close'),
    signupClose: document.getElementById('signup-close'),
    bloodRequestClose: document.getElementById('blood-request-close'),

    // Forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    bloodRequestForm: document.getElementById('blood-request-form')
};

// Utility Functions
function showModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Add animation class
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideIn 0.3s ease-out';
}

function hideModal(modal) {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.animation = 'modalSlideOut 0.3s ease-out';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary)' : 'var(--destructive)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function updateLiveRequests() {
    const requestList = document.querySelector('.request-list');
    if (!requestList) return;

    requestList.innerHTML = appState.bloodRequests.map(request => `
        <div class="request-item">
            <div class="request-info">
                <i class="fas fa-tint request-icon"></i>
                <div class="request-details">
                    <p class="request-text">Needs <span class="blood-type blood-${request.bloodType.toLowerCase().replace('+', '-positive').replace('-', '-negative')}">${request.bloodType}</span></p>
                    <p class="request-location">in ${request.location}</p>
                </div>
            </div>
            <p class="request-time">${request.time}</p>
        </div>
    `).join('');
}

function updateDashboardActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    activityList.innerHTML = appState.activities.map(activity => `
        <div class="activity-item">
            <i class="${activity.icon} activity-icon"></i>
            <div class="activity-details">
                <p class="activity-text">${activity.text}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        </div>
    `).join('');
}

function switchToLandingPage() {
    const dashboard = getElement('dashboard');
    const notificationsPage = getElement('notifications-page');

    if (dashboard) dashboard.style.display = 'none';
    if (notificationsPage) notificationsPage.style.display = 'none';

    appState.isLoggedIn = false;
    appState.currentUser = null;

    // Update nav active state
    updateNavActiveState('home');
}

function switchToDashboard() {
    const dashboard = getElement('dashboard');
    const notificationsPage = getElement('notifications-page');
    const leaderboardPage = getElement('leaderboard-page');

    if (dashboard) {
        dashboard.style.display = 'block';
    } else {
        console.warn('Dashboard element not found');
    }

    if (notificationsPage) {
        notificationsPage.style.display = 'none';
    }

    if (leaderboardPage) {
        leaderboardPage.style.display = 'none';
    }

    appState.isLoggedIn = true;

    // Update dashboard content based on user mode
    updateDashboardContent();
    updateDashboardActivity();
}

function switchToNotifications() {
    const dashboard = getElement('dashboard');
    const notificationsPage = getElement('notifications-page');
    const leaderboardPage = getElement('leaderboard-page');

    if (dashboard) {
        dashboard.style.display = 'none';
    }

    if (leaderboardPage) {
        leaderboardPage.style.display = 'none';
    }

    if (notificationsPage) {
        notificationsPage.style.display = 'block';
    } else {
        console.warn('Notifications page element not found');
    }
}

function switchToLeaderboard() {
    const dashboard = getElement('dashboard');
    const notificationsPage = getElement('notifications-page');
    const leaderboardPage = getElement('leaderboard-page');

    if (dashboard) {
        dashboard.style.display = 'none';
    }

    if (notificationsPage) {
        notificationsPage.style.display = 'none';
    }

    if (leaderboardPage) {
        leaderboardPage.style.display = 'block';
    } else {
        console.warn('Leaderboard page element not found');
    }
}

function updateNavActiveState(activeTab) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to current tab
    const activeLink = document.querySelector(`a[href="#${activeTab}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function updateDashboardContent() {
    const dashboardContainer = document.querySelector('.dashboard .container');
    if (!dashboardContainer) return;

    // Clear existing content except header
    const header = dashboardContainer.querySelector('.dashboard-header');
    dashboardContainer.innerHTML = '';
    if (header) {
        dashboardContainer.appendChild(header);
    }

    // Add mode toggle
    const modeToggle = document.createElement('div');
    modeToggle.className = 'mode-toggle';
    modeToggle.innerHTML = `
        <div class="card" style="margin-bottom: 2rem;">
            <div class="card-content" style="padding: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h3 style="margin: 0; font-size: 1.125rem;">Current Mode: <span style="color: var(--primary); font-weight: 700;">${appState.userMode === 'donor' ? 'Donor' : 'Recipient'}</span></h3>
                        <p style="margin: 0.5rem 0 0; color: var(--muted-foreground); font-size: 0.875rem;">
                            ${appState.userMode === 'donor' ? 'You are viewing donation opportunities in your area' : 'You are managing your blood requests'}
                        </p>
                    </div>
                    <button class="btn btn-outline" id="toggle-mode-btn">
                        Switch to ${appState.userMode === 'donor' ? 'Recipient' : 'Donor'} Mode
                    </button>
                </div>
            </div>
        </div>
    `;
    dashboardContainer.appendChild(modeToggle);

    // Add mode-specific content
    if (appState.userMode === 'donor') {
        renderDonorDashboard(dashboardContainer);
    } else {
        renderRecipientDashboard(dashboardContainer);
    }

    // Add event listener for mode toggle
    const toggleBtn = document.getElementById('toggle-mode-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleUserMode);
    }
}

function toggleUserMode() {
    appState.userMode = appState.userMode === 'donor' ? 'recipient' : 'donor';
    updateDashboardContent();
    showNotification(`Switched to ${appState.userMode} mode`);
}

function renderDonorDashboard(container) {
    const donorContent = document.createElement('div');
    donorContent.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Nearby Blood Requests</h3>
                <p style="color: var(--muted-foreground); margin: 0.5rem 0 0;">Help patients in need by donating blood</p>
            </div>
            <div class="card-content">
                <div class="opportunities-list">
                    ${appState.donationOpportunities.map(opp => `
                        <div class="opportunity-card" style="border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                                <div style="flex: 1; min-width: 250px;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                                        <h4 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${opp.patientName}</h4>
                                        <span class="blood-type blood-${opp.urgency.toLowerCase()}" style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700; background-color: var(--destructive); color: white;">${opp.urgency}</span>
                                    </div>
                                    <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: var(--muted-foreground);">
                                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                                            <i class="fas fa-tint" style="color: var(--primary);"></i>
                                            Needs: <strong>${opp.bloodType}</strong> (${opp.quantity} ${opp.quantity > 1 ? 'units' : 'unit'})
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                                            <i class="fas fa-map-marker-alt"></i>
                                            ${opp.location} (${opp.distance})
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-primary view-details-btn" data-opportunity-id="${opp.id}">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    container.appendChild(donorContent);

    // Add event listeners for view details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const oppId = e.target.closest('.view-details-btn').dataset.opportunityId;
            showOpportunityDetails(oppId);
        });
    });
}

function renderRecipientDashboard(container) {
    const recipientContent = document.createElement('div');
    recipientContent.innerHTML = `
        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h3 class="card-title">My Blood Requests</h3>
                    <p style="color: var(--muted-foreground); margin: 0.5rem 0 0;">
                        ${appState.bloodRequests.length > 0 ? 'Manage your blood donation requests and offers' : 'You have no active blood requests.'}
                    </p>
                </div>
                <button class="btn btn-primary" id="new-request-dashboard-btn">
                    <i class="fas fa-plus"></i> New Request
                </button>
            </div>
            <div class="card-content">
                <div class="requests-list">
                    ${appState.bloodRequests.length > 0 ? appState.bloodRequests.map(req => `
                        <div class="request-card" style="border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1.5rem; overflow: hidden;">
                            <div style="padding: 1rem; background-color: var(--card);">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
                                    <div>
                                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                            <span style="font-size: 1.125rem; font-weight: 600;">Request for ${req.bloodType}</span>
                                            <span class="blood-type" style="padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700; 
                                                background-color: ${req.status === 'Open' ? 'var(--destructive)' : req.status === 'Completed' ? 'var(--primary)' : 'var(--secondary)'}; 
                                                color: white;">${req.status}</span>
                                        </div>
                                        <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">
                                            ${req.quantity} ${req.quantity > 1 ? 'units' : 'unit'} needed at ${req.location} by <strong>${formatDate(req.neededByDate)}</strong>
                                        </p>
                                    </div>
                                    <div style="font-size: 0.875rem; color: var(--muted-foreground);">
                                        Requested on ${req.date}
                                    </div>
                                </div>
                            </div>

                            ${req.offers && req.offers.length > 0 ? `
                                <div style="padding: 1rem; border-top: 1px solid var(--border);">
                                    <h4 style="font-weight: 600; margin-bottom: 0.75rem; font-size: 0.875rem;">
                                        Offers Received (${req.offers.filter(o => o.status === 'Pending').length} Pending)
                                    </h4>
                                    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                        ${req.offers.map(offer => `
                                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-radius: var(--radius); background-color: var(--muted); flex-wrap: wrap; gap: 1rem;">
                                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                                    <div class="avatar" style="width: 2.5rem; height: 2.5rem; border-radius: 50%; overflow: hidden; background-color: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                                        ${offer.donorAvatarUrl ? `<img src="${offer.donorAvatarUrl}" alt="${offer.donorName}" style="width: 100%; height: 100%; object-fit: cover;">` : offer.donorName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style="font-weight: 600; margin: 0;">${offer.donorName}</p>
                                                        <p style="font-size: 0.875rem; color: var(--muted-foreground); margin: 0;">Blood Type: ${offer.donorBloodType}</p>
                                                    </div>
                                                </div>
                                                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                                                    ${offer.status === 'Pending' && req.status === 'Open' ? `
                                                        <button class="btn btn-primary btn-sm accept-offer-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">Accept</button>
                                                        <button class="btn btn-outline btn-sm decline-offer-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">Decline</button>
                                                    ` : ''}
                                                    ${offer.status === 'Accepted' ? `
                                                        <button class="btn btn-primary btn-sm">Chat</button>
                                                        <button class="btn btn-outline btn-sm">Contact</button>
                                                        <button class="btn btn-secondary btn-sm complete-donation-btn" data-request-id="${req.id}" data-offer-id="${offer.id}">
                                                            <i class="fas fa-check"></i> Blood Collected
                                                        </button>
                                                    ` : ''}
                                                    ${offer.status === 'Declined' ? `
                                                        <span class="blood-type" style="background-color: var(--secondary); color: var(--secondary-foreground);">Declined</span>
                                                    ` : ''}
                                                    ${offer.status === 'Completed' ? `
                                                        <span class="blood-type" style="background-color: var(--primary);">Completed</span>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : `
                                <div style="padding: 1rem; border-top: 1px solid var(--border); text-align: center; color: var(--muted-foreground); font-size: 0.875rem;">
                                    <p>No offers received for this request yet.</p>
                                </div>
                            `}
                        </div>
                    `).join('') : `
                        <div style="text-align: center; padding: 4rem 1rem; color: var(--muted-foreground);">
                            <p style="margin-bottom: 1rem;">You haven't made any blood requests yet.</p>
                            <button class="btn btn-primary" id="create-first-request-btn">
                                <i class="fas fa-plus"></i> Create Your First Request
                            </button>
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;
    container.appendChild(recipientContent);

    // Add event listeners
    const newRequestBtn = document.getElementById('new-request-dashboard-btn');
    const createFirstBtn = document.getElementById('create-first-request-btn');

    if (newRequestBtn) {
        newRequestBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }
    if (createFirstBtn) {
        createFirstBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }

    // Add event listeners for offer actions
    document.querySelectorAll('.accept-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleOfferResponse(requestId, offerId, true);
        });
    });

    document.querySelectorAll('.decline-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleOfferResponse(requestId, offerId, false);
        });
    });

    document.querySelectorAll('.complete-donation-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.target.dataset.requestId;
            const offerId = e.target.dataset.offerId;
            handleBloodCollected(requestId, offerId);
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function showOpportunityDetails(opportunityId) {
    const opportunity = appState.donationOpportunities.find(opp => opp.id === opportunityId);
    if (!opportunity) return;

    // Create and show opportunity details modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 650px; background: white; color: #333;">
            <div style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600; color: #1f2937;">Donation Opportunity</h2>
                <button class="modal-close opportunity-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; padding: 0;">&times;</button>
            </div>
            <div style="padding: 1.5rem;">
                <p style="color: #6b7280; margin-bottom: 1.5rem; font-size: 0.875rem;">A patient nearby needs your help. Please review the details below.</p>

                <div style="display: grid; gap: 1rem; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Patient:</span>
                        <span style="font-weight: 600; color: #1f2937;">Jahanara Begum</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Blood Type:</span>
                        <span style="background-color: #dc2626; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700;">O+</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Quantity:</span>
                        <span style="font-weight: 600; color: #1f2937;">2 units</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Urgency:</span>
                        <span style="background-color: #dc2626; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 700;">Urgent</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Needed By:</span>
                        <span style="font-weight: 600; color: #1f2937;">July 28th, 2024</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Donation Center:</span>
                        <span style="font-weight: 600; color: #1f2937; text-align: right;">Dhaka Medical College</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6b7280; font-size: 0.875rem;">Address:</span>
                        <span style="color: #1f2937; text-align: right;">Dhaka Medical College Hospital, Dhaka 1000</span>
                    </div>
                    <div style="margin-top: 0.5rem;">
                        <span style="color: #6b7280; font-size: 0.875rem; display: block; margin-bottom: 0.5rem;">Additional Details:</span>
                        <div style="padding: 0.75rem; background-color: #f3f4f6; border-radius: 0.5rem; color: #1f2937; font-size: 0.875rem;">
                            Patient is critical and needs blood urgently for surgery.
                        </div>
                    </div>
                </div>

                <!-- Map placeholder -->
                <div style="width: 100%; height: 200px; background-color: #f3f4f6; border-radius: 0.5rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; color: #6b7280; font-size: 0.875rem; border: 1px solid #e5e7eb;">
                    <div style="text-align: center;">
                        <div style="margin-bottom: 0.5rem;">📍</div>
                        <div>Location Map</div>
                        <div style="font-size: 0.75rem; margin-top: 0.25rem;">Dhaka Medical College Hospital</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                    <button style="flex: 1; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #374151; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-decoration: none;">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button class="offer-donation-btn" data-opportunity-id="${opportunity.id}" style="flex: 1; padding: 0.75rem 1rem; border: none; border-radius: 0.5rem; background: #dc2626; color: white; font-size: 0.875rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-hand-holding-medical"></i> Offer
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Add event listeners
    const closeBtn = modal.querySelector('.opportunity-close');
    const offerBtn = modal.querySelector('.offer-donation-btn');

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            documentbody.removeChild(modal);
            document.body.style.overflow = 'auto';
        }
    });

    offerBtn.addEventListener('click', () => {
        handleOfferDonation(opportunity);
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';    });
}

function handleOfferDonation(opportunity) {
    showNotification(`Your offer to help ${opportunity.patientName} has been sent. You will be notified when they respond.`);

    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: `Offered to donate to ${opportunity.patientName}`,
        time: 'Just now',
        icon: 'fas fa-heart'
    });

    updateDashboardActivity();
}

function handleOfferResponse(requestId, offerId, accepted) {
    appState.bloodRequests = appState.bloodRequests.map(req => {
        if (req.id === requestId) {
            const offerToUpdate = req.offers?.find(o => o.id === offerId);
            if (!offerToUpdate) return req;

            showNotification(
                `Offer ${accepted ? 'accepted' : 'declined'} from ${offerToUpdate.donorName}`,
                accepted ? 'success' : 'error'
            );

            const updatedOffers = req.offers?.map(offer => {
                if (offer.id === offerId) {
                    return { ...offer, status: accepted ? 'Accepted' : 'Declined' };
                }
                // if this offer is being accepted, decline other pending offers
                if(accepted && offer.status === 'Pending') {
                    return { ...offer, status: 'Declined'};
                }
                return offer;
            });

            const newRequestStatus = accepted ? 'Fulfilled' : req.status;

            return { ...req, offers: updatedOffers, status: newRequestStatus };
        }
        return req;
    });

    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: `${accepted ? 'Accepted' : 'Declined'} donation offer`,
        time: 'Just now',
        icon: accepted ? 'fas fa-check' : 'fas fa-times'
    });

    updateDashboardContent();
    updateDashboardActivity();
}

function handleBloodCollected(requestId, offerId) {
    appState.bloodRequests = appState.bloodRequests.map(req => {
        if (req.id === requestId) {
            const offerToComplete = req.offers?.find(o => o.id === offerId);
            if (!offerToComplete) return req;

            showNotification(`Thank you for confirming. ${offerToComplete.donorName}'s donation has been completed.`);

            const updatedOffers = req.offers?.map(offer => 
                offer.id === offerId ? { ...offer, status: 'Completed' } : offer
            );

            return { ...req, offers: updatedOffers, status: 'Completed' };
        }
        return req;
    });

    // Add to activities
    appState.activities.unshift({
        id: Date.now(),
        text: 'Blood donation completed',
        time: 'Just now',
        icon: 'fas fa-heart'
    });

    updateDashboardContent();
    updateDashboardActivity();
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData, requiredFields) {
    const errors = [];

    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`);
        }
    });

    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    if (formData.password && formData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    return errors;
}

// Navigation Functions
function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
    elements.navToggle.classList.toggle('active');
}

function closeMobileMenu() {
    elements.navMenu.classList.remove('active');
    elements.navToggle.classList.remove('active');
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email') || document.getElementById('login-email').value,
        password: formData.get('password') || document.getElementById('login-password').value
    };

    const errors = validateForm(loginData, ['email', 'password']);

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }

    // Simulate login process
    setTimeout(() => {
        appState.currentUser = {
            id: Date.now(),
            email: loginData.email,
            name: loginData.email.split('@')[0]
        };

        hideModal(elements.loginModal);
        switchToDashboard();
        showNotification('Successfully logged in!');

        // Reset form
        event.target.reset();
    }, 500);
}

function handleSignup(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const signupData = {
        name: formData.get('name') || document.getElementById('signup-name').value,
        email: formData.get('email') || document.getElementById('signup-email').value,
        password: formData.get('password') || document.getElementById('signup-password').value,
        bloodType: formData.get('bloodType') || document.getElementById('signup-blood-type').value,
        location: formData.get('location') || document.getElementById('signup-location').value
    };

    const errors = validateForm(signupData, ['name', 'email', 'password', 'bloodType', 'location']);

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }

    // Simulate signup process
    setTimeout(() => {
        const newUser = {
            id: Date.now(),
            ...signupData
        };

        appState.users.push(newUser);
        appState.currentUser = newUser;

        hideModal(elements.signupModal);
        switchToDashboard();
        showNotification('Account created successfully!');

        // Reset form
        event.target.reset();
    }, 500);
}

function handleLogout() {
    appState.currentUser = null;
    appState.isLoggedIn = false;
    switchToLandingPage();
    showNotification('Successfully logged out!');
}

// Blood Request Functions
function handleBloodRequest(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const requestData = {
        bloodType: formData.get('bloodType') || document.getElementById('request-blood-type').value,
        location: formData.get('location') || document.getElementById('request-location').value,
        urgency: formData.get('urgency') || document.getElementById('request-urgency').value,
        details: formData.get('details') || document.getElementById('request-details').value
    };

    const errors = validateForm(requestData, ['bloodType', 'location', 'urgency']);

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return;
    }

    // Create new blood request
    const newRequest = {
        id: Date.now().toString(),
        ...requestData,
        time: 'Just now',
        quantity: 1,
        status: 'Open',
        date: new Date().toISOString().split('T')[0],
        neededByDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        offers: [],
        userId: appState.currentUser?.id || null
    };

    appState.bloodRequests.unshift(newRequest);

    // Add to activity
    appState.activities.unshift({
        id: Date.now(),
        text: 'Blood request posted',
        time: 'Just now',
        icon: 'fas fa-tint'
    });

    hideModal(elements.bloodRequestModal);
    updateLiveRequests();
    updateDashboardActivity();
    showNotification('Blood request posted successfully!');

    // Reset form
    event.target.reset();
}

function findDonors() {
    if (!appState.isLoggedIn) {
        showModal(elements.loginModal);
        return;
    }

    // Simulate finding donors
    showNotification('Searching for compatible donors in your area...');

    setTimeout(() => {
        const donorCount = Math.floor(Math.random() * 10) + 1;
        showNotification(`Found ${donorCount} compatible donors nearby!`);

        // Add to activity
        appState.activities.unshift({
            id: Date.now(),
            text: `Found ${donorCount} compatible donors`,
            time: 'Just now',
            icon: 'fas fa-search'
        });

        updateDashboardActivity();
    }, 2000);
}

// Event Listeners
function initializeEventListeners() {
    // Navigation
    if (elements.navToggle) {
        elements.navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links and handle navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();

            const href = link.getAttribute('href');

            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to clicked link
            link.classList.add('active');

            if (href === '#home') {
                switchToDashboard(); // Always show dashboard for home
             } else if (href === '#notifications') {
                switchToNotifications();
            } else if (href === '#leaderboard') {
                switchToLeaderboard();
            } else if (href === '#messages') {
                // Add messages page functionality here
                showNotification('Messages feature coming soon!');
            } else if (href === '#history') {
                // Add history page functionality here
                showNotification('History feature coming soon!');
            }
        });
    });

    // Authentication buttons
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => showModal(elements.loginModal));
    }

    if (elements.signupBtn) {
        elements.signupBtn.addEventListener('click', () => showModal(elements.signupModal));
    }

    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }

    // Hero buttons
    if (elements.requestBloodBtn) {
        elements.requestBloodBtn.addEventListener('click', () => {
            if (appState.isLoggedIn) {
                showModal(elements.bloodRequestModal);
            } else {
                showModal(elements.loginModal);
            }
        });
    }

    if (elements.donateBloodBtn) {
        elements.donateBloodBtn.addEventListener('click', () => showModal(elements.signupModal));
    }

    if (elements.joinBtn) {
        elements.joinBtn.addEventListener('click', () => showModal(elements.signupModal));
    }

    // Dashboard buttons
    if (elements.newRequestBtn) {
        elements.newRequestBtn.addEventListener('click', () => showModal(elements.bloodRequestModal));
    }

    if (elements.findDonorsBtn) {
        elements.findDonorsBtn.addEventListener('click', findDonors);
    }

    // Modal close buttons
    if (elements.loginClose) {
        elements.loginClose.addEventListener('click', () => hideModal(elements.loginModal));
    }

    if (elements.signupClose) {
        elements.signupClose.addEventListener('click', () => hideModal(elements.signupModal));
    }

    if (elements.bloodRequestClose) {
        elements.bloodRequestClose.addEventListener('click', () => hideModal(elements.bloodRequestModal));
    }

    // Close modals when clicking outside
    [elements.loginModal, elements.signupModal, elements.bloodRequestModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    hideModal(modal);
                }
            });
        }
    });

    // Form submissions
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }

    if (elements.signupForm) {
        elements.signupForm.addEventListener('submit', handleSignup);
    }

    if (elements.bloodRequestForm) {
        elements.bloodRequestForm.addEventListener('submit', handleBloodRequest);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Close any open modal
            [elements.loginModal, elements.signupModal, elements.bloodRequestModal].forEach(modal => {
                if (modal && modal.style.display === 'block') {
                    hideModal(modal);
                }
            });
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation Functions
function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .testimonial-card, .stat-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Live Updates
function startLiveUpdates() {
    // Update request times every minute
    setInterval(() => {
        appState.bloodRequests.forEach(request => {
            if (request && request.time && typeof request.time === 'string' && request.time.includes('ago')) {
                try {
                    const timeMatch = request.time.match(/(\d+)([mh])\s+ago/);
                    if (timeMatch && timeMatch.length >= 3) {
                        const value = parseInt(timeMatch[1]);
                        const unit = timeMatch[2];

                        if (!isNaN(value)) {
                            if (unit === 'm' && value < 59) {
                                request.time = `${value + 1}m ago`;
                            } else if (unit === 'm' && value >= 59) {
                                request.time = '1h ago';
                            } else if (unit === 'h') {
                                request.time = `${value + 1}h ago`;
                            }
                        }
                    }
                } catch (error) {
                    console.warn('Error updating time for request:', request.id || 'unknown', error);
                }
            }
        });

        updateLiveRequests();
    }, 60000); // Update every minute

    // Add new random requests occasionally
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal'];
            const urgencies = ['immediate', 'urgent', 'normal'];

            const newRequest = {
                id: Date.now().toString(),
                bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                time: 'Just now',
                urgency: urgencies[Math.floor(Math.random() * urgencies.length)]
            };

            appState.bloodRequests.unshift(newRequest);

            // Keep only last 10 requests
            if (appState.bloodRequests.length > 10) {
                appState.bloodRequests = appState.bloodRequests.slice(0, 10);
            }

            updateLiveRequests();
        }
    }, 30000); // Check every 30 seconds
}

// Initialize Application
function initializeApp() {
    console.log('RoktoSheba - Initializing...');

    // Set default state for logged in user
    appState.isLoggedIn = true;
    appState.currentUser = {
        id: 'user_1',
        name: 'Fahim Ahmed',
        email: 'fahim@example.com',
        bloodType: 'A+'
    };

    // Initialize event listeners
    initializeEventListeners();

    // Initialize animations
    animateOnScroll();

    // Start live updates
    startLiveUpdates();

    // Update initial content
    updateLiveRequests();

    // Show dashboard by default
    switchToDashboard();

    // Set home tab as active
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }

    // Add CSS for modal slide out animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideOut {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-50px);
            }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    `;
    document.head.appendChild(style);

    console.log('RoktoSheba - Ready!');
}

function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        showModal,
        hideModal,
        showNotification,
        handleLogin,
        handleSignup,
        handleBloodRequest
    };
}

// 
//
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Navigation functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get target page ID from href
            const target = this.getAttribute('href').substring(1);
            
            // Show the corresponding page with smooth transition
            showPage(target);
        });
    });
    
    // Function to show a specific page
    function showPage(pageId) {
        // Map page IDs to section IDs
        const pageMap = {
            'home': 'dashboard',
            'messages': 'messages-page',
            'notifications': 'notifications-page',
            'history': 'history-page',
            'leaderboard': 'leaderboard-page'
        };
        
        const targetSectionId = pageMap[pageId] || 'dashboard';
        
        // Hide all pages first
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target page
        const targetSection = document.getElementById(targetSectionId);
        if (targetSection) {
            // Delay adding active class to allow for transition
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 10);
        }
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.nav-theme-toggle');
    themeToggle.addEventListener('click', function() {
        const icon = this.querySelector('i');
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
    
    // View Details button functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.request-card');
            const name = card.querySelector('.request-name').textContent;
            const bloodType = card.querySelector('.request-detail:nth-child(1) span').textContent;
            const location = card.querySelector('.request-detail:nth-child(2) span').textContent;
            
            alert(`Request Details:\n\nName: ${name}\n${bloodType}\n${location}\n\nWould you like to help?`);
        });
    });
    
    // Notification action button functionality
    document.querySelectorAll('.notification-action').forEach(button => {
        button.addEventListener('click', function() {
            const notification = this.closest('.notification-item');
            const text = notification.querySelector('.notification-text').textContent;
            
            alert(`Notification Details:\n\n${text}`);
        });
    });
});

// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const pageSections = document.querySelectorAll('.page-section');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Navigation functionality - fixed tab switching
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target page from data attribute
            const targetPage = this.getAttribute('data-page');
            
            // Update active navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Show the corresponding page with smooth transition
            showPage(targetPage);
        });
    });
    
    // Function to show a specific page
    function showPage(pageId) {
        // Hide all pages first
        pageSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target page
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            // Add active class with slight delay for transition
            setTimeout(() => {
                targetSection.classList.add('active');
            }, 10);
        }
    }
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.nav-theme-toggle');
    themeToggle.addEventListener('click', function() {
        const icon = this.querySelector('i');
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });
    
    // View Details button functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.request-card');
            const name = card.querySelector('.request-name').textContent;
            const bloodType = card.querySelector('.request-detail:nth-child(1) span').textContent;
            const location = card.querySelector('.request-detail:nth-child(2) span').textContent;
            
            alert(`Request Details:\n\nName: ${name}\n${bloodType}\n${location}\n\nWould you like to help?`);
        });
    });
    
    // Notification action button functionality
    document.querySelectorAll('.notification-action').forEach(button => {
        button.addEventListener('click', function() {
            const notification = this.closest('.notification-item');
            const text = notification.querySelector('.notification-text').textContent;
            
            alert(`Notification Details:\n\n${text}`);
        });
    });
});