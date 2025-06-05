// MongoDB initialization script for Task Manager Application
db = db.getSiblingDB('taskmanager');

// Create users collection with schema validation
db.createCollection('users', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "password", "createdAt"],
         properties: {
            username: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            password: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            email: {
               bsonType: "string",
               pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
               description: "must be a valid email format if provided"
            },
            createdAt: {
               bsonType: "date",
               description: "must be a date and is required"
            },
            updatedAt: {
               bsonType: "date",
               description: "must be a date if provided"
            }
         }
      }
   }
});

// Create tasks collection with schema validation
db.createCollection('tasks', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["title", "userId", "status", "createdAt"],
         properties: {
            title: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            description: {
               bsonType: "string",
               description: "must be a string if provided"
            },
            userId: {
               bsonType: "objectId",
               description: "must be an ObjectId and is required"
            },
            status: {
               bsonType: "string",
               enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
               description: "must be a valid status and is required"
            },
            priority: {
               bsonType: "string",
               enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
               description: "must be a valid priority if provided"
            },
            dueDate: {
               bsonType: "date",
               description: "must be a date if provided"
            },
            createdAt: {
               bsonType: "date",
               description: "must be a date and is required"
            },
            updatedAt: {
               bsonType: "date",
               description: "must be a date if provided"
            }
         }
      }
   }
});

// Create indexes for performance optimization
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "createdAt": 1 });

db.tasks.createIndex({ "userId": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "priority": 1 });
db.tasks.createIndex({ "createdAt": 1 });
db.tasks.createIndex({ "dueDate": 1 });
db.tasks.createIndex({ "userId": 1, "status": 1 });
db.tasks.createIndex({ "userId": 1, "createdAt": -1 });

// Insert sample admin user (password should be bcrypt hashed in production)
db.users.insertOne({
    "username": "admin",
    "password": "$2a$10$DowJonesIndex123456789012345678901234567890", // Replace with actual bcrypt hash
    "email": "admin@taskmanager.com",
    "createdAt": new Date(),
    "updatedAt": new Date()
});

// Insert sample tasks for demonstration
var adminUser = db.users.findOne({"username": "admin"});
if (adminUser) {
    db.tasks.insertMany([
        {
            "title": "Welcome to Task Manager",
            "description": "This is your first task. You can edit or delete it.",
            "userId": adminUser._id,
            "status": "PENDING",
            "priority": "MEDIUM",
            "createdAt": new Date(),
            "updatedAt": new Date()
        },
        {
            "title": "Set up your profile",
            "description": "Complete your profile information",
            "userId": adminUser._id,
            "status": "IN_PROGRESS",
            "priority": "HIGH",
            "dueDate": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            "createdAt": new Date(),
            "updatedAt": new Date()
        }
    ]);
}

print("TaskManager database initialized successfully!");
print("Collections created: users, tasks");
print("Indexes created for performance optimization");
print("Sample data inserted");
