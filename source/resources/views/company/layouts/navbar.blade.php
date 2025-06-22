<nav class="navbar">
    <div class="nav-logo">
        <img src="{{ asset('images/studirect.png') }}" alt="StuDirect Logo">
    </div>
    <ul class="nav-links">
        <li><a href="#" id="homeBtn">Home</a></li>
        <li><a href="#" id="messageBtn">Messages</a></li>
        <li><a href="#" id="calendarBtn">Calendar</a></li>
    </ul>
    <div class="nav-profile" id="profileArea">
        <span class="profile-name">{{ $company['name'] ?? 'Company' }}</span>
        <div class="profile-pic"></div>
        <div class="profile-dropdown" id="profileDropdown">
            <a href="#" id="settingsBtn">Settings</a>
            <form id="logoutForm" action="{{ route('logout') }}" method="POST" style="display:none;">
                @csrf
            </form>
            <a href="#" id="logoutBtn" onclick="event.preventDefault(); document.getElementById('logoutForm').submit();">Log Out</a>
        </div>
    </div>
</nav>
