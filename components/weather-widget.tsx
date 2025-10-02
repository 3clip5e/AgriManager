import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Droplets, Wind } from "lucide-react"

interface WeatherData {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  conditions: string
  forecast: Array<{
    date: string
    temp: number
    conditions: string
  }>
}

interface WeatherWidgetProps {
  weather: WeatherData
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getWeatherIcon(weather.conditions)}
          <span className="ml-2">Météo Aujourd'hui</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Météo actuelle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{weather.conditions}</p>
            </div>
          </div>

          {/* Détails météo */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <Droplets className="h-4 w-4 text-blue-500 mr-1" />
              <span>{weather.humidity}% Humidité</span>
            </div>
            <div className="flex items-center">
              <CloudRain className="h-4 w-4 text-blue-600 mr-1" />
              <span>{weather.rainfall}mm Précipitations</span>
            </div>
            <div className="flex items-center">
              <Wind className="h-4 w-4 text-gray-500 mr-1" />
              <span>{weather.windSpeed} km/h Vent</span>
            </div>
          </div>

          {/* Prévisions sur 3 jours */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Prévisions sur 3 jours</h4>
            <div className="space-y-1">
              {weather.forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{day.date}</span>
                  <div className="flex items-center">
                    {getWeatherIcon(day.conditions)}
                    <span className="ml-2">{day.temp}°C</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
