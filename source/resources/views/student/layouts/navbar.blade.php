<nav class="navbar">
    <div class="nav-profile">
        <div class="profile-pic"></div>
        <span class="profile-name">{{ $student['first_name'] ?? 'User' }}</span>
    </div>
    <ul class="nav-links">
        <li><a href="#" id="homeBtn">Home</a></li>
        <li><a href="#" id="matchesBtn">Matches</a></li>
        <li><a href="#" id="calendarBtn">Calendar</a></li>
    </ul>
    <div class="nav-logo">
        <img src="images/studirect.png" alt="StuDirect Logo">
    </div>
</nav>
