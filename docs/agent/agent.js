import { startAgentLoop } from "./loop.js";
import { sensors } from "./sensors.js";

export const agent = {
    start(){
        startAgentLoop();
    },
    notifyAgentClicked(){
        sensors.userClickedAgent = true;
    },
    notifyQuestionSelected(id){
        sensors.selectedQuestion = Number(id);
    },
}