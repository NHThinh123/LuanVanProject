const BoxCustom = ({ children, style, margin, padding }) => {
  return (
    <div
      style={{
        // border: "1px solid #000",
        margin: margin || "20px 0",
        padding: padding || "20px",
        borderRadius: "16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default BoxCustom;
