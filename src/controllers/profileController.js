const { fetchUserProfile, fetchUserRepos, computeInsights } = require("../services/githubService");
const { pool } = require("../db/connection");

// POST /api/analyze/:username
const analyzeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const [profile, repos] = await Promise.all([
      fetchUserProfile(username),
      fetchUserRepos(username),
    ]);

    const { total_stars, top_languages, most_active_repo, account_age_days, activity_score } = computeInsights(repos, profile);

    const query = `
      INSERT INTO profiles 
        (username, name, avatar_url, bio, location, public_repos, followers, following, total_stars, top_languages, most_active_repo, profile_url, account_age_days, activity_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        bio = VALUES(bio),
        location = VALUES(location),
        public_repos = VALUES(public_repos),
        followers = VALUES(followers),
        following = VALUES(following),
        total_stars = VALUES(total_stars),
        top_languages = VALUES(top_languages),
        most_active_repo = VALUES(most_active_repo),
        profile_url = VALUES(profile_url),
        account_age_days = VALUES(account_age_days),
        activity_score = VALUES(activity_score),
        analyzed_at = CURRENT_TIMESTAMP
    `;

    const values = [
      profile.login,
      profile.name,
      profile.avatar_url,
      profile.bio,
      profile.location,
      profile.public_repos,
      profile.followers,
      profile.following,
      total_stars,
      JSON.stringify(top_languages),
      most_active_repo,
      profile.html_url,
      account_age_days,
      activity_score,
    ];

    await pool.execute(query, values);

    res.status(200).json({
      success: true,
      message: `Profile analyzed and stored`,
      data: { username: profile.login, total_stars, top_languages, most_active_repo, account_age_days, activity_score },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/profiles
const getAllProfiles = async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM profiles ORDER BY analyzed_at DESC");
    res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/profiles/:username
const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const [rows] = await pool.execute("SELECT * FROM profiles WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "Profile not found. Analyze it first." });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/profiles/:username
const deleteProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const [result] = await pool.execute("DELETE FROM profiles WHERE username = ?", [username]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "Profile not found" });
    }

    res.status(200).json({ success: true, message: `Profile ${username} deleted` });
  } catch (err) {
    next(err);
  }
};

module.exports = { analyzeProfile, getAllProfiles, getProfile, deleteProfile };