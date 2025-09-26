const svc = require('../services/activityService');

exports.list = async (req, res, next) => {
  try {
    const data = await svc.listForManage({ user: req.user, status: req.query.status });
    res.json(data);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const body = req.body || {};
    body.status = body.status || 'DRAFT';
    const data = await svc.create({ payload: body, user: req.user });
    res.json(data);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await svc.update({ id, payload: req.body || {}, user: req.user });
    res.json(data);
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const data = await svc.updateStatus({ id, status, user: req.user });
    res.json(data);
  } catch (e) { next(e); }
};

exports.destroy = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = await svc.destroy({ id, user: req.user });
    res.json(data);
  } catch (e) { next(e); }
};
