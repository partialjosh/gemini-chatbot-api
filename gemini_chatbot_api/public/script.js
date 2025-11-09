document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');

    /**
     * Appends a message to the chat box.
     * @param {string} message - The message content.
     * @param {'user' | 'bot'} sender - The sender of the message.
     * @returns {HTMLElement} The created message element.
     */
    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
        return messageElement;
    };

    /**
     * Handles the form submission to send a message to the chatbot API.
     * @param {Event} event - The form submission event.
     */
    const handleChatSubmit = async (event) => {
        event.preventDefault();
        const userMessage = userInput.value.trim();

        if (!userMessage) {
            return;
        }

        // 1. Add user's message to the chat box
        addMessage(userMessage, 'user');

        // 2. Clear the input field
        userInput.value = '';

        // 3. Show a temporary "Thinking..." bot message
        const thinkingMessageElement = addMessage('Thinking...', 'bot');

        try {
            // 4. Send the user's message to the backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        text: userMessage
                    }],
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();

            // 5. Replace "Thinking..." with the AI's actual response
            if (data && data.result) {
                thinkingMessageElement.textContent = data.result;
            } else {
                // Handle cases where the response is ok but there's no result
                thinkingMessageElement.textContent = 'Sorry, no response received.';
            }
        } catch (error) {
            console.error('Error fetching chat response:', error);
            // 6. Show an error message if the fetch fails
            if (thinkingMessageElement) {
                thinkingMessageElement.textContent = 'Failed to get response from server.';
            } else {
                addMessage('Failed to get response from server.', 'bot');
            }
        }
    };

    chatForm.addEventListener('submit', handleChatSubmit);
});