import { Col, Row, Skeleton, Typography, Tag, Flex, Divider } from "antd";
import { useParams } from "react-router-dom";
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import { usePosts } from "../features/post/hooks/usePost";
import { useCourses } from "../features/course/hooks/useCourses";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const PostFilterByCoursePage = () => {
  const { course_id: initialCourseId } = useParams();
  console.log("Initial Course ID:", initialCourseId);
  const [selectedCourseId, setSelectedCourseId] = useState(
    initialCourseId || null
  );

  const { courses, loading: coursesLoading } = useCourses(); // Lấy toàn bộ khóa học
  const {
    posts,
    pagination,
    isLoading: isPostsLoading,
  } = usePosts({ course_id: selectedCourseId });

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
  };

  useEffect(() => {
    if (initialCourseId && !selectedCourseId) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId, selectedCourseId]);

  if (isPostsLoading || coursesLoading) {
    return (
      <Row justify="center" gutter={[24, 24]}>
        <Col span={20}>
          <Flex justify="center" gap={16}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                size={"large"}
                shape={"round"}
                block
              />
            ))}
          </Flex>
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
          <Skeleton active paragraph={{ rows: 4 }} />
          <Divider />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center">
      <Col span={20}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="custom-prev-button"
            style={{
              width: 40,
              height: 40,
              background: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginRight: 10,
            }}
            aria-label="Cuộn sang trái"
          >
            <LeftOutlined style={{ fontSize: 20, color: "#000" }} />
          </div>
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            freeMode={true}
            slidesPerView="auto"
            navigation={{
              prevEl: ".custom-prev-button",
              nextEl: ".custom-next-button",
            }}
            style={{ flex: 1 }}
          >
            {courses.map((course) => (
              <SwiperSlide key={course._id} style={{ width: "auto" }}>
                <Tag
                  color={selectedCourseId === course._id ? "blue" : "default"}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    fontSize: 16,
                    borderRadius: 24,
                  }}
                  onClick={() => handleCourseSelect(course._id)}
                >
                  {course.course_code} - {course.course_name}
                </Tag>
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            className="custom-next-button"
            style={{
              width: 40,
              height: 40,
              background: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginLeft: 10,
            }}
            aria-label="Cuộn sang phải"
          >
            <RightOutlined style={{ fontSize: 20, color: "#000" }} />
          </div>
        </div>
        <Typography.Title
          level={1}
          style={{ textAlign: "center", marginTop: 40, marginBottom: 0 }}
        >
          {courses.find((course) => course._id === selectedCourseId)
            ?.course_code || "Chưa chọn"}
          {" - "}
          {courses.find((course) => course._id === selectedCourseId)
            ?.course_name || "Chưa chọn"}
        </Typography.Title>
        {selectedCourseId && (
          <Typography.Paragraph
            type="secondary"
            style={{ textAlign: "center" }}
          >
            {pagination.total || 0} bài viết liên quan
          </Typography.Paragraph>
        )}
        <Divider style={{ margin: "20px 0" }} />
        <Row gutter={[16, 16]} justify="center">
          <Col span={20} style={{ marginTop: 20 }}>
            <Typography.Title level={3} style={{ marginBottom: 16 }}>
              Bài viết liên quan
            </Typography.Title>
            {posts.length === 0 ? (
              <Typography.Text type="secondary">
                Không có bài viết nào liên quan đến khóa học này.
              </Typography.Text>
            ) : (
              <SearchingPostList posts={posts} />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PostFilterByCoursePage;
