import { Avatar, Col, Flex, Row } from "antd";

import { Link } from "react-router-dom";
import logo from "../../assets/Logo/Logo.png";
import { Footer } from "antd/es/layout/layout";
import {
  FacebookFilled,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
const FooterCustom = () => {
  return (
    <div
      style={{
        padding: "40px 16px",
        textAlign: "center",
        borderTop: "1px solid #e8e8e8", // Top border for separation
      }}
    >
      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col xs={24} sm={8}>
          <Flex vertical align="center">
            <img
              src={logo}
              alt="Logo"
              style={{ height: 32, marginBottom: 16 }}
            />
            <p style={{ fontSize: 14, color: "#8c8c8c", margin: 0 }}>
              Knowee - Kết nối tri thức, chia sẻ đam mê
            </p>
          </Flex>
        </Col>
        <Col xs={24} sm={8}>
          <Flex gap={36} align="end">
            <Link
              to="/"
              style={{ color: "#595959", fontSize: 14, fontWeight: "bold" }}
            >
              Về chúng tôi
            </Link>
            <Link
              to="/"
              style={{ color: "#595959", fontSize: 14, fontWeight: "bold" }}
            >
              Điều khoản sử dụng
            </Link>
            <Link
              to="/"
              style={{ color: "#595959", fontSize: 14, fontWeight: "bold" }}
            >
              Chính sách bảo mật
            </Link>
          </Flex>
        </Col>
        <Col xs={24} sm={8}>
          <Flex vertical gap={8}>
            <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Liên hệ
            </h4>

            <Flex gap={16} justify="center" style={{ marginTop: 8 }}>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar
                  size={32}
                  style={{ backgroundColor: "#3b5998", cursor: "pointer" }}
                  icon={<FacebookFilled />}
                />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar
                  size={32}
                  style={{ backgroundColor: "#1da1f2", cursor: "pointer" }}
                  icon={<TwitterOutlined />}
                />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar
                  size={32}
                  style={{ backgroundColor: "#010409", cursor: "pointer" }}
                  icon={<GithubOutlined />}
                />
              </a>
            </Flex>
          </Flex>
        </Col>
      </Row>
      <div
        style={{
          marginTop: 24,

          paddingTop: 16,
          fontSize: 12,
          color: "#8c8c8c",
        }}
      >
        © 2025 Knowee. All rights reserved.
      </div>
    </div>
  );
};

export default FooterCustom;
