-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 23, 2026 at 12:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mushroom_mate`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_log`
--

INSERT INTO `audit_log` (`id`, `user_id`, `action`, `created_at`) VALUES
(1, 1, 'User logged in', '2026-06-22 18:04:27'),
(2, 1, 'Verified farmer #4', '2026-06-22 18:06:20'),
(3, 1, 'Unverified farmer #4', '2026-06-22 18:06:22'),
(4, 1, 'Verified farmer #4', '2026-06-22 18:07:11'),
(5, 1, 'User logged in', '2026-06-22 20:57:11'),
(6, 5, 'User logged in', '2026-06-22 21:12:47'),
(7, 5, 'Placed order #3 (Rs.2600)', '2026-06-22 21:13:04'),
(8, 2, 'User logged in', '2026-06-22 21:14:24'),
(9, 1, 'User logged in', '2026-06-22 21:24:43'),
(10, 2, 'User logged in', '2026-06-22 21:31:32'),
(11, 5, 'User logged in', '2026-06-22 21:31:56'),
(12, 5, 'Placed order #4 (Rs.3480)', '2026-06-22 21:32:09'),
(13, 7, 'New customer registered', '2026-06-22 21:46:25'),
(14, 8, 'New customer registered', '2026-06-22 21:47:56'),
(15, 9, 'New farmer registered', '2026-06-22 21:52:53'),
(16, 8, 'User logged in', '2026-06-22 22:08:18'),
(17, 8, 'Verified farmer #9', '2026-06-22 22:08:26'),
(18, 9, 'User logged in', '2026-06-22 22:27:40');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Oyster', NULL, '2026-06-22 20:42:47'),
(2, 'Button', NULL, '2026-06-22 20:42:47'),
(3, 'Shiitake', NULL, '2026-06-22 20:42:47'),
(4, 'Spawn', NULL, '2026-06-22 20:42:47'),
(5, 'Equipment', NULL, '2026-06-22 20:42:47');

-- --------------------------------------------------------

--
-- Table structure for table `knowledge`
--

CREATE TABLE `knowledge` (
  `id` int(11) NOT NULL,
  `type` enum('guide','disease') NOT NULL DEFAULT 'guide',
  `title` varchar(200) NOT NULL,
  `summary` varchar(400) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `symptoms` text DEFAULT NULL,
  `treatment` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `knowledge`
--

INSERT INTO `knowledge` (`id`, `type`, `title`, `summary`, `body`, `symptoms`, `treatment`, `image`, `created_at`) VALUES
(7, 'guide', 'සාර්ථකව මුතුබෙලි හතු (Oyster Mushroom) වගා කරන ආකාරය', 'නිවසේදීම ඉතා පහසුවෙන් සහ අඩු වියදමකින් මුතුබෙලි හතු වගා කිරීම සඳහා අවශ්‍ය මූලික පියවර 5ක්.', '1 බීජ තෝරාගැනීම: කෘෂිකර්ම දෙපාර්තමේන්තුවෙන් හෝ විශ්වාසවන්ත ස්ථානයකින් නිරෝගී බීජ (Spawn) මිලදී ගන්න.\n\n2 මාධ්‍යය සකස් කිරීම: පිරිසිදු රබර් ලී කුඩු, සහල් නිවුඩු සහ කැල්සියම් කාබනේට් නියමිත අනුපාතයට කලවම් කර අවශ්‍ය පමණට ජලය එක් කරන්න.\n\n3 ජීවානුහරණය: සකස් කළ මාධ්‍යය පොලිතින් කවරවල (අඟල් 7x14) අසුරා පැය 3-4 ක් පමණ හුමාලයෙන් තම්බා ගන්න. මෙය බැක්ටීරියා විනාශ කිරීමට අත්‍යවශ්‍ය වේ.\n\n4 බීජ දැමීම: ජීවානුහරණය කළ වගා මලු හොඳින් නිවුණු පසු (කාමර උෂ්ණත්වයට පත් වූ පසු) පිරිසිදු, සුළං නොඑන ස්ථානයකදී බීජ ඇතුළත් කරන්න.\n\n5 අඳුරු කාමරයක තැබීම: දින 25-30 ක් පමණ යනතෙක් සුදු පාට දිලීර ජාලය මල්ල පුරා පැතිරෙන තුරු අඳුරු ස්ථානයක තබන්න. ඉන්පසු මලු විවෘත කර දිනපතා ජලය ඉසින්න. දින කිහිපයකින් හතු මතුවීම ආරම්භ වේ.', '', '', 'https://mushroomsofsrilanka.weebly.com/uploads/1/3/1/9/131905943/editor/5ea3f6b38f2b3.png?1587807039', '2026-06-22 22:12:48'),
(8, 'guide', 'බොත්තම් හතු (Button Mushroom) වගාවට මූලික හැඳින්වීමක්', 'ශීත දේශගුණයක් අවශ්‍ය වන, ඉහළ වෙළඳපොළ වටිනාකමක් ඇති බොත්තම් හතු වගා කරන ආකාරය පිළිබඳ මූලික දැනුම.', '1 අවශ්‍ය දේශගුණය: බොත්තම් හතු වගාවට සෙල්සියස් අංශක 15-20 අතර අඩු උෂ්ණත්වයක් අවශ්‍ය වේ. මේ නිසා ශ්‍රී ලංකාවේ නුවරඑළිය වැනි ප්‍රදේශ වඩාත් සුදුසුය. අනෙක් ප්‍රදේශ වලදී කෘතිමව වායු සමනය කළ (A/C) කුටි භාවිතා කළ යුතුය.\n\n2 කොම්පෝස්ට් මාධ්‍යය සකස් කිරීම: මුතුබෙලි හතු මෙන් නොව, බොත්තම් හතු සඳහා පිදුරු, කුකුල් පොහොර, යුරියා සහ ජිප්සම් යොදා දින 28ක් පමණ තිස්සේ විශේෂ කොම්පෝස්ට් මාධ්‍යයක් සකස් කළ යුතුය.\n\n3 බීජ සිටුවීම: සකස් කළ කොම්පෝස්ට් විශේෂිත ලී හෝ ප්ලාස්ටික් තැටි වල අතුරා ඒ මත බීජ (Spawn) විසුරුවා හැර දින 15ක් පමණ අඳුරේ තබන්න.\n\n4 පස් දැමීම (Casing): සුදු පාට දිලීර ජාලය හොඳින් පැතිරුණු පසු, ජීවානුහරණය කළ පස් තට්ටුවක් (Casing soil) අඟලක් පමණ ඝනකමට ඊට උඩින් යොදන්න.\n\n5 අස්වැන්න: පස් යොදා දින 15-20 කින් කුඩා බොත්තම් ආකාරයට හතු මතුවීම ඇරඹේ. හතු කුඩය දිගහැරීමට පෙර නෙළාගැනීමෙන් වැඩි වටිනාකමක් ලබාගත හැක.', '', '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSraqwPYXCTZ2z01PCzczINoRTcAtj-CU-PyBKfNCm6lg&s=10', '2026-06-22 22:14:24'),
(9, 'guide', 'හතු කුටියේ උෂ්ණත්වය සහ ආර්ද්‍රතාවය නිවැරදිව පාලනය කරමු', 'හතු මලු වලින් උපරිම අස්වැන්නක් ලබාගැනීමට හතු ගෙය තුළ පරිසරය නිවැරදිව පවත්වා ගන්නා ආකාරය.', '1. උෂ්ණත්වය පවත්වා ගැනීම: මුතුබෙලි හතු සඳහා වඩාත් සුදුසු උෂ්ණත්වය සෙල්සියස් අංශක 25-28 අතර වේ. වහලයට පොල් අතු හෝ මාන උළු සෙවිලි කිරීම මඟින් ඇතුළත සිසිල්ව තබා ගත හැක.\n\n2. ආර්ද්‍රතාවය (තෙතමනය): කුටියේ තෙතමනය 80% - 90% ත් අතර ඉහළ මට්ටමක පවත්වා ගත යුතුය. මේ සඳහා බිමට වැලි අතුරා ජලය ඉසීම ඉතා සාර්ථක ක්‍රමයකි.\n\n3. වාතාශ්‍රය ලබා දීම: හතු මලු වලට හොඳින් ඔක්සිජන් ලැබිය යුතුය. කුටියේ වාතාශ්‍රය හොඳින් පවත්වා ගන්න, නමුත් තද සුළං කෙලින්ම මලු වලට වැදීම සුදුසු නොවේ.\n\n4. ජලය ඉසීම: දිනකට දෙවරක් (උදේ සහ සවස) ස්ප්‍රේ (Spray) යන්ත්‍රයක් මඟින් සියුම් පිනි බිංදු ආකාරයෙන් ජලය ඉසින්න. මලු වල කට ඇතුළට ජලය නොයන ලෙස ප්‍රවේශම් වන්න, එසේ වුවහොත් මලු කුණු වී යා හැක.', '', '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT711In__pe_35qjT8WFRE6_TfTO8y20DW0lerP6H16THsyAJxUqi5f6kU&s=10', '2026-06-22 22:17:42'),
(10, 'disease', 'හතු මලු කොළ පාට වීම (Green Mould / Trichoderma)', 'ශ්‍රී ලංකාවේ මුතුබෙලි හතු වගාකරුවන් මුහුණ දෙන ප්‍රධානතම හා බහුලවම දක්නට ලැබෙන දිලීර රෝගයයි', '', '• ජීවානුහරණය කළ හතු මල්ල තුළ හෝ මල්ලේ කට අසල සුදු පැහැති දිලීරය වෙනුවට කොළ පැහැති හෝ නිල්-කොළ පැහැති පුස් වර්ගයක් වේගයෙන් වර්ධනය වීම.\n• හතු මල්ලේ වර්ධනය බාල වීම.\n• ආසාදනය වූ මලු වලින් කුණු වූ ගන්ධයක් පිටවීම.', '1. රෝගය දුටු වහාම එම මල්ල වගා කුටියෙන් ඉවත් කර ඈතින් වළලා හෝ පුළුස්සා දමන්න. කිසිවිටෙකත් එම මල්ල වගා කුටිය තුළදී විවෘත නොකරන්න. (එහි බීජාණු සුළඟින් ගොස් අනෙක් මලු වලට බෝ වේ).\n2. වගා කුටිය සහ අවට පරිසරය පිරිසිදුව තබා ගන්න.\n3. මාධ්‍යය සකස් කිරීමේදී නිවැරදිව ජීවානුහරණය (පැය 3-4 ක් හොඳින් තැම්බීම) සිදු කරන්න.\n4. මලු වලට ජලය ඉසීමේදී, මල්ල ඇතුළට ජලය නොයන ලෙස ප්‍රවේශම් වන්න.', 'https://analyticalscience.wiley.com/cms/asset/27f3d18d-4596-49db-96e8-bbcca1a30d15/ibf8e0bd568760da96d2db8ab0c1b7c8f.jpg', '2026-06-22 22:22:34'),
(11, 'disease', 'හතු මලු වලින් කහ පාට වතුර ගැලීම සහ හතු කහ වීම', 'බැක්ටීරියා ආසාදනයක් හෝ අධික තෙතමනය හේතුවෙන් හතු මලු විනාශ වී යාම.', '', '• හතු මල්ල ඇතුළත හෝ පහළ කොටසේ කහ හෝ දුඹුරු පැහැති දියරයක් (වතුර) එකතු වී තිබීම.\n• මල්ලෙන් පිටතට එන කුඩා හතු පොහොට්ටු (Pins) කහ පාට වී හෝ දුඹුරු පාට වී කුණු වී යාම.\n• හතු කුඩය මත දුඹුරු පැහැති ලප ඇති වීම සහ ඇලෙන සුළු ස්වභාවයක් ගැනීම.', '1. වගා කුටියේ වාතාශ්‍රය (Ventilation) වහාම වැඩි කරන්න. \n2. හතු මලු වලට කෙලින්ම වතුර ඉසීම තාවකාලිකව නවතා, කුටියේ බිමට පමණක් ජලය ඉසින්න. හතු මතුපිට නිතරම තෙතමනය රැඳී තිබීම බැක්ටීරියා වර්ධනයට හේතු වේ.\n3. කහ පාට වතුර එකතු වී ඇති මලු වල යටින් කුඩා සිදුරක් සාදා එම දියරය ඉවත් වීමට ඉඩ හරින්න.\n4. රෝගය උත්සන්න වී කුණු වී ඇති හතු පොහොට්ටු ප්‍රවේශමෙන් කඩා ඉවත් කරන්න.', 'https://veshenka-expert.info/wp-content/uploads/2018/11/zeltie-veshenki.jpg.webp', '2026-06-22 22:24:06'),
(12, 'disease', 'හතු මලු තුළ කලු හෝ අළු පැහැති පුස් හටගැනීම', 'අධික උෂ්ණත්වය සහ වාතාශ්‍රය අඩු වීම නිසා හටගන්නා භයානක පුස් වර්ගයකි.', '', '• හතු මල්ල ඇතුළත කලු හෝ තද අළු පැහැති කුඩු වැනි පුස් වර්ගයක් දැකගත හැකි වීම.\n• මෙය සාමාන්‍යයෙන් බීජ දැමූ ස්ථානය අවට හෝ මල්ලේ ඉහළ කොටසේ බහුලව දක්නට ලැබේ.\n• සුදු දිලීරය වර්ධනය වීම සම්පූර්ණයෙන්ම නතර වී මල්ල විනාශ වීම.', '1. මෙම කලු පුස් වර්ගයේ (Aspergillus) බීජාණු මිනිස් ශ්වසන පද්ධතියට අහිතකර විය හැකි බැවින්, රෝගය දුටු වහාම මුව ආවරණයක් (Mask) පැළඳ එම මලු වගා කුටියෙන් ඉවත් කර පුළුස්සා දමන්න.\n2. වගා කුටියේ උෂ්ණත්වය අධිකව ඉහළ යාම පාලනය කරන්න (සෙවණ වැඩි කිරීම හෝ වහලයට ජලය ඉසීම).\n3. බීජ (Spawn) ගෙන එන විට ඒවායේ කලු හෝ කොළ ලප ඇත්දැයි හොඳින් පරීක්ෂා කර බලන්න. ආසාදිත බීජ කිසිවිටෙකත් භාවිතා නොකරන්න.\n4. බීජ දැමීමේ ක්‍රියාවලිය (Inoculation) ඉතා පිරිසිදු පරිසරයකදී පමණක් සිදු කරන්න.', 'https://t3.ftcdn.net/jpg/13/79/45/64/360_F_1379456472_bmp5E9P2B3gUxppBBzuXNgGwbkyeaY3v.jpg', '2026-06-22 22:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` varchar(40) DEFAULT 'Cash on Delivery',
  `ship_name` varchar(120) DEFAULT NULL,
  `ship_phone` varchar(20) DEFAULT NULL,
  `ship_address` varchar(255) DEFAULT NULL,
  `ship_city` varchar(80) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `farmer_id` int(11) DEFAULT NULL,
  `name` varchar(160) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `qty` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `name` varchar(160) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` varchar(30) DEFAULT 'kg',
  `stock` int(11) NOT NULL DEFAULT 0,
  `low_stock_at` int(11) NOT NULL DEFAULT 10,
  `image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `farmer_id`, `name`, `category`, `description`, `price`, `unit`, `stock`, `low_stock_at`, `image`, `is_active`, `created_at`) VALUES
(9, 9, 'Fresh White Oyster Mushrooms', 'Oyster', 'Organically grown, freshly harvested premium white oyster mushrooms. Rich in texture and perfect for traditional Sri Lankan curries and stir-fries.', 850.00, 'kg', 50, 10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjgcfxd-W2mNew8pX7eTG0Hv6Q5ZXE7lSLD9vGJ3c3kg&s=10', 1, '2026-06-22 21:55:33'),
(10, 9, 'Vibrant Pink Oyster Mushrooms', 'Oyster', 'Exotic and vibrant pink oyster mushrooms with a subtle seafood-like aroma and a meaty texture. Harvested daily from our organic smart farm.', 1150.00, 'kg', 12, 15, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7SXacwqLIYSTWzNgDl1pI1VITPdAQdGxqN8XFl-NMYQ&s=10', 1, '2026-06-22 21:56:29'),
(11, 9, 'Fresh White Button Mushrooms', 'Button', 'Premium quality white button mushrooms grown in controlled cool climate conditions. Cleaned, sliced-ready, and packed in eco-friendly containers.', 680.00, '500g pack', 35, 8, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoZX8vDMsoW4x5_lEb1oiHHZIr9T8au4KxAHFpZIYlaA&s=10', 1, '2026-06-22 21:57:56'),
(12, 9, 'Premium Dried Shiitake Mushrooms', 'Shiitake', 'High-grade sun-dried Shiitake mushrooms packed with deep umami flavor. Perfect for soups, broths, and gourmet Asian cuisine. Long shelf life.', 2450.00, 'packet', 20, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY8x93QntoYGu2zi2s-1vt5qWV1zQyfCg1ryTTB2g8A&s', 1, '2026-06-22 21:59:26'),
(13, 9, 'Oyster Mushroom Spawn Bag (F1)', 'Spawn', 'Laboratory-tested, high-yield F1 generation white oyster mushroom grain spawn. Formulated for maximum contamination resistance and fast colonization.', 220.00, 'bottle', 150, 20, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsd_8G2862bV-n-X8VXGy5FfYnoEpJTXuVH-QpiLKJxA&s', 1, '2026-06-22 22:01:12'),
(14, 9, 'All-in-One Mushroom Grow Kit', 'Equipment', 'The perfect educational DIY kit for beginners and kids. Just mist with water daily and harvest your own fresh oyster mushrooms at home within 14 days!', 1500.00, 'unit', 45, 10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRI0s_gX6NTmGrEGmBa-x548xn0PNTT2ic3DVBxdemvlw&s=10', 1, '2026-06-22 22:02:13'),
(15, 9, 'Sterilized Mushroom Substrate Block', 'Equipment', 'Ready-to-inoculate sterilized rubber sawdust substrate block. Supplemented with rice bran and calcium carbonate, perfectly optimized for commercial oyster mushroom cultivation.', 380.00, 'unit', 120, 25, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcPr_IwGZPt-prOUttAjtFH6J8PnwDgh3G3NShyp006RCelLHPQHbsP-k&s=10', 1, '2026-06-22 22:04:35'),
(16, 9, 'Gourmet King Oyster Mushrooms', 'Oyster', 'Premium quality, thick-stemmed King Oyster mushrooms. Known for their rich savory umami flavor and dense, chewy texture. Highly versatile and an excellent gourmet ingredient for grilling, roasting, or using as a vegan meat substitute.', 950.00, '500g pack', 25, 5, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVPLavOifAj_L_CEPPNUCRMNKLsml19wYJnJWZ_rwk3w&s=10', 1, '2026-06-22 22:06:52');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','farmer','customer') NOT NULL DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(80) DEFAULT NULL,
  `farm_name` varchar(160) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `city`, `farm_name`, `is_verified`, `avatar`, `created_at`) VALUES
(8, 'Admin', 'admin@motorshield.lk', '$2a$10$PtZd8YQccPmgNjDqFSxiruINakGHD0bBsx0AtXy78gLQi.V7ZXxuu', 'admin', NULL, NULL, NULL, NULL, 1, NULL, '2026-06-22 21:47:56'),
(9, 'Charith Eranda', 'charitherandabs@gmail.com', '$2a$10$ClafcTDb5mC1zNizuVqu8uDtjJzXTiCFExHqgafJmLb/LtYRCIX/6', 'farmer', '0774488465', NULL, 'Monaragala', 'MushroomMate', 1, NULL, '2026-06-22 21:52:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `knowledge`
--
ALTER TABLE `knowledge`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `knowledge`
--
ALTER TABLE `knowledge`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
