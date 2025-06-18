// company.js wordt nu opgesplitst in aparte bestanden per pagina.
// Laat alleen de algemene functies en initialisatie over.

console.log('company.js geladen (main logic)');

// ✅ Algemene variabelen (kunnen nog hergebruikt worden indien nodig)
const loggedInCompanyId = 5; // <-- Vervang met de juiste ID van jouw bedrijf
const loggedInCompanyType = "App/Models/Company";

// ✅ Deze functies kunnen blijven indien nodig voor meerdere pagina's
function getTimeRowIndex(time) {
    const hour = time.split(":"[0]);
    const mapping = { "09": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 6, "15": 7 };
    return mapping[hour] ?? 1;
}

function getMinuteColumnIndex(time) {
    const minute = time.split(":"[1]);
    const mapping = { "00": 1, "15": 2, "30": 3, "45": 4 };
    return mapping[minute] ?? 1;
}

function setAppointment(rowIndex, colIndex, text) {
    const table = document.getElementById("calendar-table");
    if (!table) return;
    const row = table.rows[rowIndex];
    if (row && row.cells[colIndex]) {
        const current = row.cells[colIndex].innerText.trim();
        if (current === "–" || current === "") {
            row.cells[colIndex].innerText = text;
        } else {
            row.cells[colIndex].innerText += "\n" + text;
        }
    }
}

// ✅ Stijltoggle voor actieve knoppen blijft bruikbaar
function setActiveButton(activeId) {
    const buttons = document.querySelectorAll(".center button, .right button");
    buttons.forEach(btn => {
        if (btn.id === activeId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// ❌ Alle specifieke pagina-logica (homeBtn, messageBtn, calendarBtn, settingsBtn) is verplaatst naar aparte bestanden en moet hier dus verwijderd worden.

// Deze file kan optioneel gebruikt worden als centrale entry-point voor algemene functies of variabelen.
// Voor de daadwerkelijke logica gebruik je nu:
// - resources/js/company/home.js
// - resources/js/company/messages.js
// - resources/js/company/calendar.js
// - resources/js/company/settings.js

// (Optioneel: export functies als je bundling gebruikt of ES6 modules wil toepassen)

export {
    loggedInCompanyId,
    loggedInCompanyType,
    getTimeRowIndex,
    getMinuteColumnIndex,
    setAppointment,
    setActiveButton
};
