import { addMessage, openChat } from "./ui.js";
export const actions = {
    greeting(){
        openChat();
        addMessage("Hola! soy Jules-T800 💀, en que te puedo ayudar?"); 
    },

    answer(id){
        if(id === 1) {addMessage("Jules-T800 es un agente virtual diseñado para ayudar a los usuarios a navegar el blog de Jules.");} 
        if(id === 2) {addMessage("Puedes preguntarme sobre las secciones del blog, curiosidades o cualquier otra cosa relacionada con Jules.");}
        if(id === 3) {addMessage("Claro! En profesional busca el proyecto de Braille to Text, te sorprenderá!");}
    },
    
    funfact(section){
        //No forzar la apertura del chat
        addMessage("Dato curioso: cambiaste de sección a " + section + "!");
    }
}