-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 13, 2023 at 05:37 PM
-- Server version: 5.7.42-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cc221036`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `user1` varchar(32) NOT NULL,
  `user2` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `chat`
--

INSERT INTO `chat` (`id`, `user1`, `user2`) VALUES
(31, 'TheRealTrump', 'Felix'),
(30, 'TheRealTrump', 'FixiFax'),
(29, 'TheRealTrump', 'Vero');

-- --------------------------------------------------------

--
-- Table structure for table `follower_following`
--

CREATE TABLE `follower_following` (
  `follower` varchar(32) NOT NULL,
  `following` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `follower_following`
--

INSERT INTO `follower_following` (`follower`, `following`) VALUES
('TheRealTrump', 'Felix'),
('Vero', 'Felix'),
('TheRealTrump', 'FixiFax'),
('Vero', 'FixiFax'),
('TheRealTrump', 'Vero');

-- --------------------------------------------------------

--
-- Table structure for table `like`
--

CREATE TABLE `like` (
  `user` varchar(32) NOT NULL,
  `P_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `like`
--

INSERT INTO `like` (`user`, `P_ID`) VALUES
('Felix', 16),
('TheRealTrump', 16),
('Vero', 16),
('Felix', 17),
('TheRealTrump', 17),
('Vero', 17),
('TheRealTrump', 18),
('TheRealTrump', 19),
('Vero', 19),
('TheRealTrump', 20),
('TheRealTrump', 21);

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `sender` varchar(32) NOT NULL,
  `message` text NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `chat_id`, `sender`, `message`, `timestamp`) VALUES
(184, 30, 'TheRealTrump', 'Have you ever heard about the US?', '2023-07-13 16:42:29'),
(185, 29, 'TheRealTrump', 'Hey girl. You look way to independent for the US!', '2023-07-13 16:42:57'),
(186, 31, 'TheRealTrump', 'Boy, what\'s up with all those animals?', '2023-07-13 16:44:56'),
(187, 29, 'Vero', 'Bro... Check your live. You are soooo wag. Nobody want\'s to vote for you...', '2023-07-13 16:45:23'),
(188, 29, 'TheRealTrump', 'Big sad', '2023-07-13 16:45:44');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `P_ID` int(11) NOT NULL,
  `creator` varchar(32) DEFAULT NULL,
  `image_location` text,
  `caption` varchar(400) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`P_ID`, `creator`, `image_location`, `caption`) VALUES
(16, 'Felix', 'Felix_9d07cee1-6536-5647-aded-c1fb0d9a0b38.jpg', 'Love those cute creatures'),
(17, 'Felix', 'Felix_0c9eb06f-9475-5ebb-a64d-407e209f1711.jpg', 'You can\'t hide, they will find you...'),
(18, 'Vero', 'Vero_232c5197-5413-5102-98c1-ffd0fab5f8a3.jpg', 'Back from my hike, was quite nice'),
(19, 'Vero', 'Vero_a542945c-7749-5aa1-a7f1-340154f29d22.jpg', 'Can\'t wait to climb on top of that'),
(20, 'TheRealTrump', 'TheRealTrump_ea35065d-fede-568d-be84-925a29907431.jpg', 'Just found this punk kid... can\'t wait to deport him!'),
(21, 'TheRealTrump', 'TheRealTrump_0398393b-6c8d-5fd6-aa25-82f2d7e071ed.jpg', 'You can\'t tell me that I\'m the bad guy here');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `username` varchar(32) NOT NULL,
  `firstname` text NOT NULL,
  `surname` text NOT NULL,
  `status` text NOT NULL,
  `password` text NOT NULL,
  `privilege` enum('user','admin','guest','disabled') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `firstname`, `surname`, `status`, `password`, `privilege`) VALUES
('Felix', 'Felix', 'Teutsch', 'I love llamas & Alpacas', '$2b$10$rmSnMz4y6vXLXkyJMJGSqe.5rtwTK28w8.W8ljKhXDeKRiKoookpa', 'user'),
('FixiFax', 'FixiFax', 'Xilef', 'Here for the party', '$2b$10$x0/ndNAH1PyFQdcis4QqWOa/J5P3SqDqIdlpEzVEeGFScbh34xbSK', 'user'),
('TheRealTrump', 'Donald', 'Trump', 'Make America Bad again', '$2b$10$p5KEHyMWBuh5TFeZTM5gGekSshohBRZbKq9Tm8Z9Xtx9q3aw6Nk5a', 'user'),
('Vero', 'Veronika', 'Frei', 'Bussy being awsome!', '$2b$10$vItLd7P2d.JYRJqeUz94FuNpAWkKD3tehGs0vuPfYatD7Jl7cMMhC', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user1_user2` (`user1`,`user2`),
  ADD KEY `fk_user2` (`user2`);

--
-- Indexes for table `follower_following`
--
ALTER TABLE `follower_following`
  ADD PRIMARY KEY (`follower`,`following`),
  ADD KEY `follower_following_ibfk_2` (`following`);

--
-- Indexes for table `like`
--
ALTER TABLE `like`
  ADD PRIMARY KEY (`user`,`P_ID`),
  ADD KEY `like_ibfk_2` (`P_ID`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_id` (`chat_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`P_ID`),
  ADD KEY `post_ibfk_1` (`creator`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=189;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `P_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `fk_user1` FOREIGN KEY (`user1`) REFERENCES `user` (`username`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user2` FOREIGN KEY (`user2`) REFERENCES `user` (`username`) ON DELETE CASCADE;

--
-- Constraints for table `follower_following`
--
ALTER TABLE `follower_following`
  ADD CONSTRAINT `follower_following_ibfk_1` FOREIGN KEY (`follower`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follower_following_ibfk_2` FOREIGN KEY (`following`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follower_following_ibfk_3` FOREIGN KEY (`follower`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follower_following_ibfk_4` FOREIGN KEY (`follower`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `like`
--
ALTER TABLE `like`
  ADD CONSTRAINT `like_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `like_ibfk_2` FOREIGN KEY (`P_ID`) REFERENCES `post` (`P_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `fk_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
