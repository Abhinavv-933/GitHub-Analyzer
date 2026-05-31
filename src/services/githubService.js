const axios = require("axios");


const GITHUB_API = "https://api.github.com";
const headers = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

const fetchUserProfile = async (username) => {
  const { data } = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
  return data;
};

const fetchUserRepos = async (username) => {
  const { data } = await axios.get(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
    { headers }
  );
  return data;
};

const computeInsights = (repos, profile) => {
  // Total stars across all repos
  const total_stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  // Top 3 languages by repo count
  const langCount = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCount[repo.language] = (langCount[repo.language] || 0) + 1;
    }
  });
  const top_languages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  // Most active repo (stars + forks)
  const most_active_repo = repos.reduce(
    (best, repo) => {
      const score = repo.stargazers_count + repo.forks_count;
      return score > best.score ? { name: repo.name, score } : best;
    },
    { name: null, score: 0 }
  ).name;

  // Account age in days
  const account_age_days = Math.floor(
    (new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)
  );

  // Activity score
  const activity_score = (profile.followers * 3) + (total_stars * 2) + (profile.public_repos * 1);

  return { total_stars, top_languages, most_active_repo, account_age_days, activity_score };
};


module.exports = { fetchUserProfile, fetchUserRepos, computeInsights };
