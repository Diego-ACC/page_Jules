import { isChatOpen } from "./ui.js";

export const sensors = {
    getSelection(){
        return document.body.getAttribute("data-section");
    },

    userClickedAgent: false,
    selectedQuestion: null,
    changedSection: null,
    _lastSection: null,

    checkSection(){
        const current = this.getSelection();
        if(current !== this._lastSection){
            if(this._lastSection !== null && isChatOpen()){
                //Si ya existía una sección previa, registramos el cambio
                this.changedSection = current;
            }else{
                //Primera vez que se detecta una sección, no es un cambio
                this.changedSection = null;
            }
            this._lastSection = current;
        }else{
            this.changedSection = null;
        }
    },

    reset(){
        this.userClickedAgent = false;
        this.selectedQuestion = null;
        this.changedSection = null;
    }
}