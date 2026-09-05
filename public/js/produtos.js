const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

let produtos = [];
let categorias = [];

const listaProdutos = document.getElementById("listaProdutos");

const modal = document.getElementById("modalProduto");

const form = document.getElementById("formProduto");

const mensagem = document.getElementById("mensagem");

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;

  mensagem.className = `mensagem ${tipo}`;

  setTimeout(() => {
    mensagem.textContent = "";

    mensagem.className = "mensagem";
  }, 3000);
}

async function carregarCategorias() {
  try {
    const resposta = await fetch("/api/categorias", {
      headers,
    });

    categorias = await resposta.json();

    const select = document.getElementById("categoria");

    select.innerHTML = `<option value="">
                Sem categoria
            </option>`;

    categorias.forEach((categoria) => {
      select.innerHTML += `
                    <option
                        value="${categoria.id}"
                    >
                        ${categoria.nome}
                    </option>
                `;
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}

async function carregarProdutos() {
  try {
    listaProdutos.innerHTML = `
            <tr>
                <td colspan="9">
                    Carregando produtos...
                </td>
            </tr>
        `;

    const resposta = await fetch("/api/produtos", {
      headers,
    });

    if (!resposta.ok) {
      throw new Error("Erro ao carregar produtos");
    }

    produtos = await resposta.json();

    renderizarProdutos();
  } catch (erro) {
    console.error(erro);

    listaProdutos.innerHTML = `
            <tr>
                <td colspan="9">
                    Erro ao carregar produtos.
                </td>
            </tr>
        `;
  }
}
function atualizarResumo() {
  const total = produtos.length;

  const estoque = produtos.filter((produto) => {
    return Number(produto.quantidade) > 0;
  }).length;

  const baixo = produtos.filter((produto) => {
    const quantidade = Number(produto.quantidade);
    const minimo = Number(produto.estoque_minimo);

    return quantidade > 0 && quantidade <= minimo;
  }).length;

  const zerados = produtos.filter((produto) => {
    return Number(produto.quantidade) === 0;
  }).length;

  document.getElementById("totalProdutos").textContent = total;
  document.getElementById("produtosEstoque").textContent = estoque;
  document.getElementById("produtosBaixo").textContent = baixo;
  document.getElementById("produtosZerados").textContent = zerados;
}


function renderizarProdutos() {
    atualizarResumo();
  const pesquisa = document.getElementById("pesquisa").value.toLowerCase();

  const filtro = document.getElementById("filtroEstoque").value;

  const produtosFiltrados = produtos.filter((produto) => {
    const nome = produto.nome.toLowerCase();

    const codigo = produto.codigo ? produto.codigo.toLowerCase() : "";

    const pesquisaEncontrada =
      nome.includes(pesquisa) || codigo.includes(pesquisa);

    const quantidade = Number(produto.quantidade);

    const minimo = Number(produto.estoque_minimo);

    let passaFiltro = true;

    if (filtro === "baixo") {
      passaFiltro = quantidade > 0 && quantidade <= minimo;
    }

    if (filtro === "normal") {
      passaFiltro = quantidade > minimo;
    }

    if (filtro === "zerado") {
      passaFiltro = quantidade === 0;
    }

    return pesquisaEncontrada && passaFiltro;
  });

  if (produtosFiltrados.length === 0) {
    listaProdutos.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="text-align:center"
                >
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

    return;
  }

  listaProdutos.innerHTML = produtosFiltrados
    .map((produto) => {
      const quantidade = Number(produto.quantidade);

      const minimo = Number(produto.estoque_minimo);

      let status = `<span class="status normal">
                        Normal
                    </span>`;

      if (quantidade === 0) {
        status = `<span class="status zerado">
                            Zerado
                        </span>`;
      } else if (quantidade <= minimo) {
        status = `<span class="status baixo">
                            Estoque Baixo
                        </span>`;
      }

      return `

                <tr>

                    <td>
                        #${produto.id}
                    </td>


                    <td>
                        <strong>
                            ${produto.nome}
                        </strong>
                    </td>


                    <td>
                        ${produto.codigo || "-"}
                    </td>


                    <td>
                        ${produto.categoria_nome || "-"}
                    </td>


                    <td>

                        ${formatarDinheiro(produto.preco_compra)}

                    </td>


                    <td>

                        ${formatarDinheiro(produto.preco_venda)}

                    </td>


                    <td>

                        ${quantidade}

                    </td>


                    <td>

                        ${status}

                    </td>


                    <td>

                        <div class="acoes">

                            <button
                                class="btn-editar"
                                onclick="editarProduto(${produto.id})"
                            >
                                ✏️
                            </button>


                            <button
                                class="btn-excluir"
                                onclick="excluirProduto(${produto.id})"
                            >
                                🗑️
                            </button>

                        </div>

                    </td>

                </tr>

                `;
    })
    .join("");
}

function formatarDinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function abrirModal() {
  document.getElementById("tituloModal").textContent = "Novo Produto";

  form.reset();

  document.getElementById("produtoId").value = "";

  document.getElementById("quantidade").value = 0;

  document.getElementById("estoqueMinimo").value = 5;

  modal.classList.add("mostrar");
}

function fecharModal() {
  modal.classList.remove("mostrar");
}

async function editarProduto(id) {
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    mostrarMensagem("Produto não encontrado", "erro");

    return;
  }

  document.getElementById("tituloModal").textContent = "Editar Produto";

  document.getElementById("produtoId").value = produto.id;

  document.getElementById("nome").value = produto.nome;

  document.getElementById("codigo").value = produto.codigo || "";

  document.getElementById("categoria").value = produto.categoria_id || "";

  document.getElementById("quantidade").value = produto.quantidade;

  document.getElementById("estoqueMinimo").value = produto.estoque_minimo;

  document.getElementById("precoCompra").value = produto.preco_compra;

  document.getElementById("precoVenda").value = produto.preco_venda;

  /*
        Quantidade não deve ser
        alterada diretamente
        quando o produto já existe.

        O ideal é usar a tela
        de movimentações.
    */

  document.getElementById("quantidade").disabled = true;

  modal.classList.add("mostrar");
}

async function excluirProduto(id) {
  const produto = produtos.find((p) => p.id === id);

  if (!produto) {
    return;
  }

  const confirmar = confirm(
    `Deseja realmente excluir o produto "${produto.nome}"?`,
  );

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`/api/produtos/${id}`, {
      method: "DELETE",

      headers,
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(dados.erro || "Erro ao excluir produto", "erro");

      return;
    }

    mostrarMensagem("Produto excluído com sucesso");

    carregarProdutos();
  } catch (erro) {
    mostrarMensagem("Erro ao conectar ao servidor", "erro");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("produtoId").value;

  const dados = {
    nome: document.getElementById("nome").value,

    codigo: document.getElementById("codigo").value,

    categoria_id: document.getElementById("categoria").value || null,

    preco_compra: Number(document.getElementById("precoCompra").value),

    preco_venda: Number(document.getElementById("precoVenda").value),

    estoque_minimo: Number(document.getElementById("estoqueMinimo").value),
  };

  /*
            Apenas no cadastro
            enviamos a quantidade inicial.
        */

  if (!id) {
    dados.quantidade = Number(document.getElementById("quantidade").value);
  }

  try {
    let url = "/api/produtos";

    let metodo = "POST";

    if (id) {
      url = `/api/produtos/${id}`;

      metodo = "PUT";
    }

    const resposta = await fetch(url, {
      method: metodo,

      headers,

      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mostrarMensagem(resultado.erro || "Erro ao salvar produto", "erro");

      return;
    }

    mostrarMensagem(
      id ? "Produto atualizado com sucesso" : "Produto cadastrado com sucesso",
    );

    fecharModal();

    carregarProdutos();
  } catch (erro) {
    console.error(erro);

    mostrarMensagem("Erro ao conectar ao servidor", "erro");
  }
});

document
  .getElementById("pesquisa")
  .addEventListener("input", renderizarProdutos);

document
  .getElementById("filtroEstoque")
  .addEventListener("change", renderizarProdutos);

document.getElementById("btnNovoProduto").addEventListener("click", () => {
  document.getElementById("quantidade").disabled = false;

  abrirModal();
});

document.getElementById("fecharModal").addEventListener("click", fecharModal);

document.getElementById("cancelarModal").addEventListener("click", fecharModal);

document.getElementById("logout").addEventListener("click", (event) => {
  event.preventDefault();

  localStorage.removeItem("token");

  localStorage.removeItem("usuario");

  window.location.href = "index.html";
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    fecharModal();
  }
});

/* INICIAR */

carregarCategorias();

carregarProdutos();
