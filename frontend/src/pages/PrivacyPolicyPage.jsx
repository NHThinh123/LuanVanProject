import { Col, Layout, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

const PrivacyPolicyPage = () => {
  return (
    <Row justify={"center"}>
      <Col span={18}>
        <Layout style={{ padding: "24px", background: "#fff" }}>
          <Title level={2} style={{ color: "#1D267D" }}>
            Chính Sách Bảo Mật
          </Title>
          <Paragraph>
            Tại <strong>Knowee</strong>, chúng tôi cam kết bảo vệ quyền riêng tư
            và thông tin cá nhân của người dùng. Chính sách bảo mật này giải
            thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu
            của bạn khi bạn sử dụng nền tảng của chúng tôi.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            1. Thông Tin Thu Thập
          </Title>
          <Paragraph>
            Chúng tôi thu thập các loại thông tin sau:
            <ul>
              <li>
                <strong>Thông tin cá nhân</strong>: Họ tên, email, trường học,
                ngành học, năm học khi bạn đăng ký tài khoản.
              </li>
              <li>
                <strong>Thông tin sử dụng</strong>: Lịch sử tìm kiếm, bài viết
                bạn thích, bình luận, hoặc tương tác trên nền tảng.
              </li>
              <li>
                <strong>Thông tin kỹ thuật</strong>: Địa chỉ IP, loại thiết bị,
                trình duyệt, và dữ liệu phiên khi bạn truy cập Knowee.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            2. Mục Đích Sử Dụng Thông Tin
          </Title>
          <Paragraph>
            Thông tin của bạn được sử dụng để:
            <ul>
              <li>
                Cung cấp và cá nhân hóa các gợi ý bài viết dựa trên sở thích và
                hành vi của bạn.
              </li>
              <li>
                Quản lý tài khoản và hỗ trợ các chức năng như đăng bài, bình
                luận, và chat trực tuyến.
              </li>
              <li>
                Cải thiện nền tảng, phân tích dữ liệu và đảm bảo an toàn hệ
                thống.
              </li>
              <li>Gửi thông báo hoặc cập nhật về Knowee (nếu bạn đồng ý).</li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            3. Lưu Trữ và Bảo Mật Dữ Liệu
          </Title>
          <Paragraph>
            <ul>
              <li>
                Chúng tôi sử dụng SSL/TLS để mã hóa dữ liệu truyền tải giữa
                client và server.
              </li>
              <li>
                Mật khẩu được mã hóa bằng thuật toán mạnh trước khi lưu trữ
                trong cơ sở dữ liệu MongoDB.
              </li>
              <li>
                Chúng tôi triển khai các biện pháp bảo mật để chống lại các cuộc
                tấn công như XSS và CSRF.
              </li>
              <li>
                Dữ liệu được lưu trữ trên các máy chủ an toàn và chỉ được truy
                cập bởi nhân viên được ủy quyền.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            4. Chia Sẻ Thông Tin
          </Title>
          <Paragraph>
            Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên
            thứ ba, trừ khi:
            <ul>
              <li>Có sự đồng ý của bạn.</li>
              <li>
                Cần thiết để tuân thủ yêu cầu pháp lý hoặc bảo vệ quyền lợi của
                Knowee.
              </li>
              <li>
                Sử dụng các dịch vụ bên thứ ba (như Cloudinary để lưu trữ tài
                liệu) với các biện pháp bảo mật nghiêm ngặt.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            5. Quyền Của Người Dùng
          </Title>
          <Paragraph>
            Bạn có quyền:
            <ul>
              <li>
                Truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình thông
                qua trang cá nhân.
              </li>
              <li>
                Yêu cầu ngừng sử dụng dữ liệu của bạn bằng cách liên hệ qua
                email: <a href="mailto:support@knowee.vn">support@knowee.vn</a>.
              </li>
              <li>Từ chối nhận thông báo hoặc email tiếp thị từ Knowee.</li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            6. Thay Đổi Chính Sách Bảo Mật
          </Title>
          <Paragraph>
            Chúng tôi có thể cập nhật chính sách bảo mật này để phản ánh các
            thay đổi trong hoạt động hoặc yêu cầu pháp lý. Mọi cập nhật sẽ được
            thông báo trên nền tảng và có hiệu lực ngay khi đăng tải.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            7. Liên Hệ
          </Title>
          <Paragraph>
            Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua
            email: <a href="mailto:support@knowee.vn">support@Knowee.vn</a>.
          </Paragraph>
        </Layout>
      </Col>
    </Row>
  );
};

export default PrivacyPolicyPage;
