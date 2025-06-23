'use strict';

// Global variables for company swiping
let availableCompanies = [];
let currentCompanyIndex = 0;
let shownCompanies = new Set();
let isAnimating = false;
let companiesWithMatchPercentage = [];

// Appointment booking functionality
let selectedDate = null;
let selectedTime = null;
let currentCompanyForAppointment = null;
let availableAppointments = [];

// Initialize company data and fetch match percentages for sorting
async function initializeCompanies() {
    if (window.companiesData && window.companiesData.length > 0) {
        // Get IDs of already liked/matched companies
        const likedCompanyIds = (window.likedCompanies || []).map(company => company.id);

        // First filter out any companies already shown/swiped OR already liked/matched
        const unswipedCompanies = window.companiesData.filter(company =>
            !shownCompanies.has(company.id) && !likedCompanyIds.includes(company.id)
        );

        // Fetch match percentages for sorting (not displayed)
        companiesWithMatchPercentage = await fetchMatchPercentages(unswipedCompanies);

        // Sort by match percentage (highest first)
        companiesWithMatchPercentage.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

        availableCompanies = [...companiesWithMatchPercentage];
        currentCompanyIndex = 0;
        showCurrentCompany();
    }
}

// Shuffle array function
// Show current company information
function showCurrentCompany() {
    if (availableCompanies.length === 0) return;

    const company = availableCompanies[currentCompanyIndex];
    if (!company) return;

    updateCompanySwipeSection(company);
    updateCompanyInfo(company);
    updateCompanyCounter();
}

// Update the company swipe card display
function updateCompanySwipeSection(company) {
    const elements = {
        title: document.querySelector('#company-title h2'),
        jobTitle: document.querySelector('#company-title p'),
        logo: document.querySelector('#company-logo img')
    };

    if (elements.title) {
        elements.title.innerHTML = `${company.name || 'Naam Bedrijf'}`;
    }
    if (elements.jobTitle) {
        elements.jobTitle.textContent = company.job_title || 'Stage Positie';
    }
    if (elements.logo) {
        elements.logo.src = company.photo || '';
        elements.logo.alt = company.name || 'Company Logo';
    }
}

// Update company information section
function updateCompanyInfo(company) {
    const elements = {
        jobDomain: document.getElementById('job-domain'),
        jobType: document.getElementById('job-type'),
        jobDescription: document.getElementById('job-description'),
        jobRequirements: document.getElementById('job-requirements'),
        companyDescription: document.getElementById('company-description')
    };

    const updates = [
        { element: elements.jobDomain, value: company.job_domain, fallback: 'Geen jobdomein opgegeven.' },
        { element: elements.jobType, value: company.job_types, fallback: 'Geen functietype opgegeven.' },
        { element: elements.jobDescription, value: company.job_description, fallback: 'Geen omschrijving beschikbaar.' },
        { element: elements.jobRequirements, value: company.job_requirements, fallback: 'Geen vereisten opgegeven.' },
        { element: elements.companyDescription, value: company.description || company.company_description, fallback: 'Er is geen informatie beschikbaar over dit bedrijf.' }
    ];

    updates.forEach(({ element, value, fallback }) => {
        if (element) {
            element.textContent = value || fallback;
        }
    });
}

// Handle swipe actions with animation
function handleSwipe(action) {
    if (availableCompanies.length === 0 || isAnimating) return;

    isAnimating = true;
    const currentCompany = availableCompanies[currentCompanyIndex];
    const swipeSection = document.getElementById('company-swipe-section');

    if (swipeSection) {
        animateSwipe(swipeSection, action);
    }

    // Save the connection to database
    saveConnection(currentCompany.id, action);

    // Complete swipe after animation
    setTimeout(() => {
        resetSwipeAnimation(swipeSection);

        // Remove the company from available companies (no longer in queue)
        shownCompanies.add(currentCompany.id);
        availableCompanies.splice(currentCompanyIndex, 1);

        // Adjust index if we removed the last item
        if (currentCompanyIndex >= availableCompanies.length) {
            currentCompanyIndex = 0;
        }

        // Check if we need to refresh the company queue
        if (availableCompanies.length === 0) {
            refreshCompanyQueue();
        } else {
            showCurrentCompany();
        }

        isAnimating = false;
    }, 800);
}

// Save connection (like/dislike) to database
async function saveConnection(companyId, action) {
    const status = action === 'liked'; // true for like, false for dislike

    const connectionData = {
        student_id: window.studentId,
        company_id: companyId,
        status: status
    };

    try {
        const response = await fetch('/connections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify(connectionData)
        });

        if (response.ok) {
            const result = await response.json();

            // If we just liked a company, refresh connections list with a small delay
            if (status === true) {
                // Add a small delay to ensure the backend has processed the connection
                setTimeout(async () => {
                    await refreshConnectionsList();
                }, 500);
            }
        } else {
            const errorText = await response.text();
            console.error('Failed to save connection. Response text:', errorText);

            try {
                const errorJson = JSON.parse(errorText);
                console.error('Connection error details:', errorJson);
            } catch (parseError) {
                console.error('Could not parse error response as JSON');
            }
        }
    } catch (error) {
        console.error('Network error saving connection:', error);
    }
}

// Animate the swipe card movement
function animateSwipe(element, action) {
    const translateX = action === 'liked' ? '420px' : '-420px';

    element.style.transition = 'transform 0.6s ease-out, opacity 1.4s ease-out';
    element.style.zIndex = '-10';
    element.style.transform = `translateX(${translateX})`;
    element.style.opacity = '0';
}

// Reset swipe animation styles
function resetSwipeAnimation(element) {
    if (!element) return;

    element.style.transition = 'none';
    element.style.transform = 'translateX(0)';
    element.style.opacity = '1';
    element.style.zIndex = '';
}

// Move to next company in the queue
// Refresh the company queue when all companies have been shown
async function refreshCompanyQueue() {
    const unshownCompanies = window.companiesData.filter(company => !shownCompanies.has(company.id));

    if (unshownCompanies.length > 0) {
        // Fetch match percentages for remaining companies and sort them
        companiesWithMatchPercentage = await fetchMatchPercentages(unshownCompanies);
        companiesWithMatchPercentage.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
        availableCompanies = [...companiesWithMatchPercentage];
    } else {
        // All companies have been shown, reset and start over
        shownCompanies.clear();
        companiesWithMatchPercentage = await fetchMatchPercentages(window.companiesData);
        companiesWithMatchPercentage.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
        availableCompanies = [...companiesWithMatchPercentage];
    }

    currentCompanyIndex = 0;
    showCurrentCompany();
}

// Set up swipe button event listeners and keyboard shortcuts
function setupSwipeButtons() {
    const buttons = {
        like: document.getElementById('like'),
        dislike: document.getElementById('dislike')
    };

    // Button click handlers
    if (buttons.like) {
        buttons.like.addEventListener('click', () => handleSwipe('liked'));
    }
    if (buttons.dislike) {
        buttons.dislike.addEventListener('click', () => handleSwipe('disliked'));
    }

    // Keyboard shortcuts (only when on home page)
    document.addEventListener('keydown', (e) => {
        const homeContent = document.getElementById('home-content');
        if (!homeContent?.classList.contains('active')) return;

        const keyActions = {
            'ArrowLeft': () => handleSwipe('disliked'),
            'ArrowRight': () => handleSwipe('liked')
        };

        if (keyActions[e.key]) {
            e.preventDefault();
            keyActions[e.key]();
        }
    });
}

// Add company counter display
function updateCompanyCounter() {
    const remainingCompanies = availableCompanies.length - currentCompanyIndex;
    const totalUnshown = window.companiesData.filter(company => !shownCompanies.has(company.id)).length;

    // Optional: Display counter in UI if needed
    // For now, just track the counts internally
}

// Function to refresh the connections/matches list
async function refreshConnectionsList() {
    try {
        // Fetch updated liked companies from the server using student ID
        const response = await fetch(`/connections/${window.studentId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.likedCompanies) {
                // Update the global likedCompanies data
                window.likedCompanies = data.likedCompanies;

                // Update the message list HTML
                updateMessageListHTML(data.likedCompanies);
            }
        } else {
            console.error('Failed to refresh connections list');
        }
    } catch (error) {
        console.error('Error refreshing connections:', error);
    }
}

// Function to update the message list HTML
function updateMessageListHTML(likedCompanies) {
    const messageList = document.getElementById('message-list');
    if (!messageList) return;

    if (likedCompanies.length > 0) {
        let html = '';
        likedCompanies.forEach(company => {
            const photo = company.photo || '/images/image-placeholder.png';
            html += `
                <div class="message-company" data-company-id="${company.id}">
                    <img src="${photo}"
                         class="company-thumb"
                         alt="Company Logo"
                         onerror="this.src='/images/image-placeholder.png'">
                    <span class="company-name">${company.name}</span>
                </div>
            `;
        });
        messageList.innerHTML = html;
    } else {
        messageList.innerHTML = `
            <div class="no-matches-message">
                <p>Je hebt nog geen bedrijven geliked. Ga naar Home om bedrijven te bekijken en te liken!</p>
            </div>
        `;
    }

    // Re-attach click event listeners to the new message companies
    setupMessageCompanyClickHandlers();
}

// Function to setup click handlers for message companies
function setupMessageCompanyClickHandlers() {
    document.querySelectorAll('.message-company').forEach(item => {
        item.addEventListener('click', function() {
            const companyId = this.dataset.companyId;
            if (companyId) {
                // Remove active class from all items
                document.querySelectorAll('.message-company').forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');

                // Show company info instead of chat
                showCompanyInfoInMatches(companyId);
            }
        });
    });

    // Setup message button click handler
    const messageButton = document.getElementById('message-button');
    if (messageButton) {
        messageButton.addEventListener('click', function() {
            // Get the currently selected company
            const activeCompany = document.querySelector('.message-company.active');
            if (activeCompany) {
                const companyId = activeCompany.dataset.companyId;
                showChatInMatches(companyId);
            }
        });
    }

    // Setup appointment button click handler
    const appointmentButton = document.getElementById('appointment-button');
    if (appointmentButton) {
        appointmentButton.addEventListener('click', function() {
            // Get the currently selected company
            const activeCompany = document.querySelector('.message-company.active');
            if (activeCompany) {
                const companyId = activeCompany.dataset.companyId;
                showAppointmentPopup(companyId);
            }
        });
    }

    // Setup back button click handler
    const backButton = document.getElementById('back-to-company-info');
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Get the currently selected company
            const activeCompany = document.querySelector('.message-company.active');
            if (activeCompany) {
                const companyId = activeCompany.dataset.companyId;
                showCompanyInfoInMatches(companyId);
            }
        });
    }

    // Setup appointment popup handlers
    const closePopupBtn = document.getElementById('close-appointment-popup');
    const cancelBtn = document.getElementById('cancel-appointment');
    const bookBtn = document.getElementById('book-appointment');

    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', hideAppointmentPopup);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', hideAppointmentPopup);
    }

    if (bookBtn) {
        bookBtn.addEventListener('click', bookAppointment);
    }

    // Close popup when clicking outside
    const popup = document.getElementById('appointment-popup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                hideAppointmentPopup();
            }
        });
    }
}

// Function to show company info in matches page
function showCompanyInfoInMatches(companyId) {
    // Find the company data from the available companies or liked companies
    const company = findCompanyById(companyId);
    if (!company) return;

    // Show company info section, hide chat section
    const companyInfoSection = document.getElementById('company-info-section-matches');
    const chatSection = document.getElementById('chat-section');

    // Use class-based toggling for consistent behavior
    companyInfoSection.style.display = 'block';
    chatSection?.classList.remove('active');

    // Hide empty state and show company info
    const emptyContainer = companyInfoSection?.querySelector('.empty-company-info-container');
    const infoContainer = companyInfoSection?.querySelector('.company-info-container');

    emptyContainer?.classList.remove('active');
    infoContainer?.classList.add('active');

    // Update company info elements
    updateSelectedCompanyInfo(company);
}

// Function to show chat in matches page
function showChatInMatches(companyId) {
    // Hide company info section and show chat section
    const companyInfoSection = document.getElementById('company-info-section-matches');
    const chatSection = document.getElementById('chat-section');

    // Use class-based toggling for consistent behavior
    companyInfoSection.style.display = 'none';
    chatSection?.classList.add('active');

    // Update chat header with company name
    const company = findCompanyById(companyId);
    const chatCompanyName = document.getElementById('chat-company-name');
    if (chatCompanyName && company) {
        chatCompanyName.textContent = `Chat met ${company.name}`;
    }

    // Show chat container
    const chatContainer = chatSection?.querySelector('.chat-container');
    chatContainer?.classList.add('active');

    // Trigger company selection for chat
    window.dispatchEvent(new CustomEvent('companySelected', {
        detail: { companyId: companyId }
    }));
}

// Function to find company by ID from available data
function findCompanyById(companyId) {
    // First check in liked companies
    if (window.likedCompanies) {
        const likedCompany = window.likedCompanies.find(company => company.id == companyId);
        if (likedCompany) return likedCompany;
    }

    // Then check in all companies data
    if (window.companiesData) {
        const company = window.companiesData.find(company => company.id == companyId);
        if (company) return company;
    }

    return null;
}

// Function to update selected company info display
function updateSelectedCompanyInfo(company) {
    const elements = {
        name: document.getElementById('selected-company-name'),
        job: document.getElementById('selected-company-job'),
        image: document.getElementById('selected-company-image'),
        domain: document.getElementById('selected-job-domain'),
        type: document.getElementById('selected-job-type'),
        description: document.getElementById('selected-job-description'),
        requirements: document.getElementById('selected-job-requirements'),
        companyDescription: document.getElementById('selected-company-description')
    };

    if (elements.name) elements.name.textContent = company.name || 'Bedrijfsnaam';
    if (elements.job) elements.job.textContent = company.job_title || 'Functietitel';
    if (elements.image) {
        elements.image.src = company.photo || '/images/image-placeholder.png';
        elements.image.alt = company.name || 'Company Logo';
    }
    if (elements.domain) elements.domain.textContent = company.job_domain || 'Geen jobdomein opgegeven.';
    if (elements.type) elements.type.textContent = company.job_types || 'Geen functietype opgegeven.';
    if (elements.description) elements.description.textContent = company.job_description || 'Geen omschrijving beschikbaar.';
    if (elements.requirements) elements.requirements.textContent = company.job_requirements || 'Geen vereisten opgegeven.';
    if (elements.companyDescription) elements.companyDescription.textContent = company.description || company.company_description || 'Er is geen informatie beschikbaar over dit bedrijf.';
}

// Generic function to render any section
function renderSection(sectionId, buttonId) {
    // Update active navigation button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    if (buttonId) {
        document.getElementById(buttonId)?.classList.add('active');
    }

    // Show target section, hide others
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
}

// Specific render functions
function renderHome() {
    renderSection('home-content', 'homeBtn');
}

function renderMatches() {
    renderSection('matches-content', 'matchesBtn');

    // Refresh connections when switching to matches tab
    refreshConnectionsList();

    // Reset to default state - show company info section with empty state, hide chat
    const chatSection = document.getElementById('chat-section');
    const companyInfoSection = document.getElementById('company-info-section-matches');

    // Show company info section (default), hide chat section
    companyInfoSection.style.display = 'block';
    chatSection?.classList.remove('active');

    // Show empty state for company info
    const emptyInfoContainer = companyInfoSection?.querySelector('.empty-company-info-container');
    const infoContainer = companyInfoSection?.querySelector('.company-info-container');

    emptyInfoContainer?.classList.add('active');
    infoContainer?.classList.remove('active');

    // Remove active class from all message companies
    document.querySelectorAll('.message-company').forEach(item => item.classList.remove('active'));
}

function renderCalendar() {
    renderSection('calendar-content', 'calendarBtn');
}

function renderSettings() {
    renderSection('settings-content', null);
}

// function to handle company selection in chat
function handleCompanySelection() {
    document.querySelectorAll('.message-company').forEach(companyMatch => {
        companyMatch.addEventListener('click', () => {
            // remove active class from all matches
            document.querySelectorAll('.message-company').forEach(company => {
                company.classList.remove('active');
            });
            companyMatch.classList.add('active');

            // update chat section visibility and content
            const chatSection = document.getElementById('chat-section');
            const emptyContainer = chatSection.querySelector('.empty-chat-container');
            const chatContainer = chatSection.querySelector('.chat-container');

            // hide empty state and show chat
            emptyContainer.classList.remove('active');
            chatContainer.classList.add('active');

            // update the company name in the chat header
            const headerTitle = chatContainer.querySelector('.chat-header h2');
            headerTitle.textContent = companyMatch.querySelector('.company-name').textContent;

            // get company ID and trigger conversation loading
            const companyId = companyMatch.dataset.companyId;
            if (companyId) {
                // dispatch custom event to load conversation
                window.dispatchEvent(new CustomEvent('companySelected', {
                    detail: { companyId: companyId }
                }));
            }
        });
    });
}

// function to handle profile dropdown
function handleProfileDropdown() {
    const profileArea = document.getElementById('profileArea');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileArea && profileDropdown) {
        // function to toggle dropdown
        const toggleDropdown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        };

        // add click event to entire profile area
        profileArea.addEventListener('click', toggleDropdown);

        // close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileArea.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });

        // handle settings button click
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                profileDropdown.classList.remove('show');
                renderSettings();
            });
        }

        // handle logout button click
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                profileDropdown.classList.remove('show');
                // TODO: Implement logout functionality
                if (confirm('Are you sure you want to log out?')) {
                    // Redirect to logout route or home page
                    window.location.href = '/logout';
                }
            });
        }
    }
}

// function to handle settings navigation
function handleSettingsNavigation() {
    const profileSettingsBtn = document.getElementById('profileSettingsBtn');
    const preferencesBtn = document.getElementById('preferencesBtn');
    const themeBtn = document.getElementById('themeBtn');

    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', () => {
            // update active button
            document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
            profileSettingsBtn.classList.add('active');

            // show profile settings panel
            document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));
            document.getElementById('profile-settings').classList.add('active');
        });
    }

    if (preferencesBtn) {
        preferencesBtn.addEventListener('click', () => {
            if (!preventNavigationIfUnsaved(() => {
                // update active button
                document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
                preferencesBtn.classList.add('active');

                // show preferences panel
                document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));
                document.getElementById('preferences-settings').classList.add('active');
            })) {
                return;
            }
        });
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (!preventNavigationIfUnsaved(() => {
                // update active button
                document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
                themeBtn.classList.add('active');

                // show theme settings panel
                document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));
                document.getElementById('theme-settings').classList.add('active');
            })) {
                return;
            }
        });
    }

    // handle theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// Profile settings change tracking
let originalProfileData = {};
let hasUnsavedChanges = false;

function profileChangeTracking() {
    // Store original values
    const profileInputs = document.querySelectorAll('#profile-settings input, #profile-settings select');
    profileInputs.forEach(input => {
        if (input.id && input.id !== 'changePasswordBtn' && input.id !== 'email') {
            originalProfileData[input.id] = input.value;
        }
    });

    // Add change listeners
    profileInputs.forEach(input => {
        if (input.id && input.id !== 'changePasswordBtn' && input.id !== 'email') {
            input.addEventListener('input', handleProfileChange);
            input.addEventListener('change', handleProfileChange);
        }
    });

    // Add save button handler
    const saveBtn = document.querySelector('#profile-settings .save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', handleProfileSave);
    }

    // Add undo button handler
    const undoBtn = document.getElementById('undoChangesBtn');
    if (undoBtn) {
        undoBtn.addEventListener('click', handleProfileUndo);
    }
}

function handleProfileChange() {
    const profilePanel = document.getElementById('profile-settings');
    const undoBtn = document.getElementById('undoChangesBtn');
    let hasChanges = false;

    // Check if any field has changed
    const profileInputs = document.querySelectorAll('#profile-settings input, #profile-settings select');
    profileInputs.forEach(input => {
        if (input.id && input.id !== 'changePasswordBtn' && input.id !== 'email') {
            if (input.value !== originalProfileData[input.id]) {
                hasChanges = true;
                input.classList.add('changed');
            } else {
                input.classList.remove('changed');
            }
        }
    });

    hasUnsavedChanges = hasChanges;

    if (hasChanges) {
        profilePanel.classList.add('profile-settings-changed');
        undoBtn.style.display = 'inline-block';
    } else {
        profilePanel.classList.remove('profile-settings-changed');
        undoBtn.style.display = 'none';
    }
}

function handleProfileSave(e) {
    e.preventDefault();

    // Get current student ID from URL or data attribute
    const currentUrl = window.location.pathname;
    const studentId = currentUrl.split('/').pop();

    // Collect form data
    const formData = {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        study_direction: document.getElementById('studyDirection').value,
        graduation_track: document.getElementById('graduationTrack').value
    };

    // Send PATCH request
    fetch(`/student/${studentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            // Update original data and reset change tracking
            Object.keys(formData).forEach(key => {
                const fieldId = key === 'first_name' ? 'firstName' :
                               key === 'last_name' ? 'lastName' :
                               key === 'study_direction' ? 'studyDirection' :
                               key === 'graduation_track' ? 'graduationTrack' : key;
                originalProfileData[fieldId] = formData[key];
            });

            resetProfileChangeTracking();
            alert('Profile updated successfully!');
        } else {
            throw new Error('Failed to update profile');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    });
}

function handleProfileUndo() {
    // Restore original values
    Object.keys(originalProfileData).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = originalProfileData[fieldId];
        }
    });

    resetProfileChangeTracking();
}

function resetProfileChangeTracking() {
    hasUnsavedChanges = false;
    const profilePanel = document.getElementById('profile-settings');
    const undoBtn = document.getElementById('undoChangesBtn');

    profilePanel.classList.remove('profile-settings-changed');
    undoBtn.style.display = 'none';

    // Remove changed class from all inputs
    document.querySelectorAll('#profile-settings input, #profile-settings select').forEach(input => {
        input.classList.remove('changed');
    });
}

function preventNavigationIfUnsaved(callback) {
    if (hasUnsavedChanges) {
        const confirmLeave = confirm('You have unsaved changes in your profile. Are you sure you want to leave without saving?');
        if (!confirmLeave) {
            return false;
        }
        resetProfileChangeTracking();
    }
    callback();
    return true;
}

// Fetch match percentages for companies (used for sorting only)
async function fetchMatchPercentages(companies) {
    try {
        // Extract company IDs
        const companyIds = companies.map(company => company.id);

        // Make a single request for all matches
        const response = await fetch(`/api/matches/${window.studentId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                company_ids: companyIds
            })
        });

        if (response.ok) {
            const matchData = await response.json();
            const matches = matchData.matches || {};

            // Add match percentages to companies
            const companiesWithMatch = companies.map(company => ({
                ...company,
                match_percentage: matches[company.id] || 0
            }));

            return companiesWithMatch;
        } else {
            console.warn('Failed to fetch match percentages, using fallback method');
            // Fallback to individual requests if bulk request fails
            return await fetchMatchPercentagesIndividual(companies);
        }
    } catch (error) {
        console.error('Error fetching match percentages:', error);
        // Fallback to individual requests on error
        return await fetchMatchPercentagesIndividual(companies);
    }
}

// Fallback function for individual match requests
async function fetchMatchPercentagesIndividual(companies) {
    const companiesWithMatch = [];

    for (const company of companies) {
        try {
            const response = await fetch(`/api/match/${window.studentId}/${company.id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            if (response.ok) {
                const matchData = await response.json();
                companiesWithMatch.push({
                    ...company,
                    match_percentage: matchData.match_percentage || 0
                });
            } else {
                companiesWithMatch.push({
                    ...company,
                    match_percentage: 0
                });
            }
        } catch (error) {
            console.error(`Error fetching match for company ${company.id}:`, error);
            companiesWithMatch.push({
                ...company,
                match_percentage: 0
            });
        }
    }

    return companiesWithMatch;
}

// Function to show appointment booking popup
function showAppointmentPopup(companyId) {
    const company = findCompanyById(companyId);
    if (!company) return;

    currentCompanyForAppointment = companyId;
    const popup = document.getElementById('appointment-popup');
    const companyNameElement = document.getElementById('appointment-company-name');

    if (companyNameElement && company) {
        companyNameElement.textContent = `Afspraak boeken met ${company.name}`;
    }

    popup.classList.add('show');

    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';

    // Reset state
    selectedDate = null;
    selectedTime = null;
    document.getElementById('appointment-loading').style.display = 'block';
    document.getElementById('appointment-calendar').style.display = 'none';
    document.getElementById('appointment-error').style.display = 'none';
    document.getElementById('book-appointment').style.display = 'none';

    // Fetch available appointments
    fetchAvailableAppointments(companyId);
}

// Function to hide appointment booking popup
function hideAppointmentPopup() {
    const popup = document.getElementById('appointment-popup');
    popup.classList.remove('show');

    // Restore body scroll when popup is closed
    document.body.style.overflow = '';

    selectedDate = null;
    selectedTime = null;
    currentCompanyForAppointment = null;
    availableAppointments = [];
}

// Function to fetch available appointments from backend
async function fetchAvailableAppointments(companyId) {
    try {
        console.log('Fetching appointments for company ID:', companyId); // Debug log
        const response = await fetch(`/appointments/${companyId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        });

        console.log('Response status:', response.status); // Debug log
        console.log('Response ok:', response.ok); // Debug log

        if (response.ok) {
            const data = await response.json();
            console.log('Appointment data received:', data); // Debug log
            availableAppointments = data.appointments || [];
            console.log('Available appointments:', availableAppointments); // Debug log

            document.getElementById('appointment-loading').style.display = 'none';

            // Always show the calendar, even if no appointments exist
            document.getElementById('appointment-calendar').style.display = 'block';
            initializeAppointmentCalendar();
        } else {
            // Log the response details for debugging
            const responseText = await response.text();
            console.log('Response error text:', responseText);

            // If endpoint doesn't exist (404) or other error, treat as no existing appointments
            console.log('Backend endpoint not available, proceeding with empty appointments array');
            availableAppointments = [];

            document.getElementById('appointment-loading').style.display = 'none';
            document.getElementById('appointment-calendar').style.display = 'block';
            initializeAppointmentCalendar();
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);

        // On network error, proceed with empty appointments (allows booking any slot)
        console.log('Network error, proceeding with empty appointments array');
        availableAppointments = [];

        document.getElementById('appointment-loading').style.display = 'none';
        document.getElementById('appointment-calendar').style.display = 'block';
        initializeAppointmentCalendar();
    }
}

// Function to initialize the appointment calendar (now daily view)
function initializeAppointmentCalendar() {
    const today = new Date();
    // Use today's date as the default date for appointment booking
    selectedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    renderDailyAppointmentSlots();
}

// Function to render daily appointment time slots
function renderDailyAppointmentSlots() {
    console.log('Rendering daily appointment slots for date:', selectedDate); // Debug log
    console.log('Available appointments:', availableAppointments); // Debug log

    const slotsContainer = document.getElementById('appointment-time-slots');
    slotsContainer.innerHTML = '';

    // Generate all possible time slots from 9:00 to 18:00 in 15-minute intervals
    for (let hour = 9; hour <= 18; hour++) {
        const row = document.createElement('tr');
        row.className = 'hour-row';
        row.dataset.hour = hour;

        // Time column
        const timeCell = document.createElement('td');
        timeCell.className = 'time-cell';
        timeCell.textContent = `${hour.toString().padStart(2, '0')}:00`;

        // Appointment slots column
        const appointmentCell = document.createElement('td');
        appointmentCell.className = 'appointment-cell';
        appointmentCell.dataset.hour = hour;

        const timeSlotsDiv = document.createElement('div');
        timeSlotsDiv.className = 'time-slots';

        // Generate 4 quarter slots for this hour (0, 15, 30, 45 minutes)
        for (let quarter = 0; quarter < 4; quarter++) {
            const minutes = quarter * 15;
            const timeSlot = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            const quarterDiv = document.createElement('div');
            quarterDiv.className = 'quarter-slot';
            quarterDiv.dataset.time = timeSlot;

            // Check if this time slot is already booked
            const isBooked = isTimeSlotBooked(timeSlot);

            if (isBooked) {
                // Show booked slot
                const appointmentBlock = document.createElement('div');
                appointmentBlock.className = 'appointment-block booked';
                appointmentBlock.innerHTML = `
                    <span class="appointment-time">${timeSlot}</span>
                    <span class="appointment-status">Geboekt</span>
                `;
                quarterDiv.appendChild(appointmentBlock);
            } else {
                // Show available slot as button
                const availableBtn = document.createElement('button');
                availableBtn.className = 'time-slot-btn available';
                availableBtn.textContent = timeSlot;
                availableBtn.title = `Boek afspraak voor ${timeSlot}`;
                availableBtn.addEventListener('click', () => selectAppointmentTime(timeSlot, availableBtn));
                quarterDiv.appendChild(availableBtn);
            }

            timeSlotsDiv.appendChild(quarterDiv);
        }

        appointmentCell.appendChild(timeSlotsDiv);
        row.appendChild(timeCell);
        row.appendChild(appointmentCell);
        slotsContainer.appendChild(row);
    }

    console.log('Daily appointment slots rendered'); // Debug log
}

// Function to check if a time slot is booked
function isTimeSlotBooked(timeSlot) {
    // Check if any appointment exists for this time slot on the selected date
    return availableAppointments.some(apt => {
        // Handle different date formats that might come from the backend
        let appointmentDate = apt.date;
        if (apt.date && typeof apt.date === 'string') {
            // If date includes time, extract just the date part
            appointmentDate = apt.date.split('T')[0];
        }

        return appointmentDate === selectedDate && apt.time === timeSlot;
    });
}

// Function to select appointment time
function selectAppointmentTime(time, timeElement) {
    console.log('Selecting appointment time:', time); // Debug log

    // Remove previous selection
    document.querySelectorAll('.time-slot-btn.selected').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Select new time
    timeElement.classList.add('selected');
    selectedTime = time;

    console.log('Selected time set to:', selectedTime); // Debug log

    // Show book appointment button
    const bookBtn = document.getElementById('book-appointment');
    if (bookBtn) {
        bookBtn.style.display = 'block';
        console.log('Book appointment button shown'); // Debug log
    }
}

// Function to book appointment
async function bookAppointment() {
    if (!selectedDate || !selectedTime || !currentCompanyForAppointment) {
        alert('Selecteer eerst een datum en tijd.');
        return;
    }

    console.log('Booking appointment:', { // Debug log
        selectedDate,
        selectedTime,
        currentCompanyForAppointment,
        studentId: window.studentId
    });

    try {
        const response = await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                student_id: window.studentId,
                company_id: currentCompanyForAppointment,
                date: selectedDate,
                time: selectedTime
            })
        });

        console.log('Booking response status:', response.status); // Debug log

        if (response.ok) {
            const result = await response.json();
            console.log('Booking successful:', result); // Debug log
            alert('Afspraak succesvol geboekt!');
            hideAppointmentPopup();

            // Optionally refresh the calendar or update the UI
            // You could trigger a calendar refresh here if needed
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Onbekende fout' }));
            console.error('Booking error:', errorData); // Debug log
            alert(`Fout bij het boeken van de afspraak: ${errorData.message || 'Onbekende fout'}`);
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Er is een fout opgetreden bij het boeken van de afspraak.');
    }
}

// add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if student ID is available
    if (!window.studentId) {
        console.error('WARNING: window.studentId is not set! Connections will not work.');
    }

    // Initialize company swiping functionality
    initializeCompanies();
    setupSwipeButtons();

    // home button click handler
    document.getElementById('homeBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (!preventNavigationIfUnsaved(() => renderHome())) {
            return;
        }
    });

    // matches button click handler
    document.getElementById('matchesBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (!preventNavigationIfUnsaved(() => renderMatches())) {
            return;
        }
    });

    // calendar button click handler
    document.getElementById('calendarBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (!preventNavigationIfUnsaved(() => renderCalendar())) {
            return;
        }
    });

    // settings button click handler
    document.getElementById('settingsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        renderSettings();
    });

    // start with home view
    renderHome();
    // set up chat functionality immediately
    handleCompanySelection();
    // set up initial message company click handlers
    setupMessageCompanyClickHandlers();
    // set up profile dropdown functionality
    handleProfileDropdown();
    // set up settings navigation
    handleSettingsNavigation();
    // initialize profile change tracking
    profileChangeTracking();
});
