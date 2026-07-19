const commentService = require('../services/commentService');
const { parseTicketIdParam } = require('../validators/ticketValidators');
const { validateCreateCommentBody } = require('../validators/commentValidators');

async function listComments(req, res, next) {
  try {
    const ticketId = parseTicketIdParam(req.params.id);
    const comments = await commentService.listComments(ticketId);
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
}

async function addComment(req, res, next) {
  try {
    const ticketId = parseTicketIdParam(req.params.id);
    const input = validateCreateCommentBody(req.body);
    const comment = await commentService.addComment(ticketId, input);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listComments,
  addComment,
};
