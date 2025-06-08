console.log('test');
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
        "Steven scheduled a speeddate",
        "Arda swiped you",
        "Dries has an appointment in 5 minutes",
        "..."
    ];

    notifications.forEach(notification => {
        const p = document.createElement("p");
        p.textContent = notification;
        notificationSection.appendChild(p);
    });

    const mapSection = document.createElement("section");
    mapSection.classList.add("map");

    const img = document.createElement("img");
    img.src = "/source/frontend/public/plattegrondvb.png";
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

    loadHomeContent();
    setActiveButton("homeBtn");

    homeBtn.addEventListener("click", () => {
        loadHomeContent();
        setActiveButton("homeBtn");
    });

    /* message page */
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

        const users = [
            {
                name: "Alexandra",
                photo: "https://i.pravatar.cc/40?img=1",
                messages: ["I'm interested in your company"]
            },
            {
                name: "Steven",
                photo: "https://i.pravatar.cc/40?img=2",
                messages: ["When does the speeddating start?"]
            },
            {
                name: "Kevin",
                photo: "https://i.pravatar.cc/40?img=6",
                messages: ["Thanks for your message!"]
            }
        ];

        const chatWindow = document.createElement("div");
        chatWindow.classList.add("chat-window");

        function loadChat(user) {
            chatWindow.innerHTML = "";

            const name = document.createElement("div");
            name.classList.add("chat-name");
            name.innerHTML = `<img src="${user.photo}" class="avatar"> ${user.name}`;
            chatWindow.appendChild(name);

            user.messages.forEach(msg => {
                const bubble = document.createElement("div");
                bubble.classList.add("chat-bubble");
                bubble.textContent = msg;
                chatWindow.appendChild(bubble);
            });

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "type a message";
            input.classList.add("chat-input");

            input.addEventListener("keydown", e => {
                if (e.key === "Enter" && input.value.trim() !== "") {
                    const newMessage = input.value;
                    user.messages.push(newMessage);
                    loadChat(user); // reload to update display
                }
            });

            chatWindow.appendChild(input);
        }

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

        loadChat(users[0]); // load first user by default
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

        appointmentList.innerHTML = `
            <h3>appointments:</h3>
            <p>12:30</p>
            <ul><li>Alexandra</li></ul>
            <p>12:45</p>
            <ul><li>Steven</li></ul>
        `;

        const tableHTML = `
            <table id="calendar-table">
                <tr><th>Time slot</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr>
                <tr><td>09:00</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
                <tr><td>09:15</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
                <tr><td>09:30</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
                <tr><td>12:30</td><td>–</td><td><span style="color:lightblue">Alexandra</span></td><td>–</td><td>–</td><td>–</td></tr>
                <tr><td>12:45</td><td>–</td><td><span style="color:lightblue">Steven</span></td><td>–</td><td>–</td><td>–</td></tr>
            </table>
        `;

        const calendarTable = document.createElement("div");
        calendarTable.classList.add("calendar-table");
        calendarTable.innerHTML = tableHTML;

        calendarContainer.appendChild(appointmentList);
        calendarContainer.appendChild(calendarTable);
        content.appendChild(calendarContainer);
    });
});

function setAppointment(rowIndex, colIndex, text) {
    const table = document.getElementById("calendar-table");
    if (!table) return;
    const row = table.rows[rowIndex];
    if (row && row.cells[colIndex]) {
        row.cells[colIndex].innerText = text;
    }
}

function setActiveButton(activeId) {
    const buttons = document.querySelectorAll(".center button");
    buttons.forEach(btn => {
        if (btn.id === activeId) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}