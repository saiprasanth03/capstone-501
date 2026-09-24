const Session = require("../models/Session");
const Sport = require("../models/Sport");

const createSession = async (req, res) => {
  try {
    const {
      sport,
      additionalPlayersNeeded,
      date,
      venue,
      players = [],
    } = req.body;

    if (
      !sport ||
      additionalPlayersNeeded === undefined ||
      !date ||
      !venue
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const sessionDate = new Date(date);

    if (sessionDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Session date must be in the future",
      });
    }

    const sportExists = await Sport.findOne({
      _id: sport,
      isActive: true,
    });

    if (!sportExists) {
      return res.status(404).json({
        success: false,
        message: "Sport not found",
      });
    }

    const uniquePlayers = [
      req.user._id,
      ...players.filter(
        (id) => id.toString() !== req.user._id.toString()
      ),
    ];

    const session = await Session.create({
      sport,
      creator: req.user._id,
      players: [...new Set(uniquePlayers.map(String))],
      additionalPlayersNeeded,
      date: sessionDate,
      venue,
    });

    const populatedSession = await session.populate([
      { path: "sport", select: "name" },
      { path: "creator", select: "name email" },
      { path: "players", select: "name email" },
    ]);

    res.status(201).json({
      success: true,
      session: populatedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      creator: req.user._id,
    })
      .populate("sport", "name")
      .populate("players", "name email")
      .sort({ date: 1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAvailableSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      status: "scheduled",
      date: { $gt: new Date() },
      creator: { $ne: req.user._id },
      $expr: {
        $lt: [
          { $size: "$players" },
          { $add: [{ $size: "$players" }, "$additionalPlayersNeeded"] }
        ]
      }
    })
      .populate("sport", "name")
      .populate("creator", "name email")
      .populate("players", "name email")
      .sort({ date: 1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        success: false,
        message: "Session is not available",
      });
    }

    if (session.date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot join a past session",
      });
    }

    const alreadyJoined = session.players.some(
      (player) => player.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: "Already joined this session",
      });
    }

    if (session.players.length >= session.additionalPlayersNeeded + 1) {
      return res.status(400).json({
        success: false,
        message: "Session is full",
      });
    }

    session.players.push(req.user._id);
    await session.save();

    res.json({
      success: true,
      message: "Session joined successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



const getJoinedSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      players: req.user._id,
      creator: { $ne: req.user._id },
    })
      .populate("sport", "name")
      .populate("creator", "name email")
      .populate("players", "name email")
      .sort({ date: 1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelSession = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    const session = await Session.findOne({
      _id: req.params.id,
      creator: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Session is already cancelled",
      });
    }

    if (session.date <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Past sessions cannot be cancelled",
      });
    }

    session.status = "cancelled";
    session.cancellationReason = reason.trim();

    await session.save();

    res.json({
      success: true,
      message: "Session cancelled successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createSession,
  getMySessions,
  getAvailableSessions,
  joinSession,
  getJoinedSessions,
  cancelSession,
};