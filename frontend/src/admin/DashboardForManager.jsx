import React from "react";
import { Button, Table, Card, Row, Col, Nav } from "react-bootstrap";

function App() {
  const students = [
    { id: "#STU-00123", name: "Johnathan Doe", bus: "B-42", route: "Maple Street Express" },
    { id: "#STU-00124", name: "Emily Smith", bus: "B-17", route: "Oak Avenue Line" },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white vh-100 p-3" style={{ width: "240px" }}>
        <h5 className="mb-4">🚌 BusTrack Pro</h5>
        <Nav className="flex-column">
          <Nav.Link className="text-white">Dashboard</Nav.Link>
          <Nav.Link className="text-white bg-secondary rounded">Students</Nav.Link>
          <Nav.Link className="text-white">Buses</Nav.Link>
          <Nav.Link className="text-white">Drivers</Nav.Link>
          <Nav.Link className="text-white">Routes</Nav.Link>
          <Nav.Link className="text-white">Reports</Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <input type="text" className="form-control w-50" placeholder="Search..." />
          <div className="d-flex align-items-center">
            <span className="me-2">Admin User</span>
            <div className="rounded-circle bg-secondary" style={{ width: 40, height: 40 }}></div>
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="p-4">
          <Row className="mb-4">
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Total Students</Card.Title>
                  <h2>1,250</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Total Buses</Card.Title>
                  <h2>84</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title>Active Routes</Card.Title>
                  <h2>45</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Student Table */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Student Records</h5>
            <div>
              <Button variant="primary" className="me-2">Create New Route</Button>
              <Button variant="info">Add New Student</Button>
            </div>
          </div>

          <Table bordered hover className="bg-white">
            <thead className="table-light">
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Bus No.</th>
                <th>Route</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.bus}</td>
                  <td>{s.route}</td>
                  <td>
                    <Button size="sm" variant="link">Edit</Button>
                    <Button size="sm" variant="link" className="text-danger">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;
