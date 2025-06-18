
<header id="header">
    <div class="left">
        <img id="logo" src='/images/studirect.png' alt="studirect logo">
    </div>
    <div class="center">
        <button id="homeBtn">Home</button>
        <button id="messageBtn">Messages</button>
        <button id="calendarBtn">Calendar</button>
    </div>
    <div class="right">
        <button id="settingsBtn">Settings</button>
    </div>
</header>

<script>
    document.addEventListener("DOMContentLoaded", () => {
        const routes = {
            homeBtn: "@include('company.layouts.home')",
            messageBtn: "@include('company.layouts.messages')",
            calendarBtn: "@include('company.layouts.calendar')",
            settingsBtn: "@include('company.layouts.settings')"
        };

        const content = document.getElementById("content");

        document.querySelectorAll("#header button").forEach(btn => {
            btn.addEventListener("click", () => {
                const active = document.querySelector("#header .active");
                if (active) active.classList.remove("active");
                btn.classList.add("active");

                // Vervang de huidige inhoud met de juiste include (werkt alleen bij server-side render)
                // Voor SPA gedrag moet dit gesplitst blijven in JS-componenten
            });
        });
    });
</script>