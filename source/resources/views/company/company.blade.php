<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Company</title>
    
    {{-- Vite injectie --}}
    @vite(['resources/css/company/company.css', 'resources/js/company/company.js'])
</head>
<body>
    <header>
        @include('company.layouts.navbar')
    </header>

  <main id="company-content">
    @include('company.layouts.home')
</main>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            const content = document.getElementById("company-content");

            function setActive(tabId) {
                document.querySelectorAll(".nav-btn").forEach(btn => {
                    btn.classList.remove("active");
                });
                document.getElementById(tabId).classList.add("active");
            }

     
            document.getElementById("homeBtn").addEventListener("click", () => {
                loadView("home");
                setActive("homeBtn");
            });
            document.getElementById("messageBtn").addEventListener("click", () => {
                loadView("messages");
                setActive("messageBtn");
            });
            document.getElementById("calendarBtn").addEventListener("click", () => {
                loadView("calendar");
                setActive("calendarBtn");
            });
            document.getElementById("settingsBtn").addEventListener("click", () => {
                loadView("settings");
                setActive("settingsBtn");
            });
        });
    </script>
</body>
</html>