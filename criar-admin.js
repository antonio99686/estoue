require("dotenv").config();

const bcrypt = require("bcryptjs");
const conexao = require("./config/database");

async function criarAdmin() {

    const nome = "Administrador";
    const email = "admin@estoque.com";
    const senha = "123456";

    try {

        const senhaHash = await bcrypt.hash(
            senha,
            10
        );

        conexao.query(
            `
            INSERT INTO usuarios
            (nome, email, senha)
            VALUES (?, ?, ?)
            `,
            [
                nome,
                email,
                senhaHash
            ],
            (erro) => {

                if (erro) {

                    if (erro.code === "ER_DUP_ENTRY") {

                        console.log(
                            "Esse usuário já existe!"
                        );

                    } else {

                        console.error(
                            "Erro:",
                            erro
                        );

                    }

                    conexao.end();

                    return;

                }

                console.log(
                    "Usuário administrador criado!"
                );

                console.log(
                    "Email: admin@estoque.com"
                );

                console.log(
                    "Senha: 123456"
                );

                conexao.end();

            }
        );

    } catch (erro) {

        console.error(
            "Erro:",
            erro
        );

        conexao.end();

    }

}

criarAdmin();