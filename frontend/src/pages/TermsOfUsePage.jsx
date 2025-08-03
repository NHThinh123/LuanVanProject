import { Col, Layout, Row, Typography } from "antd";

const { Title, Paragraph } = Typography;

const TermsOfUsePage = () => {
  return (
    <Row justify={"center"}>
      <Col span={18}>
        <Layout style={{ padding: "24px", background: "#fff" }}>
          <Title level={2} style={{ color: "#1D267D" }}>
            Điều Khoản Sử Dụng
          </Title>
          <Paragraph>
            Chào mừng bạn đến với <strong>Knowee</strong>. Bằng việc sử dụng nền
            tảng của chúng tôi, bạn đồng ý tuân thủ các điều khoản sử dụng được
            nêu dưới đây. Vui lòng đọc kỹ để hiểu rõ quyền và nghĩa vụ của bạn
            khi tham gia cộng đồng học tập trực tuyến của chúng tôi.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            1. Chấp Nhận Điều Khoản
          </Title>
          <Paragraph>
            Khi truy cập hoặc sử dụng Knowee, bạn xác nhận rằng bạn đã đọc, hiểu
            và đồng ý bị ràng buộc bởi các điều khoản này. Nếu bạn không đồng ý,
            vui lòng không sử dụng dịch vụ của chúng tôi.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            2. Quyền và Nghĩa Vụ của Người Dùng
          </Title>
          <Paragraph>
            <ul>
              <li>
                Bạn phải cung cấp thông tin chính xác, đầy đủ khi đăng ký tài
                khoản.
              </li>
              <li>
                Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của
                mình.
              </li>
              <li>
                Bạn cam kết không đăng tải nội dung vi phạm pháp luật, trái đạo
                đức, hoặc không liên quan đến mục đích học tập.
              </li>
              <li>
                Bạn có quyền đăng bài, bình luận, tương tác và sử dụng các tính
                năng của nền tảng theo đúng quy định.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            3. Nội Dung Người Dùng
          </Title>
          <Paragraph>
            <ul>
              <li>
                Mọi nội dung bạn đăng tải (bài viết, tài liệu, bình luận) phải
                phù hợp với mục đích giáo dục của Knowee.
              </li>
              <li>
                Chúng tôi có quyền kiểm duyệt, ẩn hoặc xóa nội dung không phù
                hợp mà không cần thông báo trước.
              </li>
              <li>
                Bạn giữ quyền sở hữu nội dung bạn đăng tải, nhưng cấp cho Knowee
                quyền sử dụng, hiển thị và phân phối nội dung đó trên nền tảng.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            4. Hành Vi Cấm
          </Title>
          <Paragraph>
            <ul>
              <li>
                Đăng tải nội dung xúc phạm, phân biệt đối xử, hoặc gây tranh
                cãi.
              </li>
              <li>
                Sử dụng nền tảng để quảng cáo, tiếp thị hoặc các mục đích thương
                mại không được phép.
              </li>
              <li>
                Thực hiện các hành vi gây hại đến hệ thống, như tấn công mạng
                hoặc gửi mã độc.
              </li>
              <li>
                Sao chép, phân phối hoặc sử dụng trái phép nội dung của người
                dùng khác.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            5. Chấm Dứt Dịch Vụ
          </Title>
          <Paragraph>
            Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu bạn
            vi phạm các điều khoản này hoặc có hành vi gây hại đến cộng đồng
            Knowee.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            6. Thay Đổi Điều Khoản
          </Title>
          <Paragraph>
            Knowee có quyền cập nhật hoặc thay đổi các điều khoản này bất kỳ lúc
            nào. Các thay đổi sẽ được thông báo trên nền tảng và có hiệu lực
            ngay khi được đăng tải.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            7. Liên Hệ
          </Title>
          <Paragraph>
            Nếu bạn có câu hỏi về điều khoản sử dụng, vui lòng liên hệ qua
            email: <a href="mailto:support@Knowee.vn">support@Knowee.vn</a>.
          </Paragraph>
        </Layout>
      </Col>
    </Row>
  );
};

export default TermsOfUsePage;
