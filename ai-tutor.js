document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const headerStatus = document.querySelector('.chat-header div p');

    // --- CONFIGURATION ---
    const API_URL = '/api/gemini'; // Calls our own Secure Backend

    // --- INITIALIZATION ---
    function initializeAI() {
        console.log("AI Tutor Initialized. Connected to Secure Serverless Backend.");
        if (headerStatus) {
            headerStatus.textContent = "Online (Secure)";
            headerStatus.style.color = "var(--secondary)";
        }
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

        // Simple formatting for bold text
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'bot', 'loading-msg');
        loadingDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return loadingDiv;
    }

    async function getAIResponse(prompt) {
        const loadingMsg = showLoading();

        try {
            // Call our own secure backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt })
            });

            const data = await response.json();
            loadingMsg.remove();

            if (response.ok && data.text) {
                appendMessage(data.text, 'bot');
            } else {
                console.error("Server Error:", data);
                appendMessage(`System Error: ${data.error || "Unable to connect to AI server."}`, 'bot');
            }

        } catch (error) {
            loadingMsg.remove();
            console.error("Network Error:", error);
            appendMessage("Connection Error: unable to reach the server. Please check your internet.", 'bot');
        }
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text) {
            appendMessage(text, 'user');
            userInput.value = '';
            getAIResponse(text);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    // Start initialization
    initializeAI();
});
