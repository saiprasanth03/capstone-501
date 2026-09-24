const Session = require("../models/Session");

const getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range",
      });
    }

    const sessionsPlayed = await Session.countDocuments({
      date: { $gte: start, $lte: end },
      status: "completed",
    });

    const sportPopularity = await Session.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          status: { $in: ["scheduled", "completed"] },
        },
      },
      {
        $group: {
          _id: "$sport",
          sessions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "sports",
          localField: "_id",
          foreignField: "_id",
          as: "sport",
        },
      },
      {
        $unwind: "$sport",
      },
      {
        $project: {
          _id: 0,
          sport: "$sport.name",
          sessions: 1,
        },
      },
      {
        $sort: {
          sessions: -1,
        },
      },
    ]);

    res.json({
      success: true,
      report: {
        startDate,
        endDate,
        sessionsPlayed,
        sportPopularity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReports,
};