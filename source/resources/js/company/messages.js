'use strict';

let chatMessages = null;
let messageForm = null;
let messageTextarea = null;
let currentStudentId = null;
let companyId = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
});

function initializeElements() {
    chatMessages = document.getElementById('chat-messages');
    messageForm = document.getElementById('message-form');
    messageTextarea = document.getElementById('message-textarea');
    currentStudentId = document.getElementById('current-student-id');

    const companyIdElement = document.querySelector('[data-company-id]');
    companyId = companyIdElement?.dataset.companyId;

    if (!companyId) {
        console.error('Company ID not found.');
    }
}

function setupEventListeners() {
    messageForm.addEventListener('submit', function(e) {
        handleMessageSubmit(e);
    });

    window.addEventListener('studentSelected', function(event) {
        handleStudentSelection(event.detail.studentId);
    });

    if (messageTextarea) {
        messageTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                messageForm.dispatchEvent(new Event('submit'));
            }
        });
    }
}

function handleStudentSelection(studentId) {
    if (!studentId) return;
    currentStudentId.value = studentId;
    showConversation(studentId);
}

function showConversation(studentId) {
    document.querySelectorAll('.conversation').forEach(conv => {
        conv.style.display = 'none';
    });

    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    const noMessagesCompany = chatMessages.querySelector('.no-messages-student');
    if (noMessagesCompany) {
        noMessagesCompany.remove();
    }

    const conversation = chatMessages.querySelector(`[data-student-id="${studentId}"]`);
    if (conversation) {
        conversation.style.display = 'block';
        scrollToBottom();
    } else {
        showEmptyStateForStudent();
    }
}

function showEmptyStateForStudent() {
    document.querySelectorAll('.conversation').forEach(conv => {
        conv.style.display = 'none';
    });

    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'no-messages-student';
    emptyDiv.innerHTML = '<p>No messages yet. Start the conversation!</p>';

    const existingEmpty = chatMessages.querySelector('.no-messages-student');
    if (existingEmpty) {
        existingEmpty.remove();
    }

    chatMessages.appendChild(emptyDiv);
}

function handleMessageSubmit(e) {
    e.preventDefault();

    const messageContent = messageTextarea.value.trim();
    if (!messageContent) return;

    addMessageToChat(messageContent, true);
    document.getElementById('message-content').value = messageContent;

    const formData = new FormData(messageForm);

    fetch(messageForm.action, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageTextarea.value = '';
        } else {
            throw new Error(data.message || 'Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
        removeLastSentMessage();
        showErrorAlert('Failed to send message. Please try again.');
    });
}

function addMessageToChat(content, isSent = false) {
    const studentId = currentStudentId.value;
    if (!studentId) return;

    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    const noMessagesStudent = chatMessages.querySelector('.no-messages-student');
    if (noMessagesStudent) {
        noMessagesStudent.remove();
    }

    let conversation = chatMessages.querySelector(`[data-student-id="${studentId}"]`);
    if (!conversation) {
        conversation = document.createElement('div');
        conversation.className = 'conversation';
        conversation.setAttribute('data-student-id', studentId);
        conversation.style.display = 'block';
        chatMessages.appendChild(conversation);
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(new Date().toISOString());

    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(messageTime);
    conversation.appendChild(messageDiv);

    scrollToBottom();
}

function removeLastSentMessage() {
    const messages = chatMessages.querySelectorAll('.message.sent');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
        lastMessage.remove();
    }
}

function showErrorAlert(message) {
    alert(message);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}