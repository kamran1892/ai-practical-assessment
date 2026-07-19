const ticketService = require('../services/ticketService');
const {
  parseTicketIdParam,
  validateListQuery,
  validateCreateTicketBody,
  validateUpdateTicketBody,
} = require('../validators/ticketValidators');

async function listTickets(req, res, next) {
  try {
    const filters = validateListQuery(req.query);
    const tickets = await ticketService.listTickets(filters);
    res.status(200).json(tickets);
  } catch (err) {
    next(err);
  }
}

async function getTicketById(req, res, next) {
  try {
    const id = parseTicketIdParam(req.params.id);
    const ticket = await ticketService.getTicketDetail(id);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const input = validateCreateTicketBody(req.body);
    const ticket = await ticketService.createTicket(input);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
}

async function updateTicket(req, res, next) {
  try {
    const id = parseTicketIdParam(req.params.id);
    const patch = validateUpdateTicketBody(req.body);
    const ticket = await ticketService.updateTicket(id, patch);
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTickets,
  getTicketById,
  createTicket,
  updateTicket,
};
