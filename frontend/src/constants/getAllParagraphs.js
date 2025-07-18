export const getAllParagraphs = (htmlContent) => {
  if (!htmlContent) return "";
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const paragraphs = doc.querySelectorAll("p");
    // Loại bỏ thẻ <img> trong mỗi thẻ <p>
    paragraphs.forEach((p) => {
      const images = p.querySelectorAll("img");
      images.forEach((img) => img.remove());
    });
    // Gộp nội dung tất cả các thẻ <p>, mỗi thẻ cách nhau bởi <br>
    return Array.from(paragraphs)
      .map((p) => p.innerHTML)
      .filter((content) => content.trim() !== "") // Loại bỏ các thẻ <p> rỗng
      .join("<br>");
  } catch (error) {
    console.error("Lỗi khi phân tích HTML:", error);
    return "";
  }
};
