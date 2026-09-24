const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  getProfile,
};