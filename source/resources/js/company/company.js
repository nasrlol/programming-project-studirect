'use strict';

const loggedInCompanyId = 5;

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("company-content");

    const homeBtn = document.getElementById("homeBtn");
    const messageBtn = document.getElementById("messageBtn");
    const calendarBtn = document.getElementById("calendarBtn");
    const settingsBtn = document.getElementById("settingsBtn");

    loadHomeContent();
    setActiveButton("homeBtn");

    homeBtn.addEventListener("click", () => {
        loadHomeContent();
        setActiveButton("homeBtn");
    });

    messageBtn.addEventListener("click", () => {
        fetch('/company/messages')
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                setActiveButton("messageBtn");
                if (typeof initMessages === 'function') initMessages();
            });
    });

    calendarBtn.addEventListener("click", () => {
        fetch('/company/calendar')
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                setActiveButton("calendarBtn");
                loadAppointments();
            });
    });

    settingsBtn.addEventListener("click", () => {
        fetch('/company/settings')
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
                setActiveButton("settingsBtn");
                loadSettingsTab('profile', document.querySelector(".settings-nav-item.active"));
            });
    });

    function setActiveButton(activeId) {
        document.querySelectorAll(".center button, .right button").forEach(btn => {
            btn.classList.toggle("active", btn.id === activeId);
        });
    }

    function loadHomeContent() {
        fetch('/company/home')
            .then(res => res.text())
            .then(html => {
                content.innerHTML = html;
            });
    }

    function loadAppointments() {
        fetch("http://10.2.160.208/api/appointments")
            .then(response => response.json())
            .then(async (response) => {
                const allAppointments = response.data;
                const appointments = allAppointments.filter(appt => appt.company_id === loggedInCompanyId);

                const appointmentListDiv = document.getElementById("appointmentList");
                if (!appointmentListDiv) return;

                if (appointments.length === 0) {
                    appointmentListDiv.innerHTML = "<p>Geen afspraken gevonden voor jouw bedrijf.</p>";
                    return;
                }

                for (const appointment of appointments) {
                    const time = appointment.time_slot.split(" - ")[0];
                    const studentId = appointment.student_id;

                    let studentName = `Student ${studentId}`;
                    try {
                        const studentRes = await fetch(`http://10.2.160.208/api/students/${studentId}`);
                        const studentJson = await studentRes.json();
                        if (studentJson.data) {
                            const s = studentJson.data;
                            studentName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
                        }
                    } catch (error) {
                        console.warn(`Kon student ${studentId} niet ophalen`);
                    }

                    const rowIndex = getTimeRowIndex(time);
                    const colIndex = getMinuteColumnIndex(time);

                    const groupId = `group-${time.replace(":", "")}`;
                    let group = document.getElementById(groupId);
                    if (!group) {
                        group = document.createElement("div");
                        group.id = groupId;
                        group.innerHTML = `<p><strong>${time}</strong></p><ul data-time="${time}"></ul>`;
                        appointmentListDiv.appendChild(group);
                    }

                    const ul = group.querySelector("ul");
                    const li = document.createElement("li");
                    li.textContent = studentName;
                    ul.appendChild(li);

                    setAppointment(rowIndex, colIndex, studentName);
                }
            })
            .catch(error => {
                console.error("Fout bij ophalen van afspraken:", error);
                const appointmentListDiv = document.getElementById("appointmentList");
                if (appointmentListDiv) {
                    appointmentListDiv.innerHTML += "<p>Kon afspraken niet laden.</p>";
                }
            });
    }

    function getTimeRowIndex(time) {
        const hour = time.split(":")[0];
        const mapping = { "09": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 6, "15": 7 };
        return mapping[hour] ?? 1;
    }

    function getMinuteColumnIndex(time) {
        const minute = time.split(":")[1];
        const mapping = { "00": 1, "15": 2, "30": 3, "45": 4 };
        return mapping[minute] ?? 1;
    }

    function setAppointment(rowIndex, colIndex, text) {
        const table = document.getElementById("calendar-table");
        if (!table) return;
        const row = table.rows[rowIndex];
        if (row && row.cells[colIndex]) {
            const current = row.cells[colIndex].innerText.trim();
            row.cells[colIndex].innerText = current === "–" || current === "" ? text : `${current}\n${text}`;
        }
    }

    // SETTINGS LOGIC
    window.loadSettingsTab = function (tab, activeElement) {
        document.querySelectorAll(".settings-nav-item").forEach(nav => nav.classList.remove("active"));
        activeElement.classList.add("active");

        const content = document.getElementById("settingsContent");
        content.innerHTML = "";

        switch (tab) {
            case "profile":
                content.innerHTML = `
                    <div class="profile-card">
                        <h2>Profile Settings</h2>
                        <form id="profileForm">
                            <label>Full Name:<input type="text" id="fullName" placeholder="Enter your full name"></label>
                            <label>Email:<input type="email" id="email" placeholder="Enter your email"></label>
                            <label>LinkedIn:<input type="url" id="linkedin" placeholder="Enter your LinkedIn URL"></label>
                            <label>Bio:<textarea id="bio" rows="3" placeholder="Tell us about yourself..."></textarea></label>
                            <button type="submit" class="btn primary">Save Profile</button>
                        </form>
                    </div>
                `;
                document.getElementById("profileForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    showNotification("Profile updated successfully!", "success");
                });
                break;

            case "privacy":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Privacy Settings</h2>
                        <div class="toggle-row">
                            <span>Profile Visibility</span>
                            <label class="toggle-switch">
                                <input type="checkbox" id="profileVisible" checked>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <button class="btn primary" onclick="showNotification('Privacy settings updated!', 'success')">Save Settings</button>
                    </div>
                `;
                break;

            case "appearance":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Appearance Settings</h2>
                        <div class="setting-group">
                            <label>Theme:</label>
                            <select id="themeSelect" class="setting-select">
                                <option value="dark">Dark (Default)</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <button class="btn primary" onclick="showNotification('Appearance settings applied!', 'success')">Apply Settings</button>
                    </div>
                `;
                break;

            case "account":
                content.innerHTML = `
                    <div class="settings-card">
                        <h2>Account Settings</h2>
                        <div class="setting-group"><label>Subscription:</label><p class="account-info">Premium</p></div>
                        <div class="setting-group"><label>Member Since:</label><p class="account-info">September 2024</p></div>
                        <div class="setting-group"><label>Last Login:</label><p class="account-info">Today, 14:30</p></div>
                        <button class="btn secondary" onclick="showNotification('Password reset link sent to your email!', 'info')">Change Password</button>
                        <button class="btn secondary" onclick="downloadAccountData()">Download My Data</button>
                    </div>
                `;
                break;
        }
    };

    window.showNotification = function (message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        if (type === 'success') {
            notification.style.backgroundColor = '#22c55e';
        } else if (type === 'danger') {
            notification

        }
    }
});