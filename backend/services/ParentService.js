
import parentDAO from '../infrastructure/data/parentDAO.js';

class ParentService {
  async getAll() {
    return await parentDAO.getAll();
  }

  async getById(id) {
    return await parentDAO.getById(id);
  }

  async create(data) {
    return await parentDAO.insert(data);
  }

  async update(id, data) {
    return await parentDAO.update(id, data);
  }

  async delete(id) {
    return await parentDAO.delete(id);
  }
}

export default new ParentService();
