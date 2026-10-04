START TRANSACTION;
INSERT INTO users (name)
VALUES
('Alice'),
('Bob'),
('Charlie'),
('Diana'),
('Ethan');

INSERT INTO messages (content, releaseDate, userId)
VALUES
('Hello, how are you?', '2026-10-01 08:00:00', 1),
('Welcome to the platform!', '2026-10-01 09:15:00', 2),
('This is my first message.', '2026-10-01 10:30:00', 3),
('Have a great day!', '2026-10-01 11:45:00', 1),
('Looking forward to the weekend.', '2026-10-01 12:00:00', 4),
('Does anyone have an update?', '2026-10-02 08:20:00', 2),
('Thanks for your help!', '2026-10-02 09:10:00', 5),
('I am currently working on a new project.', '2026-10-02 10:05:00', 3),
('The meeting starts in 10 minutes.', '2026-10-02 11:00:00', 1),
('Please check your notifications.', '2026-10-02 12:30:00', 4),
('Everything is working correctly.', '2026-10-03 08:00:00', 5),
('I found an interesting article.', '2026-10-03 09:25:00', 2),
('Can someone review my changes?', '2026-10-03 10:40:00', 3),
('The deployment was successful.', '2026-10-03 11:15:00', 1),
('We should discuss this tomorrow.', '2026-10-03 12:00:00', 4),
('New features are coming soon.', '2026-10-04 08:30:00', 5),
('Please update your profile.', '2026-10-04 09:45:00', 2),
('I have completed the assigned task.', '2026-10-04 10:20:00', 3),
('Is the server running?', '2026-10-04 11:35:00', 1),
('Thank you for the feedback.', '2026-10-04 12:50:00', 4),
('A new version is now available.', '2026-10-05 08:15:00', 5),
('Let us schedule a meeting.', '2026-10-05 09:30:00', 2),
('I will send the documentation later.', '2026-10-05 10:45:00', 3),
('The issue has been resolved.', '2026-10-05 11:20:00', 1),
('Please review the latest updates.', '2026-10-05 12:40:00', 4),
('Good morning everyone!', '2026-10-06 08:00:00', 5),
('I have a quick question.', '2026-10-06 09:10:00', 2),
('The database connection is stable.', '2026-10-06 10:25:00', 3),
('Testing the message system.', '2026-10-06 11:30:00', 1),
('See you all tomorrow!', '2026-10-06 12:45:00', 4);

COMMIT;