const Post_Tag = require("../models/post_tag.model");
const Post = require("../models/post.model");
const Tag = require("../models/tag.model");

const addTagToPostService = async (post_id, tag_id, user_id) => {
  try {
    // Kiểm tra bài viết có tồn tại và thuộc về người dùng không
    const post = await Post.findOne({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    // Kiểm tra thẻ có tồn tại không
    const tag = await Tag.findById(tag_id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    // Kiểm tra xem thẻ đã được gắn vào bài viết chưa
    const existingPostTag = await Post_Tag.findOne({ post_id, tag_id });
    if (existingPostTag) {
      return { message: "Thẻ đã được gắn vào bài viết này", EC: 1 };
    }

    // Thêm thẻ vào bài viết
    const postTag = await Post_Tag.create({ post_id, tag_id });
    return {
      message: "Thêm thẻ vào bài viết thành công",
      EC: 0,
      data: postTag,
    };
  } catch (error) {
    console.error("Error in addTagToPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const removeTagFromPostService = async (post_id, tag_id, user_id) => {
  try {
    // Kiểm tra bài viết có tồn tại và thuộc về người dùng không
    const post = await Post.findOne({ _id: post_id, user_id });
    if (!post) {
      return {
        message: "Bài viết không tồn tại hoặc không thuộc về bạn",
        EC: 1,
      };
    }

    // Kiểm tra thẻ có tồn tại không
    const tag = await Tag.findById(tag_id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    // Xóa thẻ khỏi bài viết
    const postTag = await Post_Tag.findOneAndDelete({ post_id, tag_id });
    if (!postTag) {
      return { message: "Thẻ chưa được gắn vào bài viết này", EC: 1 };
    }

    return {
      message: "Xóa thẻ khỏi bài viết thành công",
      EC: 0,
    };
  } catch (error) {
    console.error("Error in removeTagFromPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getTagsByPostService = async (post_id) => {
  try {
    // Kiểm tra bài viết có tồn tại không
    const post = await Post.findById(post_id);
    if (!post) {
      return { message: "Bài viết không tồn tại", EC: 1 };
    }

    // Lấy danh sách thẻ của bài viết
    const tags = await Post_Tag.find({ post_id })
      .populate("tag_id", "tag_name")
      .select("tag_id createdAt");

    return {
      message: "Lấy danh sách thẻ của bài viết thành công",
      EC: 0,
      data: tags,
    };
  } catch (error) {
    console.error("Error in getTagsByPostService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

const getPostsByTagService = async (tag_id, query) => {
  try {
    // Kiểm tra thẻ có tồn tại không
    const tag = await Tag.findById(tag_id);
    if (!tag) {
      return { message: "Thẻ không tồn tại", EC: 1 };
    }

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Lấy danh sách bài viết có thẻ này
    const postTags = await Post_Tag.find({ tag_id })
      .populate({
        path: "post_id",
        match: { status: "accepted" }, // Chỉ lấy bài viết đã được duyệt
        select: "title content user_id createdAt",
        populate: { path: "user_id", select: "full_name avatar_url" },
      })
      .skip(skip)
      .limit(limit);

    // Lọc bỏ các bài viết null (do match status: accepted)
    const posts = postTags
      .filter((postTag) => postTag.post_id)
      .map((postTag) => postTag.post_id);

    const total = await Post_Tag.countDocuments({ tag_id });

    return {
      message: "Lấy danh sách bài viết theo thẻ thành công",
      EC: 0,
      data: {
        posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error in getPostsByTagService:", error);
    return { message: "Lỗi server", EC: -1 };
  }
};

module.exports = {
  addTagToPostService,
  removeTagFromPostService,
  getTagsByPostService,
  getPostsByTagService,
};
