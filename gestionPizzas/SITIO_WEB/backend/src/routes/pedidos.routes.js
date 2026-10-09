const express = require('express');
const router = express.Router();
const { crearPedido, getPedidoById } = require('../controllers/pedidos.controller');

router.post('/', crearPedido);
router.get('/:id', getPedidoById);

module.exports = router;
