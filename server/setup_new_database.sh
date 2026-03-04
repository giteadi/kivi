#!/bin/bash

# KiviCare Database Setup Script
echo "Setting up KiviCare Database..."

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed or not in PATH"
    exit 1
fi

# Database credentials (update these as needed)
DB_USER="root"
DB_PASSWORD=""
DB_HOST="localhost"

echo "Step 1: Creating new database schema..."
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST < config/new_database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema created successfully"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

echo "Step 2: Inserting seed data..."
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST < config/seed_mindsaid_data.sql

if [ $? -eq 0 ]; then
    echo "✅ Seed data inserted successfully"
else
    echo "❌ Failed to insert seed data"
    exit 1
fi

echo "Step 3: Verifying database setup..."
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -e "USE kivi; SHOW TABLES;"

echo ""
echo "🎉 KiviCare Database setup completed successfully!"
echo ""
echo "Database Details:"
echo "- Database Name: kivi"
echo "- Total Tables: 12"
echo "- Sample Data: Included"
echo ""
echo "Default Login Credentials:"
echo "- Email: admin@kivicare.com"
echo "- Password: admin123"
echo ""
echo "You can now start the server with: npm run dev"