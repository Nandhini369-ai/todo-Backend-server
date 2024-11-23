import exp from "express"
import dot from "dotenv"
import mon from "mongoose"
import cors from "cors"
import nodemon from "nodemon"

const app = exp()
dot.config();
app.use(exp.json())
app.use(cors())

const tschema = new mon.Schema({
    title : {
        type:String
    },
    description: String
});

const todoCollection = mon.model('todo', tschema);

app.post('/todos', async (req, res) => {
    const data = {
        title: req.body.title,
        description: req.body.description
    };

    try {
        const newTodo = new todoCollection(data);
        await newTodo.save();
        res.status(200).json({ message: "Todo added successfully", todo: newTodo });
    } catch (err) {
        res.status(400).json({ message: "Add failed", error: err.message });
    }
});


const middleware = (req, res, next) => {
    if (true) {  
        next();  
    } else {
        res.status(400).json("Invalid user");
    }
};

app.get('/todos', middleware, async (req, res) => {
    try {
        const data = await todoCollection.find({});
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({ message: "Get failed", error: err.message });
    }
});

app.put('/todos/:id', async (req, res) => {
    try {
        const entry = await todoCollection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(entry);
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
});

app.delete('/todos/:id', async (req, res) => {
    try {
        await todoCollection.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: `Deleted ${req.params.id} successfully` });
    } catch (err) {
        res.status(400).json({ message: "Delete failed", error: err.message });
    }
});


const connect = async () => {
    try {
        await mon.connect(process.env.MONGO);
        console.log("Connection to DB successfull");
    } catch(err) {
        console.log("Error while connecting to DB:", err);
    }
}




// Start the http server
app.listen(process.env.PORT, () => {
    connect();
    console.log("Server is running...");
})