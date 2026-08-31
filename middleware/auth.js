const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            erro: "Token não informado"
        });
    }

    const partes = authHeader.split(" ");

    if (partes.length !== 2) {
        return res.status(401).json({
            erro: "Token inválido"
        });
    }

    const token = partes[1];

    jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {

        if (erro) {
            return res.status(401).json({
                erro: "Token inválido ou expirado"
            });
        }

        req.usuario = usuario;

        next();
    });
}

module.exports = autenticar;    