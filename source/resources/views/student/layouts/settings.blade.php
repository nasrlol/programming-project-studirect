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
            <h2>Profile Settings</h2>
            <div class="settings-form">
                <div class="form-group">
                    <label for="firstName">First Name</label>
                    <input type="text" id="firstName" value="{{ $student['first_name'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input type="text" id="lastName" value="{{ $student['last_name'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" value="{{ $student['email'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <button class="password-btn" id="changePasswordBtn">Change Password</button>
                </div>
                <div class="form-group">
                    <label for="studyDirection">Study Direction</label>
                    <input type="text" id="studyDirection" placeholder="Enter your study direction (e.g., Toegepaste Informatica, Bedrijfsmanagement, etc.)" value="{{ $student['study_direction'] ?? '' }}" />
                </div>
                <div class="form-group">
                    <label for="graduationTrack">Graduation Track</label>
                    <select id="graduationTrack">
                        <option value="">Select Graduation Track</option>
                        @if(isset($diplomas) && is_array($diplomas))
                            @foreach($diplomas as $diploma)
                                @if(isset($diploma['id']) && isset($diploma['type']))
                                    <option value="{{ $diploma['id'] }}" {{ ($student['graduation_track'] ?? '') == $diploma['id'] ? 'selected' : '' }}>
                                        {{ $diploma['type'] }}
                                    </option>
                                @endif
                            @endforeach
                        @endif
                        {{-- Fallback options if API data is not available --}}
                        @if(!isset($diplomas) || empty($diplomas))
                            <option value="1" {{ ($student['graduation_track'] ?? '') == '1' ? 'selected' : '' }}>Bachelor (Fallback)</option>
                            <option value="2" {{ ($student['graduation_track'] ?? '') == '2' ? 'selected' : '' }}>Master (Fallback)</option>
                            <option value="3" {{ ($student['graduation_track'] ?? '') == '3' ? 'selected' : '' }}>Graduaat (Fallback)</option>
                        @endif
                    </select>
                </div>
                <button class="save-btn">Save Changes</button>
            </div>
        </div>

        <div id="preferences-settings" class="settings-panel">
            <h2>Preferences</h2>
            <div class="settings-form">
                <div class="form-group">
                    <label for="jobPreferences">Job Preferences</label>
                    <textarea id="jobPreferences" rows="4" placeholder="Describe your preferred job type, work environment, location, etc.">{{ $student['job_preferences'] ?? '' }}</textarea>
                </div>
                <div class="form-group">
                    <label for="interests">Interests</label>
                    <textarea id="interests" rows="3" placeholder="List your professional interests, skills, technologies you'd like to work with, etc.">{{ $student['interests'] ?? '' }}</textarea>
                </div>
                <div class="form-group">
                    <label for="cvUpload">Upload CV (PDF)</label>
                    <div class="file-upload-area">
                        <input type="file" id="cvUpload" accept=".pdf" />
                        <div class="file-upload-info">
                            <span class="file-upload-icon">📄</span>
                            <span class="file-upload-text">Click to upload your CV or drag and drop</span>
                            <small>Only PDF files are accepted</small>
                        </div>
                    </div>
                    <div id="currentCV" class="current-file">
                        @if(isset($student['cv_filename']) && $student['cv_filename'])
                            <span>Current CV: {{ $student['cv_filename'] }}</span>
                            <button type="button" class="remove-file-btn">Remove</button>
                        @else
                            <span>No CV uploaded</span>
                        @endif
                    </div>
                </div>
                <button class="save-btn">Save Preferences</button>
            </div>
        </div>

        <div id="theme-settings" class="settings-panel">
            <h2>Theme Settings</h2>
            <div class="settings-form">
                <div class="form-group">
                    <label>Color Theme</label>
                    <div class="theme-options">
                        <button class="theme-option active" data-theme="dark">
                            <div class="theme-preview dark-theme"></div>
                            <span>Dark</span>
                        </button>
                        <button class="theme-option" data-theme="light">
                            <div class="theme-preview light-theme"></div>
                            <span>Light</span>
                        </button>
                    </div>
                </div>
                <button class="save-btn">Apply Theme</button>
            </div>
        </div>
    </section>
</div>
