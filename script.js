const API_KEY = "sk-f982a7d2bb1140a0bb9688fbf5c26ddd";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Respuestas personalizadas
const COMANDOS_ESPECIALES = {
    'quien eres': '¡Hola! Soy HugBotX2, tu asistente de IA personalizado. Fui creado por Hugo Monjas para ayudarte con amor en lo que necesites. 🤖✨',
    'como te llamas': 'Mi nombre es HugBotX2, ¡encantado de conocerte! 😊',
    'qué puedes hacer': 'Puedo ayudarte con información general, resolver dudas, conversar contigo y mucho más. ¡Pregúntame lo que quieras!',
    'quien te creó': 'Fui desarrollado por Hugo Monjas utilizando tecnología de vanguardia y la API de DeepSeek.',
    'quien te creo': 'Fui desarrollado por Hugo Monjas utilizando tecnología de vanguardia y la API de DeepSeek.',
    'quien es tu creador': 'Fui desarrollado por Hugo Monjas utilizando tecnología de vanguardia y la API de DeepSeek.',
    'quién es tu creador': 'Fui desarrollado por Hugo Monjas utilizando tecnología de vanguardia y la API de DeepSeek.'
};

function crearMensaje(texto, esUsuario) {
    const mensaje = document.createElement('div');
    mensaje.classList.add('message', esUsuario ? 'user-message' : 'bot-message');
    mensaje.innerHTML = texto.replace(/\n/g, '<br>');
    
    // Efecto de aparición
    setTimeout(() => {
        mensaje.style.opacity = '1';
        mensaje.style.transform = 'translateY(0)';
    }, 10);
    
    chatMessages.appendChild(mensaje);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return mensaje;
}

async function enviarMensaje() {
    const mensaje = userInput.value.trim().toLowerCase();
    if (!mensaje) return;

    userInput.value = '';
    crearMensaje(mensaje, true);

    // Verificar comandos especiales
    if (COMANDOS_ESPECIALES[mensaje]) {
        crearMensaje(COMANDOS_ESPECIALES[mensaje], false);
        return;
    }

    // Indicador de escritura mejorado
    const indicadorEscritura = crearMensaje('<div class="typing-indicator"></div>', false);
    const dots = indicadorEscritura.querySelector('.typing-indicator');
    
    // Animación de puntos
    dots.innerHTML = `
        <div class="dot"></div>
        <div class="dot" style="animation-delay: 0.2s"></div>
        <div class="dot" style="animation-delay: 0.4s"></div>
    `;

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: mensaje }],
                temperature: 0.7
            })
        });

        const datos = await respuesta.json();
        chatMessages.removeChild(indicadorEscritura);
        crearMensaje(datos.choices[0].message.content, false);
    } catch (error) {
        chatMessages.removeChild(indicadorEscritura);
        crearMensaje('⚠️ Error de conexión. Inténtalo de nuevo.', false);
        console.error('Error:', error);
    }
}

// Eventos
sendButton.addEventListener('click', enviarMensaje);
userInput.addEventListener('keypress', (e) => e.key === 'Enter' && enviarMensaje());

// Mensaje inicial
setTimeout(() => {
    crearMensaje('¡Hola! Soy HugBotX2, tu asistente de IA. ¿En qué puedo ayudarte hoy? 😊', false);
    userInput.focus();
}, 1000);

// Efecto de carga inicial
document.body.style.opacity = '0';
setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
}, 500);


