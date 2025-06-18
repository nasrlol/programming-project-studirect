
{{-- resources/views/company/layouts/settings.blade.php --}}
<div class="settings-container">
    <div class="settings-nav">
        <h3>settings menu:</h3>
        <div class="settings-nav-item active" onclick="loadSettingsTab('profile', this)">
            <span class="nav-icon">👤</span> profile
        </div>
        <div class="settings-nav-item" onclick="loadSettingsTab('privacy', this)">
            <span class="nav-icon">🔒</span> privacy
        </div>
        <div class="settings-nav-item" onclick="loadSettingsTab('appearance', this)">
            <span class="nav-icon">🎨</span> appearance
        </div>
        <div class="settings-nav-item" onclick="loadSettingsTab('account', this)">
            <span class="nav-icon">⚙️</span> account
        </div>
    </div>

    <div class="settings-content" id="settingsContent">
        <!-- Hier wordt de content geladen via JavaScript -->
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        loadSettingsTab('profile', document.querySelector(".settings-nav-item.active"));
    });

    function loadSettingsTab(tab, activeElement) {
        document.querySelectorAll(".settings-nav-item").forEach(nav => nav.classList.remove("active"));
        activeElement.classList.add("active");

        const content = document.getElementById("settingsContent");
        content.innerHTML = "";

        switch (tab) {
            case "profile":
                content.innerHTML = `
                    <div class="profile-card">
                        <h2>Profile Settings</h2>
                        <form id="profileForm">
                            <label>
                                Full Name:
                                <input type="text" id="fullName" value="" placeholder="Enter your full name">
                            </label>
                            <label>
                                Email:
                                <input type="email" id="email" value="" placeholder="Enter your email">
                            </label>
                            <label>
                                LinkedIn:
                                <input type="url" id="linkedin" value="" placeholder="Enter your LinkedIn URL">
                            </label>
                            <label>
                                Bio:
                                <textarea id="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
                            </label>
                            <button type="submit" class="btn primary">Save Profile</button>
                        </form>
                    </div>
                `;

                document.getElementById("profileForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showNotification("Profile updated successfully!", "success");
                });
                break;

            case "privacy":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Privacy Settings</h2>
                        <div class="toggle-row">
                            <span>Profile Visibility</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="profileVisible" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <button class="btn primary" onclick="showNotification('Privacy settings updated!', 'success')">Save Settings</button>
                    </div>
                `;
                break;

            case "appearance":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Appearance Settings</h2>
                        <div class="setting-group">
                            <label>Theme:</label>
                            <select id="themeSelect" class="setting-select">
                                <option value="dark">Dark (Default)</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <button class="btn primary" onclick="showNotification('Appearance settings applied!', 'success')">Apply Settings</button>
                    </div>
                `;
                break;

            case "account":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Account Settings</h2>
                        <div class="setting-group">
                            <label>Subscription:</label>
                            <p class="account-info">Premium</p>
                        </div>
                        <div class="setting-group">
                            <label>Member Since:</label>
                            <p class="account-info">September 2024</p>
                        </div>
                        <div class="setting-group">
                            <label>Last Login:</label>
                            <p class="account-info">Today, 14:30</p>
                        </div>
                        <button class="btn secondary" onclick="showNotification('Password reset link sent to your email!', 'info')">Change Password</button>
                        <button class="btn secondary" onclick="downloadAccountData()">Download My Data</button>
                    </div>
                `;
                break;
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        if (type === 'success') {
            notification.style.backgroundColor = '#22c55e';
        } else if (type === 'danger') {
            notification.style.backgroundColor = '#e63946';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function downloadAccountData() {
        showNotification('Preparing your data download...', 'info');
        setTimeout(() => {
            showNotification('Download ready! Check your email.', 'success');
        }, 2000);
    }
</script>
