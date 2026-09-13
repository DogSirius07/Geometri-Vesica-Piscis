# Aria.OS · Infinite Neural Ecosystem

Uma SPA **local-first**, gratuita e sem dependências de runtime, criada como um sistema operacional pessoal para GitHub Pages. Aria.OS une ações de produtividade, registro emocional, rotina, conexão e assistência contextual em uma única experiência responsiva.

## Executar localmente

Como há Service Worker, use um servidor local — não abra o `index.html` diretamente:

```bash
python3 -m http.server 8080
```

Depois, acesse `http://localhost:8080`.

## Publicar no GitHub Pages

1. Envie os arquivos deste repositório para a branch de publicação.
2. Em **Settings → Pages**, escolha **Deploy from a branch** e selecione a raiz da branch.
3. O `start_url` relativo do manifesto e o cache do Service Worker funcionam tanto no domínio raiz quanto em um subdiretório de projeto.

## Arquitetura

- **Core (`app.js`)**: estado central, Event Bus nativo, roteamento por hash, ações, Command Palette, busca de comandos, notificações e Contextual Home.
- **Persistência**: o estado versionado é salvo em `localStorage` para funcionamento imediato e pode ser exportado/importado em JSON no Admin Core. A camada é deliberadamente isolada para futura troca por IndexedDB.
- **Neural Fabric**: tarefas, memórias e registros ganham IDs únicos, timestamps e são indexados na visualização de rede e timeline.
- **Módulos**: Cockpit, Tarefas, Diário, Rotina, Neural Fabric, Modo Princesa, Aria Copilot, Nossa Frequência, Finanças, Galeria e Admin Core.
- **PWA**: `manifest.webmanifest` e `sw.js` fornecem instalação e cache offline do app shell.

## Recursos de interação

- `Ctrl/Cmd + K` abre a Command Palette.
- `T` cria uma tarefa rapidamente quando nenhum campo está em foco.
- A Command Palette entende o padrão local `criar tarefa …`.
- O Copilot opera por intenções locais e não usa um provedor externo.
- O Modo Princesa inclui respiração visual e um gerador opcional de tom de ambiente de 432 Hz via Web Audio. Ele não oferece afirmações ou aconselhamento médico.
- Todos os itens criados atualizam timeline, contexto e persistência local.

## Privacidade e segurança

Os dados nunca são enviados a um serviço remoto pela aplicação. O app evita inserção de conteúdo do usuário como HTML executável e usa criação/escapamento de texto para renderização. O backup JSON é responsabilidade da pessoa que o exporta: ele pode conter dados pessoais e deve ser armazenado com cuidado.

Esta versão não oferece autenticação real de servidor, sincronização criptografada entre dispositivos ou recuperação de conta — um app estático não deve fingir garantias que não possui.

## Próximos passos

A arquitetura permite uma camada IndexedDB com migrações, relações explícitas entre todos os nós, upload de mídia em IndexedDB, rearranjo persistente de widgets, notificações agendadas, autenticação local com Web Crypto e sincronização opcional escolhida pelo usuário.
