const { getStatisticsService } = require("../services/statistics.service");

const getStatistics = async (req, res) => {
  const { range } = req.query;

  if (!range || ![7, 28, 365].includes(Number(range))) {
    return res
      .status(400)
      .json({ message: "Thiếu hoặc range không hợp lệ (7, 28, 365)", EC: 1 });
  }

  const result = await getStatisticsService({ range });
  return res.status(result.EC === 0 ? 200 : 500).json(result);
};

module.exports = { getStatistics };
