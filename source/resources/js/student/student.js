'use strict';

//renderen van elementen voor match pagina
function renderMatch() {
    const sidebar = document.getElementById('sidebar-content');
    
    //renderen van sidebar
    if (sidebar) {
        sidebar.innerHTML = `
            <div id="notifications">
                <h2>Meldingen:</h2>
                <p>Je hebt geen nieuwe meldingen.</p>
            </div>
            <div id="groundplan">
                <img src="../public/plattegrondEHB.png">
            </div>
        `;
    }
    const screenContent = document.getElementById('screen-content');
    
    //renderen van bedrijf kaart
    if (screenContent) {
        screenContent.innerHTML = `
            <div id="screen-rectangle">
                <div id="company-title">
                    <h2 id="company-name">Byteforge Solutions</h2>
                    <p>IT Support Intern</p>
                </div>
                <div id="logo-placeholder"></div>
                <div id="company-info">
                    <div>
                        <h5>Omschrijving</h5>
                        <ul>
                        <li>Gent, Oost-Vlaanderen</li>
                        <li>Stage</li>
                        <li>februari - juni 2025 (duur tijd bespreekbaar)</li>
                        <li>Loon: n/a</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Vereisten</h5>
                        <ul>
                        <li>Bachelor Toegepaste Informatica / Graduaat Systeem- en Netwerkbeheer</li>
                        <li>soft skill</li>
                        <li>rijbewijs</li>
                        </ul>
                    </div>
                    <div>
                        <h5>Over dit bedrijf</h5>
                        <p>ByteForge Solutions is een groeiend softwarebedrijf gespecialiseerd in maatwerkapplicaties voor KMO's. Met een klein maar gedreven team bouwen we weboplossingen, automatisering, ...</p>
                    </div>
                </div>
                <div id="swipe">
                    <button>✕</button>
                    <button>✓</button>
                </div>
            </div>
        `;
    }
}

//renderen van match pagina wanneer de pagina geladen wordt
renderMatch();

//renderen van elementen voor message pagina
function renderMessage() {
    const sidebar = document.getElementById('sidebar-content');
    
    //renderen van sidebar
    if (sidebar) {
        const names = ['BATO nv', 'Werkgroep', 'Blah Blah', 'Amplifon'];
        sidebar.innerHTML = `
            <div id="message-list">
                ${names.map(name => `<div class="message-item">${name}</div>`).join('')}
            </div>
        `;
    }
    const screenContent = document.getElementById('screen-content');
    
    //renderen van messages
    if (screenContent) {
        screenContent.innerHTML = `
            <div id="message-info">
                <h3>Je chatberichten</h3>
                <p>Selecteer een naam om het gesprek te openen</p>
            </div>
        `;
    }
}

//renderen van elementen voor kalender pagina
function renderCalendar() {
    const sidebar = document.getElementById('sidebar-content');
    
    //renderen van sidebar
    if (sidebar) {
        const times = [
            '09:00 - BATO nv',
            '11:30 - Amplifon',
            '13:00 - Blah Blah',
            '15:00 - Werkgroep',
        ];
        sidebar.innerHTML = `
            <div id="times-list">
                <h2>Afspraken</h2>
                <div>
                    ${times.map(tijd => `<div class="afspraak-item">${tijd}</div>`).join('')}
                </div>
            </div>
        `;
    }
    const screenContent = document.getElementById('screen-content');
    
    //renderen van kalender
    if (screenContent) {
        let table = '<table id="calendar-table">';
        table += `
            <tr><th rowspan=2>Tijdslot</th><th colspan=4>Bedrijven</th></tr>
            <tr><th>:00</th><th>:15</th><th>:30</th><th>:45</th></tr>
            <tr><th>9:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>10:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>11:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>12:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>13:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>14:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>15:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>16:00</th><td></td><td></td><td></td><td></td></tr>
            <tr><th>17:00</th><td></td><td></td><td></td><td></td></tr>
        `;
        table += '</table>';
        screenContent.innerHTML = table;

        //afspraken toevoegen aan de kalender
        setTime(2, 1, 'BATO nv');
        setTime(4, 3, 'Amplifon');
        setTime(6, 1, 'Blah Blah');
        setTime(8, 1, 'Werkgroep');
    }
}

//functie om afspraken toe te voegen aan de kalender
function setTime(rowIndex, colIndex, text) {
    const table = document.getElementById("calendar-table");
    if (!table) return;
    const row = table.rows[rowIndex];
    if (row && row.cells[colIndex]) {
        row.cells[colIndex].innerText = text;
    }
}

window.addEventListener('DOMContentLoaded', () => { 

    //event listeners voor match knop
    const matchBtn = document.getElementById('match');
    if (matchBtn) {
        matchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderMatch();
        });
    }

    //event listeners voor message knop
    const messageBtn = document.getElementById('message');
    if (messageBtn) {
        messageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderMessage();
        });
    }

    //event listeners voor kalender knop
    const calendarBtn = document.getElementById('calendar');
    if (calendarBtn) {
        calendarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderCalendar();
        });
    }
});