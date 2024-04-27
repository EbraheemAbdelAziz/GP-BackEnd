-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2024 at 02:17 AM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.4.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gp-database`
--

-- --------------------------------------------------------

--
-- Table structure for table `chamionships`
--

CREATE TABLE `chamionships` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `game_remaining` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `chamionships`
--

INSERT INTO `chamionships` (`id`, `name`, `price`, `game_remaining`, `image`) VALUES
(1, 'ziko', 50, 3, '1709903298566.jpg'),
(2, 'zizo', 200, 5, '1709903477170.jpg'),
(3, 'badr', 400, 7, '1709903498769.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `skins`
--

CREATE TABLE `skins` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `imageUrl` varchar(255) NOT NULL,
  `scale` varchar(255) NOT NULL,
  `modelUrl` varchar(255) NOT NULL,
  `positionPlane` varchar(255) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `skins`
--

INSERT INTO `skins` (`id`, `name`, `imageUrl`, `scale`, `modelUrl`, `positionPlane`, `price`) VALUES
(9, 'Retro', '1709761143898.png', '{\"x\":0.025,\"y\":0.025,\"z\":0.025}', 'models/plane5/skin.glb', '{\"x\":0,\"y\":1,\"z\":0}', 100),
(10, 'Ghost', '1709761249214.png', '{\"x\":0.2,\"y\":0.2,\"z\":0.2}', 'models/plane2/skin.glb', '{\"x\":0,\"y\":1,\"z\":0}', 250),
(11, 'Star Lord', '1709761300460.png', '{\"x\":1,\"y\":1,\"z\":1}', 'models/plane1/skin.glb', '{\"x\":0,\"y\":1,\"z\":0}', 500);

-- --------------------------------------------------------

--
-- Table structure for table `starlordrounds`
--

CREATE TABLE `starlordrounds` (
  `id` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `requiredCoins` int(11) NOT NULL,
  `speed` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `starlordrounds`
--

INSERT INTO `starlordrounds` (`id`, `time`, `requiredCoins`, `speed`) VALUES
(1, 15, 3, 0.1),
(2, 25, 10, 0.12),
(3, 35, 20, 0.14),
(4, 40, 30, 0.16);

-- --------------------------------------------------------

--
-- Table structure for table `userround`
--

CREATE TABLE `userround` (
  `userId` int(11) NOT NULL,
  `roundId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userround`
--

INSERT INTO `userround` (`userId`, `roundId`) VALUES
(1, 1),
(4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `coins` int(11) NOT NULL DEFAULT 200,
  `xp` int(11) NOT NULL DEFAULT 0,
  `photo` varchar(255) NOT NULL,
  `tutorial` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `token`, `coins`, `xp`, `photo`, `tutorial`) VALUES
(1, 'Ebraheem zezo', 'ebraheemzezo@gmail.com', '$2b$10$P8tHFI11T81.Z1flRC6GVe/CMmSf1O9.0trYC7CJrTU.NAdG3TZvy', 'f0348b7e23dfd834531bfc873162cda8', 4077, 1000, '1713243606112.png', 0),
(4, 'ahmed', 'ahmed@gmail.com', '$2b$10$FvnRGc7P8OjbP3JK3PaHV.TEwAsRdFHv3zahzCjvOB7VN0KYNXNqi', 'fa60165e290142da599afe7ff8e5eb04', 353, 200, '1709903298569.jpg', 0);

-- --------------------------------------------------------

--
-- Table structure for table `userskins`
--

CREATE TABLE `userskins` (
  `userId` int(11) NOT NULL,
  `skinId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userskins`
--

INSERT INTO `userskins` (`userId`, `skinId`) VALUES
(1, 9),
(1, 10),
(1, 11),
(4, 9),
(4, 10),
(4, 11);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chamionships`
--
ALTER TABLE `chamionships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `skins`
--
ALTER TABLE `skins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `starlordrounds`
--
ALTER TABLE `starlordrounds`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userround`
--
ALTER TABLE `userround`
  ADD PRIMARY KEY (`userId`,`roundId`),
  ADD KEY `roundId` (`roundId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userskins`
--
ALTER TABLE `userskins`
  ADD PRIMARY KEY (`userId`,`skinId`),
  ADD KEY `skinId` (`skinId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chamionships`
--
ALTER TABLE `chamionships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `skins`
--
ALTER TABLE `skins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `starlordrounds`
--
ALTER TABLE `starlordrounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userround`
--
ALTER TABLE `userround`
  ADD CONSTRAINT `userround_ibfk_1` FOREIGN KEY (`roundId`) REFERENCES `starlordrounds` (`id`),
  ADD CONSTRAINT `userround_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `userskins`
--
ALTER TABLE `userskins`
  ADD CONSTRAINT `userskins_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `userskins_ibfk_2` FOREIGN KEY (`skinId`) REFERENCES `skins` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
