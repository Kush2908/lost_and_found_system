# Installation Guide

This document provides a step-by-step setup guide for running the University Online Lost and Found System in a local development environment using XAMPP.

---

## System Requirements

Before starting, ensure your system satisfies the following prerequisite software requirements:

- **Operating System**: Windows 10/11, Linux, or macOS
- **Web Server**: Apache 2.4+ (included with XAMPP)
- **PHP Version**: PHP 8.0 or higher (PHP 8.2+ recommended)
- **Database Server**: MySQL 5.7+ or MariaDB 10.4+
- **PHP Extensions Required**:
  - `pdo_mysql`
  - `mbstring`
  - `fileinfo`
  - `session`
- **Web Browser**: Google Chrome, Mozilla Firefox, Microsoft Edge, or Safari

---

## Step-by-Step Installation

### 1. Download & Install XAMPP

1. Download XAMPP with PHP 8.x from [Apache Friends](https://www.apachefriends.org/).
2. Run the installer and install XAMPP to the default directory (e.g., `C:\xampp`).
3. Ensure Apache and MySQL components are selected during installation.

### 2. Place Project Files

Clone or copy the project repository into the Apache document root directory (`htdocs`):

```bash
C:\xampp\htdocs\online-lost-and-found-system
```

Verify that the main directory contains core files such as `index.php`, `db.php`, `auth.php`, and `schema.sql`.

---

## Environment Setup (.env)

The application uses environment variables for database connections.

1. Navigate to the project root directory (`C:\xampp\htdocs\online-lost-and-found-system`).
2. Copy `.env.example` to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` in a text editor and adjust the settings to match your database parameters:

   ```env
   DB_HOST=localhost
   DB_NAME=lost_and_found_db
   DB_USER=root
   DB_PASS=
   ```

> **Note**: If your local MySQL setup has a password set for the `root` user, enter it in `DB_PASS`.

---

## Database Import

You can set up the database structure and initial seed data using either phpMyAdmin or the MySQL Command Line.

### Option A: Using phpMyAdmin (GUI)

1. Launch XAMPP Control Panel and start **Apache** and **MySQL**.
2. Open your web browser and navigate to `http://localhost/phpmyadmin`.
3. Click on the **SQL** tab in the top navigation bar.
4. Open `schema.sql` from `C:\xampp\htdocs\online-lost-and-found-system\schema.sql`, copy its content, paste it into the query window, and click **Go**.
5. Alternatively, click **Import**, select `schema.sql`, and click **Import**.

### Option B: Using MySQL CLI

Open Command Prompt or Terminal and execute:

```bash
cd C:\xampp\mysql\bin
mysql -u root -p < C:\xampp\htdocs\online-lost-and-found-system\schema.sql
```

This script creates the database `lost_and_found_db`, sets up tables (`users`, `items`, `claims`), configures foreign key constraints, indexes, and populates sample seed data.

---

## Directory Permissions

Ensure that the `uploads` folder is writable so user-uploaded item images can be stored properly:

- On Windows: Ensure `C:\xampp\htdocs\online-lost-and-found-system\uploads` is not set to Read-Only.
- On Linux/macOS: Run `chmod -R 775 uploads/` or ensure the web server service account (`www-data` / `apache`) has write access.

---

## First Login & Verification

1. Start Apache and MySQL in XAMPP Control Panel.
2. Open your browser and navigate to:
   ```
   http://localhost/online-lost-and-found-system/
   ```
3. Use the following default seeded credentials to log in:

### Administrator Account
- **Username**: `Kushsh29`
- **Email**: `admin@lostandfound.com`
- **Role**: `admin`
- **Access URL**: `http://localhost/online-lost-and-found-system/admin/dashboard.php`

### Sample Student Accounts
- **User 1**:
  - **Username**: `john_doe`
  - **Email**: `john@gla.ac.in`
  - **Role**: `user`
- **User 2**:
  - **Username**: `jane_smith`
  - **Email**: `jane@gla.ac.in`
  - **Role**: `user`

---

## Troubleshooting

- **Database Connection Error**: Verify MySQL is running in XAMPP and that `.env` credentials match your database instance.
- **404 Not Found**: Ensure the folder name inside `htdocs` is exactly `online-lost-and-found-system`.
- **Image Upload Failures**: Check that `uploads/` directory exists and has write permissions.
