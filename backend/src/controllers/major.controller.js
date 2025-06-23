const {
  createMajorService,
  updateMajorService,
  deleteMajorService,
  getAllMajorsService,
  getMajorByIdService,
} = require("../services/major.service");

const createMajor = async (req, res) => {
  const { major_name } = req.body;

  if (!major_name) {
    return res.status(400).json({ message: "Thiếu major_name", EC: 1 });
  }

  const result = await createMajorService(major_name);
  return res
    .status(result.EC === 0 ? 201 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const updateMajor = async (req, res) => {
  const { id } = req.params;
  const { major_name } = req.body;

  if (!major_name) {
    return res.status(400).json({ message: "Thiếu major_name", EC: 1 });
  }

  const result = await updateMajorService(id, major_name);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 400 : 500)
    .json(result);
};

const deleteMajor = async (req, res) => {
  const { id } = req.params;

  const result = await deleteMajorService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

const getAllMajors = async (req, res) => {
  const result = await getAllMajorsService();
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

const getMajorById = async (req, res) => {
  const { id } = req.params;

  const result = await getMajorByIdService(id);
  return res
    .status(result.EC === 0 ? 200 : result.EC === 1 ? 404 : 500)
    .json(result);
};

module.exports = {
  createMajor,
  updateMajor,
  deleteMajor,
  getAllMajors,
  getMajorById,
};
