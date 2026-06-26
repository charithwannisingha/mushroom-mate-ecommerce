# 🍄 Mushroom Mate - E-Commerce & Farm Management System
<img width="1429" height="941" alt="Screenshot 2026-06-26 130618" src="https://github.com/user-attachments/assets/b0debb60-b086-4eab-93d1-6aaeefdde378" />
<img width="1495" height="948" alt="Screenshot 2026-06-26 130657" src="https://github.com/user-attachments/assets/7209b3af-0ec2-434d-8949-8f8cd24c4b98" />

An integrated web-based platform designed to bridge the gap between small-scale mushroom farmers and consumers in Sri Lanka.

## 🚀 Features

* **Multi-Role Authentication:** Secure login for Admins, Farmers, and Customers.
* **Farmer Dashboard:** Allows farmers to manage their product listings, track stock levels with low-stock alerts, and view incoming orders.
* **Admin Control Panel:** Complete system oversight. Admins can verify users, moderate products (remove fake listings), manage categories, and publish articles to the Knowledge Hub.
* **Knowledge Hub:** A curated digital library containing mushroom cultivation guides and disease diagnostics.
* **E-Commerce Store:** A seamless shopping experience for consumers to browse, filter, and order fresh mushrooms, spawn, and equipment.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Lucide React (Icons)
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt

## 💻 How to Run Locally

### 1. Database Setup
1. Open XAMPP and start **Apache** and **MySQL**.
2. Open phpMyAdmin (`http://localhost/phpmyadmin`).
3. Create a new database named `mushroom-mate`.
4. Import the provided `.sql` file (from the `database` folder) into this database.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   
   npm install
   
1. Create a .env file in the backend folder and add your database credentials and JWT Secret.
2. Start the backend server:
   
   npm start

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder.
2. Install dependencies:
   
npm install

3. Start the React development server:

npm run dev

👨‍💻 Developer
Developed by Charith Wannisingha
