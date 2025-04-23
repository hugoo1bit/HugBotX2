// Configuración de DeepSeek
const API_KEY = "sk-f982a7d2bb1140a0bb9688fbf5c26ddd"; // Tu API Key
const API_URL = "https://api.deepseek.com/v1/chat/completions";

// Elementos del chat
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Función para agregar mensajes
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para enviar mensaje a DeepSeek
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    addMessage(message, true);
    userInput.value = '';

    // Mostrar "escribiendo..."
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot-message', 'typing-indicator');
    typingIndicator.textContent = "Escribiendo";
    chatMessages.appendChild(typingIndicator);

    try {
        // Enviar a DeepSeek API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: message }],
                temperature: 0.7
            })
        });

        const data = await response.json();
        chatMessages.removeChild(typingIndicator);
        addMessage(data.choices[0].message.content, false);
    } catch (error) {
        chatMessages.removeChild(typingIndicator);
        addMessage("⚠️ Error: " + error.message, false);
        console.error("Error:", error);
    }
}

// Eventos
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Mensaje de bienvenida
setTimeout(() => {
    addMessage("¡Hola! Soy tu asistente de HUGBOT. ¿En qué puedo ayudarte hoy? 😊", false);
}, 1000);