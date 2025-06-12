'use strict';

// function to render home section
function renderHome() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('homeBtn').classList.add('active');

    // show home content, hide others
    document.querySelectorAll('.container').forEach(section => section.classList.remove('active'));
    document.getElementById('home-content').classList.add('active');
}

// function to render matches section
function renderMatches() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('matchesBtn').classList.add('active');

    // show matches content, hide others
    document.querySelectorAll('.container').forEach(section => section.classList.remove('active'));
    document.getElementById('matches-content').classList.add('active');
}

// function to render calendar section
function renderCalendar() {
    // update active button
    document.querySelectorAll('.nav-links a').forEach(button => button.classList.remove('active'));
    document.getElementById('calendarBtn').classList.add('active');

    // show calendar content, hide others
    document.querySelectorAll('.container').forEach(section => section.classList.remove('active'));
    document.getElementById('calendar-content').classList.add('active');
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
