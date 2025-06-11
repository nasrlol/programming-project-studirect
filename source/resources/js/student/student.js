'use strict';

// function to render home section
function renderHome() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('homeBtn').classList.add('active');

    // get all sections
    const sections = document.querySelectorAll('.section');

    // section 1: notifications and map
    sections[0].innerHTML = `
        <div id="map-fix">
            <h2>Meldingen</h2>
            <div id="notifications">
                <p>Je hebt geen nieuwe meldingen.</p>
            </div>
            <div id="groundplan">
                <img src="images/plattegrondEHB.png">
            </div>
        </div>
    `;

    // section 2: company match screen content
    sections[1].innerHTML = `
        <div id="company-screen">
            <div id="company-title">
                <h2 id="company-name">ByteForge Solutions</h2>
                <p>IT Support Intern</p>
            </div>
            <div id="company-logo"></div>
            <div id="swipe">
                <button id="dislike">✕</button>
                <button id="like">✓</button>
            </div>
        </div>
    `;

    // section 3: company details
    sections[2].innerHTML = `
        <div id="company-info">
            <div>
                <h5>Description</h5>
                <ul>
                    <li>Ghent, East Flanders</li>
                    <li>Internship</li>
                    <li>February - June 2025 (duration negotiable)</li>
                    <li>Salary: n/a</li>
                    <li>Full-time position</li>
                    <li>Flexible hours</li>
                    <li>Young, dynamic work environment</li>
                </ul>
            </div>
            <div>
                <h5>Requirements</h5>
                <ul>
                    <li>Bachelor Applied Computer Science / Graduate System and Network Management</li>
                    <li>Good communication skills</li>
                    <li>Problem-solving mindset</li>
                    <li>Team player mentality</li>
                    <li>Basic network knowledge</li>
                    <li>Knowledge of Windows Server and Active Directory is a plus</li>
                </ul>
            </div>
            <div>
                <h5>About this company</h5>
            </div>
        </div>
    `;
}

// function to render matches section
function renderMatches() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('matchesBtn').classList.add('active');
}

// function to render calendar section
function renderCalendar() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('calendarBtn').classList.add('active');
}

// ddd event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // home button click handler
    document.getElementById('homeBtn').addEventListener('click', (e) => {
        e.preventDefault();
        renderHome();
    });

    // matches button click handler
    document.getElementById('matchesBtn').addEventListener('click', (e) => {
        e.preventDefault();
        renderMatches();
    });

    // calendar button click handler
    document.getElementById('calendarBtn').addEventListener('click', (e) => {
        e.preventDefault();
        renderCalendar();
    });

    // start with home view
    renderHome();
});
