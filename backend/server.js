const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
// Middleware
app.use(cors());
app.use(express.json());

mongoose
 .connect("mongodb://truongvietban:abc123456@ac-ps11rqd-shard-00-00.swyods2.mongodb.net:27017,ac-ps11rqd-shard-00-01.swyods2.mongodb.net:27017,ac-ps11rqd-shard-00-02.swyods2.mongodb.net:27017/?ssl=true&replicaSet=atlas-12a7kc-shard-0&authSource=admin&appName=Cluster0")
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.error("MongoDB Error:", err));
// TODO: Tạo Schema
const UserSchema = new mongoose.Schema({
 name: {
 type: String,
 required: [true, 'Tên không được để trống'],
 minlength: [2, 'Tên phải có ít nhất 2 ký tự']
 },
 age: {
 type: Number,
 required: [true, 'Tuổi không được để trống'],
 min: [0, 'Tuổi phải >= 0']
 },
 email: {
 type: String,
 required: [true, 'Email không được để trống'],
 match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
 },
 address: {
 type: String
 }
});

const User = mongoose.model("User", UserSchema);
// Start server
app.listen(3001, () => {
 console.log("Server running on http://localhost:3001");
});
app.get("/api/users", async (req, res) => {
 try {
 // Query database
 const users = await User.find();
 // Đếm tổng số documents
 const total = await User.countDocuments();
 // Trả về response
 res.json({
 total,
 data: users
 });
 } catch (err) {
 res.status(500).json({ error: err.message });
 }
});
app.post("/api/users", async (req, res) => {
 try {
 const { name, age, email, address } = req.body;

 // Tạo user mới
 const newUser = await User.create({ name, age, email, address });
 res.status(201).json({
 message: "Tạo người dùng thành công",
 data: newUser
 });
 } catch (err) {
 res.status(400).json({ error: "email đã tồn tại" });
 }
});
app.put("/api/users/:id", async (req, res) => {
 try {
 const { id } = req.params;
 const { name, age, email, address } = req.body;
 const updatedUser = await User.findByIdAndUpdate(
 id,
 { name, age, email, address },
{ new: true, runValidators: true } // Quan trọng
 );
 if (!updatedUser) {
 return res.status(404).json({ error: "Không tìm thấy người dùng" });
 }
 res.json({
 message: "Cập nhật người dùng thành công",
 data: updatedUser
 });
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
});
app.delete("/api/users/:id", async (req, res) => {
 try {
 const { id } = req.params;
 const deletedUser = await User.findByIdAndDelete(id);
 if (!deletedUser) {
 return res.status(404).json({ error: "Không tìm thấy người dùng" });
 }
 res.json({ message: "Xóa người dùng thành công" });
 } catch (err) {
 res.status(400).json({ error: err.message });
 }
});