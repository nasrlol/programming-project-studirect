<nav class="navbar">
    <div class="nav-logo">
        <img src="images/studirect.png" alt="StuDirect Logo">
    </div>
    <ul class="nav-links">
        <li><a href="#" id="homeBtn">Home</a></li>
        <li><a href="#" id="matchesBtn">Matches</a></li>
        <li><a href="#" id="calendarBtn">Calendar</a></li>
    </ul>
    <div class="nav-profile" id="profileArea">
        <span class="profile-name">{{ $student['first_name'] ?? 'User' }}</span>
        <div class="profile-pic"></div>
        <div class="profile-dropdown" id="profileDropdown">
            <a href="#" id="settingsBtn">Settings</a>
            <a href="#" id="logoutBtn">Log Out</a>
        </div>
    </div>
</nav>
