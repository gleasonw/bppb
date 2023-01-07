package main

import (
	"encoding/json"
	"fmt"
	"github.com/joho/godotenv"
	"io"
	"net/http"
	"os"
	"time"
)

type ForecastPeriod struct {
	Number            int     `json:"number,omitempty"`
	Name              string  `json:"name,omitempty"`
	StartTime         string  `json:"startTime,omitempty"`
	EndTime           string  `json:"endTime,omitempty"`
	IsDaytime         bool    `json:"isDayTime,omitempty"`
	Temperature       int     `json:"temperature,omitempty"`
	TemperatureUnit   string  `json:"temperatureUnit,omitempty"`
	TemperatureTrend  string  `json:"temperatureTrend,omitempty"`
	WindSpeed         int     `json:"windSpeed,omitempty"`
	WindDirection     int     `json:"windDirection,omitempty"`
	Icon              string  `json:"icon,omitempty"`
	ShortForecast     string  `json:"shortForecast,omitempty"`
	PrecipitationProb float64 `json:"precipitationProbability,omitempty"`
	DetailedForecast  string  `json:"detailedForecast,omitempty"`
}

type ForecastBatch struct {
	Properties struct {
		Periods []ForecastPeriod `json:"periods,omitempty"`
	} `json:"properties,omitempty"`
}

func loopWeatherDataGet(weekChannel chan ForecastBatch, hourChannel chan ForecastBatch) {
	ticker := time.NewTicker(15 * time.Minute)
	var nwsWeekData ForecastBatch
	var nwsHourData ForecastBatch
	isRailway := os.Getenv("FORECAST_OWA")
	if isRailway == "" {
		err := godotenv.Load(".env")
		if err != nil {
			return
		}
	}
	nwsWeekData, nwsHourData = getWeather(os.Getenv("FORECAST_OWA"))
	for {
		select {
		case <-ticker.C:
			nwsWeekData, nwsHourData = getWeather(os.Getenv("FORECAST_OWA"))
		case weekChannel <- nwsWeekData:
			fmt.Println("Sent week data")
		case hourChannel <- nwsHourData:
			fmt.Println("Sent hour data")
		}
	}
}

func getWeather(url string) (week ForecastBatch, hour ForecastBatch) {
	resp, err := http.Get(url)
	if err != nil {
		fmt.Println(err)
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println(err)
	}
	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	current := data["current"].(map[string]interface{})
	hourly := data["hourly"].([]interface{})
	daily := data["daily"].([]interface{})
	if err != nil {
		fmt.Println(err)
	}
	hourPeriodArray := []ForecastPeriod{}
	for i := 0; i < 12; i++ {
		period := buildForecastPeriod(hourly[i].(map[string]interface{}), i)
		hourPeriodArray = append(hourPeriodArray, period)
	}
	weekPeriodArray := []ForecastPeriod{}
	currentPeriod := buildForecastPeriod(current, 0)
	weekPeriodArray = append(weekPeriodArray, currentPeriod)
	for i := 1; i < 8; i++ {
		period := buildForecastPeriod(daily[i].(map[string]interface{}), i)
		weekPeriodArray = append(weekPeriodArray, period)
	}
	week.Properties.Periods = weekPeriodArray
	hour.Properties.Periods = hourPeriodArray
	return week, hour
}

//TODO: map bad open weather icons to NWS icons

func buildForecastPeriod(period map[string]interface{}, index int) ForecastPeriod {
	weatherMeta := period["weather"].([]interface{})[0].(map[string]interface{})
	convertedTime := time.Unix(int64(period["dt"].(float64)), 0).In(time.FixedZone("PST", -28800))
	forecastPeriod := ForecastPeriod{}
	forecastPeriod.Number = index
	forecastPeriod.Name = convertedTime.Format("Monday")
	forecastPeriod.StartTime = convertedTime.Format("2006-01-02T15:04:05-07:00")
	if temp, ok := period["temp"].(float64); ok {
		forecastPeriod.Temperature = int(temp)
	} else {
		tempDayMeta := period["temp"].(map[string]interface{})
		forecastPeriod.Temperature = int(tempDayMeta["day"].(float64))
	}
	forecastPeriod.TemperatureUnit = "F"
	forecastPeriod.WindSpeed = int(period["wind_speed"].(float64))
	forecastPeriod.WindDirection = int(period["wind_deg"].(float64))
	iconCode := weatherMeta["icon"].(string)
	forecastPeriod.Icon = "https://openweathermap.org/img/wn/" + iconCode + ".png"
	forecastPeriod.ShortForecast = weatherMeta["main"].(string)
	if precip, ok := period["pop"].(float64); ok {
		forecastPeriod.PrecipitationProb = precip
	} else {
		forecastPeriod.PrecipitationProb = 0
	}
	forecastPeriod.DetailedForecast = weatherMeta["description"].(string)
	return forecastPeriod
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func main() {
	fmt.Println("Hello Railway")
	weekChannel := make(chan ForecastBatch)
	hourChannel := make(chan ForecastBatch)
	go loopWeatherDataGet(weekChannel, hourChannel)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		fmt.Fprintf(w, "Hello Railway")
	})

	http.HandleFunc("/weather/week", func(w http.ResponseWriter, r *http.Request) {
		getForecastAndJsonify(w, weekChannel)
	})

	http.HandleFunc("/weather/hour", func(w http.ResponseWriter, r *http.Request) {
		getForecastAndJsonify(w, hourChannel)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	listenPort := fmt.Sprintf(":%s", port)
	fmt.Println(listenPort)

	err := http.ListenAndServe(listenPort, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
}

func getForecastAndJsonify(w http.ResponseWriter, forecastChannel chan ForecastBatch) {
	enableCors(&w)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	err := json.NewEncoder(w).Encode(<-forecastChannel)
	if err != nil {
		fmt.Println(err)
	}
}
