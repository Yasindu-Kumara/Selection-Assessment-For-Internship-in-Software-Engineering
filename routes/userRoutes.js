import { Express } from "express";
import { Router } from "express";
const User = require("./models/User");

Router.post("/users", async (req, res) => {
  try {
    const { email, location } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "user already exists with this email address" });
    }

    const newUser = new User({ email, location });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (error) {
    console.log("error creating user:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

Router.put("/users/:userId/location", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { location } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    const weatherData = await fetchWeather(location);

    user.location = location;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log("error updating user location", error);
    res.status(500).json({ error: "internal server error" });
  }
});

Router.get("/users/:userId/weather/:date", async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = new Date(req.params.date);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const weatherData = user.weatherData.find((data) =>
      isSameDate(data.date, date)
    );

    if (!weatherData) {
      return res
        .status(404)
        .json({ error: "Weather data not found for the given date" });
    }

    res.status(200).json(weatherData);
  } catch (error) {
    console.error("error retrieving weather data:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

async function fetchWeather(location) {
    const apiKey = 'd718d981f62a74bf47c8626b72982c4d';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
    );
    return response.data;
  }
  

export default Router;
