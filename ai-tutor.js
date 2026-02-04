document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const headerStatus = document.querySelector('.chat-header div p');

    // --- CONFIGURATION ---
    const API_KEY = 'AIzaSyBKATl8Rxs5eC1totrP5e2ak0epCguVEJo'; // Provided by user
    let API_URL = '';
    let DEMO_MODE = false;

    // --- INITIALIZATION ---
    async function initializeAI() {
        try {
            // 1. Try to list models to see what this key can actually access
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
            const data = await response.json();

            if (response.ok && data.models) {
                // Filter for models that support generating content
                const supportedModels = data.models.filter(m =>
                    m.supportedGenerationMethods &&
                    m.supportedGenerationMethods.includes("generateContent")
                );

                if (supportedModels.length > 0) {
                    // Success! Pick the first valid model (usually gemini-1.5-flash or gemini-pro)
                    const chosenModel = supportedModels[0].name.replace('models/', '');
                    API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent?key=${API_KEY}`;

                    console.log(`Connected to Google AI using model: ${chosenModel}`);
                    if (headerStatus) {
                        headerStatus.textContent = `Online (${chosenModel})`;
                        headerStatus.style.color = "var(--secondary)";
                    }
                    DEMO_MODE = false;
                    return;
                }
            }

            // If we get here, listing worked but no models found, or listing failed
            console.warn("No compatible models found or API listing failed. Switching to Demo Mode.");
            throw new Error("No compatible models found");

        } catch (error) {
            console.error("API Initialization Failed:", error);
            activateDemoMode();
        }
    }

    function activateDemoMode() {
        DEMO_MODE = true;
        console.log("Demo Mode Activated");
        if (headerStatus) {
            headerStatus.textContent = "Demo Mode (Simulated)";
            headerStatus.style.color = "#888"; // Grey for demo
        }
        appendMessage("<strong>System Notice:</strong> Unable to connect to Google AI (API Key restricted or Region blocked). Switched to <strong>Demo Mode</strong> so you can still test the interface.", 'bot');
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);

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

        if (DEMO_MODE) {
            // --- DEMO MODE RESPONSES ---
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            loadingMsg.remove();

            const lower = prompt.toLowerCase();
            let response = "That's a great question! I'm in Demo Mode, but a real AI would explain it in detail.";

            if (lower.includes('hello') || lower.includes('hi')) response = "Hello! I'm your AI Tutor (Demo). How can I help you learn today?";
            else if (lower.includes('math')) response = "Math is fun! In **Algebra**, we solve for x. For example: 2x = 10 means x = 5.";
            else if (lower.includes('science')) response = "**Science** explores the world! From atoms to galaxies, we use observation to understand nature.";
            else if (lower.includes('history')) response = "Impact High School was founded in **2019**. We are rewriting history every day!";

            appendMessage(response, 'bot');
            return;
        }

        // --- REAL AI RESPONSE ---
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "You are a helpful school tutor. Context: High School. Brief answer. Question: " + prompt
                        }]
                    }]
                })
            });

            const data = await response.json();
            loadingMsg.remove();

            if (response.ok && data.candidates && data.candidates[0].content) {
                appendMessage(data.candidates[0].content.parts[0].text, 'bot');
            } else {
                // If the real API fails mid-chat, fallback to error message
                console.error("API Error during chat:", data);
                appendMessage(`System Error: ${data.error?.message || response.statusText}.`, 'bot');
            }

        } catch (error) {
            loadingMsg.remove();
            appendMessage("Connection Error: " + error.message, 'bot');
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
