<div id="settings-content" class="content-container">
    <section class="sectionType1 settings-sidebar">
        <div class="settings-nav">
            <h3>Settings</h3>
            <div class="settings-menu">
                <button id="profileSettingsBtn" class="settings-btn active">Profile</button>
                <button id="preferencesBtn" class="settings-btn">Preferences</button>
                <button id="themeBtn" class="settings-btn">Theme</button>
            </div>
        </div>
    </section>

    <section class="sectionType2 settings-main">
        <div id="profile-settings" class="settings-panel active">
            <h2>Company Profile Settings</h2>
            <div class="settings-form">
                <div class="form-group">
                    <label for="companyName">Company Name</label>
                    <input type="text" id="companyName" value="{{ $company['name'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="{{ $company['email'] ?? '' }}" readonly class="readonly-input" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <button class="password-btn" id="changePasswordBtn">Change Password</button>
                </div>
                <div class="form-group">
                    <label for="jobDomain">Job Domain</label>
                    <input type="text" id="jobDomain" placeholder="Enter your company's job domain (e.g., IT, Marketing, Finance, etc.)" value="{{ $company['job_domain'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="jobTypes">Job Types</label>
                    <input type="text" id="jobTypes" placeholder="Enter available job types (e.g., Internship, Full-time, Part-time)" value="{{ $company['job_types'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="boothLocation">Booth Location</label>
                    <input type="text" id="boothLocation" value="{{ $company['booth_location'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="planType">Plan Type</label>
                    <select id="planType">
                        <option value="basic" {{ ($company['plan_type'] ?? '') == 'basic' ? 'selected' : '' }}>Basic</option>
                        <option value="premium" {{ ($company['plan_type'] ?? '') == 'premium' ? 'selected' : '' }}>Premium</option>
                        <option value="enterprise" {{ ($company['plan_type'] ?? '') == 'enterprise' ? 'selected' : '' }}>Enterprise</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="companyDescription">Company Description</label>
                    <textarea id="companyDescription" placeholder="Describe your company and what you do..." rows="4">{{ $company['company_description'] ?? $company['description'] ?? '' }}</textarea>
                </div>
                <div class="form-group">
                    <label for="jobDescription">Job Description</label>
                    <textarea id="jobDescription" placeholder="Describe the available positions and requirements..." rows="4">{{ $company['job_description'] ?? '' }}</textarea>
                </div>
                <div class="form-group">
                    <label for="jobRequirements">Job Requirements</label>
                    <textarea id="jobRequirements" placeholder="List the requirements for the positions..." rows="3">{{ $company['job_requirements'] ?? '' }}</textarea>
                </div>
                <div class="form-group">
                    <label for="speeddateDuration">Speeddate Duration (minutes)</label>
                    <input type="number" id="speeddateDuration" min="1" max="60" value="{{ $company['speeddate_duration'] ?? 15 }}" />
                </div>
                <div class="button-group">
                    <button class="save-btn" id="saveProfileBtn">Save Changes</button>
                    <button class="undo-btn" id="undoChangesBtn" style="display: none;">Undo Changes</button>
                </div>
            </div>
        </div>

        <div id="preferences-settings" class="settings-panel">
            <h2>Preferences</h2>
            <div class="settings-form">
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="emailNotifications" checked>
                        Receive email notifications
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="messageNotifications" checked>
                        Message notifications
                    </label>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="appointmentReminders" checked>
                        Appointment reminders
                    </label>
                </div>
                <div class="form-group">
                    <label for="language">Language</label>
                    <select id="language">
                        <option value="en">English</option>
                        <option value="nl" selected>Nederlands</option>
                        <option value="fr">Français</option>
                    </select>
                </div>
                <button class="save-btn">Save Preferences</button>
            </div>
        </div>

        <div id="theme-settings" class="settings-panel">
            <h2>Theme</h2>
            <div class="settings-form">
                <div class="theme-options">
                    <div class="theme-option active" data-theme="light">
                        <div class="theme-preview light-theme"></div>
                        <span>Light</span>
                    </div>
                    <div class="theme-option" data-theme="dark">
                        <div class="theme-preview dark-theme"></div>
                        <span>Dark</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
