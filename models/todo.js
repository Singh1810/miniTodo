import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    title: String,
    task: String,
    userId: String
})

const todoModel = mongoose.model('todo', todoSchema);
export default todoModel;