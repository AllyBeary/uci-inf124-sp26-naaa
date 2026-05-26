// run $ npx ts-node api/mongo-db/crud-ex.ts

import "./env";
import { connectDB } from "./client";
import { User } from "./user.model";

async function runCRUD() {
  await connectDB();

  // CREATE
  const createdUser = await User.create({
    name: "Jane Doe",
    email: "jdoe@example.com",
  });

  console.log("CREATE:");
  console.log(createdUser);

  // READ
  const users = await User.find();

  console.log("\nREAD:");
  console.log(users);

  // UPDATE
  const updatedUser = await User.findOneAndUpdate(
    { email: "jdoe@example.com" },
    { name: "John Doe" },
    { returnDocument: "after" }
  );

  console.log("\nUPDATE:");
  console.log(updatedUser);

  // DELETE
  const deletedUser = await User.findOneAndDelete({
    email: "jdoe@example.com",
  });

  console.log("\nDELETE:");
  console.log(deletedUser);

  process.exit(0);
}

runCRUD().catch((err) => {
  console.error(err);
  process.exit(1);
});