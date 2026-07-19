const express = require('express');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');

const router = express.Router();

router.get('/', ticketController.listTickets);
router.post('/', ticketController.createTicket);

// Nested routes before bare /:id where helpful for clarity
router.get('/:id/comments', commentController.listComments);
router.post('/:id/comments', commentController.addComment);
router.patch('/:id/status', ticketController.changeStatus);

router.get('/:id', ticketController.getTicketById);
router.patch('/:id', ticketController.updateTicket);

module.exports = router;
