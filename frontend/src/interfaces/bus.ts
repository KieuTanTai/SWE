
export interface Bus {
  bus_id?: number; // Optional khi tạo mới
  bus_license_plate: string;
  bus_brand: string;
  bus_model: string;
  bus_capacity: number;
  bus_year_manufactured: number;
  bus_has_wifi: boolean;
  bus_has_camera: boolean;
  bus_color: string;
  bus_status: boolean; // true: Active, false: Maintenance/Inactive
  
  // Các trường tính toán từ Backend 
  bus_age?: number; 
}