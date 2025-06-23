const {
  uploadDocumentService,
  deleteDocumentService,
  getDocumentsByPostService,
  getDocumentByIdService,
} = require("../services/document.service");

const uploadDocument = async (req, res) => {
  const { post_id, type } = req.body;
  const user_id = req.user.id; // Lấy từ middleware authentication
  const file = req.file; // Lấy từ multer

  if (!post_id || !type || !file) {
    return res
      .status(400)
      .json({ message: "Thiếu post_id, type, hoặc file", EC: 1 });
  }

  const result = await uploadDocumentService(user_id, post_id, file, type);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteDocument = async (req, res) => {
  const { document_id } = req.params;
  const user_id = req.user.id;

  const result = await deleteDocumentService(user_id, document_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 403 : 500)
    .json(result);
};

const getDocumentsByPost = async (req, res) => {
  const { post_id } = req.params;

  const result = await getDocumentsByPostService(post_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getDocumentById = async (req, res) => {
  const { document_id } = req.params;

  const result = await getDocumentByIdService(document_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  uploadDocument,
  deleteDocument,
  getDocumentsByPost,
  getDocumentById,
};
