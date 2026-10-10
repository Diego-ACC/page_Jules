import { sensors } from "./sensors.js";

export function startAgentLoop() {
    // Los eventos de navegación y del chat notifican los cambios directamente.
    sensors.checkSection();
}
