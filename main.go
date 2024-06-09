package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"text/template"
	"time"

	"github.com/joho/godotenv"
)

type Weather struct {
	ID          int    `json:"id"`
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

type Current struct {
	DT        int64     `json:"dt"`
	Temp      float64   `json:"temp"`
	FeelsLike float64   `json:"feels_like"`
	DewPoint  float64   `json:"dew_point"`
	UVI       float64   `json:"uvi"`
	WindSpeed float64   `json:"wind_speed"`
	Weather   []Weather `json:"weather"`
}

type Hourly struct {
	DT        int64     `json:"dt"`
	Temp      float64   `json:"temp"`
	FeelsLike float64   `json:"feels_like"`
	DewPoint  float64   `json:"dew_point"`
	UVI       float64   `json:"uvi"`
	WindSpeed float64   `json:"wind_speed"`
	WindGust  float64   `json:"wind_gust"`
	Weather   []Weather `json:"weather"`
	Pop       float64   `json:"pop"`
}

type Temp struct {
	Day   float64 `json:"day"`
	Min   float64 `json:"min"`
	Max   float64 `json:"max"`
	Night float64 `json:"night"`
	Eve   float64 `json:"eve"`
	Morn  float64 `json:"morn"`
}

type FeelsLike struct {
	Day   float64 `json:"day"`
	Night float64 `json:"night"`
	Eve   float64 `json:"eve"`
	Morn  float64 `json:"morn"`
}

type Daily struct {
	DT        int64     `json:"dt"`
	Sunrise   int64     `json:"sunrise"`
	Sunset    int64     `json:"sunset"`
	Moonrise  int64     `json:"moonrise"`
	Moonset   int64     `json:"moonset"`
	MoonPhase float64   `json:"moon_phase"`
	Summary   string    `json:"summary"`
	Temp      Temp      `json:"temp"`
	FeelsLike FeelsLike `json:"feels_like"`
	Pressure  int       `json:"pressure"`
	Humidity  int       `json:"humidity"`
	DewPoint  float64   `json:"dew_point"`
	WindSpeed float64   `json:"wind_speed"`
	WindDeg   int       `json:"wind_deg"`
	WindGust  float64   `json:"wind_gust"`
	Weather   []Weather `json:"weather"`
	Clouds    int       `json:"clouds"`
	Pop       float64   `json:"pop"`
	UVI       float64   `json:"uvi"`
	Rain      float64   `json:"rain,omitempty"`
}

type WeatherData struct {
	Lat            float64  `json:"lat"`
	Lon            float64  `json:"lon"`
	Timezone       string   `json:"timezone"`
	TimezoneOffset int      `json:"timezone_offset"`
	Current        Current  `json:"current"`
	Hourly         []Hourly `json:"hourly"`
	Daily          []Daily  `json:"daily"`
}

func loopImageGet(imageChannel chan []byte) {
	ticker := time.NewTicker(2 * time.Minute)

	image, err := fetchDriveImage()

	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		select {
		case <-ticker.C:
			image, err = fetchDriveImage()

			if err != nil {
				fmt.Println(err)
				return
			}

		case imageChannel <- image:
			fmt.Println("Sent image")
		}
	}
}

// query openweather api every 15 minutes
func loopWeatherDataGet(weatherChannel chan PersistedWeather) {
	ticker := time.NewTicker(15 * time.Minute)

	persistedWeather, err := getOpenWeather()

	if err != nil {
		fmt.Println("error getting initial weather data, " + err.Error())
		return
	}

	weatherChannel <- persistedWeather

	for {
		select {
		case <-ticker.C:
			persistedWeather, err = getOpenWeather()

			if err != nil {
				fmt.Println(err)
				return
			}
		case weatherChannel <- persistedWeather:
			fmt.Println("Sent weather data")
		}
	}
}

type OpenWeatherResponse = http.Response

type PersistedWeather = WeatherData

func getOpenWeather() (PersistedWeather, error) {

	url := os.Getenv("FORECAST_OWA")

	if url == "" {
		// running locally
		err := godotenv.Load(".env")
		if err != nil {
			fmt.Println("error loading .env file, " + err.Error())
			return PersistedWeather{}, err
		}

		url = os.Getenv("FORECAST_OWA")
	}

	retries := 3
	resp := &http.Response{}
	err := error(nil)

	for retries > 0 {
		resp, err = http.Get(url)

		if err != nil {
			fmt.Println("error making weather request, " + err.Error())
			time.Sleep(5 * time.Second)
			retries--
			continue
		} else {
			break
		}
	}

	if resp == nil {
		fmt.Println("exceeded max retries on weather request")
		return PersistedWeather{}, err
	}

	defer resp.Body.Close()

	weatherBody, err := io.ReadAll(resp.Body)

	if err != nil {
		fmt.Println(err)
		return PersistedWeather{}, err
	}

	weatherData := WeatherData{}

	err = json.Unmarshal(weatherBody, &weatherData)

	if err != nil {
		fmt.Println(err)
		return PersistedWeather{}, err
	}

	return weatherData, nil

}

func fetchDriveImage() ([]byte, error) {
	retries := 3
	resp := &http.Response{}
	err := error(nil)

	for retries > 0 {
		resp, err = http.Get("https://drive.google.com/uc?export=view&id=19wUlMTJDHE1tHuxpYLkgvx1OI4Omr9ye")

		if err != nil {
			fmt.Println("error fetching image, " + err.Error())
			time.Sleep(5 * time.Second)
			retries--
			continue
		} else {
			break
		}
	}

	if resp == nil {
		fmt.Println("retries exceeded on image fetch")
		return nil, err
	}

	defer resp.Body.Close()

	image, err := io.ReadAll(resp.Body)

	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return image, nil

}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

type WeatherPageData struct {
	Title   string
	Message string
	Weather PersistedWeather
}

func indexHandler(w http.ResponseWriter, weatherChan chan PersistedWeather) {
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	weatherData := <-weatherChan

	// slice hourly data to only the next 10 hours, after the current hour

	weatherData.Hourly = weatherData.Hourly[1:11]

	// Create an instance of PageData with the data to be passed to the template
	data := WeatherPageData{
		Title:   "bppb",
		Weather: weatherData,
	}

	// Execute the template with the data
	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func main() {
	fmt.Println("Hello Railway")
	imageChannel := make(chan []byte)
	weatherChannel := make(chan PersistedWeather)

	go loopWeatherDataGet(weatherChannel)
	go loopImageGet(imageChannel)

	// serve static css
	http.Handle("/static/css/", http.StripPrefix("/static/css/", http.FileServer(http.Dir("static/css"))))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		indexHandler(w, weatherChannel)
	})

	http.HandleFunc("/court", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "image/png")
		w.WriteHeader(http.StatusOK)

		_, err := w.Write(<-imageChannel)
		if err != nil {
			fmt.Println(err)
		}
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
