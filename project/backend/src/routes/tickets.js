const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

router.get('/', ticketController.listTickets);
router.post('/', ticketController.createTicket);
router.get('/:id', ticketController.getTicketById);
router.patch('/:id', ticketController.updateTicket);

// Status change intentionally not mounted here — next step (statusTransition module)

module.exports = router;
