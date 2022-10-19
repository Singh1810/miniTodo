import UserModel from "../models/user.js"
import todoModel from "../models/todo.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const SECRET_KEY = "TODOAPP";


class UserController {
    static home = (req, res) => {
        res.render("index")
    }

    static registration = (req, res) => {
        res.render("registration")
    }

    static createUserDoc = async (req, res) => {
        const {name, email, password} = req.body;
        try {
            const existingUser = await UserModel.findOne({email : email});
            if (existingUser){
                return res.status(400).send({message: "User already exists"});
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const doc = await UserModel.create({
                name: name,
                email: email,
                password: hashedPassword
            });
            
            const token = jwt.sign({ email: doc.email, id: doc._id }, SECRET_KEY, { expiresIn: '1800s' });
            res.cookie('token', token);

            await doc.save()
            res.redirect('/login')

        } catch (error) {
            console.log(error);
            res.status(500).send({message: "Something went wrong"});
        }
    }

    static login = (req, res) => {
        res.render("login")
    }

    static verifyLogin = async (req, res) => {
        const { email, password } = req.body;
        try {
            const existingUser = await UserModel.findOne({ email: email })
            if (!existingUser) {
                return res.status(404).send({ message: "User  not found" });
            } 
            const matchPassword = await bcrypt.compare(password, existingUser.password);
            res.render('dashboard');
            if(!matchPassword){
                return res.status(400).send({ message : "Invalid Credentials" });
            }
            const token = jwt.sign({email: existingUser.email, id: existingUser._id}, SECRET_KEY, { expiresIn: '1800s' });
            res.cookie('token', token);
        } catch (error) {
            console.log(error)
        }
    }

    static addTask = (req, res) => {
        res.render('add');
    }
    static add = (req, res) => {
        const taskdata = {
            title: req.body.title,
            task: req.body.task
        }
        let data = todoModel(taskdata);
        data.save((err) => {
            if (err) {
                res.send( { message: 'Task not added' });
            } else {
                res.render('add', { message: 'Task added successfully' });
            }
        });
    }

    static display = (req, res) => {
        todoModel.find((err, todo) => {
            if (err) {
                console.log(err);
            } else {
                res.render('display', { todo: todo });

            } 
        });
    }

    static delete = (req, res) => {
        todoModel.findByIdAndRemove(req.params.id, (err) => {
            if (err) {
                res.redirect('/display');
            } else {
                res.redirect('/display');
            }
        });
    }

    static edit = (req, res) => {
        console.log(req.params.id);
        todoModel.findById(req.params.id, (err, user) => {
            if (err) {
                console.log(err);
            } else {
                res.render('edit', { userDetail: user });
            }
        });

    }

    static editTask = (req, res) => {
        todoModel.findByIdAndUpdate(req.params.id, req.body, (err) => {
            if (err) {
                res.redirect('edit/' + req.params.id);
            } else {
                res.redirect('/display');
            }
        });
    }

    static search = (req, res) => {   
        todoModel.find({
            $or: [
                { title: { $regex: req.query.search } },
                { task: { $regex: req.query.search } }]
        }, (err, todo) => {
            if (err) {
                console.log(err);
            } else {
                res.render('display', { todo: todo });
            } 
        });
    }
}

export default UserController;