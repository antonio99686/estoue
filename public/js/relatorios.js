const token =
    localStorage.getItem("token");


if (!token) {

    window.location.href =
        "index.html";

}


const headers = {

    "Content-Type":
        "application/json",

    "Authorization":
        `Bearer ${token}`

};


/* =========================================
   FORMATAÇÃO
========================================= */

function dinheiro(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function dataFormatada(data) {

    return new Date(
        data
    ).toLocaleString(
        "pt-BR"
    );

}


/* =========================================
   PEGAR PARÂMETROS DE DATA
========================================= */

function getParametrosData() {

    const inicio =
        document
            .getElementById(
                "dataInicio"
            )
            .value;


    const fim =
        document
            .getElementById(
                "dataFim"
            )
            .value;


    const params =
        new URLSearchParams();


    if (inicio) {

        params.append(
            "data_inicio",
            inicio
        );

    }


    if (fim) {

        params.append(
            "data_fim",
            fim
        );

    }


    return params.toString();

}


/* =========================================
   RESUMO GERAL
========================================= */

async function carregarResumo() {

    try {

        const resposta =
            await fetch(
                "/api/relatorios/resumo",
                {
                    headers
                }
            );


        const dados =
            await resposta.json();


        document
            .getElementById(
                "totalProdutos"
            )
            .textContent =
            dados.total_produtos;


        document
            .getElementById(
                "totalUnidades"
            )
            .textContent =
            dados.total_unidades;


        document
            .getElementById(
                "estoqueBaixo"
            )
            .textContent =
            dados.estoque_baixo;


        document
            .getElementById(
                "valorEstoque"
            )
            .textContent =
            dinheiro(
                dados.valor_estoque
            );


    } catch (erro) {

        console.error(
            "Erro no resumo:",
            erro
        );

    }

}


/* =========================================
   ESTOQUE BAIXO
========================================= */

async function carregarEstoqueBaixo() {

    const container =
        document.getElementById(
            "listaEstoqueBaixo"
        );


    try {

        const resposta =
            await fetch(
                "/api/relatorios/estoque-baixo",
                {
                    headers
                }
            );


        const produtos =
            await resposta.json();


        if (
            produtos.length === 0
        ) {

            container.innerHTML =
                `
                <p>
                    ✅ Nenhum produto
                    com estoque baixo.
                </p>
                `;

            return;

        }


        container.innerHTML =
            produtos.map(
                produto =>

                `
                <div
                    class="produto-alerta baixo"
                >

                    <strong>
                        ${produto.nome}
                    </strong>

                    <span>
                        Estoque:
                        ${produto.quantidade}
                    </span>

                    <small>
                        Mínimo:
                        ${produto.estoque_minimo}
                    </small>

                </div>
                `

            ).join("");


    } catch (erro) {

        container.innerHTML =
            "Erro ao carregar.";

    }

}


/* =========================================
   ESTOQUE ZERADO
========================================= */

async function carregarEstoqueZerado() {

    const container =
        document.getElementById(
            "listaEstoqueZerado"
        );


    try {

        const resposta =
            await fetch(
                "/api/relatorios/estoque-zerado",
                {
                    headers
                }
            );


        const produtos =
            await resposta.json();


        if (
            produtos.length === 0
        ) {

            container.innerHTML =
                `
                <p>
                    ✅ Nenhum produto zerado.
                </p>
                `;

            return;

        }


        container.innerHTML =
            produtos.map(
                produto =>

                `
                <div
                    class="produto-alerta zerado"
                >

                    <strong>
                        ${produto.nome}
                    </strong>

                    <span>
                        Estoque:
                        0
                    </span>

                </div>
                `

            ).join("");


    } catch (erro) {

        container.innerHTML =
            "Erro ao carregar.";

    }

}


/* =========================================
   RESUMO MOVIMENTAÇÕES
========================================= */

async function carregarResumoMovimentacoes() {

    try {

        const params =
            getParametrosData();


        const resposta =
            await fetch(
                `/api/relatorios/movimentacoes/resumo?${params}`,
                {
                    headers
                }
            );


        const dados =
            await resposta.json();


        document
            .getElementById(
                "totalEntradas"
            )
            .textContent =
            dados.total_entradas;


        document
            .getElementById(
                "totalSaidas"
            )
            .textContent =
            dados.total_saidas;


    } catch (erro) {

        console.error(
            erro
        );

    }

}


/* =========================================
   HISTÓRICO
========================================= */

async function carregarHistorico() {

    const tabela =
        document.getElementById(
            "listaRelatorioMovimentacoes"
        );


    try {

        const params =
            getParametrosData();


        const resposta =
            await fetch(
                `/api/relatorios/movimentacoes?${params}`,
                {
                    headers
                }
            );


        const dados =
            await resposta.json();


        if (
            dados.length === 0
        ) {

            tabela.innerHTML =
                `
                <tr>

                    <td
                        colspan="5"
                        style="text-align:center"
                    >

                        Nenhuma movimentação encontrada.

                    </td>

                </tr>
                `;

            return;

        }


        tabela.innerHTML =
            dados.map(
                movimento =>

                `
                <tr>

                    <td>

                        ${movimento.produto_nome}

                    </td>


                    <td>

                        ${
                            movimento.tipo ===
                            "ENTRADA"

                            ?

                            "📥 Entrada"

                            :

                            "📤 Saída"
                        }

                    </td>


                    <td>

                        ${movimento.quantidade}

                    </td>


                    <td>

                        ${
                            movimento.usuario_nome
                            ||
                            "-"
                        }

                    </td>


                    <td>

                        ${dataFormatada(
                            movimento.criado_em
                        )}

                    </td>

                </tr>
                `

            ).join("");


    } catch (erro) {

        console.error(
            erro
        );

    }

}


/* =========================================
   CARREGAR RELATÓRIOS
========================================= */

function carregarRelatorios() {

    carregarResumo();

    carregarEstoqueBaixo();

    carregarEstoqueZerado();

    carregarResumoMovimentacoes();

    carregarHistorico();

}


/* =========================================
   BOTÃO FILTRAR
========================================= */

document
    .getElementById(
        "btnFiltrar"
    )
    .addEventListener(
        "click",
        () => {

            carregarResumoMovimentacoes();

            carregarHistorico();

        }
    );


/* =========================================
   LIMPAR FILTROS
========================================= */

document
    .getElementById(
        "btnLimpar"
    )
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "dataInicio"
                )
                .value =
                "";


            document
                .getElementById(
                    "dataFim"
                )
                .value =
                "";


            carregarResumoMovimentacoes();

            carregarHistorico();

        }
    );


/* =========================================
   IMPRIMIR
========================================= */

function imprimirRelatorio() {

    window.print();

}


/* =========================================
   LOGOUT
========================================= */

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


/* =========================================
   INICIAR
========================================= */

carregarRelatorios();