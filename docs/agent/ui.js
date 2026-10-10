export function openChat() {
  const box = document.getElementById('agent-chat');
  if (!box) return;
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  document.getElementById('agent-button')?.setAttribute('aria-expanded', 'true');
  document.getElementById('agent-input')?.focus();
}
export function closeChat() {
  const box = document.getElementById('agent-chat');
  if (!box) return;
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
  document.getElementById('agent-button')?.setAttribute('aria-expanded', 'false');
  document.getElementById('agent-button')?.focus();
}
export function isChatOpen() {
  return document.getElementById('agent-chat')?.classList.contains('open') || false;
}
export function addMessage(text, speaker = 'Jules-T800') {
  const box = document.getElementById('agent-messages');
  if (!box) return;
  const message = document.createElement('p');
  message.className = 'agent-message';
  message.classList.toggle('user-message', speaker === 'You');
  const name = document.createElement('strong');
  name.textContent = `${speaker}: `;
  message.append(name, document.createTextNode(text));
  box.append(message);
  // Limitar el historial visible para evitar crecimiento ilimitado del DOM.
  while (box.children.length > 60) box.firstElementChild.remove();
  box.scrollTop = box.scrollHeight;
}
export function setChoices(choices) {
  const box = document.getElementById('agent-questions');
  if (!box) return;
  box.replaceChildren(...choices.map(([label, command]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', label);
    button.dataset.agentCommand = command;
    return button;
  }));
}
export function clearMessages() {
  document.getElementById('agent-messages')?.replaceChildren();
}

export function setStatus(status = 'READY') {
  const label = document.getElementById('agent-status');
  if (label) label.textContent = status;
}
