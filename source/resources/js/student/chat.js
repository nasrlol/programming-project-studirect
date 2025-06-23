'use strict';

// Chat functionality for student interface - Simplified with pre-loaded messages
let chatMessages = null;
let messageForm = null;
let messageTextarea = null;
let currentCompanyId = null;
let studentId = null;

// Smart polling variables
let pollingInterval = null;
let isUserActive = true;
let lastMessageTime = null;
let currentPollingCompanyId = null;

// initialize chat when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    setupSmartPolling();
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

// Set up smart polling system
function setupSmartPolling() {
    // Track user activity to adjust polling frequency
    document.addEventListener('visibilitychange', () => {
        isUserActive = !document.hidden;
        if (isUserActive && currentPollingCompanyId) {
            startMessagePolling(currentPollingCompanyId);
        } else if (!isUserActive) {
            // Reduce polling frequency when tab is inactive
            startMessagePolling(currentPollingCompanyId, true);
        }
    });

    // Track user interaction to determine activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            isUserActive = true;
        }, { passive: true });
    });
}

// Start smart polling for messages
function startMessagePolling(companyId, isInactive = false) {
    // Clear any existing interval
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }

    if (!companyId) return;

    currentPollingCompanyId = companyId;

    // Determine polling interval based on user activity
    const interval = isInactive ? 10000 : (isUserActive ? 3000 : 7000); // 3s active, 7s semi-active, 10s inactive

    pollingInterval = setInterval(() => {
        if (currentPollingCompanyId === companyId) {
            fetchNewMessages(companyId);
        }
    }, interval);

    // Also fetch immediately
    fetchNewMessages(companyId);
}

// Fetch new messages from server
function fetchNewMessages(companyId) {
    if (!companyId || !studentId) return;

    const conversationData = {
        user1_id: parseInt(studentId),
        user1_type: 'App\\Models\\Student',
        user2_id: parseInt(companyId),
        user2_type: 'App\\Models\\Company'
    };

    fetch('/messages/conversation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ||
                           document.querySelector('input[name="_token"]')?.value || ''
        },
        body: JSON.stringify(conversationData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.data) {
            updateConversationWithNewMessages(companyId, data.data);
        }
    })
    .catch(error => {
        console.error('Error fetching messages:', error);
        // Don't stop polling on error, just log it
    });
}

// Update conversation with new messages
function updateConversationWithNewMessages(companyId, messages) {
    if (!messages || messages.length === 0) return;

    const conversation = chatMessages.querySelector(`[data-company-id="${companyId}"]`);

    // If no conversation exists, create one
    if (!conversation) {
        createNewConversation(companyId, messages);
        return;
    }

    // Get current messages in the conversation
    const currentMessages = conversation.querySelectorAll('.message');
    const currentMessageCount = currentMessages.length;

    // If we have new messages, update the conversation
    if (messages.length > currentMessageCount) {
        // Clear and rebuild conversation to ensure proper order
        conversation.innerHTML = '';

        messages.forEach(message => {
            const messageDiv = createMessageElement(message);
            conversation.appendChild(messageDiv);
        });

        // Update last message time
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            lastMessageTime = lastMessage.created_at;
        }

        // Scroll to bottom if this is the active conversation
        if (currentPollingCompanyId === companyId) {
            scrollToBottom();
        }

        // Show notification for new messages if tab is not active
        if (!isUserActive && messages.length > currentMessageCount) {
            showNewMessageNotification();
        }
    }
}

// Create a new conversation element
function createNewConversation(companyId, messages) {
    // Hide no messages state
    const noMessages = chatMessages.querySelector('.no-messages');
    if (noMessages) {
        noMessages.style.display = 'none';
        noMessages.classList.remove('active');
    }

    const noMessagesCompany = chatMessages.querySelector('.no-messages-company');
    if (noMessagesCompany) {
        noMessagesCompany.remove();
    }

    // Create new conversation
    const conversation = document.createElement('div');
    conversation.className = 'conversation';
    conversation.setAttribute('data-company-id', companyId);
    conversation.style.display = currentPollingCompanyId === companyId ? 'block' : 'none';

    messages.forEach(message => {
        const messageDiv = createMessageElement(message);
        conversation.appendChild(messageDiv);
    });

    chatMessages.appendChild(conversation);

    if (currentPollingCompanyId === companyId) {
        scrollToBottom();
    }
}

// Create a message element
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender_type === 'App\\Models\\Student' ? 'sent' : 'received'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    const messageText = document.createElement('p');
    messageText.textContent = message.content;

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = formatTime(message.created_at);

    messageContent.appendChild(messageText);
    messageContent.appendChild(messageTime);
    messageDiv.appendChild(messageContent);

    return messageDiv;
}

// Show notification for new messages
function showNewMessageNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New message received', {
            body: 'You have a new message in your chat.',
            icon: '/favicon.ico'
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('New message received', {
                    body: 'You have a new message in your chat.',
                    icon: '/favicon.ico'
                });
            }
        });
    }
}

// Stop polling when leaving the chat
function stopMessagePolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    currentPollingCompanyId = null;
}

// handle company selection
function handleCompanySelection(companyId) {
    if (!companyId) return;

    currentCompanyId.value = companyId;
    showConversation(companyId);

    // Start polling for this company
    startMessagePolling(companyId);
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
    emptyDiv.innerHTML = '<p>Nog geen berichten. Start het gesprek!</p>';

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
            // Trigger immediate polling to get the confirmed message
            if (currentPollingCompanyId) {
                setTimeout(() => fetchNewMessages(currentPollingCompanyId), 500);
            }
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

// Cleanup polling when page is unloaded
window.addEventListener('beforeunload', () => {
    stopMessagePolling();
});
