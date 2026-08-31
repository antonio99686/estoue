const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const conexao = require("../config/database");

router.post("/cadastro", async (req, res) => {

    try {

        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Preencha todos os campos"
            });
        }

        conexao.query(
            "SELECT id FROM usuarios WHERE email = ?",
            [email],
            async (erro, resultados) => {

                if (erro) {
                    return res.status(500).json({ erro });
                }

                if (resultados.length > 0) {
                    return res.status(400).json({
                        erro: "E-mail já cadastrado"
                    });
                }

                const senhaHash = await bcrypt.hash(senha, 10);

                conexao.query(
                    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
                    [nome, email, senhaHash],
                    (erro) => {

                        if (erro) {
                            return res.status(500).json({ erro });
                        }

                        res.json({
                            mensagem: "Usuário cadastrado com sucesso"
                        });
                    }
                );

            }
        );

    } catch (erro) {

        res.status(500).json({
            erro: "Erro interno"
        });

    }

});

router.post("/login", (req, res) => {

    const { email, senha } = req.body;

    conexao.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (erro, resultados) => {

            if (erro) {
                return res.status(500).json({ erro });
            }

            if (resultados.length === 0) {
                return res.status(401).json({
                    erro: "Usuário ou senha inválidos"
                });
            }

            const usuario = resultados[0];

            const senhaCorreta = await bcrypt.compare(
                senha,
                usuario.senha
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    erro: "Usuário ou senha inválidos"
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );

            res.json({
                mensagem: "Login realizado",
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });

        }
    );

});

module.exports = router;