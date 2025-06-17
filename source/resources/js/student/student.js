'use strict';

// function to render home section
function renderHome() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('homeBtn').classList.add('active');

    // show home content, hide others
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById('home-content').classList.add('active');
}

// function to render matches section
function renderMatches() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('matchesBtn').classList.add('active');

    // show matches content, hide others
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById('matches-content').classList.add('active');

    // show empty state and hide chat
    const chatSection = document.getElementById('chat-section');
    const emptyContainer = chatSection.querySelector('.empty-chat-container');
    const chatContainer = chatSection.querySelector('.chat-container');

    emptyContainer.classList.add('active');
    chatContainer.classList.remove('active');
}

// function to render calendar section
function renderCalendar() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('calendarBtn').classList.add('active');

    // show calendar content, hide others
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById('calendar-content').classList.add('active');
}

// function to render settings section
function renderSettings() {
    // hide all content containers
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById('settings-content').classList.add('active');

    // remove active class from nav links
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
}

// function to handle company selection in chat
function handleCompanySelection() {
    document.querySelectorAll('.message-company').forEach(companyMatch => {
        companyMatch.addEventListener('click', () => {
            console.log('Company clicked:', companyMatch);

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
                console.log('Logout clicked');
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

// add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
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
