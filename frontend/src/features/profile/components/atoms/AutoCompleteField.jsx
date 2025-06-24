import { AutoComplete, Form } from "antd";
import React from "react";

const AutoCompleteField = ({
  label,
  name,
  value,
  onSelect,
  onSearch,
  options,
  placeholder,
  dropdownRender,
  rules,
  form,
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <AutoComplete
        value={value}
        onSelect={(val) => {
          onSelect(val);
          form.setFieldsValue({ [name]: val });
        }}
        onSearch={onSearch}
        placeholder={placeholder}
        size="large"
        style={{ width: "100%" }}
        popupRender={dropdownRender}
      >
        {options.map((item) => (
          <AutoComplete.Option key={item.id} value={item.name}>
            {item.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete>
    </Form.Item>
  );
};

export default AutoCompleteField;
