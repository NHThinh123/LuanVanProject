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
  multiple = false,
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <AutoComplete
        value={multiple ? undefined : value}
        onSelect={(val) => {
          if (multiple) {
            const currentValues = form.getFieldValue(name) || [];
            form.setFieldsValue({ [name]: [...currentValues, val] });
          } else {
            onSelect(val);
            form.setFieldsValue({ [name]: val });
          }
        }}
        onSearch={onSearch}
        placeholder={placeholder}
        size="large"
        style={{ width: "100%" }}
        popupRender={dropdownRender}
        options={options.map((item) => ({
          value: item.name,
          label: item.name,
        }))}
        allowClear
      />
    </Form.Item>
  );
};

export default AutoCompleteField;
