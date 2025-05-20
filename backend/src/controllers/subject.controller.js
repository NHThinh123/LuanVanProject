const {
  createSubjectService,
  getSubjectsService,
  getSubjectByIdService,
  updateSubjectService,
  deleteSubjectService,
} = require("../services/subject.service");

const createSubject = async (req, res) => {
  const { subject_name } = req.body;
  if (!subject_name) {
    return res.status(400).json({
      message: "Vui lòng cung cấp tên môn học",
    });
  }

  try {
    const data = await createSubjectService({ subject_name });
    return res.status(201).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const data = await getSubjectsService();
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const data = await getSubjectByIdService(req.params.id);
    if (!data.data) {
      return res.status(404).json({ message: "Môn học không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const updateSubject = async (req, res) => {
  const { subject_name } = req.body;
  if (!subject_name) {
    return res.status(400).json({ message: "Tên môn học không được để trống" });
  }
  try {
    const data = await updateSubjectService(req.params.id, { subject_name });
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Môn học không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const data = await deleteSubjectService(req.params.id);
    if (!data.data) {
      return res
        .status(404)
        .json({ message: data.message || "Môn học không tìm thấy" });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
