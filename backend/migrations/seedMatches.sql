-- Insert sample matches
INSERT INTO matches (home_team_id, away_team_id, date, time, league, status, home_score, away_score) VALUES
(1, 2, '2024-01-15', '15:00', 'Premier League', 'completed', 2, 1),
(2, 3, '2024-01-16', '17:30', 'Premier League', 'completed', 1, 3),
(3, 1, '2024-01-17', '20:00', 'Premier League', 'completed', 0, 2),
(1, 4, '2024-01-18', '16:00', 'Premier League', 'completed', 3, 1),
(2, 4, '2024-01-19', '18:30', 'Premier League', 'completed', 2, 2),
(3, 4, '2024-01-20', '15:45', 'Premier League', 'completed', 1, 0),
(1, 2, '2024-01-21', '19:00', 'Premier League', 'completed', 4, 1),
(2, 3, '2024-01-22', '17:15', 'Premier League', 'completed', 0, 3),
(1, 3, '2024-01-25', '20:30', 'Premier League', 'upcoming', NULL, NULL),
(2, 4, '2024-01-26', '16:45', 'Premier League', 'upcoming', NULL, NULL),
(3, 1, '2024-01-27', '18:00', 'Premier League', 'upcoming', NULL, NULL);
