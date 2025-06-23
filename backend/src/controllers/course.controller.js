const {
  createCourseService,
  updateCourseService,
  deleteCourseService,
  getAllCoursesService,
  getCourseByIdService,
} = require("../services/course.service");

const createCourse = async (req, res) => {
  const { course_name, course_code } = req.body;

  if (!course_name) {
    return res.status(400).json({ message: "Thiếu course_name", EC: 1 });
  }

  const result = await createCourseService({ course_name, course_code });
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_name, course_code } = req.body;

  const result = await updateCourseService(id, { course_name, course_code });
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;

  const result = await deleteCourseService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getAllCourses = async (req, res) => {
  const { page, limit, search } = req.query;

  const result = await getAllCoursesService({ page, limit, search });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getCourseById = async (req, res) => {
  const { id } = req.params;

  const result = await getCourseByIdService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
};
