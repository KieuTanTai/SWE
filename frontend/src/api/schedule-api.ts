import axios from "axios";
import type { Schedule } from "@/interfaces/schedule";

export async function getSchedulesByRouteId(
  route_id: number
): Promise<Schedule[]> {
  const response = await axios.get(
    `http://localhost:5000/api/schedules?route_id=${route_id}`
  );
  return response.data as Schedule[];
}
// 🔹 Lịch trình theo tài xế (dựa trên accountId)
export async function getSchedulesByDriverAccountId(
    accountId: number
): Promise<Schedule[]> {
  const response = await axios.get(
      `http://localhost:5000/api/schedules/driver`,
      { params: { accountId } }
  );
  return response.data as Schedule[];
}