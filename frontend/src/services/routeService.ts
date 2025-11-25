import axios from "axios";
import type { Route } from "@/interfaces/route";

const baseUrl = "http://localhost:5000/api/routes";

export async function getRoutes(): Promise<Route[]> {
  const response = await axios.get(baseUrl);
  return response.data as Route[];
}
