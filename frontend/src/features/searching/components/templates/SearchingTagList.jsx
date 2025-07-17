import { Button, Flex, Tag } from "antd";
import React from "react";

const SearchingTagList = ({ tags, keyword }) => {
  return (
    <Flex wrap="wrap" gap={8}>
      {tags.map((tag) => (
        <Button
          variant="outlined"
          color="primary"
          key={tag._id}
          style={{
            margin: "5px",
            padding: "20px",
            fontSize: 18,
            borderRadius: 24,
          }}
          href={`/posts/tag/${tag._id}?keyword=${keyword}`}
        >
          #{tag.tag_name} ({tag.post_count || 0})
        </Button>
      ))}
      {tags.length === 0 && <Tag color="gray">Không có thẻ nào</Tag>}
    </Flex>
  );
};

export default SearchingTagList;
