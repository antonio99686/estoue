const express = require("express");
const router = express.Router();

const conexao = require("../config/database");
const autenticar = require("../middleware/auth");


router.get("/", autenticar, (req, res) => {

    const sql = `
        SELECT
            movimentacoes.*,
            produtos.nome AS produto_nome,
            usuarios.nome AS usuario_nome
        FROM movimentacoes
        INNER JOIN produtos
            ON produtos.id = movimentacoes.produto_id
        LEFT JOIN usuarios
            ON usuarios.id = movimentacoes.usuario_id
        ORDER BY movimentacoes.id DESC
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
        produto_id,
        tipo,
        quantidade,
        observacao
    } = req.body;

    if (
        !produto_id ||
        !tipo ||
        !quantidade
    ) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    conexao.query(
        "SELECT quantidade FROM produtos WHERE id = ?",
        [produto_id],
        (erro, resultado) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            if (resultado.length === 0) {
                return res.status(404).json({
                    erro: "Produto não encontrado"
                });
            }

            const estoqueAtual =
                resultado[0].quantidade;

            if (
                tipo === "SAIDA" &&
                quantidade > estoqueAtual
            ) {
                return res.status(400).json({
                    erro: "Estoque insuficiente"
                });
            }

            const novoEstoque =
                tipo === "ENTRADA"
                    ? estoqueAtual + Number(quantidade)
                    : estoqueAtual - Number(quantidade);


            conexao.query(
                `
                UPDATE produtos
                SET quantidade = ?
                WHERE id = ?
                `,
                [
                    novoEstoque,
                    produto_id
                ],
                (erro) => {

                    if (erro) {
                        return res.status(500).json({ erro });
                    }


                    conexao.query(
                        `
                        INSERT INTO movimentacoes
                        (
                            produto_id,
                            tipo,
                            quantidade,
                            observacao,
                            usuario_id
                        )
                        VALUES (?, ?, ?, ?, ?)
                        `,
                        [
                            produto_id,
                            tipo,
                            quantidade,
                            observacao || null,
                            req.usuario.id
                        ],
                        (erro, resultado) => {

                            if (erro) {
                                return res.status(500).json({ erro });
                            }

                            res.json({
                                id: resultado.insertId,
                                mensagem:
                                    "Movimentação registrada com sucesso"
                            });

                        }
                    );

                }
            );

        }
    );

});


module.exports = router;