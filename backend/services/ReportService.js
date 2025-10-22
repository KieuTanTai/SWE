import reportDAO from "../infrastructure/data/reportDAO.js";

 class ReportService {
  async getAll() {
    return await reportDAO.getAll();
  }

  async getById(id) {
    return await reportDAO.getById(id);
  }

  async create(data) {
    return await reportDAO.insert(data);
  }

  async update(id, data) {
    return await reportDAO.update(id, data);
  }

  async delete(id) {
    return await reportDAO.delete(id);
  }
}
export default new ReportService;