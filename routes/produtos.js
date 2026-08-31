const express = require("express");
const router = express.Router();

const conexao = require("../config/database");
const autenticar = require("../middleware/auth");


router.get("/", autenticar, (req, res) => {

    const sql = `
        SELECT 
            produtos.*,
            categorias.nome AS categoria_nome
        FROM produtos
        LEFT JOIN categorias
        ON produtos.categoria_id = categorias.id
        ORDER BY produtos.nome
    `;

    conexao.query(sql, (erro, resultados) => {

        if (erro) {
            return res.status(500).json({ erro });
        }

        res.json(resultados);

    });

});


router.post("/", autenticar, (req, res) => {

    const {
        nome,
        codigo,
        categoria_id,
        preco_compra,
        preco_venda,
        quantidade,
        estoque_minimo
    } = req.body;

    if (!nome) {
        return res.status(400).json({
            erro: "Nome do produto obrigatório"
        });
    }

    const sql = `
        INSERT INTO produtos
        (
            nome,
            codigo,
            categoria_id,
            preco_compra,
            preco_venda,
            quantidade,
            estoque_minimo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [
            nome,
            codigo || null,
            categoria_id || null,
            preco_compra || 0,
            preco_venda || 0,
            quantidade || 0,
            estoque_minimo || 5
        ],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json({
                id: resultado.insertId,
                mensagem: "Produto cadastrado com sucesso"
            });

        }
    );

});


router.put("/:id", autenticar, (req, res) => {

    const { id } = req.params;

    const {
        nome,
        codigo,
        categoria_id,
        preco_compra,
        preco_venda,
        estoque_minimo
    } = req.body;

    const sql = `
        UPDATE produtos
        SET
            nome = ?,
            codigo = ?,
            categoria_id = ?,
            preco_compra = ?,
            preco_venda = ?,
            estoque_minimo = ?
        WHERE id = ?
    `;

    conexao.query(
        sql,
        [
            nome,
            codigo,
            categoria_id,
            preco_compra,
            preco_venda,
            estoque_minimo,
            id
        ],
        (erro) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json({
                mensagem: "Produto atualizado"
            });

        }
    );

});


router.delete("/:id", autenticar, (req, res) => {

    conexao.query(
        "DELETE FROM produtos WHERE id = ?",
        [req.params.id],
        (erro) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            res.json({
                mensagem: "Produto excluído"
            });

        }
    );

});


module.exports = router;