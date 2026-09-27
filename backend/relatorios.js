const db = require("./db");

function gerarRelatorioAtendimentos(callback) {
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

    db.all(sql, [], callback);
}

module.exports = {
    gerarRelatorioAtendimentos
};
