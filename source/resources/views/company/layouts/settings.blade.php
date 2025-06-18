
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


