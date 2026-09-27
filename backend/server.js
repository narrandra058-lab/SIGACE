const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({
        mensagem: "API do SIGACE funcionando."
    });
});

app.post("/eleitores", (req, res) => {
    const { nm_eleitor, nr_cpf, nr_titulo } = req.body;

    if (!nm_eleitor) {
        return res.status(400).json({
            erro: "Nome do eleitor é obrigatório."
        });
    }

    const sql = `
        INSERT INTO ELEITOR
        (NM_ELEITOR, NR_CPF, NR_TITULO)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [nm_eleitor, nr_cpf, nr_titulo],
        function (erro) {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar eleitor."
                });
            }

            res.status(201).json({
                mensagem: "Eleitor cadastrado com sucesso.",
                id: this.lastID
            });
        }
    );
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
