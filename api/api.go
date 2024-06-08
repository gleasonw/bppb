package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

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

type PersistedWeather = struct {
	WeatherBody []byte
	Headers     http.Header
}

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

	return PersistedWeather{WeatherBody: weatherBody, Headers: resp.Header}, nil

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

func main() {
	fmt.Println("Hello Railway")
	imageChannel := make(chan []byte)
	weatherChannel := make(chan PersistedWeather)

	go loopWeatherDataGet(weatherChannel)
	go loopImageGet(imageChannel)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		fmt.Fprintf(w, "Hello Railway")
	})

	http.HandleFunc("/weather", func(w http.ResponseWriter, r *http.Request) {
		latestResponse := <-weatherChannel

		for name, headers := range latestResponse.Headers {
			for _, h := range headers {
				w.Header().Add(name, h)
			}
		}

		w.Write(latestResponse.WeatherBody)

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
