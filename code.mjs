import { MongoClient } from "mongodb";
import bcryptjs from "bcryptjs";

const uri = "mongodb+srv://shovitdutta1:18LrwZeYfh7GWXDL@sizzlenspice.wjfvqqs.mongodb.net/?retryWrites=true&w=majority&appName=SizzleNSpice";
async function createTestingAdmin() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();
    const adminsCollection = db.collection("admins");
    const existingAdmin = await adminsCollection.findOne({ email: "yt-dlx@proton.me" });
    if (existingAdmin) {
      console.log("Testing admin already exists");
      return;
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("proton", salt);
    const adminDoc = {
      password: hashedPassword,
      email: "yt-dlx@proton.me",
      name: "Test Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await adminsCollection.insertOne(adminDoc);
    console.log(`Testing admin created with id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error creating testing admin:", error);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

createTestingAdmin();
