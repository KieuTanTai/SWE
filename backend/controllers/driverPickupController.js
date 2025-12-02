// backend/controllers/DriverPickupController.js

import express from "express";
import DriverPickupTrackingService from "../services/driverPickupTrackingService.js";

const router = express.Router();

/**
 * GET /api/driver/trips/:detailScheduleId/pickups
 */
router.get("/trips/:detailScheduleId/pickups", async (req, res) => {
    try {
        const detailScheduleId = parseInt(req.params.detailScheduleId, 10);

        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            return res
                .status(400)
                .json({ error: "detailScheduleId must be a positive integer" });
        }

        const result =
            await DriverPickupTrackingService.getPickupListForTrip(detailScheduleId);

        if (!result.success) {
            return res.status(500).json({ error: result.error });
        }

        return res.json(result.data);
    } catch (error) {
        console.error(
            "[GET /api/driver/trips/:detailScheduleId/pickups] ERROR:",
            error
        );
        return res
            .status(500)
            .json({ error: "Internal server error", message: error.message });
    }
});

/**
 * POST /api/driver/pickups/:pickupScheduleId/status
 *
 * Body JSON:
 * {
 *   "detailScheduleId": 1,
 *   "studentId": 1,
 *   "driverPersonId": 19,
 *   "status": "picked_up",
 *   "note": "Đã đón đúng giờ"
 * }
 */
// backend/controllers/DriverPickupController.js

router.post("/pickups/:pickupScheduleId/status", async (req, res) => {
    try {
        const pickupScheduleId = parseInt(req.params.pickupScheduleId, 10);
        const body = req.body || {};

        const {
            detailScheduleId,
            studentId,
            accountId,   // 👈 LẤY accountId từ body
            status,
            note,
        } = body;

        console.log(">>> req.params:", req.params);
        console.log(">>> req.body:", req.body);
        console.log("Body nhận từ client:", body);

        // validate pickupScheduleId
        if (!Number.isInteger(pickupScheduleId) || pickupScheduleId <= 0) {
            return res
                .status(400)
                .json({ error: "pickupScheduleId must be a positive integer" });
        }

        // ✅ validate accountId (thay vì driverPersonId)
        if (!Number.isInteger(accountId) || accountId <= 0) {
            return res
                .status(400)
                .json({ error: "Invalid accountId in body" });
        }

        // (tuỳ chọn) validate thêm mấy trường còn lại nếu muốn
        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            return res
                .status(400)
                .json({ error: "Invalid detailScheduleId in body" });
        }

        if (!Number.isInteger(studentId) || studentId <= 0) {
            return res
                .status(400)
                .json({ error: "Invalid studentId in body" });
        }

        // Gọi service: service sẽ tự map accountId -> driver_person_id
        const result =
            await DriverPickupTrackingService.createPickupStatusReport(
                accountId,
                {
                    pickupScheduleId,
                    detailScheduleId,
                    studentId,
                    status,
                    note,
                }
            );

        console.log(">>> result from service:", result);

        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(
            "[POST /api/driver/pickups/:pickupScheduleId/status] ERROR:",
            error
        );
        return res
            .status(500)
            .json({ error: "Internal server error", message: error.message });
    }
});


/**
 * POST /api/driver/trips/:detailScheduleId/report
 * body: { accountId, type, note? }
 */
router.post("/trips/:detailScheduleId/report", async (req, res) => {
    try {
        const detailScheduleId = parseInt(req.params.detailScheduleId, 10);
        const { accountId, type, note } = req.body || {};

        if (!Number.isInteger(detailScheduleId) || detailScheduleId <= 0) {
            return res
                .status(400)
                .json({ error: "detailScheduleId must be a positive integer" });
        }

        if (!Number.isInteger(accountId) || accountId <= 0) {
            return res
                .status(400)
                .json({ error: "Invalid accountId in body" });
        }

        const result =
            await DriverPickupTrackingService.createTripReport(accountId, {
                detailScheduleId,
                type,
                note,
            });

        return res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error(
            "[POST /api/driver/trips/:detailScheduleId/report] ERROR:",
            error
        );
        return res
            .status(500)
            .json({ error: "Internal server error", message: error.message });
    }
});


export default router;
