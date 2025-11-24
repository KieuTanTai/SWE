
import { Bus } from "@/interfaces/bus";

// === MOCK DATA (Dữ liệu giả lập) ===
const MOCK_BUSES: Bus[] = [
  {
    bus_id: 1,
    bus_license_plate: "51B-123.45",
    bus_brand: "Hyundai",
    bus_model: "County",
    bus_capacity: 29,
    bus_year_manufactured: 2019,
    bus_has_wifi: true,
    bus_has_camera: true,
    bus_color: "Yellow",
    bus_status: true, // Active
    bus_age: 5
  },
  {
    bus_id: 2,
    bus_license_plate: "29H-999.99",
    bus_brand: "Thaco",
    bus_model: "Garden",
    bus_capacity: 45,
    bus_year_manufactured: 2020,
    bus_has_wifi: true,
    bus_has_camera: false,
    bus_color: "White",
    bus_status: true, // Active
    bus_age: 4
  },
  {
    bus_id: 3,
    bus_license_plate: "60A-555.66",
    bus_brand: "Ford",
    bus_model: "Transit",
    bus_capacity: 16,
    bus_year_manufactured: 2015,
    bus_has_wifi: false,
    bus_has_camera: false,
    bus_color: "Silver",
    bus_status: false, // Maintenance
    bus_age: 9
  },
];

export const busService = {
  // 1. Lấy danh sách xe
  getAllBuses: async () => {
    return new Promise<Bus[]>((resolve) => {
      setTimeout(() => resolve(MOCK_BUSES), 800);
    });
  },

  // 2. Lấy chi tiết xe (Dùng cho trang Edit)
  getBusById: async (id: number) => {
    return new Promise<Bus>((resolve, reject) => {
      setTimeout(() => {
        // Log id để tránh warning 'unused variable'
        console.log("Fetching bus ID:", id);

        const bus = MOCK_BUSES.find(b => b.bus_id === id);
        if (bus) resolve(bus);
        else reject(new Error("Bus not found"));
      }, 500);
    });
  },

  // 3. Tạo xe mới
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createBus: async (data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("New Bus Created:", data);
        resolve({ success: true });
      }, 1000);
    });
  },

  // 4. Cập nhật xe
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateBus: async (id: number, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updated Bus ${id}:`, data);
        resolve({ success: true });
      }, 1000);
    });
  },

  deleteBus: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Soft Deleting Bus ID: ${id}`);
        const bus = MOCK_BUSES.find(b => b.bus_id === id);
        if (bus) {
            bus.bus_status = false; // Chuyển thành Inactive/Maintenance
        }
        resolve({ success: true });
      }, 500);
    });
  }
};