import {
  Col,
  Row,
  Skeleton,
  Typography,
  Tag,
  Flex,
  Divider,
  Button,
  Space,
} from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import { usePosts } from "../features/post/hooks/usePost";
import { useTag } from "../features/tag/hooks/useTag";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// Hook để lấy kích thước màn hình
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const PostFilterByTagPage = () => {
  const { tag_id: initialTagId } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [selectedTagId, setSelectedTagId] = useState(initialTagId || null);

  const { tags: relatedTags, tagsLoading } = useTag({ keyword });
  const { tags: allTags, isLoading: allTagsLoading } = useTag();
  const {
    posts,
    pagination,
    isLoading: isPostsLoading,
  } = usePosts({ tag_id: selectedTagId });

  // Lấy kích thước màn hình
  const { width } = useWindowSize();
  const isMobile = width < 600;
  const isTablet = width < 1000;
  const isDesktop = width < 1200;

  // Phân chia tag: tag liên quan (có post_count > 0) và tag còn lại
  const relevantTags = relatedTags.filter((tag) => tag.post_count > 0);
  const otherTags = allTags.filter(
    (tag) => !relevantTags.some((rt) => rt._id === tag._id)
  );

  const handleTagSelect = (tagId) => {
    setSelectedTagId(tagId);
  };

  useEffect(() => {
    if (initialTagId && !selectedTagId) {
      setSelectedTagId(initialTagId);
    }
  }, [initialTagId, selectedTagId]);

  if (isPostsLoading || tagsLoading || allTagsLoading) {
    return (
      <Row justify="center" gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col
          span={isMobile ? 24 : isTablet ? 22 : isDesktop ? 22 : 20}
          style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
        >
          <Flex justify="center" gap={isMobile ? 8 : 16}>
            {Array.from({ length: isMobile ? 6 : 10 }).map((_, index) => (
              <Skeleton.Button
                key={index}
                active
                size={isMobile ? "middle" : "large"}
                shape="round"
                block
              />
            ))}
          </Flex>
          <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
          <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
          <Skeleton active paragraph={{ rows: isMobile ? 2 : 4 }} />
          <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ marginTop: 20 }}>
      <Col
        span={isMobile ? 24 : isTablet ? 22 : isDesktop ? 22 : 20}
        style={{ padding: isMobile ? "0px 12px" : "0px 24px" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          {!isMobile && (
            <div
              className="custom-prev-button"
              style={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginRight: isMobile ? 8 : 10,
              }}
              aria-label="Cuộn sang trái"
            >
              <LeftOutlined
                style={{ fontSize: isMobile ? 16 : 20, color: "#000" }}
              />
            </div>
          )}
          <Swiper
            modules={[Navigation]}
            spaceBetween={isMobile ? 8 : 10}
            freeMode={true}
            slidesPerView="auto"
            navigation={{
              prevEl: ".custom-prev-button",
              nextEl: ".custom-next-button",
            }}
            style={{ flex: 1 }}
          >
            {relevantTags.map((tag) => (
              <SwiperSlide key={tag._id} style={{ width: "auto" }}>
                <Tag
                  color={selectedTagId === tag._id ? "blue" : "default"}
                  style={{
                    cursor: "pointer",
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                    borderRadius: 24,
                  }}
                  onClick={() => handleTagSelect(tag._id)}
                >
                  #{tag.tag_name} ({tag.post_count})
                </Tag>
              </SwiperSlide>
            ))}
            {otherTags.map((tag) => (
              <SwiperSlide key={tag._id} style={{ width: "auto" }}>
                <Tag
                  color={selectedTagId === tag._id ? "blue" : "default"}
                  style={{
                    cursor: "pointer",
                    padding: isMobile ? "6px 12px" : "8px 16px",
                    fontSize: isMobile ? 14 : isTablet ? 16 : 18,
                    borderRadius: 24,
                  }}
                  onClick={() => handleTagSelect(tag._id)}
                >
                  #{tag.tag_name} ({tag.post_count})
                </Tag>
              </SwiperSlide>
            ))}
          </Swiper>
          {!isMobile && (
            <div
              className="custom-next-button"
              style={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                background: "#fff",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                marginLeft: isMobile ? 8 : 10,
              }}
              aria-label="Cuộn sang phải"
            >
              <RightOutlined
                style={{ fontSize: isMobile ? 16 : 20, color: "#000" }}
              />
            </div>
          )}
        </div>
        <Typography.Title
          level={isMobile ? 3 : 2}
          style={{
            textAlign: "center",
            marginTop: isMobile ? 16 : isTablet ? 24 : 40,
            marginBottom: 0,
            fontSize: isMobile ? 24 : isTablet ? 32 : 40,
          }}
        >
          #
          {allTags.find((tag) => tag._id === selectedTagId)?.tag_name ||
            "Chưa chọn"}
        </Typography.Title>
        {selectedTagId && (
          <Typography.Paragraph
            type="secondary"
            style={{
              textAlign: "center",
              fontSize: isMobile ? 14 : isTablet ? 16 : 18,
            }}
          >
            {pagination.total || 0} bài viết liên quan
          </Typography.Paragraph>
        )}
        <Divider style={{ margin: isMobile ? "12px 0" : "16px 0" }} />
        <Row gutter={[16, 16]} justify="center">
          <Col
            span={isMobile ? 24 : isTablet ? 22 : isDesktop ? 22 : 20}
            style={{ marginTop: isMobile ? 12 : 20 }}
          >
            <Typography.Title
              level={isMobile ? 4 : 3}
              style={{ marginBottom: isMobile ? 12 : 16 }}
            >
              Bài viết liên quan
            </Typography.Title>
            {posts.length === 0 ? (
              <Typography.Text
                type="secondary"
                style={{ fontSize: isMobile ? 14 : isTablet ? 16 : 18 }}
              >
                Không có bài viết nào liên quan đến thẻ này.
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

export default PostFilterByTagPage;
