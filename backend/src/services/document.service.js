const Document = require("../models/document.model");
const Post = require("../models/post.model");
// Giả định sử dụng AWS S3 hoặc Cloudinary để lưu trữ

// const uploadDocumentService = async (user_id, post_id, file, type) => {
//   try {
//     // Kiểm tra bài viết có tồn tại và thuộc về người dùng không
//     const post = await Post.findOne({ _id: post_id, user_id });
//     if (!post) {
//       return {
//         message: "Bài viết không tồn tại hoặc không thuộc về bạn",
//         EC: 1,
//       };
//     }

//     // Kiểm tra loại tài liệu hợp lệ
//     if (!["pdf", "docx", "xlsx", "image", "rar", "zip"].includes(type)) {
//       return { message: "Loại tài liệu không hợp lệ", EC: 1 };
//     }

//     // Tải file lên dịch vụ lưu trữ (AWS S3/Cloudinary)
//     const { url } = await uploadFile(file, type); // Hàm giả định trả về URL

//     // Tạo tài liệu mới
//     const document = await Document.create({
//       post_id,
//       type,
//       document_url: url,
//     });

//     return {
//       message: "Tải lên tài liệu thành công",
//       EC: 0,
//       data: document,
//     };
//   } catch (error) {
//     console.error("Error in uploadDocumentService:", error);
//     return { message: "Lỗi server", EC: -1 };
//   }
// };

// const deleteDocumentService = async (user_id, document_id) => {
//   try {
//     // Tìm tài liệu và kiểm tra quyền sở hữu thông qua bài viết
//     const document = await Document.findById(document_id).populate("post_id");
//     if (!document) {
//       return { message: "Tài liệu không tồn tại", EC: 1 };
//     }
//     if (document.post_id.user_id.toString() !== user_id.toString()) {
//       return { message: "Bạn không có quyền xóa tài liệu này", EC: 1 };
//     }

//     // Xóa file khỏi dịch vụ lưu trữ
//     await deleteFile(document.document_url); // Hàm giả định

//     // Xóa tài liệu khỏi cơ sở dữ liệu
//     await Document.findByIdAndDelete(document_id);

//     return {
//       message: "Xóa tài liệu thành công",
//       EC: 0,
//     };
//   } catch (error) {
//     console.error("Error in deleteDocumentService:", error);
//     return { message: "Lỗi server", EC: -1 };
//   }
// };

const getDocumentsByPostService = async (post_id) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    // Lấy danh sách tài liệu của bài viết
    const documents = await Document.find({ post_id }).select(
      "type document_url createdAt"
    );

    return {
      message: "Lấy danh sách tài liệu thành công",
      EC: 0,
      data: documents,
    };
  } catch (error) {
    console.error("Error in getDocumentsByPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getDocumentByIdService = async (document_id) => {
  try {
    // Lấy chi tiết tài liệu
    const document = await Document.findById(document_id).populate(
      "post_id",
      "title user_id"
    );
    if (!document) {
      return { message: "Tài liệu không tồn tại", EC: 1 };
    }

    return {
      message: "Lấy thông tin tài liệu thành công",
      EC: 0,
      data: document,
    };
  } catch (error) {
    console.error("Error in getDocumentByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  // uploadDocumentService,
  // deleteDocumentService,
  getDocumentsByPostService,
  getDocumentByIdService,
};
