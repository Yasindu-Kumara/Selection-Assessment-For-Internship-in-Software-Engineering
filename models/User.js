import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    location: { type: String, required: ture},
    weatherData: [{ date: Date, temperature: Number, description: String}],

});

const User = mongoose.model('User', userSchema);

export default User;