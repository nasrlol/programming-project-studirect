'use strict';

// Chat functionality for student interface - Simplified with pre-loaded messages
let chatMessages = null;
let messageForm = null;
let messageTextarea = null;
let currentCompanyId = null;
let studentId = null;

// initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
});

// initialize all DOM elements
function initializeElements() {
    chatMessages = document.getElementById('chat-messages');
    messageForm = document.getElementById('message-form');
    messageTextarea = document.getElementById('message-textarea');
    currentCompanyId = document.getElementById('current-company-id');

    // get student ID from the data attribute
    const studentIdElement = document.querySelector('[data-student-id]');
    studentId = studentIdElement?.dataset.studentId;

    if (!studentId) {
        console.error('Student ID not found.');
    }
}

// set up all event listeners
function setupEventListeners() {
    // handle form submission
    messageForm.addEventListener('submit', function(e) {
        handleMessageSubmit(e);
    });

    // listen for company selection events
    window.addEventListener('companySelected', function(event) {
        handleCompanySelection(event.detail.companyId);
    });

    // enter key in textarea
    if (messageTextarea) {
        messageTextarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                messageForm.dispatchEvent(new Event('submit'));
            }
        });
    }
}

// handle company selection
function handleCompanySelection(companyId) {
    if (!companyId) return;

    currentCompanyId.value = companyId;
    showConversation(companyId);
}

// Show conversation for selected company
function showConversation(companyId) {
    // Hide all conversations
    document.querySelectorAll('.conversation').forEach(conv => {
        conv.style.display = 'none';
    });

    // Hide default no-messages state
    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    // Remove any temporary empty states
    const noMessagesCompany = chatMessages.querySelector('.no-messages-company');
    if (noMessagesCompany) {
        noMessagesCompany.remove();
    }

    // Show conversation for selected company
    const conversation = chatMessages.querySelector(`[data-company-id="${companyId}"]`);
    if (conversation) {
        conversation.style.display = 'block';
        scrollToBottom();
    } else {
        // No messages for this company yet, show empty state
        showEmptyStateForCompany();
    }
}

// Show empty state for a company with no messages
function showEmptyStateForCompany() {
    // Hide all conversations
    document.querySelectorAll('.conversation').forEach(conv => {
        conv.style.display = 'none';
    });

    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'no-messages-company';
    emptyDiv.innerHTML = '<p>No messages yet. Start the conversation!</p>';

    // Remove any existing empty state
    const existingEmpty = chatMessages.querySelector('.no-messages-company');
    if (existingEmpty) {
        existingEmpty.remove();
    }

    chatMessages.appendChild(emptyDiv);
}

// Handle form submission
function handleMessageSubmit(e) {
    e.preventDefault();

    const messageContent = messageTextarea.value.trim();
    if (!messageContent) return;

    // Add message to chat immediately for better UX
    addMessageToChat(messageContent, true);

    // Set hidden input value
    document.getElementById('message-content').value = messageContent;

    // Submit form via fetch
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
            // Message already added to chat, no need to do anything else
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

// Add message to chat (for immediate display when sending)
function addMessageToChat(content, isSent = false) {
    const companyId = currentCompanyId.value;
    if (!companyId) return;

    // Hide and remove any empty state messages
    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    const noMessagesCompany = chatMessages.querySelector('.no-messages-company');
    if (noMessagesCompany) {
        noMessagesCompany.remove();
    }

    // Find or create conversation container for this company
    let conversation = chatMessages.querySelector(`[data-company-id="${companyId}"]`);
    if (!conversation) {
        conversation = document.createElement('div');
        conversation.className = 'conversation';
        conversation.setAttribute('data-company-id', companyId);
        conversation.style.display = 'block';
        chatMessages.appendChild(conversation);
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const messageText = document.createElement('p');
    messageText.textContent = content;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(new Date().toISOString());

    // Put both text and timestamp inside the message-content bubble
    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);
    conversation.appendChild(messageDiv);

    scrollToBottom();
}

// Remove the last sent message (used when sending fails)
function removeLastSentMessage() {
    const messages = chatMessages.querySelectorAll('.message.sent');
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
        lastMessage.remove();
    }
}

// Show error alert
function showErrorAlert(message) {
    alert(message); // You can replace this with a better notification system
}

// Scroll chat to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to format time in military format (24-hour)
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
