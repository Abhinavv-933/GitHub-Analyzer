CREATE DATABASE IF NOT EXISTS github_analyzer;
USE github_analyzer;

CREATE TABLE IF NOT EXISTS profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(200),
  public_repos INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,
  total_stars INT DEFAULT 0,
  top_languages JSON,
  most_active_repo VARCHAR(200),
  profile_url TEXT,
  account_age_days INT DEFAULT 0,
  activity_score INT DEFAULT 0,
  analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE profiles 
ADD COLUMN account_age_days INT DEFAULT 0,
ADD COLUMN activity_score INT DEFAULT 0;