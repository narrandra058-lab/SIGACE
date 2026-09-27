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

// 1. Cadastrar eleitor
app.post("/eleitores", (req, res) => {
    const { nm_eleitor, nr_cpf, nr_titulo } = req.body;

    if (!nm_eleitor) {
        return res.status(400).json({
            erro: "Nome do eleitor é obrigatório."
        });
    }

    db.run(
        `INSERT INTO ELEITOR
        (NM_ELEITOR, NR_CPF, NR_TITULO)
        VALUES (?, ?, ?)`,
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

// 2. Consultar eleitores
app.get("/eleitores", (req, res) => {
    db.all(
        `SELECT * FROM ELEITOR ORDER BY NM_ELEITOR`,
        [],
        (erro, eleitores) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao consultar eleitores."
                });
            }

            res.json(eleitores);
        }
    );
});

// 3. Registrar atendimento
app.post("/atendimentos", (req, res) => {
    const {
        id_eleitor,
        tp_atendimento,
        st_atendimento
    } = req.body;

    if (!id_eleitor || !tp_atendimento) {
        return res.status(400).json({
            erro: "Eleitor e tipo de atendimento são obrigatórios."
        });
    }

    db.run(
        `INSERT INTO ATENDIMENTO
        (ID_ELEITOR, TP_ATENDIMENTO, ST_ATENDIMENTO)
        VALUES (?, ?, ?)`,
        [
            id_eleitor,
            tp_atendimento,
            st_atendimento || "Pendente"
        ],
        function (erro) {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao registrar atendimento."
                });
            }

            res.status(201).json({
                mensagem: "Atendimento registrado com sucesso.",
                id: this.lastID
            });
        }
    );
});

// 4. Consultar histórico de atendimentos
app.get("/atendimentos", (req, res) => {
    const sql = `
        SELECT
            A.ID_ATENDIMENTO,
            E.NM_ELEITOR,
            A.TP_ATENDIMENTO,
            A.ST_ATENDIMENTO,
            A.DT_ATENDIMENTO
        FROM ATENDIMENTO A
        INNER JOIN ELEITOR E
            ON E.ID_ELEITOR = A.ID_ELEITOR
        ORDER BY A.DT_ATENDIMENTO DESC
    `;

    db.all(sql, [], (erro, atendimentos) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao consultar atendimentos."
            });
        }

        res.json(atendimentos);
    });
});

// 5. Atualizar status do atendimento
app.put("/atendimentos/:id/status", (req, res) => {
    const { st_atendimento } = req.body;
    const { id } = req.params;

    if (!st_atendimento) {
        return res.status(400).json({
            erro: "O status é obrigatório."
        });
    }

    db.run(
        `UPDATE ATENDIMENTO
         SET ST_ATENDIMENTO = ?
         WHERE ID_ATENDIMENTO = ?`,
        [st_atendimento, id],
        function (erro) {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao atualizar status."
                });
            }

            res.json({
                mensagem: "Status atualizado com sucesso."
            });
        }
    );
});

// 6. Consultar atendimento por ID
app.get("/atendimentos/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        `SELECT
            A.ID_ATENDIMENTO,
            E.NM_ELEITOR,
            A.TP_ATENDIMENTO,
            A.ST_ATENDIMENTO,
            A.DT_ATENDIMENTO
         FROM ATENDIMENTO A
         INNER JOIN ELEITOR E
            ON E.ID_ELEITOR = A.ID_ELEITOR
         WHERE A.ID_ATENDIMENTO = ?`,
        [id],
        (erro, atendimento) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao consultar atendimento."
                });
            }

            if (!atendimento) {
                return res.status(404).json({
                    erro: "Atendimento não encontrado."
                });
            }

            res.json(atendimento);
        }
    );
});

// 7. Cadastrar servidor
app.post("/servidores", (req, res) => {
    const { nm_servidor } = req.body;

    if (!nm_servidor) {
        return res.status(400).json({
            erro: "Nome do servidor é obrigatório."
        });
    }

    res.status(201).json({
        mensagem: "Servidor recebido pela API.",
        nm_servidor
    });
});

// 8. Dashboard com indicadores
app.get("/dashboard", (req, res) => {
    db.get(
        `SELECT COUNT(*) AS total_eleitores FROM ELEITOR`,
        [],
        (erro, eleitores) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao consultar indicadores."
                });
            }

            db.get(
                `SELECT COUNT(*) AS total_atendimentos FROM ATENDIMENTO`,
                [],
                (erro2, atendimentos) => {
                    if (erro2) {
                        return res.status(500).json({
                            erro: "Erro ao consultar indicadores."
                        });
                    }

                    res.json({
                        total_eleitores: eleitores.total_eleitores,
                        total_atendimentos:
                            atendimentos.total_atendimentos
                    });
                }
            );
        }
    );
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
