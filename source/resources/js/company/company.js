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

// function to render messages section
function renderMessages() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('messageBtn').classList.add('active');

    // show messages content, hide others
    document.querySelectorAll('.content-container').forEach(section => section.classList.remove('active'));
    document.getElementById('messages-content').classList.add('active');

    // remove active class from all message list items
    document.querySelectorAll('.message-company').forEach(item => item.classList.remove('active'));

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

// function to handle student selection in chat
function handleStudentSelection() {
    document.querySelectorAll('.message-contact').forEach(studentMatch => {
        studentMatch.addEventListener('click', function() {
            // remove active class from all matches
            document.querySelectorAll('.message-contact').forEach(match => match.classList.remove('active'));

            // add active class to clicked match
            this.classList.add('active');

            // hide empty state and show chat
            const chatSection = document.getElementById('chat-section');
            const emptyContainer = chatSection.querySelector('.empty-chat-container');
            const chatContainer = chatSection.querySelector('.chat-container');

            emptyContainer.classList.remove('active');
            chatContainer.classList.add('active');
              // get student data
            const studentId = this.dataset.userId;
            const studentType = this.dataset.userType;
            const studentName = this.querySelector('.contact-info h4').textContent;

            // set hidden form fields
            document.getElementById('current-student-id').value = studentId;

            // dispatch custom event for chat handler
            window.dispatchEvent(new CustomEvent('studentSelected', {
                detail: { studentId: studentId }
            }));
        });
    });
}

// function to handle profile dropdown
function handleProfileDropdown() {
    const profileArea = document.getElementById('profileArea');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileArea && profileDropdown) {
        profileArea.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!profileArea.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
    }
}

// function to handle settings navigation
function handleSettingsNavigation() {
    const profileSettingsBtn = document.getElementById('profileSettingsBtn');
    const preferencesBtn = document.getElementById('preferencesBtn');
    const themeBtn = document.getElementById('themeBtn');

    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener('click', function() {
            document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));

            this.classList.add('active');
            document.getElementById('profile-settings').classList.add('active');
        });
    }

    if (preferencesBtn) {
        preferencesBtn.addEventListener('click', function() {
            document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));

            this.classList.add('active');
            document.getElementById('preferences-settings').classList.add('active');
        });
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.querySelectorAll('.settings-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.settings-panel').forEach(panel => panel.classList.remove('active'));

            this.classList.add('active');
            document.getElementById('theme-settings').classList.add('active');
        });
    }

    // handle theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const selectedTheme = this.dataset.theme;
            applyTheme(selectedTheme);
        });
    });
}

// Profile settings change tracking
let originalProfileData = {};
let hasUnsavedChanges = false;

function profileChangeTracking() {
    // Store original values
    const profileInputs = document.querySelectorAll('#profile-settings input, #profile-settings select, #profile-settings textarea');
    profileInputs.forEach(input => {
        originalProfileData[input.id] = input.value;
    });

    // Add change listeners
    profileInputs.forEach(input => {
        input.addEventListener('input', handleProfileChange);
        input.addEventListener('change', handleProfileChange);
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
    const profileInputs = document.querySelectorAll('#profile-settings input, #profile-settings select, #profile-settings textarea');
    profileInputs.forEach(input => {
        if (input.value !== originalProfileData[input.id]) {
            hasChanges = true;
            input.classList.add('changed');
        } else {
            input.classList.remove('changed');
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

    // Get current company ID from URL or data attribute
    const currentUrl = window.location.pathname;
    const companyId = currentUrl.split('/').pop();

    // Collect form data
    const formData = {
        name: document.getElementById('companyName').value,
        job_domain: document.getElementById('jobDomain').value,
        job_types: document.getElementById('jobTypes').value,
        booth_location: document.getElementById('boothLocation').value,
        plan_type: document.getElementById('planType').value,
        company_description: document.getElementById('companyDescription').value,
        job_description: document.getElementById('jobDescription').value,
        job_requirements: document.getElementById('jobRequirements').value,
        speeddate_duration: document.getElementById('speeddateDuration').value
    };

    // Send PATCH request
    fetch(`/company/${companyId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update original data and reset change tracking
            Object.keys(formData).forEach(key => {
                const input = document.getElementById(key === 'name' ? 'companyName' : key);
                if (input) {
                    originalProfileData[input.id] = input.value;
                }
            });
            resetProfileChangeTracking();

            // Show success message
            alert('Profile updated successfully!');
        } else {
            alert('Error updating profile: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
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
    document.querySelectorAll('#profile-settings input, #profile-settings select, #profile-settings textarea').forEach(input => {
        input.classList.remove('changed');
    });
}

function preventNavigationIfUnsaved(callback) {
    if (hasUnsavedChanges) {
        if (confirm('You have unsaved changes. Are you sure you want to leave this section?')) {
            callback();
            return true;
        }
        return false;
    }
    callback();
    return true;
}

// Theme selection and persistence
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('company-theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('company-theme') || 'light';
    applyTheme(savedTheme);
    // Set active class on theme options
    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.theme === savedTheme) {
            opt.classList.add('active');
        }
    });
}

// add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // home button click handler
    document.getElementById('homeBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (preventNavigationIfUnsaved(() => renderHome())) {
            renderHome();
        }
    });

    // messages button click handler
    document.getElementById('messageBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (preventNavigationIfUnsaved(() => renderMessages())) {
            renderMessages();
        }
    });

    // calendar button click handler
    document.getElementById('calendarBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (preventNavigationIfUnsaved(() => renderCalendar())) {
            renderCalendar();
        }
    });

    // settings button click handler
    document.getElementById('settingsBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (preventNavigationIfUnsaved(() => renderSettings())) {
            renderSettings();
        }
    });

    // initialize other handlers
    handleStudentSelection();
    handleProfileDropdown();
    handleSettingsNavigation();
    profileChangeTracking();
    loadTheme();

    // start with home view
    renderHome();
});
