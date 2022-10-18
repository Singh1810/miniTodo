import UserModel from "../models/user.js"
import todoModel from "../models/todo.js"

class UserController {
    static home = (req, res) => {
        res.render("index")
    }

    static registration = (req, res) => {
        res.render("registration")
    }

    static add = (req, res) => {
        const taskdata = {
            title: req.body.title,
            task: req.body.task
        }
        let data = todoModel(taskdata);
        data.save(function (err) {
            if (err) {
                res.render('add', { message: 'Task not added' });
            } else {
                res.render('add', { message: 'Task added successfully' });
            }
        });
    }

    static addTask = (req, res) => {
        res.render('add');
    }

    static display = (req, res) => {
        todoModel.find(function (err, todo) {
            if (err) {
                console.log(err);
            } else {
                res.render('display', { todo: todo });

            } 
        });
    }

    static delete = (req, res) => {
        todoModel.findByIdAndRemove(req.params.id, function (err, project) {
            if (err) {
                res.redirect('/display');
            } else {
                res.redirect('/display');
            }
        });
    }

    static edit = (req, res) => {
        console.log(req.params.id);
        todoModel.findById(req.params.id, function (err, user) {
            if (err) {
                console.log(err);
            } else {
                res.render('edit', { userDetail: user });
            }
        });

    }

    static editTask = (req, res) => {
        todoModel.findByIdAndUpdate(req.params.id, req.body, function (err) {
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

    static createUserDoc = async (req, res) => {
        try {
            const doc = new UserModel({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            await doc.save()
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    }

    static login = (req, res) => {
        res.render("login")
    }

    static verifyLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            const result = await UserModel.findOne({ email: email })
            if (result != null) {
                if (result.email == email && result.password == password) {
                    res.render('dashboard')
                } else {
                    res.send("<h1> Email or password is not valid</h1>")
                }
            } else {
                res.send("<h1>You are no register</h1>")
            }
        } catch (error) {
            console.log(error)
        }
    }

}

export default UserController;