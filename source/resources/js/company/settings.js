// settings.js

export function loadSettingsContent() {
    const content = document.getElementById("content");
    content.innerHTML = "";

    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const settingsNav = document.createElement("nav");
    settingsNav.classList.add("settings-nav");
    settingsNav.innerHTML = `
        <button id="profileBtn">Profiel</button>
        <button id="privacyBtn">Privacy</button>
        <button id="appearanceBtn">Uiterlijk</button>
        <button id="accountBtn">Account</button>
        <button id="notificationsBtn">Notificaties</button>
    `;

    const settingsContent = document.createElement("section");
    settingsContent.id = "settings-content";
    settingsContent.classList.add("settings-content");

    function loadProfileSettings() {
        settingsContent.innerHTML = `
            <h2>Profiel Instellingen</h2>
            <p>Pas je profielgegevens aan.</p>
        `;
    }

    function loadPrivacySettings() {
        settingsContent.innerHTML = `
            <h2>Privacy Instellingen</h2>
            <p>Beheer je privacy voorkeuren.</p>
        `;
    }

    function loadAppearanceSettings() {
        settingsContent.innerHTML = `
            <h2>Uiterlijk Instellingen</h2>
            <p>Pas het uiterlijk van de app aan.</p>
        `;
    }

    function loadAccountSettings() {
        settingsContent.innerHTML = `
            <h2>Account Instellingen</h2>
            <p>Beheer je account.</p>
            <button onclick="downloadAccountData()">Download gegevens</button>
            <button onclick="confirmDeleteAccount()">Verwijder account</button>
        `;
    }

    function loadNotificationSettings() {
        settingsContent.innerHTML = `
            <h2>Notificatie Instellingen</h2>
            <p>Beheer welke meldingen je ontvangt.</p>
        `;
    }

    mainContainer.appendChild(settingsNav);
    mainContainer.appendChild(settingsContent);
    content.appendChild(mainContainer);

    document.getElementById("profileBtn").addEventListener("click", loadProfileSettings);
    document.getElementById("privacyBtn").addEventListener("click", loadPrivacySettings);
    document.getElementById("appearanceBtn").addEventListener("click", loadAppearanceSettings);
    document.getElementById("accountBtn").addEventListener("click", loadAccountSettings);
    document.getElementById("notificationsBtn").addEventListener("click", loadNotificationSettings);

    loadProfileSettings(); // standaard
}

function showNotification(message, success = true) {
    alert(message); // simpele fallback, vervang later met mooie UI
}

function downloadAccountData() {
    showNotification("Je gegevens worden gedownload...");
    // download-logica hier
}

function confirmDeleteAccount() {
    if (confirm("Weet je zeker dat je je account wilt verwijderen?")) {
        showNotification("Account verwijderd (simulatie).");
    }
}
