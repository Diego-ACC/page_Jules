// UI del agente: funciones que trabajan con el DOM al ser llamadas
// Obtener referencias a los elementos del DOM del agente
const chatBox = document.getElementById("agent-chat");
const messagesContainer = document.getElementById("agent-messages");

// Función para abrir el chat (visual)
export function openChat(){
    const box = document.getElementById("agent-chat");
    if(!box) return;
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
}

export function closeChat(){
    const box = document.getElementById("agent-chat");
    if(!box) return;
    clearMessages();
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
}

export function isChatOpen(){
    const box = document.getElementById("agent-chat");
    if(!box) return false;
    return box.classList.contains("open");
}

// Agregar un mensaje al chat
export function addMessage(text){
    const msgBox = document.getElementById("agent-messages");
    if(!msgBox) return;

    const div = document.createElement("div");
    div.classList.add("agent-message");
    div.textContent = text;

    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
}

// Borrar los mensajes del chat
export function clearMessages(){
    const msgBox = document.getElementById("agent-messages");
    if(!msgBox) return;
    while(msgBox.firstChild){
        msgBox.removeChild(msgBox.firstChild);
    }
}