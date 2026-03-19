import { addMessage, openChat } from "./ui.js";
export const actions = {
    greeting(){
        openChat();
        addMessage("Hello! I'm Jules-T800 💀, how can I help you?"); 
    },

    answer(id){
        if(id === 1) {addMessage("Jules-T800 a virtual agent designed to help users navigate Jules' blog.");} 
        if(id === 2) {addMessage("You can ask me about the blog sections, interesting facts, or anything else related to Jules.");}
        if(id === 3) {addMessage("Sure! In the professional section, look for the Braille to Text project, it will surprise you!");}
    },
    
    funfact(section){
        //No forzar la apertura del chat
        addMessage("Interesting fact: you switched to the " + section + " section!");
    }
}