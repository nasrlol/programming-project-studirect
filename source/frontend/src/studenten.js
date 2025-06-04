function renderSidebarMatches() {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
        sidebar.innerHTML = `
            <div id="meldingen">
                <h2>Notificaties</h2>
                <p>Je hebt geen nieuwe notificaties.</p>
            </div>
            <div id="plattegrond">
                <img src="../public/plattegrondEHB.png">
            </div>
        `;
    }
}

function renderSidebarBerichten() {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
        const names = ['Anna', 'Bram', 'Celine', 'Daan', 'Eva'];
        sidebar.innerHTML = `
            <div id="berichten-lijst">
                ${names.map(name => `<div class="bericht-item">${name}</div>`).join('')}
            </div>
        `;
    }
}

function renderSidebarKalender() {
    const sidebar = document.getElementById('sidebar-content');
    if (sidebar) {
        const afspraken = [
            '09:00 - BATO nv',
            '11:30 - Amplifon',
            '13:00 - Blah Blah',
            '15:00 - Werkgroep',
        ];
        sidebar.innerHTML = `
            <div id="afspraken-lijst">
                <h2>Afspraken</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${afspraken.map(tijd => `<div class="afspraak-item">${tijd}</div>`).join('')}
                </div>
            </div>
        `;
    }
}

renderSidebarMatches();

window.addEventListener('DOMContentLoaded', () => {
    const matchesBtn = document.getElementById('matches');
    if (matchesBtn) {
        matchesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderSidebarMatches();
        });
    }

    const berichtenBtn = document.getElementById('berichten');
    if (berichtenBtn) {
        berichtenBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderSidebarBerichten();
        });
    }

    const kalenderBtn = document.getElementById('kalender');
    if (kalenderBtn) {
        kalenderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderSidebarKalender();
        });
    }
});

