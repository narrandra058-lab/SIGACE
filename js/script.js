// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL = "http://localhost:3000";


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
    formAtendimento.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const assunto = document.getElementById("assunto").value;
        const status = document.getElementById("status").value;

        if (nome.trim() === "" || assunto.trim() === "") {
            alert("Preencha os dados obrigatórios.");
            return;
        }

        try {
            // Primeiro cadastra o eleitor
            const respostaEleitor = await fetch(`${API_URL}/eleitores`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nm_eleitor: nome
                })
            });

            const eleitor = await respostaEleitor.json();

            if (!respostaEleitor.ok) {
                throw new Error(eleitor.erro || "Erro ao cadastrar eleitor.");
            }

            // Depois registra o atendimento
            const respostaAtendimento = await fetch(
                `${API_URL}/atendimentos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_eleitor: eleitor.id,
                        tp_atendimento: assunto,
                        st_atendimento: status || "Pendente"
                    })
                }
            );

            const atendimento = await respostaAtendimento.json();

            if (!respostaAtendimento.ok) {
                throw new Error(
                    atendimento.erro || "Erro ao registrar atendimento."
                );
            }

            alert("Atendimento registrado com sucesso!");

            formAtendimento.reset();

            window.location.href = "historico.html";

        } catch (erro) {
            alert(
                "Não foi possível registrar o atendimento. " +
                "Verifique se a API está em execução."
            );

            console.error(erro);
        }
    });
}


// ==========================================
// HISTÓRICO
// ==========================================

const listaAtendimentos =
    document.getElementById("listaAtendimentos");

if (listaAtendimentos) {

    async function carregarHistorico() {

        try {
            const resposta = await fetch(
                `${API_URL}/atendimentos`
            );

            const atendimentos = await resposta.json();

            listaAtendimentos.innerHTML = "";

            if (atendimentos.length === 0) {

                listaAtendimentos.innerHTML = `
                    <tr>
                        <td colspan="4">
                            Nenhum atendimento registrado.
                        </td>
                    </tr>
                `;

                return;
            }

            atendimentos.forEach(function (atendimento) {

                const linha = document.createElement("tr");

                const data = atendimento.DT_ATENDIMENTO
                    ? new Date(
                        atendimento.DT_ATENDIMENTO
                    ).toLocaleDateString("pt-BR")
                    : "-";

                linha.innerHTML = `
                    <td>${atendimento.NM_ELEITOR}</td>
                    <td>${atendimento.TP_ATENDIMENTO}</td>
                    <td>${atendimento.ST_ATENDIMENTO}</td>
                    <td>${data}</td>
                `;

                listaAtendimentos.appendChild(linha);
            });

        } catch (erro) {

            console.error(erro);

            listaAtendimentos.innerHTML = `
                <tr>
                    <td colspan="4">
                        Não foi possível carregar o histórico.
                    </td>
                </tr>
            `;
        }
    }

    carregarHistorico();
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

    async function carregarDashboard() {

        try {

            const resposta = await fetch(
                `${API_URL}/dashboard`
            );

            const dados = await resposta.json();

            totalAtendimentos.textContent =
                dados.total_atendimentos;

            const respostaHistorico = await fetch(
                `${API_URL}/atendimentos`
            );

            const atendimentos =
                await respostaHistorico.json();

            const emAndamento = atendimentos.filter(
                function (atendimento) {
                    return atendimento.ST_ATENDIMENTO ===
                        "Em andamento";
                }
            );

            const finalizados = atendimentos.filter(
                function (atendimento) {
                    return atendimento.ST_ATENDIMENTO ===
                        "Finalizado";
                }
            );

            atendimentosAndamento.textContent =
                emAndamento.length;

            atendimentosFinalizados.textContent =
                finalizados.length;

        } catch (erro) {

            console.error(erro);

            totalAtendimentos.textContent = "0";
            atendimentosAndamento.textContent = "0";
            atendimentosFinalizados.textContent = "0";
        }
    }

    carregarDashboard();
}
