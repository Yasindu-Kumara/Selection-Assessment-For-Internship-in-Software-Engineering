import { Express } from "express";
import mongoose from "mongoose";
const userRoutes = require('./routes/userRoutes');

const app = Express();

app.use(Express.json());

mongoose.connect('',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api', userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server is running on port ${port}');
});