import { startAgentLoop } from "./loop.js";
import { sensors } from "./sensors.js";
import { evaluateRules } from "./rules.js";

export const agent = {
    start(){
        startAgentLoop();
    },
    notifyAgentClicked(){
        sensors.userClickedAgent = true;
        evaluateRules.evaluate();
    },
    notifyQuestionSelected(id){
        sensors.selectedQuestion = Number(id);
        evaluateRules.evaluate();
    },
    notifySectionChanged(){
        sensors.checkSection();
        evaluateRules.evaluate();
    },
}
