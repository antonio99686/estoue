const express = require("express");
const router = express.Router();

const conexao = require("../config/database");
const autenticar = require("../middleware/auth");

/* =========================================
   RESUMO GERAL
========================================= */

router.get("/resumo", autenticar, (req, res) => {
  const sql = `
        SELECT
    COUNT(*) AS total_produtos,

    COALESCE(
        SUM(quantidade),
        0
    ) AS unidades_estoque,

    COALESCE(
        SUM(
            quantidade * preco_compra
        ),
        0
    ) AS valor_estoque,

    COALESCE(
        SUM(
            CASE
                WHEN quantidade = 0
                THEN 1
                ELSE 0
            END
        ),
        0
    ) AS produtos_zerados,

    COALESCE(
        SUM(
            CASE
                WHEN quantidade > 0
                AND quantidade <= estoque_minimo
                THEN 1
                ELSE 0
            END
        ),
        0
    ) AS estoque_baixo

FROM produtos
    `;

  conexao.query(sql, (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ erro });
    }

    res.json(resultado[0]);
  });
});

/* =========================================
   PRODUTOS COM ESTOQUE BAIXO
========================================= */

router.get("/estoque-baixo", autenticar, (req, res) => {
  const sql = `
            SELECT
                produtos.*,
                categorias.nome
                AS categoria_nome

            FROM produtos

            LEFT JOIN categorias
            ON categorias.id =
            produtos.categoria_id

            WHERE
                produtos.quantidade > 0
                AND
                produtos.quantidade <=
                produtos.estoque_minimo

            ORDER BY
                produtos.quantidade ASC
        `;

  conexao.query(sql, (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ erro });
    }

    res.json(resultado);
  });
});

/* =========================================
   PRODUTOS ZERADOS
========================================= */

router.get("/estoque-zerado", autenticar, (req, res) => {
  const sql = `
            SELECT
                produtos.*,
                categorias.nome
                AS categoria_nome

            FROM produtos

            LEFT JOIN categorias
            ON categorias.id =
            produtos.categoria_id

            WHERE
                produtos.quantidade = 0

            ORDER BY
                produtos.nome
        `;

  conexao.query(sql, (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ erro });
    }

    res.json(resultado);
  });
});

/* =========================================
   MOVIMENTAÇÕES POR PERÍODO
========================================= */

router.get("/movimentacoes", autenticar, (req, res) => {
  const { data_inicio, data_fim } = req.query;

  let sql = `
            SELECT
                movimentacoes.*,

                produtos.nome
                AS produto_nome,

                usuarios.nome
                AS usuario_nome

            FROM movimentacoes

            INNER JOIN produtos
            ON produtos.id =
            movimentacoes.produto_id

            LEFT JOIN usuarios
            ON usuarios.id =
            movimentacoes.usuario_id

            WHERE 1 = 1
        `;

  const parametros = [];

  if (data_inicio) {
    sql += `
                AND DATE(
                    movimentacoes.criado_em
                ) >= ?
            `;

    parametros.push(data_inicio);
  }

  if (data_fim) {
    sql += `
                AND DATE(
                    movimentacoes.criado_em
                ) <= ?
            `;

    parametros.push(data_fim);
  }

  sql += `
            ORDER BY
            movimentacoes.criado_em DESC
        `;

  conexao.query(sql, parametros, (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ erro });
    }

    res.json(resultado);
  });
});

/* =========================================
   TOTAL DE ENTRADAS E SAÍDAS
========================================= */

router.get("/movimentacoes/resumo", autenticar, (req, res) => {
  const { data_inicio, data_fim } = req.query;

  let sql = `
            SELECT

                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo = 'ENTRADA'
                            THEN quantidade
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_entradas,


                COALESCE(
                    SUM(
                        CASE
                            WHEN tipo = 'SAIDA'
                            THEN quantidade
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_saidas


            FROM movimentacoes

            WHERE 1 = 1
        `;

  const parametros = [];

  if (data_inicio) {
    sql += `
                AND DATE(criado_em) >= ?
            `;

    parametros.push(data_inicio);
  }

  if (data_fim) {
    sql += `
                AND DATE(criado_em) <= ?
            `;

    parametros.push(data_fim);
  }

  conexao.query(sql, parametros, (erro, resultado) => {
    if (erro) {
      return res.status(500).json({ erro });
    }

    res.json(resultado[0]);
  });
});

module.exports = router;
