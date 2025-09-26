const repo = require('../repositories/activityRepo');
const ActivityRepo = require('../repositories/activityRepo');
const assertOwnedOrAdmin = (activity, user) => {
    if (!activity) {
        const e = new Error('Activity không tồn tại'); e.status = 404; throw e;
    }
    if (user.role !== 'ADMIN' && activity.created_by !== user.id) {
        const e = new Error('Không có quyền thao tác hoạt động này'); e.status = 403; throw e;
    }
};

const create = async ({ payload, user }) => {
    const data = await repo.create({ ...payload, created_by: user.id });
    return data;
};

const update = async ({ id, payload, user }) => {
    const act = await repo.getById(id);
    assertOwnedOrAdmin(act, user);
    return await repo.update(id, payload);
};

const destroy = async ({ id, user }) => {
    const act = await repo.getById(id);
    assertOwnedOrAdmin(act, user);
    await repo.destroy(id);
    return { ok: true };
};

const listForManage = async ({ user, status }) =>
    await repo.listForManage({ createdBy: user.id, isAdmin: user.role === 'ADMIN', status });

const updateStatus = async ({ id, status, user }) => {
    const act = await repo.getById(id);
    assertOwnedOrAdmin(act, user);
    return await repo.updateStatus(id, status); // 'DRAFT' | 'PUBLISHED' | 'CLOSED'
};
const listPublished = async () => {
    return ActivityRepo.listPublished();
};
module.exports = { create, update, destroy, listForManage, updateStatus, listPublished };
