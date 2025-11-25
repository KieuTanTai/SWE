import { useEffect, useState } from "react";
import { getRoutes } from "@/services/routeService";
import type { Route } from "@/interfaces/route";

export default function useRouteList() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setLoading(true);
        const data = await getRoutes();
        setRoutes(data);
      } catch (err) {
        setError("Không thể tải dữ liệu tuyến xe");
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  return { routes, loading, error };
}
