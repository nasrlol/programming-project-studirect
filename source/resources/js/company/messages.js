'use strict';

export function loadMessages(content) {
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

    fetch("http://10.2.160.208/api/students")
        .then(res => res.json())
        .then(apiResponse => {
            const students = Array.isArray(apiResponse.data) ? apiResponse.data : [];

            if (students.length === 0) {
                chatList.innerHTML += `<p>No users found.</p>`;
                appendToContent();
                return;
            }

            const users = students.map((s, i) => ({
                id: s.id,
                name: `${s.first_name} ${s.last_name}`.trim() || `Student ${i + 1}`,
                type: "App/Models/Student",
                photo: ""
            }));

            users.forEach(user => {
                const button = document.createElement("div");
                button.classList.add("user");
                button.innerHTML = `<img src="${user.photo}" class="avatar"> ${user.name}`;
                button.addEventListener("click", () => loadChat(user));
                chatList.appendChild(button);
            });

            appendToContent();
            if (users.length > 0) loadChat(users[0]);
        })
        .catch(err => {
            console.error("Fout bij ophalen studenten:", err);
            chatList.innerHTML += `<p>Kon gebruikers niet laden.<br>${err.message}</p>`;
            appendToContent();
        });

    function appendToContent() {
        messageContainer.appendChild(chatList);
        messageContainer.appendChild(chatWindow);
        content.appendChild(messageContainer);
    }

    function loadChat(user) {
        const receiverId = user.id;
        const receiverType = user.type;

        chatWindow.innerHTML = "";

        const name = document.createElement("div");
        name.classList.add("chat-name");
        name.innerHTML = `<img src="${user.photo}" class="avatar"> ${user.name}`;
        chatWindow.appendChild(name);

        fetch("http://10.2.160.208/api/messages/conversation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user1_id: loggedInCompanyId,
                user1_type: loggedInCompanyType,
                user2_id: receiverId,
                user2_type: receiverType
            })
        })
            .then(res => res.json())
            .then(data => {
                const messages = data.conversation || [];

                messages.forEach(msg => {
                    const bubble = document.createElement("div");
                    bubble.classList.add("chat-bubble");
                    if (msg.sender_id === loggedInCompanyId && msg.sender_type === loggedInCompanyType) {
                        bubble.classList.add("me");
                    }
                    bubble.textContent = msg.content;
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
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                sender_id: loggedInCompanyId,
                                sender_type: loggedInCompanyType,
                                receiver_id: receiverId,
                                receiver_type: receiverType,
                                content: contentValue
                            })
                        })
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
}