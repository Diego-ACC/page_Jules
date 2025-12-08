import { sensors } from "./sensors.js";
import { evaluateRules } from "./rules.js";

export function startAgentLoop() {
    setInterval(() => {
        sensors.checkSection();
        evaluateRules.evaluate();
    }, 300);
}
