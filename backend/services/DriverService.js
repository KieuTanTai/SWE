import driverDAO from '../infrastructure/data/driverDAO.js';
class DriverService {
  async getAll() {
    return await driverDAO.getAll();
  }

  async getById(id) {
    return await driverDAO.getById(id);
  }

  async create(data) {
    return await driverDAO.insert(data);
  }

  async update(id, data) {
    return await driverDAO.update(id, data);
  }

  async delete(id) {
    return await driverDAO.delete(id);
  }
}

export default new DriverService();
