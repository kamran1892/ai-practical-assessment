const userService = require('../services/userService');

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
};
