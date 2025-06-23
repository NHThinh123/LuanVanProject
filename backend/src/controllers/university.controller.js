const {
  createUniversityService,
  updateUniversityService,
  deleteUniversityService,
  getAllUniversitiesService,
  getUniversityByIdService,
} = require("../services/university.service");

const createUniversity = async (req, res) => {
  const { university_name } = req.body;

  if (!university_name) {
    return res.status(400).json({ message: "Thiếu university_name", EC: 1 });
  }

  const result = await createUniversityService(university_name);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateUniversity = async (req, res) => {
  const { id } = req.params;
  const { university_name } = req.body;

  if (!university_name) {
    return res.status(400).json({ message: "Thiếu university_name", EC: 1 });
  }

  const result = await updateUniversityService(id, university_name);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteUniversity = async (req, res) => {
  const { id } = req.params;

  const result = await deleteUniversityService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getAllUniversities = async (req, res) => {
  const result = await getAllUniversitiesService();
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getUniversityById = async (req, res) => {
  const { id } = req.params;

  const result = await getUniversityByIdService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createUniversity,
  updateUniversity,
  deleteUniversity,
  getAllUniversities,
  getUniversityById,
};
