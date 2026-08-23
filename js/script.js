// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        if (email.trim() === "" || senha.trim() === "") {
            alert("Preencha o e-mail e a senha.");
            return;
        }

        localStorage.setItem("usuarioLogado", "true");

        window.location.href = "dashboard.html";
    });
}


// ==========================================
// CADASTRO DE ATENDIMENTO
// ==========================================

const formAtendimento = document.getElementById("formAtendimento");

if (formAtendimento) {
    formAtendimento.addEventListener("submit", function (event) {
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

        formAtendimento.reset();

        window.location.href = "historico.html";
    });
}


// ==========================================
// HISTÓRICO
// ==========================================

const listaAtendimentos =
    document.getElementById("listaAtendimentos");

if (listaAtendimentos) {

    const atendimentos =
        JSON.parse(localStorage.getItem("atendimentos")) || [];

    listaAtendimentos.innerHTML = "";

    if (atendimentos.length === 0) {

        listaAtendimentos.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhum atendimento registrado.
                </td>
            </tr>
        `;

    } else {

        atendimentos.forEach(function (atendimento) {

            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${atendimento.nome}</td>
                <td>${atendimento.assunto}</td>
                <td>${atendimento.status}</td>
                <td>${atendimento.data}</td>
            `;

            listaAtendimentos.appendChild(linha);
        });
    }
}


// ==========================================
// DASHBOARD
// ==========================================

const totalAtendimentos =
    document.getElementById("totalAtendimentos");

const atendimentosAndamento =
    document.getElementById("atendimentosAndamento");

const atendimentosFinalizados =
    document.getElementById("atendimentosFinalizados");

if (
    totalAtendimentos &&
    atendimentosAndamento &&
    atendimentosFinalizados
) {

    const atendimentos =
        JSON.parse(localStorage.getItem("atendimentos")) || [];

    const emAndamento = atendimentos.filter(
        function (atendimento) {
            return atendimento.status === "Em andamento";
        }
    );

    const finalizados = atendimentos.filter(
        function (atendimento) {
            return atendimento.status === "Finalizado";
        }
    );

    totalAtendimentos.textContent =
        atendimentos.length;

    atendimentosAndamento.textContent =
        emAndamento.length;

    atendimentosFinalizados.textContent =
        finalizados.length;
}
