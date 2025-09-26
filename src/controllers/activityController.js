// src/controllers/activityController.js
const ActivityService = require('../services/activityService');
const Service = require('../services/activityService');
const listPublished = async (_req, res, next) => {
  try {
    const list = await ActivityService.listPublished();
    res.json(list);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const activity = await ActivityService.create(req.body, req.user.id);
    res.json(activity);
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const registration = await ActivityService.register(Number(req.params.id), req.user.id);
    res.json(registration);
  } catch (err) {
    next(err);
  }
};

module.exports = { listPublished, create, register };
