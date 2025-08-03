import { Layout, Typography, Card, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const AboutUsPage = () => {
  return (
    <Row justify={"center"}>
      <Col span={18}>
        <Layout style={{ padding: "24px", background: "#fff" }}>
          <Title level={2} style={{ color: "#1D267D" }}>
            Về Chúng Tôi
          </Title>
          <Paragraph>
            Chào mừng bạn đến với <strong>Knowee</strong>, một nền tảng mạng xã
            hội học tập được thiết kế dành riêng cho học sinh, sinh viên và giáo
            viên tại Việt Nam. Chúng tôi cam kết xây dựng một cộng đồng tri thức
            sôi động, nơi người dùng có thể dễ dàng chia sẻ kinh nghiệm học tập,
            mẹo ôn thi, tài liệu học tập và các phương pháp học tập hiệu quả.
          </Paragraph>
          <Paragraph>
            Được phát triển bởi Nguyễn Hưng Thịnh, sinh viên ngành Kỹ thuật Phần
            mềm tại Đại học Cần Thơ, Knowee là kết quả của luận văn tốt nghiệp
            với mục tiêu ứng dụng công nghệ hiện đại vào giáo dục. Nền tảng của
            chúng tôi tích hợp hệ thống gợi ý bài viết thông minh sử dụng các
            thuật toán học máy như TF-IDF và Cosine Similarity, giúp cá nhân hóa
            nội dung theo sở thích, hành vi tương tác và lịch sử tìm kiếm của
            người dùng.
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            Sứ Mệnh Của Chúng Tôi
          </Title>
          <Paragraph>
            Knowee hướng tới việc tạo ra một không gian học tập trực tuyến tiện
            lợi, nơi sinh viên có thể:
            <ul>
              <li>Chia sẻ và tiếp cận các kinh nghiệm học tập chất lượng.</li>
              <li>Nhận gợi ý bài viết phù hợp với nhu cầu học tập cá nhân.</li>
              <li>
                Kết nối với cộng đồng học tập thông qua các tính năng như bình
                luận, theo dõi và chat trực tuyến.
              </li>
              <li>
                Truy cập nội dung học tập mọi lúc, mọi nơi trên các thiết bị
                khác nhau.
              </li>
            </ul>
          </Paragraph>
          <Title level={3} style={{ color: "#1D267D" }}>
            Công Nghệ Đằng Sau Knowee
          </Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card title="MERN Stack">
                Sử dụng MongoDB, Express.js, React, và Node.js để xây dựng một
                ứng dụng web mạnh mẽ, hiệu suất cao và dễ mở rộng.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Hệ Thống Gợi Ý AI">
                Ứng dụng các thuật toán TF-IDF và Cosine Similarity để đề xuất
                bài viết phù hợp với từng người dùng.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Giao Diện Thân Thiện">
                Kết hợp Ant Design để tạo giao diện trực quan, responsive, phù
                hợp với mọi thiết bị từ điện thoại đến máy tính.
              </Card>
            </Col>
          </Row>
          <Title level={3} style={{ color: "#1D267D" }}>
            Liên Hệ Với Chúng Tôi
          </Title>
          <Paragraph>
            Chúng tôi luôn sẵn sàng lắng nghe ý kiến từ bạn để cải thiện nền
            tảng. Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng liên hệ
            qua email: <a href="mailto:support@Knowee.vn">support@Knowee.vn</a>.
          </Paragraph>
        </Layout>
      </Col>
    </Row>
  );
};

export default AboutUsPage;
