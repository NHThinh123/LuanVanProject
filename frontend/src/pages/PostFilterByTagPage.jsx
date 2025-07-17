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
import SearchingPostList from "../features/searching/components/templates/SearchingPostList";
import { usePosts } from "../features/post/hooks/usePost";
import { useTag } from "../features/tag/hooks/useTag";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
const PostFilterByTagPage = () => {
  const { tag_id: initialTagId } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [selectedTagId, setSelectedTagId] = useState(initialTagId || null);

  const { tags: relatedTags, tagsLoading } = useTag({ keyword });
  const { tags: allTags, isLoading: allTagsLoading } = useTag(); // Lấy toàn bộ tag
  const {
    posts,
    pagination,
    isLoading: isPostsLoading,
  } = usePosts({ tag_id: selectedTagId });

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
            {relevantTags.map((tag) => (
              <SwiperSlide key={tag._id} style={{ width: "auto" }}>
                <Tag
                  color={selectedTagId === tag._id ? "blue" : "default"}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    fontSize: 16,
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
                    padding: "8px 16px",
                    fontSize: 16,
                    borderRadius: 24,
                  }}
                  onClick={() => handleTagSelect(tag._id)}
                >
                  #{tag.tag_name} ({tag.post_count})
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
          #
          {allTags.find((tag) => tag._id === selectedTagId)?.tag_name ||
            "Chưa chọn"}
        </Typography.Title>
        {selectedTagId && (
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
