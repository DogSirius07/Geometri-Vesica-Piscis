const temasDisponiveis = {
    "Midnight Blue": { bg: "#020617", card: "#0f172a", text: "#f8fafc", accent: "#6366f1", hover: "#4f46e5", border: "#1e293b" },
    "Matrix Esmerald": { bg: "#020904", card: "#0a170d", text: "#00ff66", accent: "#16a34a", hover: "#15803d", border: "#14532d" },
    "Cyberpunk Dark": { bg: "#0a020f", card: "#180824", text: "#f43f5e", accent: "#e11d48", hover: "#be123c", border: "#881337" },
    "Rose Gold": { bg: "#fff5f5", card: "#ffffff", text: "#4a3b3c", accent: "#d4a5a5", hover: "#bc8a8a", border: "#e6c5c5" }
};

function carregarBanco() {
    let dados = localStorage.getItem('aria_os_db_v10');
    if (!dados) {
        let padrao = {
            "admin": {
                senha: "123",
                tema: "Midnight Blue",
                notas: "",
                metas: [],
                habitos: [],
                recado: "",
                sintonia: "",
                tarefas: [],
                financas: [],
                galeria: [],
                log: "Núcleo neural infinito inicializado.",
                chat: []
            }
        };
        localStorage.setItem('aria_os_db_v10', JSON.stringify(padrao));
        return padrao;
    }
    try { return JSON.parse(dados); } catch (e) {
        localStorage.removeItem('aria_os_db_v10');
        return carregarBanco();
    }
}

function salvarBanco(db) {
    localStorage.setItem('aria_os_db_v10', JSON.stringify(db));
}

let usuarioLogado = localStorage.getItem('aria_os_user_v10') || null;
let tipoGeometria = 'vesica';
let pomodoroInterval = null;
let tempoRestante = 1500;
let pomodoroAtivo = false;

function mudarTema(nome) {
    let t = temasDisponiveis[nome] || temasDisponiveis["Midnight Blue"];
    let r = document.documentElement;
    r.style.setProperty('--bg', t.bg);
    r.style.setProperty('--card', t.card);
    r.style.setProperty('--text', t.text);
    r.style.setProperty('--accent', t.accent);
    r.style.setProperty('--accent-hover', t.hover);
    r.style.setProperty('--border', t.border);
}

function mostrarMsg(txt, tipo) {
    let m = document.getElementById('msg');
    if (!m) return;
    m.className = "msg " + tipo;
    m.innerText = txt;
    setTimeout(() => { if(m.innerText === txt) m.innerText = ""; }, 4000);
}

function mudarTela(tela) {
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-dashboard').classList.add('hidden');
    document.getElementById('view-cadastro').classList.add('hidden');
    document.getElementById('msg').innerText = "";

    if (tela === 'login') {
        document.getElementById('view-login').classList.remove('hidden');
        mudarTema("Midnight Blue");
    } else if (tela === 'dashboard') {
        document.getElementById('view-dashboard').classList.remove('hidden');
        carregarPainel();
    } else if (tela === 'cadastro') {
        document.getElementById('view-cadastro').classList.remove('hidden');
        mudarTema("Midnight Blue");
    }
}

function trocarAba(aba) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    let tabEl = document.getElementById('tab-' + aba);
    let btnEl = document.getElementById('tb-' + aba);
    if (tabEl) tabEl.classList.remove('hidden');
    if (btnEl) btnEl.classList.add('active');
    if (aba === 'geometria') desenharPadrao(tipoGeometria);
}

function fazerLogin() {
    let u = document.getElementById('login-user').value.trim();
    let p = document.getElementById('login-pass').value;

    if (!u || !p) {
        mostrarMsg("Preencha o usuário e a chave de acesso.", "error");
        return;
    }

    let db = carregarBanco();
    if (!db[u] || db[u].senha !== p) {
        mostrarMsg("Identidade ou chave incorretos.", "error");
        return;
    }

    usuarioLogado = u;
    localStorage.setItem('aria_os_user_v10', u);
    mudarTela('dashboard');
}

function cadastrarUsuario() {
    let u = document.getElementById('cad-user').value.trim();
    let p = document.getElementById('cad-pass').value;

    if (!u || !p) {
        mostrarMsg("Preencha todos os campos.", "error");
        return;
    }

    let db = carregarBanco();
    if (db[u]) {
        mostrarMsg("Esta identidade já existe.", "error");
        return;
    }

    db[u] = {
        senha: p,
        tema: "Midnight Blue",
        notas: "",
        metas: [],
        habitos: [],
        recado: "",
        sintonia: "",
        tarefas: [],
        financas: [],
        galeria: [],
        log: "Conta criada e validada com sucesso.",
        chat: []
    };

    salvarBanco(db);
    mostrarMsg("Identidade registrada! Faça login.", "success");
    setTimeout(() => {
        document.getElementById('login-user').value = u;
        document.getElementById('login-pass').value = "";
        mudarTela('login');
    }, 1200);
}

function carregarPainel() {
    let db = carregarBanco();
    if (!usuarioLogado || !db[usuarioLogado]) {
        fazerLogout();
        return;
    }
    let d = db[usuarioLogado];

    document.getElementById('dash-title').innerText = "Painel Neural de " + usuarioLogado;
    document.getElementById('aria-notas').value = d.notas || "";
    document.getElementById('freq-recado').value = d.recado || "";
    document.getElementById('sintonia-notas').value = d.sintonia || "";
    document.getElementById('guardiao-log').innerText = d.log || "";
    document.getElementById('cfg-tema').value = d.tema || "Midnight Blue";

    mudarTema(d.tema);
    renderizarMetas();
    renderizarHabitos();
    renderizarTarefas();
    renderizarFinancas();
    renderizarGaleria();
    carregarChatHistorico();

    let inicio = new Date('2023-01-01');
    let hoje = new Date();
    let dias = Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
    document.getElementById('freq-contador').innerText = `Juntos há ${dias} dias em total sincronia ❤️`;

    trocarAba('aria');
}

function salvarDadosGerais() {
    if (!usuarioLogado) return;
    let db = carregarBanco();
    if (!db[usuarioLogado]) return;
    db[usuarioLogado].notas = document.getElementById('aria-notas').value;
    db[usuarioLogado].recado = document.getElementById('freq-recado').value;
    db[usuarioLogado].sintonia = document.getElementById('sintonia-notas').value;
    salvarBanco(db);
}

function enviarMensagemAria() {
    let input = document.getElementById('chat-input');
    let txt = input.value.trim();
    if (!txt) return;

    let db = carregarBanco();
    if (!db[usuarioLogado].chat) db[usuarioLogado].chat = [];

    db[usuarioLogado].chat.push({ sender: 'user', text: txt });
    input.value = "";

    let respostaAI = "Compreendido perfeitamente. Sincronizei essa diretriz com o núcleo do Aria.OS.";
    let lower = txt.toLowerCase();
    if (lower.includes('meta') || lower.includes('objetivo')) {
        respostaAI = "Suas metas estratégicas estão listadas na aba Sintonia. Foque no progresso diário!";
    } else if (lower.includes('finance') || lower.includes('dinheiro') || lower.includes('saldo')) {
        respostaAI = "Verifique seus lançamentos e saldo consolidado na aba Finanças.";
    } else if (lower.includes('olá') || lower.includes('oi')) {
        respostaAI = `Olá, ${usuarioLogado}! Pronta para otimizar sua alta performance hoje?`;
    }

    db[usuarioLogado].chat.push({ sender: 'ai', text: respostaAI });
    salvarBanco(db);
    carregarChatHistorico();
}

function carregarChatHistorico() {
    let db = carregarBanco();
    let chatContainer = document.getElementById('chat-container');
    let chatList = db[usuarioLogado].chat || [];
    
    chatContainer.innerHTML = `<div class="chat-msg ai">Olá! Sincronizada com seu núcleo de dados. Qual é o próximo marco de alta performance?</div>`;
    chatList.forEach(m => {
        let div = document.createElement('div');
        div.className = `chat-msg ${m.sender}`;
        div.innerText = m.text;
        chatContainer.appendChild(div);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function falarComAria() {
    let db = carregarBanco();
    let chatList = db[usuarioLogado].chat || [];
    let ultimaAi = chatList.filter(m => m.sender === 'ai').pop();
    if (!ultimaAi) return;
    
    if ('speechSynthesis' in window) {
        let utterance = new SpeechSynthesisUtterance(ultimaAi.text);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    } else {
        mostrarMsg("Síntese de voz não suportada neste navegador.", "error");
    }
}

function ouvirMicrofone() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        mostrarMsg("Reconhecimento de voz não suportado neste navegador.", "error");
        return;
    }
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.onresult = function(event) {
        let textoTranscrito = event.results[0][0].transcript;
        document.getElementById('chat-input').value = textoTranscrito;
        enviarMensagemAria();
    };
    recognition.start();
    mostrarMsg("Ouvindo... Fale agora.", "success");
}

function adicionarMeta() {
    let input = document.getElementById('aria-metainput');
    let val = input.value.trim();
    if (!val) return;
    let db = carregarBanco();
    if (!db[usuarioLogado].metas) db[usuarioLogado].metas = [];
    db[usuarioLogado].metas.push(val);
    salvarBanco(db);
    input.value = "";
    renderizarMetas();
}
function removerMeta(idx) {
    let db = carregarBanco();
    db[usuarioLogado].metas.splice(idx, 1);
    salvarBanco(db);
    renderizarMetas();
}
function renderizarMetas() {
    let db = carregarBanco();
    let metas = db[usuarioLogado].metas || [];
    let container = document.getElementById('aria-metalista');
    container.innerHTML = "";
    if (metas.length === 0) {
        container.innerHTML = `<p style="font-size:11px; opacity:0.6; text-align:center;">Nenhuma meta registrada.</p>`;
        return;
    }
    metas.forEach((m, i) => {
        let div = document.createElement('div');
        div.className = "list-item";
        div.innerHTML = `<span>${m}</span><button onclick="removerMeta(${i})">×</button>`;
        container.appendChild(div);
    });
}

function adicionarHabito() {
    let input = document.getElementById('habito-input');
    let val = input.value.trim();
    if (!val) return;
    let db = carregarBanco();
    if (!db[usuarioLogado].habitos) db[usuarioLogado].habitos = [];
    db[usuarioLogado].habitos.push({ nome: val, streak: 0 });
    salvarBanco(db);
    input.value = "";
    renderizarHabitos();
}
function incrementarStreak(idx) {
    let db = carregarBanco();
    db[usuarioLogado].habitos[idx].streak++;
    salvarBanco(db);
    renderizarHabitos();
}
function removerHabito(idx) {
    let db = carregarBanco();
    db[usuarioLogado].habitos.splice(idx, 1);
    salvarBanco(db);
    renderizarHabitos();
}
function renderizarHabitos() {
    let db = carregarBanco();
    let habitos = db[usuarioLogado].habitos || [];
    let container = document.getElementById('habito-lista');
    container.innerHTML = "";
    if (habitos.length === 0) {
        container.innerHTML = `<p style="font-size:11px; opacity:0.6; text-align:center;">Nenhum hábito cadastrado.</p>`;
        return;
    }
    habitos.forEach((h, i) => {
        let div = document.createElement('div');
        div.className = "list-item";
        div.innerHTML = `<span><b>${h.nome}</b> (🔥 ${h.streak} dias)</span> <div><button onclick="incrementarStreak(${i})" style="color:var(--success); margin-right:6px;" title="Registrar hoje">✓</button><button onclick="removerHabito(${i})">×</button></div>`;
        container.appendChild(div);
    });
}

function adicionarTarefa() {
    let input = document.getElementById('tarefa-input');
    let val = input.value.trim();
    if (!val) return;
    let db = carregarBanco();
    if (!db[usuarioLogado].tarefas) db[usuarioLogado].tarefas = [];
    db[usuarioLogado].tarefas.push(val);
    salvarBanco(db);
    input.value = "";
    renderizarTarefas();
}
function removerTarefa(idx) {
    let db = carregarBanco();
    db[usuarioLogado].tarefas.splice(idx, 1);
    salvarBanco(db);
    renderizarTarefas();
}
function renderizarTarefas() {
    let db = carregarBanco();
    let tarefas = db[usuarioLogado].tarefas || [];
    let container = document.getElementById('tarefa-lista');
    container.innerHTML = "";
    if (tarefas.length === 0) {
        container.innerHTML = `<p style="font-size:11px; opacity:0.6; text-align:center;">Nenhuma tarefa pendente.</p>`;
        return;
    }
    tarefas.forEach((t, i) => {
        let div = document.createElement('div');
        div.className = "list-item";
        div.innerHTML = `<span>${t}</span><button onclick="removerTarefa(${i})">×</button>`;
        container.appendChild(div);
    });
}

function adicionarFinanca() {
    let desc = document.getElementById('fin-desc').value.trim();
    let val = parseFloat(document.getElementById('fin-val').value);
    if (!desc || isNaN(val)) return;

    let db = carregarBanco();
    if (!db[usuarioLogado].financas) db[usuarioLogado].financas = [];
    db[usuarioLogado].financas.push({ desc: desc, val: val });
    salvarBanco(db);

    document.getElementById('fin-desc').value = "";
    document.getElementById('fin-val').value = "";
    renderizarFinancas();
}
function removerFinanca(idx) {
    let db = carregarBanco();
    db[usuarioLogado].financas.splice(idx, 1);
    salvarBanco(db);
    renderizarFinancas();
}
function renderizarFinancas() {
    let db = carregarBanco();
    let financas = db[usuarioLogado].financas || [];
    let container = document.getElementById('fin-lista');
    let saldoEl = document.getElementById('fin-saldo');
    container.innerHTML = "";
    
    let total = 0;
    if (financas.length === 0) {
        container.innerHTML = `<p style="font-size:11px; opacity:0.6; text-align:center;">Nenhum lançamento financeiro.</p>`;
        saldoEl.innerText = "Saldo Total: R$ 0,00";
        return;
    }

    financas.forEach((f, i) => {
        total += f.val;
        let div = document.createElement('div');
        div.className = "list-item";
        div.innerHTML = `<span><b>${f.desc}</b></span> <span style="color:${f.val >= 0 ? 'var(--success)' : 'var(--danger)'}">R$ ${f.val.toFixed(2)}</span> <button onclick="removerFinanca(${i})">×</button>`;
        container.appendChild(div);
    });
    saldoEl.innerText = `Saldo Total: R$ ${total.toFixed(2)}`;
}

function atualizarDisplayPomodoro() {
    let min = Math.floor(tempoRestante / 60);
    let sec = tempoRestante % 60;
    document.getElementById('pomodoro-display').innerText = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
}
function iniciarPomodoro() {
    if (pomodoroAtivo) return;
    pomodoroAtivo = true;
    pomodoroInterval = setInterval(() => {
        if (tempoRestante > 0) {
            tempoRestante--;
            atualizarDisplayPomodoro();
        } else {
            pausarPomodoro();
            alert("Ciclo de foco neural concluído!");
        }
    }, 1000);
}
function pausarPomodoro() {
    pomodoroAtivo = false;
    clearInterval(pomodoroInterval);
}
function resetarPomodoro() {
    pausarPomodoro();
    tempoRestante = 1500;
    atualizarDisplayPomodoro();
}

function adicionarGaleria() {
    let tit = document.getElementById('galeria-titulo').value.trim();
    let url = document.getElementById('galeria-url').value.trim();
    if (!tit || !url) return;

    let db = carregarBanco();
    if (!db[usuarioLogado].galeria) db[usuarioLogado].galeria = [];
    db[usuarioLogado].galeria.push({ titulo: tit, url: url });
    salvarBanco(db);

    document.getElementById('galeria-titulo').value = "";
    document.getElementById('galeria-url').value = "";
    renderizarGaleria();
}
function removerGaleria(idx) {
    let db = carregarBanco();
    db[usuarioLogado].galeria.splice(idx, 1);
    salvarBanco(db);
    renderizarGaleria();
}
function renderizarGaleria() {
    let db = carregarBanco();
    let itens = db[usuarioLogado].galeria || [];
    let container = document.getElementById('galeria-container');
    container.innerHTML = "";
    if (itens.length === 0) {
        container.innerHTML = `<p style="font-size:11px; opacity:0.6; text-align:center; grid-column: 1/-1;">Nenhuma imagem na galeria.</p>`;
        return;
    }
    itens.forEach((item, i) => {
        let card = document.createElement('div');
        card.className = "gallery-card";
        card.innerHTML = `
            <img src="${item.url}" alt="${item.titulo}" onerror="this.src='https://via.placeholder.com/150x90?text=Erro'">
            <div style="font-size: 10px; font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.titulo}</div>
            <button onclick="removerGaleria(${i})" style="color:var(--danger); border:none; background:none; cursor:pointer; font-size:10px;">Remover</button>
        `;
        container.appendChild(card);
    });
}

async function gerarChaveCriptografica() {
    let array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    let hex = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById('guardiao-senha').value = "QUANTUM-" + hex.toUpperCase();
    
    let db = carregarBanco();
    db[usuarioLogado].log = `Chave de criptografia de alta entropia gerada em ${new Date().toLocaleTimeString()}`;
    salvarBanco(db);
    document.getElementById('guardiao-log').innerText = db[usuarioLogado].log;
}
function copiarSenhaGuardiao() {
    let campo = document.getElementById('guardiao-senha');
    if (!campo.value) return;
    navigator.clipboard.writeText(campo.value);
    mostrarMsg("Chave criptográfica copiada com segurança!", "success");
}

function carregarGeolocalizacao() {
    let info = document.getElementById('clima-info');
    if (!navigator.geolocation) {
        info.innerText = "Geolocalização não suportada pelo seu navegador.";
        return;
    }
    info.innerText = "Capturando coordenadas via satélite/navegador...";
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            let lat = pos.coords.latitude.toFixed(4);
            let lon = pos.coords.longitude.toFixed(4);
            info.innerHTML = `<b>Localização Confirmada:</b><br>Latitude: ${lat} | Longitude: ${lon}<br><span style="color:var(--success)">Sistemas sincronizados com o ambiente físico.</span>`;
        },
        (err) => {
            info.innerText = "Erro ao obter geolocalização. Verifique as permissões do navegador.";
        }
    );
}

function desenharPadrao(tipo) {
    tipoGeometria = tipo;
    let canvas = document.getElementById('geoCanvas');
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    let w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    let cx = w / 2, cy = h / 2;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6366f1';
    ctx.lineWidth = 1.2;

    if (tipo === 'vesica') {
        let r = 42;
        ctx.beginPath(); ctx.arc(cx - 18, cy, r, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx + 18, cy, r, 0, Math.PI * 2); ctx.stroke();
    } else if (tipo === 'flor') {
        let r = 32;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        for (let i = 0; i < 6; i++) {
            let ang = i * Math.PI / 3;
            ctx.beginPath(); ctx.arc(cx + r * Math.cos(ang), cy + r * Math.sin(ang), r, 0, Math.PI * 2); ctx.stroke();
        }
    } else if (tipo === 'metatron') {
        let r = 52;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
        let pts = [];
        for (let i = 0; i < 6; i++) {
            let ang = i * Math.PI / 3 - Math.PI / 6;
            pts.push({ x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) });
        }
        pts.forEach((p1, i) => {
            pts.forEach((p2, j) => {
                if (i !== j) {
                    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            });
        });
    }
}

function salvarConfiguracoes() {
    let db = carregarBanco();
    let novaS = document.getElementById('cfg-novasenha').value;
    let novoT = document.getElementById('cfg-tema').value;
    if (novaS) db[usuarioLogado].senha = novaS;
    db[usuarioLogado].tema = novoT;
    salvarBanco(db);
    mostrarMsg("Configurações atualizadas com sucesso!", "success");
}

function exportarRelatorioPDF() {
    let db = carregarBanco();
    let dadosUser = db[usuarioLogado];
    let blob = new Blob([JSON.stringify(dadosUser, null, 2)], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `AriaOS_InfiniteReport_${usuarioLogado}.json`;
    a.click();
    mostrarMsg("Relatório exportado com sucesso!", "success");
}

function fazerLogout() {
    usuarioLogado = null;
    localStorage.removeItem('aria_os_user_v10');
    mudarTela('login');
}

let bancoInicial = carregarBanco();
if (usuarioLogado && bancoInicial[usuarioLogado]) {
    mudarTela('dashboard');
} else {
    mudarTela('login');
}
