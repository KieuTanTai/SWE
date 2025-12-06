"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import Maps from "@/components/maps/ggmaps";
import getRouteDetails, { getDetailRouteNames } from "@/api/detail-routes-api";
import { useRouter } from "next/navigation";
import { useAccount } from "@/contexts/AccountContext";
import driverPickupApi from "@/api/driver-pickup-api";
import { Role } from "@/interfaces";

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

    const { account } = useAccount();

    // Driver: role_id = 5 (hoặc role_name = 'driver')
    const isDriver =
        account?.roles?.some((r: Role) => {
            const name = r.role_name?.toString().toLowerCase();
            return name === "driver" || r.role_id === 5;
        }) ?? false;

    // tạm: nhập tay detailScheduleId + driverPersonId
    const [detailScheduleId, setDetailScheduleId] = useState<number>(1);
    const [driverPersonId, setDriverPersonId] = useState<number>(1);

    const [students, setStudents] = useState<PickupStudent[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0); // học sinh đang hiển thị
    const [loadingList, setLoadingList] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showList, setShowList] = useState(false); // bật/tắt panel danh sách
    const [tripAction, setTripAction] = useState<string | null>(null);

    useEffect(() => {
        if (!showList) return;
        if (!detailScheduleId) return;
        loadStudents();
    }, [showList, detailScheduleId]);

    const [tripStatus, setTripStatus] = useState<TripStatus>("not_started");

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

        let note = defaultNote || "";

        if (actionKey === "incident") {
            const input = window.prompt("Mô tả sự cố:", defaultNote || "");
            if (input === null) {
                return;
            }
            note = input;
        }

        setTripAction(actionKey);
        try {
            const body = {
                accountId: driverPersonId,
                type,
                note,
            };

            const res = await driverPickupApi.createTripReport(detailScheduleId, body);
            console.log("[TripReport] res.data =", res.data);

            alert("Đã lưu báo cáo chuyến.");
        } catch (err: any) {
            console.error("Error createTripReport:", err);
            alert(
                "Lỗi tạo báo cáo chuyến: " +
                (err.response?.data?.error || err.message || "Unknown error")
            );
        } finally {
            setTripAction(null);
        }
    };

    // handler cho từng nút
    const handleStartTrip = () => {
        // chỉ cho start 1 lần
        if (tripStatus === "not_started") {
            setTripStatus("in_progress");  // 👈 CHÍNH XÁC CHUỖI NÀY
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
        // Nếu chuẩn bị mở panel thì load danh sách mới
        if (!showList) {
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

    useEffect(() => {
        if (account?.account_id) {
            setDriverPersonId(account.account_id);
        }
    }, [account]);

    const loadStudents = async () => {
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

            rawList.sort(
                (a, b) => a.pickupScheduleId - b.pickupScheduleId
            );

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

    useEffect(() => {
        loadStudents();
    }, []);

    const currentStudent =
        students.length > 0 ? students[currentIndex] ?? students[0] : null;

    const updateStatus = async (
        pickupScheduleId: number,
        studentId: number,
        status: string,
        note?: string
    ) => {
        if (!isDriver) return;

        setUpdatingId(pickupScheduleId);
        try {
            const body = {
                detailScheduleId,
                studentId,
                accountId: driverPersonId,
                status,
                note: note || "",
            };

            const res = await driverPickupApi.updateStatus(pickupScheduleId, body);
            console.log("[Tracking] updateStatus res.data =", res.data);

            if (res.data?.success === false) {
                throw new Error(res.data.error || "Update status failed");
            }

            // update local state
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
            alert(
                "Lỗi cập nhật trạng thái: " +
                (err.response?.data?.error || err.message || "Unknown error")
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
        await updateStatus(
            currentStudent.pickupScheduleId,
            currentStudent.studentId,
            status,
            status === "picked_up" ? "Đã đón" : "Phụ huynh tới trễ"
        );

        setStudents((prev) => {
            const updated = prev;
            const nextIdx = updated.findIndex(
                (s) => s.status !== "picked_up" && s.status !== "late"
            );
            // Nếu không còn ai chưa đón thì giữ nguyên index
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

                {isDriver && (
                    <div className="fixed top-6 left-1/2 z-2000">
                        <div
                        >
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
                                        className="px-3 py-2 rounded-md bg-slate-800 text-white text-sm border border-slate-500"
                                        onClick={handleToggleList}
                                    >
                                        {showList ? "Ẩn danh sách" : "Xem danh sách"}
                                    </button>

                                </div>
                            )}
                        </div>
                    </div>
                )}

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

                    </div>
                )}

                {showList && (
                    <div className="fixed top-24 right-6 w-80 max-h-[70vh] bg-slate-800 rounded-xl p-4 text-slate-100 shadow-xl flex flex-col z-2000">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">
                                Danh sách học sinh (thứ tự đón)
                            </h3>
                            <span className="text-xs text-slate-300">
                                DS ID: {detailScheduleId}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 mb-3 text-xs">
                            <div className="flex gap-2 items-center">
                                <span>Detail ID:</span>
                                <input
                                    type="number"
                                    min={1}
                                    className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-xs"
                                    value={detailScheduleId}
                                    onChange={(e) =>
                                        setDetailScheduleId(Number(e.target.value) || 1)
                                    }
                                />
                            </div>
                            {/*{isDriver && (*/}
                            {/*    <div className="flex gap-2 items-center">*/}
                            {/*        <span>Driver:</span>*/}
                            {/*        <input*/}
                            {/*            type="number"*/}
                            {/*            min={1}*/}
                            {/*            className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-600 text-xs"*/}
                            {/*            value={driverPersonId}*/}
                            {/*            onChange={(e) =>*/}
                            {/*                setDriverPersonId(Number(e.target.value) || 1)*/}
                            {/*            }*/}
                            {/*        />*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            <button
                                onClick={loadStudents}
                                disabled={loadingList}
                                className="mt-1 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-xs font-medium disabled:opacity-60"
                            >
                                {loadingList ? "Đang tải..." : "Tải danh sách"}
                            </button>
                            {error && (
                                <div className="text-xs text-red-400">Lỗi: {error}</div>
                            )}
                        </div>

                        <div className="flex-1 overflow-auto z-1500">
                            {students.length === 0 ? (
                                <div className="text-sm text-slate-300">
                                    Chưa có học sinh cho detailScheduleId {detailScheduleId}.
                                </div>
                            ) : (
                                <ul className="space-y-2 text-sm z-1500">
                                    {students.map((s, idx) => {
                                        const isActive = idx === currentIndex;
                                        return (
                                            <li
                                                key={s.pickupScheduleId}
                                                onClick={() => {
                                                    setCurrentIndex(idx);   // đổi học sinh đang xem
                                                    setShowList(false);     // (tuỳ) đóng panel sau khi chọn
                                                }}
                                                className={`cursor-pointer px-3 py-2 rounded-lg bg-slate-900 flex justify-between items-center ${isActive
                                                        ? "border border-sky-500 ring-1 ring-sky-500"
                                                        : "hover:bg-slate-800"
                                                    }`}
                                            >
                                                <div>
                                                    <div className="font-semibold">{s.studentName}</div>
                                                    <div className="text-xs text-slate-300">
                                                        {s.studentAddress}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-slate-300">
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
