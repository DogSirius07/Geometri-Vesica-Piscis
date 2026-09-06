/* RESPOSTAS DINÂMICAS DA ARIA POR PERFIL DE ACESSO */
const ARIA_RESPONSES = {
    PRIMARY: [
        "Aria [Admin]: Todos os sistemas ativos. Logs de exames e relatórios disponíveis.",
        "Aria [Admin]: Permissões elevadas confirmadas. O que deseja configurar?"
    ],
    SECONDARY: [
        "Aria [Cuidado]: Registro salvo. Lembre-se de verificar a medição de glicemia após as refeições.",
        "Aria [Cuidado]: Dica de rotina: Mantenha os horários dos medicamentos sincronizados."
    ],
    GIRLFRIEND: [
        "Aria [Carinho]: Seu pensamento foi colocado no balão e levado com carinho. Estou aqui com você!",
        "Aria [Carinho]: Que tal colocarmos uma frequência calmante de 528 Hz para relaxar agora?"
    ],
    MOTHER: [
        "Aria [Acolhimento]: O ambiente está calmo e protegido. Respire fundo e relaxe.",
        "Aria [Acolhimento]: Tudo está em paz por aqui."
    ]
};

function askAria() {
    const inp = document.getElementById('ariaInput');
    const txt = inp.value.trim();
    if (!txt) return;
    
    const box = document.getElementById('ariaChat');
    box.innerHTML += `<div class="aria-msg user">${txt}</div>`;
    inp.value = '';
    
    setTimeout(() => {
        const options = ARIA_RESPONSES[currentRole] || ["Aria: Estou pronta para ajudar."];
        const randomReply = options[Math.floor(Math.random() * options.length)];
        box.innerHTML += `<div class="aria-msg aria">${randomReply}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 400);
}
