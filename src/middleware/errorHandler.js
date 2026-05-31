const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  // GitHub API specific errors
  if (err.response?.status === 404) {
    return res.status(404).json({ success: false, error: "GitHub user not found" });
  }
  if (err.response?.status === 403) {
    return res.status(403).json({ success: false, error: "GitHub API rate limit exceeded" });
  }

  res.status(500).json({
    success: false,
    error: err.message || "Internal server error",
  });
};

module.exports = errorHandler;