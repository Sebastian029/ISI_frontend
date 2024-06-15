import { Spin, Row, Col } from "antd";

const Loading = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          <Col>
            <Spin size="large" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Loading;
