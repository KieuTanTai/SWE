// src/services/driverService.ts
import { Driver } from "@/interfaces/driver";

// === MOCK DATA (Đã thêm trạng thái) ===
const MOCK_DRIVERS: Driver[] = [
  {
    driver_person_id: 201,
    driver_experience: 5,
    driver_experience_type: 'year',
    driver_late_arrival_count: 0,
    person: {
      person_full_name: "Michael Schumaker",
      person_email: "mike@driver.com",
      person_phone: "0909123456",
      person_gender: "Male",
      person_birthday: "1980-05-10",
      person_life_cycle_status: true // Active
    }
  },
  {
    driver_person_id: 202,
    driver_experience: 10,
    driver_experience_type: 'month',
    driver_late_arrival_count: 3,
    person: {
      person_full_name: "Lewis Hamilton",
      person_email: "lewis@driver.com",
      person_phone: "0909987654",
      person_gender: "Male",
      person_birthday: "1985-01-07",
      person_life_cycle_status: true // Active
    }
  },
  {
    driver_person_id: 203,
    driver_experience: 3,
    driver_experience_type: 'year',
    driver_late_arrival_count: 1,
    person: {
      person_full_name: "Max Verstappen",
      person_email: "max@driver.com",
      person_phone: "0912345678",
      person_gender: "Male",
      person_birthday: "1997-09-30",
      person_life_cycle_status: false // Giả lập 1 người đã nghỉ việc
    }
  }
];

export const driverService = {
  // 1. Lấy danh sách
  getAllDrivers: async () => {
    return new Promise<Driver[]>((resolve) => {
      setTimeout(() => resolve(MOCK_DRIVERS), 800);
    });
  },

  // 2. Lấy chi tiết
  getDriverById: async (id: number) => {
    return new Promise<Driver>((resolve, reject) => {
      setTimeout(() => {
        console.log("Fetching driver ID:", id);
        const driver = MOCK_DRIVERS.find(d => d.driver_person_id === id);
        if (driver) resolve(driver);
        else reject(new Error("Driver not found"));
      }, 500);
    });
  },

  // 3. Tạo mới
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDriver: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Create Driver Payload:", data);
        resolve({ success: true });
      }, 1000);
    });
  },

  // 4. Cập nhật
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateDriver: async (id: number, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Update Driver ID ${id}:`, data);
        resolve({ success: true });
      }, 1000);
    });
  },

  // 5. Xóa Mềm (Soft Delete)
  deleteDriver: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Soft Deleting Driver ID: ${id}`);
        // Tìm driver và chuyển trạng thái
        const driver = MOCK_DRIVERS.find(d => d.driver_person_id === id);
        if (driver && driver.person) {
            driver.person.person_life_cycle_status = false; // Disable
        }
        resolve({ success: true });
      }, 500);
    });
  }
};