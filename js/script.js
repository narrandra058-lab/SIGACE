// Cadastro de atendimento
const form = document.getElementById("formAtendimento");

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const atendimento = {
            nome: document.getElementById("nome").value,
            email: document.getElementById("email").value,
            telefone: document.getElementById("telefone").value,
            assunto: document.getElementById("assunto").value,
            descricao: document.getElementById("descricao").value,
            status: document.getElementById("status").value,
            data: new Date().toLocaleDateString("pt-BR")
        };

        let atendimentos =
            JSON.parse(localStorage.getItem("atendimentos")) || [];

        atendimentos.push(atendimento);

        localStorage.setItem(
            "atendimentos",
            JSON.stringify(atendimentos)
        );

        alert("Atendimento registrado com sucesso!");

        form.reset();

        window.location.href = "historico.html";
    });
}


// Exibição do histórico
const lista = document.getElementById("listaAtendimentos");

if (lista) {

    const atendimentos =
        JSON.parse(localStorage.getItem("atendimentos")) || [];

    lista.innerHTML = "";

    if (atendimentos.length === 0) {

        lista.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum atendimento registrado.
                </td>
            </tr>
        `;

    } else {

        atendimentos.forEach(function(atendimento) {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${atendimento.nome}</td>
                <td>${atendimento.assunto}</td>
                <td>${atendimento.status}</td>
                <td>${atendimento.data}</td>
            `;

            lista.appendChild(linha);
        });
    }
}
