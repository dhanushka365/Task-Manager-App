// MongoDB initialization script
db = db.getSiblingDB('taskmanager');

// Create collections
db.createCollection('users');
db.createCollection('tasks');

// Create indexes
db.users.createIndex({ "username": 1 }, { unique: true });
db.tasks.createIndex({ "userId": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "createdAt": 1 });

// Insert sample data (optional)
db.users.insertOne({
    "username": "admin",
    "password": "$2a$10$DowJonesIndex123456789012345678901234567890", // This would be bcrypt hashed
    "createdAt": new Date()
});

print("TaskManager database initialized successfully!");
