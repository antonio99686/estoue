const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
};

let movimentacoes = [];
let produtos = [];


const listaMovimentacoes =
    document.getElementById(
        "listaMovimentacoes"
    );

const modal =
    document.getElementById(
        "modalMovimentacao"
    );

const form =
    document.getElementById(
        "formMovimentacao"
    );


/* ================================
   MENSAGENS
================================ */

function mostrarMensagem(
    texto,
    tipo = "sucesso"
) {

    const mensagem =
        document.getElementById(
            "mensagemMovimentacao"
        );

    mensagem.textContent =
        texto;

    mensagem.className =
        `mensagem ${tipo}`;

    setTimeout(() => {

        mensagem.textContent =
            "";

        mensagem.className =
            "mensagem";

    }, 3000);

}


/* ================================
   MENSAGEM DO MODAL
================================ */

function mostrarMensagemModal(
    texto,
    tipo = "erro"
) {

    const mensagem =
        document.getElementById(
            "mensagemModal"
        );

    mensagem.textContent =
        texto;

    mensagem.className =
        `mensagem ${tipo}`;

}


/* ================================
   CARREGAR PRODUTOS
================================ */

async function carregarProdutos() {

    try {

        const resposta =
            await fetch(
                "/api/produtos",
                {
                    headers
                }
            );

        produtos =
            await resposta.json();


        const select =
            document.getElementById(
                "produtoId"
            );


        select.innerHTML =
            `
            <option value="">
                Selecione um produto
            </option>
            `;


        produtos.forEach(
            produto => {

                select.innerHTML +=
                    `
                    <option
                        value="${produto.id}"
                    >
                        ${produto.nome}
                        (${produto.quantidade} em estoque)
                    </option>
                    `;

            }
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

    }

}


/* ================================
   CARREGAR MOVIMENTAÇÕES
================================ */

async function carregarMovimentacoes() {

    try {

        listaMovimentacoes.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center"
                >
                    Carregando...
                </td>
            </tr>
            `;


        const resposta =
            await fetch(
                "/api/movimentacoes",
                {
                    headers
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar movimentações"
            );

        }


        movimentacoes =
            await resposta.json();


        renderizarMovimentacoes();


    } catch (erro) {

        console.error(
            erro
        );


        listaMovimentacoes.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center"
                >
                    Erro ao carregar movimentações.
                </td>
            </tr>
            `;

    }

}


/* ================================
   RENDERIZAR TABELA
================================ */

function renderizarMovimentacoes() {

    const pesquisa =
        document
            .getElementById(
                "pesquisaMovimentacao"
            )
            .value
            .toLowerCase();


    const tipo =
        document
            .getElementById(
                "filtroTipo"
            )
            .value;


    const lista =
        movimentacoes.filter(
            movimentacao => {


                const produto =
                    movimentacao.produto_nome
                        .toLowerCase();


                const passaPesquisa =
                    produto.includes(
                        pesquisa
                    );


                const passaTipo =
                    tipo === ""
                    ||
                    movimentacao.tipo ===
                    tipo;


                return (
                    passaPesquisa
                    &&
                    passaTipo
                );

            }
        );


    if (
        lista.length === 0
    ) {

        listaMovimentacoes.innerHTML =
            `
            <tr>
                <td
                    colspan="7"
                    style="text-align:center"
                >
                    Nenhuma movimentação encontrada.
                </td>
            </tr>
            `;

        return;

    }


    listaMovimentacoes.innerHTML =
        lista.map(
            movimentacao => {


                const tipoHtml =
                    movimentacao.tipo ===
                    "ENTRADA"

                    ?
                    `
                    <span class="tipo entrada">
                        📥 Entrada
                    </span>
                    `

                    :

                    `
                    <span class="tipo saida">
                        📤 Saída
                    </span>
                    `;


                return `
                <tr>

                    <td>
                        #${movimentacao.id}
                    </td>


                    <td>

                        <strong>
                            ${movimentacao.produto_nome}
                        </strong>

                    </td>


                    <td>

                        ${tipoHtml}

                    </td>


                    <td>

                        ${movimentacao.quantidade}

                    </td>


                    <td>

                        ${
                            movimentacao.observacao
                            ||
                            "-"
                        }

                    </td>


                    <td>

                        ${
                            movimentacao.usuario_nome
                            ||
                            "-"
                        }

                    </td>


                    <td>

                        ${formatarData(
                            movimentacao.criado_em
                        )}

                    </td>

                </tr>
                `;

            }
        ).join("");

}


/* ================================
   FORMATAR DATA
================================ */

function formatarData(data) {

    return new Date(
        data
    ).toLocaleString(
        "pt-BR"
    );

}


/* ================================
   ABRIR MODAL
================================ */

function abrirModal() {

    form.reset();


    document
        .getElementById(
            "estoqueAtual"
        )
        .textContent =
        "Selecione um produto";


    document
        .getElementById(
            "mensagemModal"
        )
        .textContent =
        "";


    modal.classList.add(
        "mostrar"
    );

}


/* ================================
   FECHAR MODAL
================================ */

function fecharModal() {

    modal.classList.remove(
        "mostrar"
    );

}


/* ================================
   ALTERAÇÃO DE PRODUTO
================================ */

document
    .getElementById(
        "produtoId"
    )
    .addEventListener(
        "change",
        event => {


            const id =
                Number(
                    event.target.value
                );


            const produto =
                produtos.find(
                    p =>
                        p.id === id
                );


            const estoque =
                document.getElementById(
                    "estoqueAtual"
                );


            if (!produto) {

                estoque.textContent =
                    "Selecione um produto";

                return;

            }


            estoque.textContent =
                `${produto.quantidade} unidade(s)`;

        }
    );


/* ================================
   REGISTRAR MOVIMENTAÇÃO
================================ */

form.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const produtoId =
            Number(
                document
                    .getElementById(
                        "produtoId"
                    )
                    .value
            );


        const tipo =
            document
                .getElementById(
                    "tipoMovimentacao"
                )
                .value;


        const quantidade =
            Number(
                document
                    .getElementById(
                        "quantidadeMovimentacao"
                    )
                    .value
            );


        const observacao =
            document
                .getElementById(
                    "observacao"
                )
                .value;


        const produto =
            produtos.find(
                p =>
                    p.id === produtoId
            );


        /* VALIDAÇÕES */

        if (!produtoId) {

            mostrarMensagemModal(
                "Selecione um produto"
            );

            return;

        }


        if (!tipo) {

            mostrarMensagemModal(
                "Selecione o tipo de movimentação"
            );

            return;

        }


        if (
            !quantidade
            ||
            quantidade <= 0
        ) {

            mostrarMensagemModal(
                "Informe uma quantidade válida"
            );

            return;

        }


        if (
            tipo === "SAIDA"
            &&
            produto
            &&
            quantidade >
            Number(
                produto.quantidade
            )
        ) {

            mostrarMensagemModal(
                `Estoque insuficiente. Disponível: ${produto.quantidade}`
            );

            return;

        }


        try {

            const resposta =
                await fetch(
                    "/api/movimentacoes",
                    {
                        method:
                            "POST",

                        headers,

                        body:
                            JSON.stringify(
                                {
                                    produto_id:
                                        produtoId,

                                    tipo,

                                    quantidade,

                                    observacao
                                }
                            )
                    }
                );


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                mostrarMensagemModal(
                    resultado.erro
                    ||
                    "Erro ao registrar movimentação"
                );

                return;

            }


            fecharModal();


            mostrarMensagem(
                "Movimentação registrada com sucesso!"
            );


            await carregarProdutos();


            await carregarMovimentacoes();


        } catch (erro) {

            console.error(
                erro
            );


            mostrarMensagemModal(
                "Erro ao conectar ao servidor"
            );

        }

    }
);


/* ================================
   EVENTOS
================================ */

document
    .getElementById(
        "btnNovaMovimentacao"
    )
    .addEventListener(
        "click",
        abrirModal
    );


document
    .getElementById(
        "fecharModalMovimentacao"
    )
    .addEventListener(
        "click",
        fecharModal
    );


document
    .getElementById(
        "cancelarMovimentacao"
    )
    .addEventListener(
        "click",
        fecharModal
    );


document
    .getElementById(
        "pesquisaMovimentacao"
    )
    .addEventListener(
        "input",
        renderizarMovimentacoes
    );


document
    .getElementById(
        "filtroTipo"
    )
    .addEventListener(
        "change",
        renderizarMovimentacoes
    );


document
    .getElementById(
        "logout"
    )
    .addEventListener(
        "click",
        event => {

            event.preventDefault();


            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "usuario"
            );


            window.location.href =
                "index.html";

        }
    );


modal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modal
        ) {

            fecharModal();

        }

    }
);


/* ================================
   INICIAR SISTEMA
================================ */

carregarProdutos();

carregarMovimentacoes();