export const agentState = {
    active: false,
    section: null,
    hasGreeted: false,
    selectedQuestion: null,
    questionAnswered: false,
    idleTime: 0,
};

export function updateState(patch){
    Object.assign(agentState, patch);
}