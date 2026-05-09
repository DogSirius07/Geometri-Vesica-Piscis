function unlockStation(id) {
    const messages = {
        'sons': "Qual o dia em que nossa história começou? (Ex: 0505)",
        'pedido': "Qual o destino de quem ama? (Dica: A data de hoje sem espaços)"
    };

    const pass = prompt(messages[id]);

    // Define senhas diferentes para cada estação se desejar
    if(id === 'sons' && pass === "0505") {
        document.getElementById(id).style.display = "block";
    } else if(id === 'pedido' && (pass === "0506" || pass === "0505")) {
        document.getElementById(id).style.display = "block";
    } else {
        alert("Ainda não é a hora, ou a chave está incorreta...");
    }
}
