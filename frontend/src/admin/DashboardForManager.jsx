"use client";
import React from "react";
import { Card, Row, Col, Alert, Container } from "react-bootstrap";

export default function Dashboard() {
  // Mock data UI
  const stats = [
    { label: "Tổng số học sinh", value: 1250 },
    { label: "Tổng số tài xế", value: 85 },
    { label: "Tổng số xe bus", value: 42 },
    { label: "Tổng số tuyến đường", value: 28 },
  ];

  const quickInfoCards = [
    { title: "Tình trạng xe", desc: "Tất cả xe bus đang hoạt động bình thường." },
    { title: "Thời tiết hôm nay", desc: "Trời nắng nhẹ, phù hợp cho lịch trình đưa đón." },
    { title: "Thông tin bảo trì", desc: "3 xe bus sẽ bảo trì vào cuối tuần." },
    { title: "Sự kiện sắp tới", desc: "Họp phụ huynh vào ngày 10/12." },
  ];

  return (
    <Container className="py-4">
      {/* TITLE */}
      <h2 className="fw-bold mb-4">Dashboard</h2>

      {/* STATISTICS */}
      <Row className="mb-4">
        {stats.map((item, index) => (
          <Col md={3} key={index}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h6 className="text-muted">{item.label}</h6>
                <h2 className="fw-bold">{item.value}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* IMPORTANT ANNOUNCEMENT */}
      <Alert variant="danger" className="shadow-sm">
        🔔 <strong>Thông báo quan trọng:</strong> Tuyến đường Maple Express sẽ thay đổi lịch trình trong tuần này do nâng cấp đường.
      </Alert>

      {/* GENERAL INFORMATION CARDS */}
      <h5 className="fw-bold mt-4 mb-3">Thông tin chung</h5>
      <Row>
        {quickInfoCards.map((info, index) => (
          <Col md={3} key={index} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{info.title}</Card.Title>
                <Card.Text>{info.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
