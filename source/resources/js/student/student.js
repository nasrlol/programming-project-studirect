'use strict';

// Global variables for company swiping
let availableCompanies = [];
let currentCompanyIndex = 0;
let shownCompanies = new Set();
let isAnimating = false;
let companiesWithMatchPercentage = [];

// Initialize company data and fetch match percentages for sorting
async function initializeCompanies() {
    if (window.companiesData && window.companiesData.length > 0) {
        // First filter out any companies already shown/swiped
        const unswipedCompanies = window.companiesData.filter(company => !shownCompanies.has(company.id));

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

            // Optionally refresh the matches list if we're on that page
            const matchesContent = document.getElementById('matches-content');
            if (matchesContent && matchesContent.classList.contains('active')) {
                // We could trigger a page reload or fetch updated liked companies here
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

    // Additional matches-specific setup
    document.querySelectorAll('.message-company').forEach(item => item.classList.remove('active'));

    const chatSection = document.getElementById('chat-section');
    const emptyContainer = chatSection?.querySelector('.empty-chat-container');
    const chatContainer = chatSection?.querySelector('.chat-container');

    emptyContainer?.classList.add('active');
    chatContainer?.classList.remove('active');
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
                    localStorage.clear('token')
                    localStorage.clear('user_type')
                    window.location.href = '/';
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
    // set up profile dropdown functionality
    handleProfileDropdown();
    // set up settings navigation
    handleSettingsNavigation();
    // initialize profile change tracking
    profileChangeTracking();
});
