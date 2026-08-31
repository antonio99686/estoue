const express = require("express");
const router = express.Router();

const conexao = require("../config/database");
const autenticar = require("../middleware/auth");

router.get("/", autenticar, (req, res) => {

    conexao.query(
        "SELECT * FROM categorias ORDER BY nome",
        (erro, resultados) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json(resultados);
        }
    );

});

router.post("/", autenticar, (req, res) => {

    const { nome, descricao } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: "Nome obrigatório"
        });
    }

    conexao.query(
        "INSERT INTO categorias (nome, descricao) VALUES (?, ?)",
        [nome, descricao],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json({
                id: resultado.insertId,
                mensagem: "Categoria cadastrada"
            });

        }
    );

});

module.exports = router;