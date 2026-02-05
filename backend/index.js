import express from 'express';
import cors from 'cors';
import todoRoutes from './routes/todos.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});