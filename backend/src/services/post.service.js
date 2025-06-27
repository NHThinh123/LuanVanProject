const Post = require("../models/post.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");
const Category = require("../models/category.model");
const { getDocumentsByPostService } = require("./document.service");

const { getLikesByPostService } = require("./user_like_post.service");
const { getCommentsByPostService } = require("./comment.service");

const { getTagsByPostService } = require("./post_tag.service");

const createPostService = async (user_id, postData) => {
  try {
    const { course_id, category_id, title, content } = postData;

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return { message: "Người dùng không tồn tại", EC: 1 };
    }

    // Kiểm tra khóa học nếu có
    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Khóa học không tồn tại", EC: 1 };
      }
    }

    // Kiểm tra danh mục nếu có
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Danh mục không tồn tại", EC: 1 };
      }
    }

    // Tạo bài viết mới
    const post = await Post.create({
      user_id,
      course_id,
      category_id,
      title,
      content,
      status: "pending",
    });

    return {
      message: "Tạo bài viết thành công",
      EC: 0,
      data: post,
    };
  } catch (error) {
    console.error("Error in createPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updatePostService = async (user_id, post_id, postData) => {
  try {
    const { course_id, category_id, title, content } = postData;

    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findOne({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    // Chỉ cho phép cập nhật nếu bài viết đang ở trạng thái pending
    if (post.status !== "pending") {
      return {
        message: "Không thể cập nhật bài viết đã được duyệt hoặc từ chối",
        EC: 1,
      };
    }

    // Kiểm tra khóa học nếu có
    if (course_id) {
      const course = await Course.findById(course_id);
      if (!course) {
        return { message: "Khóa học không tồn tại", EC: 1 };
      }
    }

    // Kiểm tra danh mục nếu có
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return { message: "Danh mục không tồn tại", EC: 1 };
      }
    }

    // Cập nhật bài viết
    post.course_id = course_id || post.course_id;
    post.category_id = category_id || post.category_id;
    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    return {
      message: "Cập nhật bài viết thành công",
      EC: 0,
      data: post,
    };
  } catch (error) {
    console.error("Error in updatePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const deletePostService = async (user_id, post_id) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findOneAndDelete({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    return {
      message: "Xóa bài viết thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in deletePostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostsService = async (query) => {
  try {
    const {
      user_id,
      course_id,
      category_id,
      status,
      page = 1,
      limit = 10,
    } = query;
    const filter = {};

    if (user_id) filter.user_id = user_id;
    if (course_id) filter.course_id = course_id;
    if (category_id) filter.category_id = category_id;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .populate("user_id", "full_name avatar_url")
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(filter);

    // Lấy thêm thông tin documents, tags, likeCount, commentCount cho mỗi bài viết
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [documentsResult, tagsResult, likesResult, commentsResult] =
          await Promise.all([
            getDocumentsByPostService(post._id),
            getTagsByPostService(post._id),
            getLikesByPostService(post._id),
            getCommentsByPostService(post._id, { page: 1, limit: 0 }), // limit: 0 để chỉ lấy tổng số
          ]);
        const image =
          documentsResult.EC === 0 && documentsResult.data.length > 0
            ? documentsResult.data.find((doc) => doc.type === "image")
                ?.document_url ||
              "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg"
            : "https://res.cloudinary.com/luanvan/image/upload/v1751021776/learning-education-academics-knowledge-concept_yyoyge.jpg";

        return {
          ...post._doc,
          image,
          tags:
            tagsResult.EC === 0
              ? tagsResult.data.map((tag) => tag.tag_name)
              : [],
          likeCount: likesResult.EC === 0 ? likesResult.data.length : 0,
          commentCount:
            commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
        };
      })
    );

    return {
      message: "Lấy danh sách bài viết thành công",
      EC: 0,
      data: {
        posts: postsWithDetails,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getPostsService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostByIdService = async (post_id) => {
  try {
    const post = await Post.findById(post_id)
      .populate("user_id", "full_name avatar_url")
      .populate("course_id", "course_name course_code")
      .populate("category_id", "category_name");

    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    // Lấy thêm thông tin documents, tags, likeCount, commentCount
    const [documentsResult, tagsResult, likesResult, commentsResult] =
      await Promise.all([
        getDocumentsByPostService(post_id),
        getTagsByPostService(post_id),
        getLikesByPostService(post_id),
        getCommentsByPostService(post_id, { page: 1, limit: 0 }), // limit: 0 để chỉ lấy tổng số
      ]);

    return {
      message: "Lấy thông tin bài viết thành công",
      EC: 0,
      data: {
        ...post._doc,
        documents: documentsResult.EC === 0 ? documentsResult.data : [],
        tags:
          tagsResult.EC === 0 ? tagsResult.data.map((tag) => tag.tag_name) : [],
        likeCount: likesResult.EC === 0 ? likesResult.data.length : 0,
        commentCount:
          commentsResult.EC === 0 ? commentsResult.data.pagination.total : 0,
      },
    };
  } catch (error) {
    console.error("Error in getPostByIdService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const updatePostStatusService = async (post_id, status, admin_id) => {
  try {
    // Kiểm tra admin có tồn tại không
    const admin = await User.findById(admin_id);
    if (!admin || admin.role !== "admin") {
      return { message: "Không có quyền thực hiện hành động này", EC: 1 };
    }

    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    // Kiểm tra trạng thái hợp lệ
    if (!["accepted", "rejected"].includes(status)) {
      return { message: "Trạng thái không hợp lệ", EC: 1 };
    }

    // Cập nhật trạng thái
    post.status = status;
    await post.save();

    return {
      message: `Cập nhật trạng thái bài viết thành ${status} thành công`,
      EC: 0,
      data: post,
    };
  } catch (error) {
    console.error("Error in updatePostStatusService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  createPostService,
  updatePostService,
  deletePostService,
  getPostsService,
  getPostByIdService,
  updatePostStatusService,
};
