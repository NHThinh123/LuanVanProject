const {
  addInterestCourseService,
  removeInterestCourseService,
  getInterestedCoursesByUserService,
  checkUserInterestedCourseService,
} = require("../services/user_interest_course.service");

const addInterestCourse = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user._id; // Lấy từ middleware authentication

  if (!course_id) {
    return res.status(400).json({ message: "Thiếu course_id", EC: 1 });
  }

  const result = await addInterestCourseService(user_id, course_id);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const removeInterestCourse = async (req, res) => {
  const { course_id } = req.body;
  const user_id = req.user._id;

  if (!course_id) {
    return res.status(400).json({ message: "Thiếu course_id", EC: 1 });
  }

  const result = await removeInterestCourseService(user_id, course_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const getInterestedCourses = async (req, res) => {
  const user_id = req.user._id;

  const result = await getInterestedCoursesByUserService(user_id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const checkUserInterestedCourse = async (req, res) => {
  const { course_id } = req.query;
  const user_id = req.user._id;

  if (!course_id) {
    return res.status(400).json({ message: "Thiếu course_id", EC: 1 });
  }

  const result = await checkUserInterestedCourseService(user_id, course_id);
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

module.exports = {
  addInterestCourse,
  removeInterestCourse,
  getInterestedCourses,
  checkUserInterestedCourse,
};
