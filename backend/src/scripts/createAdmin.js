const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("Error: MONGO_URI is not set in backend/.env file");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const email = (process.argv[2] || "admin@example.com").toLowerCase().trim();
    const password = process.argv[3] || "admin123";
    const name = process.argv[4] || "Admin User";

    let user = await User.findOne({ email });

    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`\n✅ Success: Existing user '${email}' has been promoted to 'admin' role!`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`\n✅ Success: New Admin user created!`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  }
};

createAdmin();
