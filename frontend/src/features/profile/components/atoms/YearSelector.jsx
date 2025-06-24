import { Form, Radio, Select } from "antd";
import React from "react";

const YearSelector = ({ useRadio = false }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2020 },
    (_, i) => currentYear - i
  ).concat("Khác");

  return (
    <Form.Item
      label="Năm bắt đầu học"
      name="startYear"
      rules={[{ required: true, message: "Vui lòng chọn năm bắt đầu học" }]}
    >
      {useRadio ? (
        <Radio.Group
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {years.map((year) => (
            <Radio.Button
              key={year}
              value={year}
              style={{
                flex: "1 1 25%",
                textAlign: "center",
                borderRadius: "20px",
                borderWidth: "1px",
              }}
            >
              {year}
            </Radio.Button>
          ))}
        </Radio.Group>
      ) : (
        <Select
          size="large"
          placeholder="Chọn năm bắt đầu học"
          style={{ width: "100%" }}
        >
          {years.map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default YearSelector;
