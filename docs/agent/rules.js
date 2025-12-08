import { sensors } from "./sensors.js";
import { actions } from "./actions.js";
import { isChatOpen } from "./ui.js";

export const evaluateRules = {
    evaluate(){

        if(sensors.userClickedAgent){
            sensors.userClickedAgent = false;
            actions.greeting();
        }

        if(sensors.selectedQuestion !== null){
            actions.answer(sensors.selectedQuestion);
            sensors.selectedQuestion = null;
        }

        if(sensors.changedSection !== null && isChatOpen()){
            actions.funfact(sensors.changedSection);
            sensors.changedSection = null;
        }else{} //No hacemos nada si el chat no está abierto
    }
};
