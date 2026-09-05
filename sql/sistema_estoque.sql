-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 05/09/2026 às 03:17
-- Versão do servidor: 8.4.7
-- Versão do PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sistema_estoque`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `categorias`
--

INSERT INTO `categorias` (`id`, `nome`, `descricao`) VALUES
(1, 'Alimentos', 'Produtos alimentícios'),
(2, 'Bebidas', 'Bebidas em geral'),
(3, 'Limpeza', 'Produtos de limpeza'),
(4, 'Outros', 'Outros produtos');

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacoes`
--

DROP TABLE IF EXISTS `movimentacoes`;
CREATE TABLE IF NOT EXISTS `movimentacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `produto_id` int NOT NULL,
  `tipo` enum('ENTRADA','SAIDA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade` int NOT NULL,
  `observacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `produto_id` (`produto_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `produtos`
--

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria_id` int DEFAULT NULL,
  `preco_compra` decimal(10,2) DEFAULT '0.00',
  `preco_venda` decimal(10,2) DEFAULT '0.00',
  `quantidade` int DEFAULT '0',
  `estoque_minimo` int DEFAULT '5',
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `categoria_id` (`categoria_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `codigo`, `categoria_id`, `preco_compra`, `preco_venda`, `quantidade`, `estoque_minimo`, `criado_em`) VALUES
(1, 'Arroz 5kg', '789100000001', 1, 18.50, 24.90, 20, 5, '2026-09-05 03:11:04'),
(2, 'Feijão 1kg', '789100000002', 1, 6.00, 8.99, 15, 5, '2026-09-05 03:11:04'),
(3, 'Açúcar 1kg', '789100000003', 1, 3.50, 5.49, 30, 10, '2026-09-05 03:11:04'),
(4, 'Sal 1kg', '789100000004', 1, 1.80, 3.50, 25, 5, '2026-09-05 03:11:04'),
(5, 'Macarrão 500g', '789100000005', 1, 3.20, 5.50, 40, 10, '2026-09-05 03:11:04'),
(6, 'Farinha de Trigo 1kg', '789100000006', 1, 4.50, 6.99, 18, 5, '2026-09-05 03:11:04'),
(7, 'Óleo de Soja 900ml', '789100000007', 1, 6.50, 8.99, 12, 5, '2026-09-05 03:11:04'),
(8, 'Refrigerante Coca-Cola 2L', '789100000008', 2, 7.00, 10.99, 25, 8, '2026-09-05 03:11:04'),
(9, 'Refrigerante Guaraná 2L', '789100000009', 2, 6.00, 9.99, 20, 8, '2026-09-05 03:11:04'),
(10, 'Água Mineral 500ml', '789100000010', 2, 1.50, 3.00, 50, 15, '2026-09-05 03:11:04'),
(11, 'Suco de Laranja 1L', '789100000011', 2, 5.00, 8.50, 10, 5, '2026-09-05 03:11:04'),
(12, 'Energético 269ml', '789100000012', 2, 6.00, 9.99, 8, 5, '2026-09-05 03:11:04'),
(13, 'Detergente 500ml', '789100000013', 3, 1.80, 3.50, 30, 10, '2026-09-05 03:11:04'),
(14, 'Sabão em Pó 800g', '789100000014', 3, 8.00, 12.99, 12, 5, '2026-09-05 03:11:04'),
(15, 'Água Sanitária 1L', '789100000015', 3, 2.50, 4.99, 20, 5, '2026-09-05 03:11:04'),
(16, 'Desinfetante 1L', '789100000016', 3, 3.00, 5.99, 18, 5, '2026-09-05 03:11:04'),
(17, 'Esponja de Aço', '789100000017', 3, 2.00, 3.99, 5, 10, '2026-09-05 03:11:04'),
(18, 'Papel Higiênico 4 unidades', '789100000018', 4, 6.50, 9.99, 15, 5, '2026-09-05 03:11:04'),
(19, 'Sabonete', '789100000019', 4, 1.80, 3.50, 25, 10, '2026-09-05 03:11:04'),
(20, 'Shampoo 400ml', '789100000020', 4, 10.00, 16.99, 8, 5, '2026-09-05 03:11:04'),
(21, 'Creme Dental', '789100000021', 4, 3.50, 6.50, 20, 5, '2026-09-05 03:11:04'),
(22, 'Desodorante', '789100000022', 4, 8.00, 13.99, 3, 5, '2026-09-05 03:11:04'),
(23, 'Biscoito Recheado', '789100000023', 5, 2.50, 4.50, 35, 10, '2026-09-05 03:11:04'),
(24, 'Café 500g', '789100000024', 5, 12.00, 18.99, 10, 5, '2026-09-05 03:11:04'),
(25, 'Leite UHT 1L', '789100000025', 5, 4.00, 6.50, 25, 10, '2026-09-05 03:11:04'),
(26, 'Chocolate 90g', '789100000026', 5, 4.00, 7.99, 30, 10, '2026-09-05 03:11:04'),
(27, 'Batata Chips', '789100000027', 5, 5.00, 8.99, 15, 5, '2026-09-05 03:11:04');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `criado_em`) VALUES
(1, 'Administrador', 'admin@estoque.com', '$2b$10$3biNrMBqP.LlOWq30OSu0uxOCrUZ2J0RGcpcUo2f2meSbPDgJUIfO', '2026-09-05 03:14:37');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
