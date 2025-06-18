'use strict';

// Chat functionality for company interface - Simplified with pre-loaded messages
let chatMessages = null;
let messageForm = null;
let messageTextarea = null;
let currentStudentId = null;
let companyId = null;

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
    currentStudentId = document.getElementById('current-student-id');

    // get company ID from the data attribute
    const companyIdElement = document.querySelector('[data-company-id]');
    companyId = companyIdElement?.dataset.companyId;

    if (!companyId) {
        console.error('Company ID not found.');
    }
}

// set up all event listeners
function setupEventListeners() {
    // handle form submission
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            handleMessageSubmit(e);
        });
    }

    // listen for student selection events
    window.addEventListener('studentSelected', function(event) {
        handleStudentSelection(event.detail.studentId);
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

// handle student selection
function handleStudentSelection(studentId) {
    if (!studentId) return;

    currentStudentId.value = studentId;
    showConversation(studentId);
}

// Show conversation for selected student
function showConversation(studentId) {
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
    const noMessagesStudent = chatMessages.querySelector('.no-messages-student');
    if (noMessagesStudent) {
        noMessagesStudent.remove();
    }

    // Show conversation for selected student
    const conversation = chatMessages.querySelector(`[data-student-id="${studentId}"]`);
    if (conversation) {
        conversation.style.display = 'block';
        scrollToBottom();
    } else {
        // No messages for this student yet, show empty state
        showEmptyStateForStudent();
    }
}

// Show empty state for a student with no messages
function showEmptyStateForStudent() {
    // Hide all conversations
    document.querySelectorAll('.conversation').forEach(conv => {
        conv.style.display = 'none';
    });

    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'no-messages-student';
    emptyDiv.innerHTML = '<p>No messages yet. Start the conversation!</p>';

    // Remove any existing empty state
    const existingEmpty = chatMessages.querySelector('.no-messages-student');
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
    const studentId = currentStudentId.value;
    if (!studentId) return;

    // Hide and remove any empty state messages
    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    const noMessagesStudent = chatMessages.querySelector('.no-messages-student');
    if (noMessagesStudent) {
        noMessagesStudent.remove();
    }

    // Find or create conversation container for this student
    let conversation = chatMessages.querySelector(`[data-student-id="${studentId}"]`);
    if (!conversation) {
        conversation = document.createElement('div');
        conversation.className = 'conversation';
        conversation.setAttribute('data-student-id', studentId);
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
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
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
