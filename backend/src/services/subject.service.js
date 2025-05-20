const Subject = require("../models/subject.model");
const Post = require("../models/post.model");
const UserInterestSubject = require("../models/user_interest_subject");

const createSubjectService = async (subjectData) => {
  try {
    // Kiểm tra xem subject_name đã tồn tại
    const existingSubject = await Subject.findOne({
      subject_name: subjectData.subject_name,
    });
    if (existingSubject) {
      return {
        message: "Môn học đã tồn tại",
        data: null,
      };
    }
    const subject = await Subject.create(subjectData);
    return {
      message: "Tạo môn học thành công",
      data: subject,
    };
  } catch (error) {
    throw new Error("Không thể tạo môn học: " + error.message);
  }
};

const getSubjectsService = async () => {
  try {
    const subjects = await Subject.find({});
    return {
      message: "Lấy danh sách môn học thành công",
      data: subjects,
    };
  } catch (error) {
    throw new Error("Không thể lấy danh sách môn học: " + error.message);
  }
};

const getSubjectByIdService = async (id) => {
  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return {
        message: "Môn học không tồn tại",
        data: null,
      };
    }
    return {
      message: "Lấy môn học thành công",
      data: subject,
    };
  } catch (error) {
    throw new Error("Không thể lấy môn học: " + error.message);
  }
};

const updateSubjectService = async (id, updateData) => {
  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return {
        message: "Môn học không tồn tại",
        data: null,
      };
    }
    // Kiểm tra xem subject_name mới đã tồn tại
    if (
      updateData.subject_name &&
      updateData.subject_name !== subject.subject_name
    ) {
      const existingSubject = await Subject.findOne({
        subject_name: updateData.subject_name,
      });
      if (existingSubject) {
        return {
          message: "Tên môn học mới đã tồn tại",
          data: null,
        };
      }
    }
    const updatedSubject = await Subject.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return {
      message: "Cập nhật môn học thành công",
      data: updatedSubject,
    };
  } catch (error) {
    throw new Error("Không thể cập nhật môn học: " + error.message);
  }
};

const deleteSubjectService = async (id) => {
  try {
    const subject = await Subject.findById(id);
    if (!subject) {
      return {
        message: "Môn học không tồn tại",
        data: null,
      };
    }
    // Kiểm tra xem môn học có bài đăng hoặc sở thích người dùng liên quan
    const relatedPosts = await Post.find({ subject_id: id });
    const relatedInterests = await UserInterestSubject.find({ subject_id: id });
    if (relatedPosts.length > 0 || relatedInterests.length > 0) {
      return {
        message: "Không thể xóa môn học vì có bài đăng hoặc sở thích liên quan",
        data: null,
      };
    }
    await Subject.findByIdAndDelete(id);
    return {
      message: "Xóa môn học thành công",
      data: { id },
    };
  } catch (error) {
    throw new Error("Không thể xóa môn học: " + error.message);
  }
};

module.exports = {
  createSubjectService,
  getSubjectsService,
  getSubjectByIdService,
  updateSubjectService,
  deleteSubjectService,
};
