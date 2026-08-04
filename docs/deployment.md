# Deployment Guide

This document outlines the deployment configurations for the University Online Lost and Found System, covering both the current local XAMPP environment and future production considerations.

---

## Localhost Deployment (XAMPP Setup)

### Environment Directory Structure

In a standard XAMPP setup on Windows, the application resides inside Apache's document root directory:

```
C:\xampp\htdocs\online-lost-and-found-system\
├── admin\                # Administrative panel pages & actions
├── css\                  # Cascading Style Sheets (main.css)
├── docs\                 # System documentation
├── includes\             # Shared layout components (header, footer, nav)
├── js\                   # JavaScript scripts (main.js)
├── uploads\              # Uploaded item photo storage directory
├── .env                  # Local environment configuration
├── auth.php              # Authentication & session helpers
├── db.php                # Database PDO initialization
├── index.php             # Main portal landing & search page
├── item-details.php      # Detailed item view & claim submission
├── login.php             # User login endpoint
├── logout.php            # Session termination endpoint
├── register.php          # Account registration endpoint
├── report.php            # Lost/Found item reporting form
└── schema.sql            # MySQL schema and initial dataset
```

### Starting the Local Server

1. Open **XAMPP Control Panel**.
2. Start the **Apache** service (default HTTP port: `80` or `8080`).
3. Start the **MySQL** service (default MySQL port: `3306`).
4. Access the web portal at `http://localhost/online-lost-and-found-system/`.

---

## Apache Configuration Basics

### 1. Document Root & Virtual Host Setup (Optional)

To serve the project from a custom domain like `http://lostandfound.gla.local` locally:

1. Open `C:\xampp\apache\conf\extra\httpd-vhosts.conf` and append:

   ```apache
   <VirtualHost *:80>
       ServerAdmin admin@gla.ac.in
       DocumentRoot "C:/xampp/htdocs/online-lost-and-found-system"
       ServerName lostandfound.gla.local
       ErrorLog "logs/lostandfound-error.log"
       CustomLog "logs/lostandfound-access.log" combined

       <Directory "C:/xampp/htdocs/online-lost-and-found-system">
           Options Indexes FollowSymLinks MultiViews
           AllowOverride All
           Require all granted
       </Directory>
   </VirtualHost>
   ```

2. Edit your system `hosts` file (`C:\Windows\System32\drivers\etc\hosts` as Administrator) and add:
   ```
   127.0.0.1 lostandfound.gla.local
   ```
3. Restart Apache via XAMPP Control Panel.

### 2. Basic .htaccess Rules

Create or modify `.htaccess` in the root directory for security hardening and custom routing:

```apache
# Disable Directory Browsing
Options -Indexes

# Set Default Directory Index
DirectoryIndex index.php

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Production Deployment Considerations (Future Implementation)

While the system is currently deployed locally on XAMPP for campus usage, deploying to a production server (such as Ubuntu 22.04 LTS with Apache/Nginx and MySQL) requires the following enhancements:

### 1. Environment & Database Security

- **Strict Environment Variables**: Move `.env` outside the public web root directory or restrict direct web access to `.env` files via Apache configuration.
- **Dedicated Database User**: Replace the default `root` user with a restricted MySQL user possessing `SELECT`, `INSERT`, `UPDATE`, and `DELETE` privileges on `lost_and_found_db` only.
- **Connection Encrypting**: Configure MySQL to enforce TLS/SSL encrypted database connections.

### 2. HTTPS & SSL Certificates

- Obtain a free SSL certificate via Let's Encrypt using Certbot or use University's wildcard SSL certificate.
- Enforce HTTPS redirection in Apache or Nginx config so all traffic is encrypted over port 443.

### 3. PHP Configuration Hardening (`php.ini`)

In a production environment, modify your `php.ini` file:

```ini
; Disable displaying error details to end users
display_errors = Off
display_startup_errors = Off
log_errors = On
error_log = /var/log/php/lost_and_found_errors.log

; Session Security Settings
session.cookie_httponly = 1
session.cookie_secure = 1
session.use_only_cookies = 1
session.cookie_samesite = Strict

; File Upload Safeguards
file_uploads = On
upload_max_filesize = 5M
post_max_size = 8M
```

### 4. Upload Directory Protection

- Prevent execution of uploaded PHP scripts inside the `uploads/` directory by placing a `.htaccess` file inside `uploads/`:

  ```apache
  # Prevent script execution in uploads directory
  <FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|cgi)$">
      Require all denied
  </FilesMatch>
  ```

### 5. Automated Backups & Monitoring

- **Database Backup**: Set up a daily cron job using `mysqldump` to archive `lost_and_found_db` automatically.
- **Log Auditing**: Implement log monitoring for error tracking and unauthorized access attempts.
