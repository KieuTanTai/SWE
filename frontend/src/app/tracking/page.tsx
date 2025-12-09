"use client";

import { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import Maps from "@/components/maps/ggmaps";
import getRouteDetails, { getDetailRouteNames } from "@/api/detail-routes-api";
import { useRouter } from "next/navigation";
import { useAccount } from "@/contexts/AccountContext";
import driverPickupApi from "@/api/driver-pickup-api";
import { Role } from "@/interfaces";
import { scheduleService } from "@/services/scheduleService";

interface RouteData {
    routeId: number;
    routeName: string;
    stopPoints: string[];
}

interface PickupStudent {
    pickupScheduleId: number;
    detailScheduleId: number;
    studentId: number;
    studentName: string;
    studentAddress?: string | null;
    status?: string | null;
    lastReportTime?: string | null;
    lastNote?: string | null;
}
type TripStatus = "not_started" | "in_progress" | "finished";


export default function TrackingPage() {
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [activeItem, setActiveItem] = useState("tracking");
    const [showTripControls, setShowTripControls] = useState(false);
    const router = useRouter();
    const wsRef = useRef<WebSocket | null>(null);
    const [parentAlerts, setParentAlerts] = useState<any[]>([]);


    const { account } = useAccount();

    // Phân quyền: Driver = 5, Admin = 1,2,3, Parent = 4
    const isDriver = account?.roles?.some((r: any) => {
        const name = r.role_name?.toString().toLowerCase();
        return name === "driver" || r.role_id === 5;
    }) ?? false;

    const isAdmin = account?.roles?.some((r: any) => [1, 2, 3].includes(r.role_id)) ?? false;

    const isParent = account?.roles?.some((r: any) => {
        const name = r.role_name?.toString().toLowerCase();
        return name === "parent" || r.role_id === 4;
    }) ?? false;

    const [detailScheduleId, setDetailScheduleId] = useState<number | null>(null);
    const [driverPersonId, setDriverPersonId] = useState<number | null>(null);
    const [driverAccountId, setDriverAccountId] = useState<number | null>(null);

    const [students, setStudents] = useState<PickupStudent[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [loadingList, setLoadingList] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showList, setShowList] = useState(false);
    const [tripAction, setTripAction] = useState<string | null>(null);
    const [tripStatus, setTripStatus] = useState<TripStatus>("not_started");

    useEffect(() => {
        if (account?.person?.person_id) {
            console.log("[Tracking] Setting driverPersonId:", account.person.person_id);
            setDriverPersonId(account.person.person_id);
        }
        if (account?.account_id) {
            console.log("[Tracking] Setting driverAccountId:", account.account_id);
            setDriverAccountId(account.account_id);
        }
    }, [account]);

    useEffect(() => {
        const fetchDriverSchedule = async () => {
            if (!driverPersonId) return;

            try {
                console.log("[Tracking] Fetching schedule for driverPersonId:", driverPersonId);

                const allSchedules = await scheduleService.getAll();
                const driverSchedule = allSchedules.find((s: any) => s.driver_id === account?.account_id);

                if (driverSchedule && driverSchedule.detailSchedules && driverSchedule.detailSchedules.length > 0) {
                    const firstDetailSchedule = driverSchedule.detailSchedules[0];
                    const detailId = firstDetailSchedule.detail_schedule_id;
                    console.log("[Tracking] Found detailScheduleId:", detailId);
                    setDetailScheduleId(detailId);
                } else {
                    console.warn("[Tracking] No schedule found for this driver");
                    // Fallback về 1 nếu không tìm thấy
                    setDetailScheduleId(1);
                }
            } catch (err) {
                console.error("[Tracking] Error fetching driver schedule:", err);
                // Fallback về 1 nếu có lỗi
                setDetailScheduleId(1);
            }
        };

        if (driverPersonId) {
            fetchDriverSchedule();
        }
    }, [driverPersonId, account?.account_id]);

    useEffect(() => {
        if (!account) return;

        // Xác định role để đăng ký với WS
        let wsRole: "driver" | "parent" | "admin" | null = null;
        if (isDriver) wsRole = "driver";
        else if (isParent) wsRole = "parent";
        else if (isAdmin) wsRole = "admin";

        if (!wsRole) return; // ai không thuộc 3 role này thì khỏi connect

        const ws = new WebSocket("ws://localhost:8050");
        wsRef.current = ws;

        ws.onopen = () => {
            const userId =
                account.person?.person_id ??
                account.account_id ??
                Date.now();

            ws.send(
                JSON.stringify({
                    type: "register",
                    role: wsRole,
                    userId: String(userId),
                })
            );
            console.log("[WS] Connected & registered as", wsRole);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "alert") {
                    // Parent (hoặc bất kỳ) sẽ nhận alert từ server
                    setParentAlerts((prev) => [...prev, data]);
                    console.log("[WS] Alert received:", data);
                }
            } catch (e) {
                console.error("[WS] parse error", e);
            }
        };

        ws.onclose = () => {
            console.log("[WS] closed");
        };

        ws.onerror = (err) => {
            console.error("[WS] error", err);
        };

        return () => {
            ws.close();
        };
    }, [account, isDriver, isParent, isAdmin]);

    // Gửi thông báo tới PARENT qua WebSocket
    const sendAlertToParents = (payload: {
        type: "pickup_status" | "incident";
        studentName?: string;
        studentId?: number;
        status?: string;
        note?: string;
    }) => {
        // Chỉ driver mới gửi
        if (!isDriver) return;
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn("[WS] not connected, cannot send alert");
            return;
        }

        // Nội dung text hiển thị bên phía phụ huynh
        let message = "";
        if (payload.type === "pickup_status") {
            if (payload.status === "picked_up") {
                message = `Đã đón học sinh ${payload.studentName || ""}.`;
            } else if (payload.status === "late") {
                message = `Học sinh ${payload.studentName || ""} bị trễ giờ. Ghi chú: ${
                    payload.note || "Không có"
                }`;
            } else {
                message = `Cập nhật trạng thái cho học sinh ${
                    payload.studentName || ""
                }: ${payload.status}`;
            }
        } else if (payload.type === "incident") {
            message = `Báo cáo sự cố: ${payload.note || ""}`;
        }

        ws.send(
            JSON.stringify({
                type: "alert",
                recipient: "parent", // server sẽ broadcast cho tất cả parent
                message,
                meta: payload,
            })
        );
    };

    useEffect(() => {
        if (!showList) return;
        if (!detailScheduleId) return;
        loadStudents();
    }, [showList, detailScheduleId]);

    const createTripReport = async (
        type: "start_pickup" | "dropped_off" | "warning",
        actionKey: "start" | "end" | "incident",
        defaultNote?: string
    ) => {
        if (!isDriver) return;
        if (!detailScheduleId) {
            alert("Không tìm thấy detailScheduleId của chuyến.");
            return;
        }
        if (!driverAccountId) {
            alert("Không tìm thấy thông tin tài xế. Vui lòng đăng nhập lại.");
            return;
        }

        let note = defaultNote || "";

        if (actionKey === "incident") {
            const input = window.prompt("Mô tả sự cố:", defaultNote || "");
            if (input === null) return;
            note = input;
        }

        setTripAction(actionKey);
        try {
            const body = {
                accountId: driverAccountId,
                type,
                note,
            };

            console.log("[TripReport] Calling API with body:", body);
            const res = await driverPickupApi.createTripReport(detailScheduleId, body);
            console.log("[TripReport] res.data =", res.data);

            alert("Đã lưu báo cáo chuyến.");
            if (actionKey === "incident") {
                sendAlertToParents({
                    type: "incident",
                    note,
                });
            }
        } catch (err: any) {
            console.error("Error createTripReport:", err);
            console.error("Error response:", err.response?.data);
            alert(
                "Lỗi tạo báo cáo chuyến: " +
                (err.response?.data?.error || err.response?.data?.message || err.message || "Unknown error")
            );
        } finally {
            setTripAction(null);
        }
    };

    const handleStartTrip = () => {
        if (tripStatus === "not_started") {
            setTripStatus("in_progress");
            alert("Đã bắt đầu chuyến đi.");
        }
    };

    const handleEndTrip = () => {
        if (tripStatus === "in_progress") {
            setTripStatus("finished");
            alert("Đã kết thúc chuyến đi.");
        }
    };

    const handleIncident = () =>
        createTripReport("warning", "incident", "");

    const handleToggleList = async () => {
        if (!showList && isDriver) {
            await loadStudents();
        }
        setShowList((v) => !v);
    };

    useEffect(() => {
        (async () => {
            const result = await getRouteDetails([1, 2, 3]);
            if (result.length > 0) {
                const newRoutes: RouteData[] = [];
                const detailRouteInfos = getDetailRouteNames(result);
                result.forEach((busRoute, index) => {
                    const stopPoints: string[] = [];
                    const routeDetails = detailRouteInfos[index] || [];
                    routeDetails.forEach((detail) => {
                        if (detail.start_name && !stopPoints.includes(detail.start_name)) {
                            stopPoints.push(detail.start_name);
                        }
                        if (detail.end_name && !stopPoints.includes(detail.end_name)) {
                            stopPoints.push(detail.end_name);
                        }
                    });
                    newRoutes.push({
                        routeId: busRoute.route_id,
                        routeName: busRoute.route_name,
                        stopPoints,
                    });
                });
                setRoutes(newRoutes);
            }
        })();
    }, []);

    const loadStudents = async () => {
        if (!detailScheduleId) {
            console.log("[Tracking] Chưa có detailScheduleId, bỏ qua load students");
            return;
        }

        setLoadingList(true);
        setError(null);
        try {
            console.log(
                "[Tracking] Gọi API getPickupList với detailScheduleId =",
                detailScheduleId
            );

            const res = await driverPickupApi.getPickupList(detailScheduleId);
            console.log("[Tracking] res.data =", res.data);

            let rawList: any[] = [];
            if (Array.isArray(res.data)) {
                rawList = res.data;
            } else if (res.data?.success === true) {
                rawList = res.data.data ?? [];
            }

            rawList.sort((a, b) => a.pickupScheduleId - b.pickupScheduleId);
            console.log("[Tracking] rawList sau sort =", rawList);

            const data: PickupStudent[] = rawList.map((item: any) => ({
                pickupScheduleId: item.pickupScheduleId,
                detailScheduleId: item.detailScheduleId,
                studentId: item.studentId,
                studentName: item.studentName ?? "Chưa có tên",
                studentAddress: item.studentAddress ?? "",
                status: item.status ?? null,
                lastReportTime: item.lastReportTime ?? null,
                lastNote: item.lastNote ?? null,
            }));

            console.log("[Tracking] data map sang PickupStudent =", data);

            const idx = data.findIndex(
                (s) => s.status !== "picked_up" && s.status !== "late"
            );
            setCurrentIndex(idx === -1 ? 0 : idx);
            setStudents(data);
        } catch (err: any) {
            console.error("Error load students:", err);
            setError(
                err.response?.data?.error ||
                err.message ||
                "Failed to load pickup list"
            );
        } finally {
            setLoadingList(false);
        }
    };

    // ✅ AUTO-LOAD khi có detailScheduleId
    useEffect(() => {
        if (detailScheduleId) {
            loadStudents();
        }
    }, [detailScheduleId]);

    const currentStudent =
        students.length > 0 ? students[currentIndex] ?? students[0] : null;

    const updateStatus = async (
        pickupScheduleId: number,
        studentId: number,
        status: string,
        note?: string
    ) => {
        if (!isDriver) return;
        if (!driverAccountId) {
            alert("Không tìm thấy thông tin tài xế. Vui lòng đăng nhập lại.");
            return;
        }
        if (!detailScheduleId) {
            alert("Không tìm thấy detailScheduleId.");
            return;
        }

        setUpdatingId(pickupScheduleId);
        try {
            const body = {
                detailScheduleId,
                studentId,
                accountId: driverAccountId,
                status,
                note: note || "",
            };

            console.log("[Tracking] updateStatus body:", body);
            const res = await driverPickupApi.updateStatus(pickupScheduleId, body);
            console.log("[Tracking] updateStatus res.data =", res.data);

            if (res.data?.success === false) {
                throw new Error(res.data.error || "Update status failed");
            }

            setStudents((prev) =>
                prev.map((s) =>
                    s.pickupScheduleId === pickupScheduleId
                        ? {
                            ...s,
                            status,
                            lastReportTime: new Date().toISOString(),
                            lastNote: note || "",
                        }
                        : s
                )
            );
        } catch (err: any) {
            console.error("Error update status:", err);
            console.error("Error response:", err.response?.data);
            alert(
                "Lỗi cập nhật trạng thái: " +
                (err.response?.data?.error || err.response?.data?.message || err.message || "Unknown error")
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const handleStatusAndNext = async (status: "picked_up" | "late") => {
        if (!currentStudent) return;

        if (tripStatus !== "in_progress") {
            alert("Bạn phải bấm 'Bắt đầu chuyến' trước khi cập nhật trạng thái học sinh.");
            return;
        }

        const note =
            status === "picked_up" ? "Đã đón" : "Phụ huynh tới trễ";

        await updateStatus(
            currentStudent.pickupScheduleId,
            currentStudent.studentId,
            status,
            note
        );

        sendAlertToParents({
            type: "pickup_status",
            studentName: currentStudent.studentName,
            studentId: currentStudent.studentId,
            status,
            note,
        });

        setStudents((prev) => {
            const updated = prev;
            const nextIdx = updated.findIndex(
                (s) => s.status !== "picked_up" && s.status !== "late"
            );
            setCurrentIndex(nextIdx === -1 ? 0 : nextIdx);
            return updated;
        });
    };
    const handleNavigate = (item: string) => {
        if (item === "tracking") return;
        if (item === "dashboard") {
            router.push("/");
        } else if (item === "student") {
            router.push("/students");
        } else if (item === "driver") {
            router.push("/drivers");
        } else if (item === "pickups") {
            router.push("/schedules");
        } else if (item === "schedule") {
            router.push("/schedules");
        } else if (item === "route") {
            router.push("/routes");
        } else {
            router.push("/");
        }
    };

    return (
        <Layout activeItem={activeItem} onNavigate={handleNavigate}>
            <div className="relative h-full">
                <div className="h-full">
                    <Maps routes={routes} />
                </div>

                {/* Cụm nút bên PHẢI TRÊN - CHỈ DRIVER */}
                {isDriver && (
                    <div className="fixed top-6 left-1/2 z-2000">
                        <div>
                            <button
                                onClick={() => setShowTripControls((v) => !v)}
                                className="px-4 py-2 rounded-full bg-slate-900/90 text-white text-sm font-semibold shadow border border-slate-600 flex items-center gap-2"
                            >
                                <span>Chi tiết chuyến đi</span>
                            </button>

                            {showTripControls && (
                                <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 rounded-xl shadow-xl p-3 flex flex-col gap-2">
                                    {tripStatus === "not_started" && (
                                        <button
                                            className="px-3 py-2 rounded-md bg-sky-500 text-white text-sm font-semibold"
                                            onClick={handleStartTrip}
                                        >
                                            Bắt đầu chuyến
                                        </button>
                                    )}

                                    {tripStatus === "in_progress" && (
                                        <>
                                            <button
                                                className="px-3 py-2 rounded-md bg-slate-600 text-white text-sm"
                                                onClick={handleEndTrip}
                                            >
                                                Kết thúc chuyến
                                            </button>
                                            <button
                                                className="px-3 py-2 rounded-md bg-amber-500 text-white text-sm"
                                                onClick={handleIncident}
                                            >
                                                Báo cáo sự cố
                                            </button>
                                        </>
                                    )}

                                    {tripStatus === "finished" && (
                                        <span className="px-3 py-2 rounded-md bg-emerald-700 text-white text-xs text-center">
                                            Chuyến đi đã kết thúc
                                        </span>
                                    )}

                                    <button
                                        className="px-3 py-2 rounded-md bg-slate-800 text-white text-sm border border-slate-500 hover:bg-slate-700"
                                        onClick={handleToggleList}
                                    >
                                        {showList ? "Ẩn danh sách" : "Xem danh sách"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CARD HỌC SINH - DRIVER: full control, ADMIN/PARENT: chỉ xem */}
                {currentStudent && (
                    <div className="fixed left-72 bottom-6 max-w-xl bg-slate-900/95 text-slate-50 rounded-2xl px-5 py-4 shadow-2xl z-1100">
                        <div className="text-lg font-semibold">
                            {currentStudent.studentName}
                        </div>
                        <div className="text-sm mt-1">
                            {currentStudent.studentAddress || "Chưa có địa chỉ"}
                        </div>

                        <div className="mt-2 text-xs text-slate-300">
                            Học sinh {currentIndex + 1} / {students.length}
                            {currentStudent.status === "picked_up" && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-600 text-[11px]">
                                    Đã đón
                                </span>
                            )}
                            {currentStudent.status === "late" && (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-orange-500 text-[11px]">
                                    Quá giờ
                                </span>
                            )}
                        </div>

                        {/* CHỈ DRIVER mới có nút cập nhật */}
                        {isDriver && (
                            <div className="mt-3 flex gap-3">
                                <button
                                    className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold shadow disabled:opacity-60"
                                    disabled={
                                        tripStatus !== "in_progress" ||
                                        updatingId === currentStudent.pickupScheduleId
                                    }
                                    title={
                                        tripStatus !== "in_progress"
                                            ? "Hãy bấm 'Bắt đầu chuyến' trước"
                                            : undefined
                                    }
                                    onClick={() => handleStatusAndNext("late")}
                                >
                                    Quá giờ
                                </button>
                                <button
                                    className="px-4 py-2 rounded-full bg-emerald-600 text-white text-sm font-semibold shadow disabled:opacity-60"
                                    disabled={
                                        tripStatus !== "in_progress" ||
                                        updatingId === currentStudent.pickupScheduleId
                                    }
                                    title={
                                        tripStatus !== "in_progress"
                                            ? "Hãy bấm 'Bắt đầu chuyến' trước"
                                            : undefined
                                    }
                                    onClick={() => handleStatusAndNext("picked_up")}
                                >
                                    Đã đón
                                </button>
                            </div>
                        )}

                        {/* Admin/Parent chỉ xem */}
                        {(isAdmin || isParent) && (
                            <div className="mt-3 text-xs text-slate-400 italic">
                                {isAdmin ? "Chế độ xem Admin" : "Chế độ xem Phụ huynh"}
                            </div>
                        )}
                    </div>
                )}

                {/* PANEL DANH SÁCH - Tất cả đều xem được */}
                {showList && (
                    <div className="fixed top-24 right-6 w-80 max-h-[70vh] bg-slate-800 rounded-xl p-4 text-slate-100 shadow-xl flex flex-col z-2000">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">
                                Danh sách học sinh ({students.length})
                            </h3>
                            {detailScheduleId && (
                                <span className="text-xs text-slate-400">
                                    DS: {detailScheduleId}
                                </span>
                            )}
                        </div>

                        {loadingList && (
                            <div className="text-center py-4 text-sm text-slate-400">
                                Đang tải danh sách...
                            </div>
                        )}

                        {error && (
                            <div className="mb-3 p-2 bg-red-500/20 border border-red-500 rounded text-xs text-red-300">
                                Lỗi: {error}
                            </div>
                        )}

                        {/* Admin/Parent chỉ xem, không có form control */}
                        {(isAdmin || isParent) && !loadingList && (
                            <div className="mb-3 text-xs text-slate-400 italic border-b border-slate-700 pb-2">
                                {isAdmin ? "Chế độ giám sát" : "Theo dõi con của bạn"}
                            </div>
                        )}

                        <div className="flex-1 overflow-auto">
                            {!loadingList && students.length === 0 ? (
                                <div className="text-sm text-slate-300">
                                    Chưa có học sinh trong chuyến đi này.
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm">
                                    {students.map((s, idx) => {
                                        const isActive = idx === currentIndex;
                                        return (
                                            <li
                                                key={s.pickupScheduleId}
                                                onClick={() => {
                                                    setCurrentIndex(idx);
                                                    if (isDriver) setShowList(false);
                                                }}
                                                className={`${isDriver ? 'cursor-pointer' : 'cursor-default'} px-3 py-2 rounded-lg bg-slate-900 flex justify-between items-center ${
                                                    isActive
                                                        ? "border-2 border-blue-500 ring-2 ring-blue-400/50"
                                                        : isDriver ? "hover:bg-slate-700" : ""
                                                }`}
                                            >
                                                <div className="flex-1">
                                                    <div className="font-semibold flex items-center gap-2">
                                                        {s.studentName}
                                                        {s.status === "picked_up" && (
                                                            <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px]">
                                                                Đã đón
                                                            </span>
                                                        )}
                                                        {s.status === "late" && (
                                                            <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px]">
                                                                Trễ
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-0.5">
                                                        {s.studentAddress}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-400 ml-2">
                                                    #{idx + 1}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}