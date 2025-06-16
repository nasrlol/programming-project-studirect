console.log('test');

const loggedInCompanyId = 5; // <-- Vervang met de juiste ID van jouw bedrijf
const loggedInCompanyType = "App/Models/Company";

function getTimeRowIndex(time) {
    const times = ["09:00", "09:15", "09:30", "10:00", "10:30", "12:30", "12:45"];
    return times.indexOf(time) + 1; // +1 omdat row 0 headers zijn
}

function getDayColumnIndexFromDateString(dateString) {
    const day = new Date(dateString).getDay(); // 0 = zondag
    return day >= 1 && day <= 5 ? day : 1; // Beperk tot ma-vr, fallback = maandag
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

function loadHomeContent() {
    content.innerHTML = "";
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("main-container");

    const notificationSection = document.createElement("section");
    notificationSection.classList.add("notifications");

    const title = document.createElement("h2");
    title.textContent = "recent notifications:";
    notificationSection.appendChild(title);

    const notifications = [
        "momenteel geen meldingen"
    ];

    notifications.forEach(notification => {
        const p = document.createElement("p");
        p.textContent = notification;
        notificationSection.appendChild(p);
    });

    const mapSection = document.createElement("section");
    mapSection.classList.add("map");

    const img = document.createElement("img");
    img.src = "/source/resources/public/plattegrondvb.png";
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

            // 📩 Post om gesprekken op te halen (nieuwe API)
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
                    const messages = data.content || []; // nieuwe API-structuur
                    messages.forEach(msg => {
                        const bubble = document.createElement("div");
                        bubble.classList.add("chat-bubble");
                        bubble.textContent = msg.content;
                        if (msg.sender_id === loggedInCompanyId && msg.sender_type === loggedInCompanyType) {
                            bubble.classList.add("me");
                        }
                        chatWindow.appendChild(bubble);
                    });

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
                                    chatWindow.insertBefore(bubble, input); // boven input invoegen
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
                const students = Array.isArray(apiResponse.data?.data) ? apiResponse.data.data : [];
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
                    photo: `https://i.pravatar.cc/40?img=${(index % 70) + 1}`
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
            <tr><th>Time slot</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr>
            <tr><td>09:00</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>09:15</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>09:30</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>10:00</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>10:30</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>12:30</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
            <tr><td>12:45</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        </table>
    `;
        calendarContainer.appendChild(calendarTable);
        content.appendChild(calendarContainer);

        fetch("http://10.2.160.208/api/appointments")
            .then(response => response.json())
            .then(async (response) => {
                const appointments = response.data;
                appointmentList.innerHTML = "<h3>appointments:</h3>";

                for (const appointment of appointments) {
                    const time = appointment.time_slot.split(" - ")[0]; // "09:00"
                    const studentId = appointment.student_id;

                    let studentName = `Student ${studentId}`;

                    // Probeer student op te halen
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
                    const colIndex = getDayColumnIndexFromDateString(appointment.created_at);
                    const table = document.getElementById("calendar-table");
                    const row = table.rows[rowIndex];
                    const cell = row?.cells?.[colIndex];

                    // ✅ Alleen verdergaan als de cel leeg is
                    if (cell && (cell.innerText.trim() === "–" || cell.innerText.trim() === "")) {
                        // Voeg toe aan linker lijst
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

                        // Zet in de tabel
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
            { id: "notifications", label: "notifications", icon: "🔔" },
            { id: "privacy", label: "privacy", icon: "🔒" },
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
                case "notifications":
                    loadNotificationSettings(contentContainer);
                    break;
                case "privacy":
                    loadPrivacySettings(contentContainer);
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
                    Full Name:
                    <input type="text" id="fullName" value="" placeholder="Enter your full name">
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
                    <textarea id="bio" rows="3" placeholder="Tell us about yourself..."></textarea>
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

        function loadNotificationSettings(container) {
            const settingsCard = document.createElement("div");
            settingsCard.classList.add("settings-card");

            settingsCard.innerHTML = `
            <h2>Notification Settings</h2>
            <div class="toggle-row">
                <span>Email Notifications</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="emailNotif" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            
            <div class="toggle-row">
                <span>Meeting Reminders</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="meetingReminders" checked>
                    <span class="slider"></span>
                </label>
            </div>
            <button class="btn primary" onclick="showNotification('Notification settings saved!', 'success')">Save Settings</button>
        `;

            container.appendChild(settingsCard);
        }

        function loadPrivacySettings(container) {
            const settingsCard = document.createElement("div");
            settingsCard.classList.add("settings-card");

            settingsCard.innerHTML = `
            <h2>Privacy Settings</h2>
            <div class="toggle-row">
                <span>Profile Visibility</span>
                <label class="toggle-switch">
                    <input type="checkbox" id="profileVisible" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            
            <button class="btn primary" onclick="showNotification('Privacy settings updated!', 'success')">Save Settings</button>
        `;

            container.appendChild(settingsCard);
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
