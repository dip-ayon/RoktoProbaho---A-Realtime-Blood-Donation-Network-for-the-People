
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
    
    // Navigation functionality - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active navigation link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu
            navMenu.classList.remove('active');
            
            // Get target page ID from data attribute
            const targetPage = this.getAttribute('data-page');
            
            // Hide all pages
            pageSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target page
            document.getElementById(targetPage).classList.add('active');
        });
    });
    
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
    
    // Modal functionality
    const modal = document.getElementById('donationModal');
    const viewBtns = document.querySelectorAll('.view-btn');
    const closeBtn = document.getElementById('closeModalBtn');
    const donateBtn = document.getElementById('donateBtn');
    const modalBloodType = document.querySelector('.modal-header .blood-type');
    const modalTitle = document.querySelector('.modal-header h2');
    const modalBadge = document.querySelector('.urgent-badge');
    
    // Show modal when View Details button is clicked
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set modal content based on which card was clicked
            const patient = btn.getAttribute('data-patient');
            
            if (patient === 'jahanara') {
                modalBloodType.textContent = 'O+';
                modalTitle.textContent = 'Jahanara Begum';
                modalBadge.textContent = 'URGENT';
            } else if (patient === 'rahim') {
                modalBloodType.textContent = 'A-';
                modalTitle.textContent = 'Rahim Ahmed';
                modalBadge.textContent = 'HIGH';
            } else if (patient === 'fatima') {
                modalBloodType.textContent = 'B+';
                modalTitle.textContent = 'Fatima Khan';
                modalBadge.textContent = 'MEDIUM';
            } else if (patient === 'mohammed') {
                modalBloodType.textContent = 'AB+';
                modalTitle.textContent = 'Mohammed Ali';
                modalBadge.textContent = 'LOW';
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal when Close button is clicked
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Donate button functionality
    donateBtn.addEventListener('click', () => {
        alert('Thank you for your willingness to donate! A representative will contact you shortly.');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Avatar popup functionality
    const navAvatar = document.getElementById("navAvatar");
    const avatarPopup = document.getElementById("avatarPopup");

    navAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        avatarPopup.style.display = avatarPopup.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
        avatarPopup.style.display = "none";
    });
    
    // Chat functionality
    const sendButton = document.querySelector('.send-button');
    const messageInput = document.querySelector('.message-input input');
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            const messagesContainer = document.querySelector('.chat-messages');
            
            const newMessage = document.createElement('div');
            newMessage.classList.add('message', 'sent');
            newMessage.innerHTML = `
                ${message}
                <div class="message-time">Just now</div>
            `;
            
            messagesContainer.appendChild(newMessage);
            messageInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Simulate reply after 1 second
            setTimeout(() => {
                const reply = document.createElement('div');
                reply.classList.add('message', 'received');
                reply.innerHTML = `
                    Thanks for the update! I'll confirm and get back to you shortly.
                    <div class="message-time">Just now</div>
                `;
                messagesContainer.appendChild(reply);
                
                // Scroll to bottom again
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        }
    }
});
