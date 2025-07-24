import { RightOutlined } from "@ant-design/icons";
import { Button, Flex, List, Typography } from "antd";

const SearchingCourseList = ({ courses }) => {
  return (
    <List
      dataSource={courses}
      split
      grid={{ gutter: [16, 16], column: 1 }}
      renderItem={(course) => (
        <List.Item>
          <Button
            href={`posts/course/${course._id}`}
            block
            type="link"
            style={{ cursor: "pointer", color: "inherit" }}
          >
            <Flex
              justify="space-between"
              align="middle"
              style={{
                padding: 16,
              }}
              flex={1}
            >
              <h3>
                {course.course_code} - {course.course_name}
              </h3>
              <RightOutlined />
            </Flex>
          </Button>
        </List.Item>
      )}
    />
  );
};

export default SearchingCourseList;
