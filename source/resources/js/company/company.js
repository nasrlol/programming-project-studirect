console.log('test');

const loggedInCompanyId = 5; // <-- Vervang met de juiste ID van jouw bedrijf
const loggedInCompanyType = "App/Models/Company";

function getTimeRowIndex(time) {
    const hour = time.split(":")[0]; // "09:00" → "09"
    const mapping = { "09": 1, "10": 2, "11": 3, "12": 4, "13": 5, "14": 6, "15": 7 };
    return mapping[hour] ?? 1; // default op 09u
}

function getMinuteColumnIndex(time) {
    const minute = time.split(":")[1]; // "09:15" → "15"
    const mapping = { "00": 1, "15": 2, "30": 3, "45": 4 };
    return mapping[minute] ?? 1; // default op 00
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
/*home page*/
function loadHomeContent() {
    content.innerHTML = "";
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const notificationSection = document.createElement("section");
    notificationSection.classList.add("notifications");

    const title = document.createElement("h2");
    title.textContent = "Welkom op de careerlaunch!";
    notificationSection.appendChild(title);

    const notifications = document.createElement("p");
    notifications.textContent = "Wij zijn verheugd om u te verwelkomen als partner in het begeleiden van de professionals van morgen. Via CareerLaunch krijgt u de kans om uw bedrijf in de kijker te zetten, vacatures te delen en rechtstreeks in contact te komen met gemotiveerde studenten. Samen bouwen we aan de toekomst. Start vandaag nog met het ontdekken van talent!";
    notificationSection.appendChild(notifications);


    const mapSection = document.createElement("section");
    mapSection.classList.add("map");

    const img = document.createElement("img");
    img.src = "/images/plattegrondvb.png";
    img.alt = "venue map";
    mapSection.appendChild(img);

    mainContainer.appendChild(notificationSection);
    mainContainer.appendChild(mapSection);

    content.appendChild(mainContainer);
}

console.log("Page loaded");

document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

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

    /*messages page*/

    messageBtn.addEventListener("click", () => {
        console.log("Clicked message button");
        setActiveButton("messageBtn");
        content.innerHTML = "";

        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");

        const chatList = document.createElement("div");
        chatList.classList.add("chat-list");

        const chatTitle = document.createElement("h3");
        chatTitle.textContent = "messages:";
        chatList.appendChild(chatTitle);

        const chatWindow = document.createElement("div");
        chatWindow.classList.add("chat-window");

        function loadChat(user) {
            const receiverId = user.id;
            const receiverType = user.type;

            chatWindow.innerHTML = "";

            const name = document.createElement("div");
            name.classList.add("chat-name");
            name.innerHTML = `<img src="${user.photo}" class="avatar"> ${user.name}`;
            chatWindow.appendChild(name);

            // ✅ Correcte POST naar conversation endpoint
            fetch("http://10.2.160.208/api/messages/conversation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user1_id: loggedInCompanyId,
                    user1_type: loggedInCompanyType,
                    user2_id: receiverId,
                    user2_type: receiverType
                })
            })
                .then(response => response.json())
                .then(data => {
                    const messages = data.conversation || []; // ✅ Correct veld

                    messages.forEach(msg => {
                        const bubble = document.createElement("div");
                        bubble.classList.add("chat-bubble");
                        bubble.textContent = msg.content;

                        if (msg.sender_id === loggedInCompanyId && msg.sender_type === loggedInCompanyType) {
                            bubble.classList.add("me");
                        }

                        chatWindow.appendChild(bubble);
                    });

                    // ✅ Input toevoegen ná alle messages
                    const input = document.createElement("input");
                    input.type = "text";
                    input.placeholder = "Type a message";
                    input.classList.add("chat-input");

                    input.addEventListener("keydown", e => {
                        if (e.key === "Enter" && input.value.trim() !== "") {
                            const contentValue = input.value.trim();

                            fetch("http://10.2.160.208/api/messages/send", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    sender_id: loggedInCompanyId,
                                    sender_type: loggedInCompanyType,
                                    receiver_id: receiverId,
                                    receiver_type: receiverType,
                                    content: contentValue
                                })
                            })
                                .then(response => response.json())
                                .then(() => {
                                    const bubble = document.createElement("div");
                                    bubble.classList.add("chat-bubble", "me");
                                    bubble.textContent = contentValue;
                                    chatWindow.insertBefore(bubble, input);
                                    input.value = "";
                                })
                                .catch(err => {
                                    console.error("Fout bij verzenden:", err);
                                });
                        }
                    });

                    chatWindow.appendChild(input);
                })
                .catch(err => {
                    chatWindow.innerHTML = "<p>Kon berichten niet laden.</p>";
                    console.error("Fout bij ophalen gesprekken:", err);
                });
        }

        // Studenten ophalen
        fetch("http://10.2.160.208/api/students")
            .then(response => response.json())
            .then(apiResponse => {
                const students = Array.isArray(apiResponse.data) ? apiResponse.data : [];
                console.log("Gevonden studenten:", students);

                if (students.length === 0) {
                    chatList.innerHTML += `<p>No users found.</p>`;
                    messageContainer.appendChild(chatList);
                    messageContainer.appendChild(chatWindow);
                    content.appendChild(messageContainer);
                    return;
                }

                const users = students.map((student, index) => ({
                    id: student.id,
                    name: `${student.first_name} ${student.last_name}`.trim() || `Student ${index + 1}`,
                    type: "App/Models/Student",
                    photo: ``
                }));

                users.forEach(user => {
                    const button = document.createElement("div");
                    button.classList.add("user");
                    button.innerHTML = `<img src="${user.photo}" class="avatar"> ${user.name}`;
                    button.addEventListener("click", () => loadChat(user));
                    chatList.appendChild(button);
                });

                messageContainer.appendChild(chatList);
                messageContainer.appendChild(chatWindow);
                content.appendChild(messageContainer);

                if (users.length > 0) {
                    loadChat(users[0]);
                }
            })
            .catch(error => {
                console.error("Fout bij ophalen studenten:", error);
                chatList.innerHTML += `<p>Kon gebruikers niet laden.<br>${error.message}</p>`;
                messageContainer.appendChild(chatList);
                messageContainer.appendChild(chatWindow);
                content.appendChild(messageContainer);
            });
    });


    /* calendar page */
    calendarBtn.addEventListener("click", () => {
        console.log("Clicked calendar button");
        setActiveButton("calendarBtn");
        content.innerHTML = "";

        const calendarContainer = document.createElement("div");
        calendarContainer.classList.add("calendar-container");

        const appointmentList = document.createElement("div");
        appointmentList.classList.add("appointment-list");
        calendarContainer.appendChild(appointmentList);

        const calendarTable = document.createElement("div");
        calendarTable.classList.add("calendar-table");
        calendarTable.innerHTML = `
        <table id="calendar-table">
            <tr><th>Time slots</th><th>00</th><th>15</th><th>30</th><th>45</th></tr>
            <tr><td>09u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>10u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>11u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>12u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>13u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>14u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>15u</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        </table>
    `;
        calendarContainer.appendChild(calendarTable);
        content.appendChild(calendarContainer);
/**
        fetch("http://10.2.160.208/api/appointments")
    .then(response => response.json())
    .then(async (response) => {
        const allAppointments = response.data;

        // ✅ FILTER enkel voor dit bedrijf
        const appointments = allAppointments.filter(appt => appt.company_id === loggedInCompanyId);

        if (appointments.length === 0) {
            appointmentList.innerHTML = "<p>Geen afspraken gevonden voor jouw bedrijf.</p>";
            return;
        }

        appointmentList.innerHTML = "<h3>Afspraken vandaag:</h3>";

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

            const rowIndex = getTimeRowIndex(time);      // bv. 10u = rij 2
            const colIndex = getMinuteColumnIndex(time); // bv. :15 = kolom 2

            const table = document.getElementById("calendar-table");
            const row = table.rows[rowIndex];
            const cell = row?.cells?.[colIndex];

            if (cell && (cell.innerText.trim() === "–" || cell.innerText.trim() === "")) {
                let group = appointmentList.querySelector(`p[data-time='${time}']`);
                if (!group) {
                    group = document.createElement("p");
                    group.dataset.time = time;
                    group.textContent = time;
                    appointmentList.appendChild(group);

                    const ul = document.createElement("ul");
                    ul.dataset.time = time;
                    appointmentList.appendChild(ul);
                }

                const ul = appointmentList.querySelector(`ul[data-time='${time}']`);
                const li = document.createElement("li");
                li.textContent = studentName;
                ul.appendChild(li);

                setAppointment(rowIndex, colIndex, studentName);
            } else {
                console.log(`⛔ Slot al bezet op ${time} (${rowIndex}, ${colIndex}) – overslaan ${studentName}`);
            }
        }
    })
    .catch(error => {
        console.error("Fout bij ophalen van afspraken:", error);
        appointmentList.innerHTML += "<p>Kon afspraken niet laden.</p>";
    });
});
 EINDE **/

// ⬇️ Extra: Appointment ID 6 ophalen
fetch("http://10.2.160.208/api/appointments/6")
    .then(res => {
        if (!res.ok) throw new Error("Appointment 6 niet gevonden.");
        return res.json();
    })
    .then(async ({ data: appointment }) => {
        const section = document.createElement("div");
        section.classList.add("highlight-appointment");

        const title = document.createElement("h3");
        title.textContent = "Belangrijke Afspraak (ID 6)";
        section.appendChild(title);

        const time = appointment.time_slot.split(" - ")[0];
        const rowIndex = getTimeRowIndex(time);
        const colIndex = getMinuteColumnIndex(time);

        let studentName = `Student ${appointment.student_id}`;
        try {
            const res = await fetch(`http://10.2.160.208/api/students/${appointment.student_id}`);
            const studentJson = await res.json();
            if (studentJson.data) {
                const s = studentJson.data;
                studentName = `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim();
            }
        } catch (e) {
            console.warn("Kon student bij afspraak 6 niet ophalen");
        }

        // Toon apart onderaan
        const info = document.createElement("p");
        info.textContent = `Tijdslot: ${appointment.time_slot} — Student: ${studentName}`;
        section.appendChild(info);

        // Optioneel: ook in de kalender zetten
        const table = document.getElementById("calendar-table");
        const cell = table?.rows?.[rowIndex]?.cells?.[colIndex];
        if (cell && (cell.innerText.trim() === "–" || cell.innerText.trim() === "")) {
            setAppointment(rowIndex, colIndex, studentName);
        }

        document.querySelector(".appointment-list").appendChild(section);
    })
    .catch(err => {
        const warning = document.createElement("p");
        warning.textContent = "❌ Kon afspraak met ID 6 niet ophalen.";
        content.appendChild(warning);
        console.error(err);
    });
});

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



    /* settings page */
    settingsBtn.addEventListener("click", () => {
        console.log("Clicked settings button");
        setActiveButton("settingsBtn");
        content.innerHTML = "";

        const settingsContainer = document.createElement("div");
        settingsContainer.classList.add("settings-container");

        // Settings navigation
        const settingsNav = document.createElement("div");
        settingsNav.classList.add("settings-nav");

        const navTitle = document.createElement("h3");
        navTitle.textContent = "settings menu:";
        settingsNav.appendChild(navTitle);

        const navItems = [
            { id: "profile", label: "profile", icon: "👤" },
            
            { id: "appearance", label: "appearance", icon: "🎨" },
            { id: "account", label: "account", icon: "⚙️" }
        ];

        let activeSettingsTab = "profile";

        navItems.forEach(item => {
            const navButton = document.createElement("div");
            navButton.classList.add("settings-nav-item");
            if (item.id === activeSettingsTab) {
                navButton.classList.add("active");
            }
            navButton.innerHTML = `<span class="nav-icon">${item.icon}</span> ${item.label}`;
            navButton.addEventListener("click", () => {
                activeSettingsTab = item.id;
                loadSettingsContent(item.id, settingsContent);

                // Update active nav item
                document.querySelectorAll(".settings-nav-item").forEach(nav => {
                    nav.classList.remove("active");
                });
                navButton.classList.add("active");
            });
            settingsNav.appendChild(navButton);
        });

        // Settings content area
        const settingsContent = document.createElement("div");
        settingsContent.classList.add("settings-content");

        function loadSettingsContent(tabId, contentContainer) {
            contentContainer.innerHTML = "";

            switch (tabId) {
                case "profile":
                    loadProfileSettings(contentContainer);
                    break;
                case "appearance":
                    loadAppearanceSettings(contentContainer);
                    break;
                case "account":
                    loadAccountSettings(contentContainer);
                    break;
            }
        }

        function loadProfileSettings(container) {
            const profileCard = document.createElement("div");
            profileCard.classList.add("profile-card");

            profileCard.innerHTML = `
            <h2>Profile Settings</h2>
            <form id="profileForm">
                <label>
                   Name:
                    <input type="text" id="fullName" value="" placeholder="Enter your company-name">
                </label>
                <label>
                    Email:
                    <input type="email" id="email" value="" placeholder="Enter your email">
                </label>
                
                <label>
                    LinkedIn:
                    <input type="url" id="linkedin" value="" placeholder="Enter your LinkedIn URL">
                </label>
                <label>
                    Bio:
                    <textarea id="bio" rows="3" placeholder="Tell us about your company..."></textarea>
                </label>
                <button type="submit" class="btn primary">Save Profile</button>
            </form>
        `;

            const form = profileCard.querySelector("#profileForm");
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                showNotification("Profile updated successfully!", "success");
            });

            container.appendChild(profileCard);
        }


        function loadAppearanceSettings(container) {
            const settingsCard = document.createElement("div");
            settingsCard.classList.add("settings-card");

            settingsCard.innerHTML = `
            <h2>Appearance Settings</h2>
            <div class="setting-group">
                <label>Theme:</label>
                <select id="themeSelect" class="setting-select">
                    <option value="dark">Dark (Default)</option>
                    <option value="light">Light</option>
                </select>
            </div>
            
            <button class="btn primary" onclick="showNotification('Appearance settings applied!', 'success')">Apply Settings</button>
        `;

            container.appendChild(settingsCard);
        }

        function loadAccountSettings(container) {
            const settingsCard = document.createElement("div");
            settingsCard.classList.add("settings-card");

            settingsCard.innerHTML = `
            <h2>Account Settings</h2>
            <div class="setting-group">
                <label>Subscription:</label>
                <p class="account-info">Premium</p>
            </div>
            <div class="setting-group">
                <label>Member Since:</label>
                <p class="account-info">September 2024</p>
            </div>
            <div class="setting-group">
                <label>Last Login:</label>
                <p class="account-info">Today, 14:30</p>
            </div>
            <button class="btn secondary" onclick="showNotification('Password reset link sent to your email!', 'info')">Change Password</button>
            <button class="btn secondary" onclick="downloadAccountData()">Download My Data</button>
        `;/* <button class="btn danger" onclick="confirmDeleteAccount()">Delete Account</button> disable account hiervan maken*/

            container.appendChild(settingsCard);
        }

        // Load initial content
        loadSettingsContent(activeSettingsTab, settingsContent);

        settingsContainer.appendChild(settingsNav);
        settingsContainer.appendChild(settingsContent);
        content.appendChild(settingsContainer);
    });

    // Utility functions for settings page
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        // Style the notification
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
            notification.style.backgroundColor = '#e63946';
        } else {
            notification.style.backgroundColor = '#3b82f6';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function downloadAccountData() {
        showNotification('Preparing your data download...', 'info');
        // Simulate data preparation
        setTimeout(() => {
            showNotification('Download ready! Check your email.', 'success');
        }, 2000);
    }

    function confirmDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            showNotification('Account deletion initiated. You will receive an email with further instructions.', 'danger');
        }
    };
});
