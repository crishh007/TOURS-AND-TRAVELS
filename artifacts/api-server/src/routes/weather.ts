import { Router } from "express";
import { GetWeatherParams } from "@workspace/api-zod";

const router = Router();

const WEATHER_DATA: Record<string, { temperature: number; condition: string; humidity: number; windSpeed: number }> = {
  goa: { temperature: 28, condition: "Sunny with sea breeze", humidity: 72, windSpeed: 18 },
  kerala: { temperature: 30, condition: "Warm and humid", humidity: 80, windSpeed: 12 },
  rajasthan: { temperature: 32, condition: "Hot and dry", humidity: 25, windSpeed: 22 },
  jaipur: { temperature: 31, condition: "Partly cloudy", humidity: 30, windSpeed: 15 },
  udaipur: { temperature: 29, condition: "Clear skies", humidity: 35, windSpeed: 10 },
  jaisalmer: { temperature: 35, condition: "Sunny and dry", humidity: 18, windSpeed: 20 },
  ladakh: { temperature: 8, condition: "Cold and clear", humidity: 30, windSpeed: 25 },
  manali: { temperature: 12, condition: "Cool with snow peaks", humidity: 55, windSpeed: 15 },
  shimla: { temperature: 15, condition: "Pleasant and cool", humidity: 60, windSpeed: 12 },
  darjeeling: { temperature: 14, condition: "Misty and cool", humidity: 70, windSpeed: 10 },
  varanasi: { temperature: 27, condition: "Warm and hazy", humidity: 60, windSpeed: 8 },
  agra: { temperature: 30, condition: "Sunny", humidity: 45, windSpeed: 12 },
  delhi: { temperature: 28, condition: "Partly cloudy", humidity: 50, windSpeed: 15 },
  mumbai: { temperature: 31, condition: "Humid and warm", humidity: 78, windSpeed: 20 },
  kolkata: { temperature: 29, condition: "Humid", humidity: 75, windSpeed: 12 },
  andaman: { temperature: 28, condition: "Tropical and sunny", humidity: 80, windSpeed: 18 },
  default: { temperature: 28, condition: "Partly cloudy", humidity: 60, windSpeed: 15 },
};

const CONDITIONS = ["Sunny", "Partly cloudy", "Clear skies", "Light clouds", "Warm and pleasant"];

router.get("/weather/:destination", async (req, res) => {
  const parsed = GetWeatherParams.safeParse({ destination: req.params.destination });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid destination" });
    return;
  }

  const key = parsed.data.destination.toLowerCase();
  const base = WEATHER_DATA[key] || WEATHER_DATA.default;

  const forecast = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const variance = Math.floor(Math.random() * 4) - 2;
    return {
      date: date.toISOString().split("T")[0],
      high: base.temperature + 2 + variance,
      low: base.temperature - 5 + variance,
      condition: CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)],
    };
  });

  res.json({
    destination: parsed.data.destination,
    temperature: base.temperature,
    condition: base.condition,
    humidity: base.humidity,
    windSpeed: base.windSpeed,
    feelsLike: base.temperature - 2,
    forecast,
  });
});

export default router;
