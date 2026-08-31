require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const authRoutes = require("./routes/auth");
const produtosRoutes = require("./routes/produtos");
const categoriasRoutes = require("./routes/categorias");
const movimentacoesRoutes = require("./routes/movimentacoes");

app.use("/api/auth", authRoutes);
app.use("/api/produtos", produtosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/movimentacoes", movimentacoesRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});