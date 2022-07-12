import React, { useEffect } from "react";
import "./racktempanimate.css";
import axios from "axios";
import $ from 'jquery'

export default function RackTempAnimation({ rackID }) {
    useEffect(() => {
        main();
        details();
    }, []);

    // adds the correct css classes required to expand the pill and reveal the forecast
    const handlePillExpand = () => {
        const pill = document.querySelector(".pill-container");
        const currentWeather = document.querySelector(".current-weather");
        const weatherForecast = document.querySelector(
            ".weather-forecast-container"
        );

        pill.classList.add("pill-container--expanded");
        currentWeather.classList.add("current-weather--hidden");
        weatherForecast.classList.add("weather-forecast--show");
    };

    // adds the correct css classes required to contract the pill and reveal the current weather
    const handlePillContract = () => {
        const pill = document.querySelector(".pill-container");
        const currentWeather = document.querySelector(".current-weather");
        const weatherForecast = document.querySelector(
            ".weather-forecast-container"
        );

        pill.classList.remove("pill-container--expanded");
        currentWeather.classList.remove("current-weather--hidden");
        weatherForecast.classList.remove("weather-forecast--show");
    };

    // main function that runs on window load and calls everything necessary
    const main = () => {
        const pillContainer = document.querySelector(".pill-container");
        pillContainer.addEventListener("mouseenter", handlePillExpand);
        pillContainer.addEventListener("mouseleave", handlePillContract);
    };

    const details = () => {
        $("#mintemp").text("0.00°C");
        $("#maxtemp").text("0.00°C");
        $("#avgtemp").text("0.00°C");
        $("#tempavg").text("0.00°C");
        axios({ method: "GET", url: "/api/thermal/racktracking?rackid=" + rackID })
            .then((response) => {
                console.log('tempanimate', response)
                let data = response.data;
                if (data.length !== 0) {
                    $("#mintemp").text(data.mintemp.toFixed(2) + "°C");
                    $("#maxtemp").text(data.maxtemp.toFixed(2) + "°C");
                    $("#avgtemp").text(data.avgtemp.toFixed(2) + "°C");
                    $("#tempavg").text(data.avgtemp.toFixed(2) + "°C ");
                }
            })
            .catch((error => {
                console.log("ERROR---->", error);
                if (error.response.status === 403) {
                    $("#displayModal").css("display", "block");
                }
            }))
    }

    return (
        <div className="main-container">
            <div className="header-container">
                <div className="pill-container">
                    <div className="current-weather">
                        <img id='tempimg'
                            style={{ width: '50px', marginLeft: '23px' }}
                            alt=""
                            className="current-weather__icon"
                            src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg"
                        />
                        <p className="current-weather__temp" id='tempavg'>
                            <span style={{ fontSize: "15px", color: '#00629B' }}>
                            </span>
                        </p>
                    </div>
                    <div className="weather-forecast-container">
                        <div className="weather-forecast">
                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date"
                                    style={{ color: '#00629B' }}>Min
                                </p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/rainy-2.svg"
                                />
                                <p className="weather-forecast__temp" id='mintemp'
                                    style={{ color: '#00629B' }}>
                                </p>
                            </div>

                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date"
                                    style={{ color: '#00629B' }}>Max</p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/thunder.svg"
                                />
                                <p className="weather-forecast__temp" id='maxtemp'
                                    style={{ color: '#00629B' }}>
                                </p>
                            </div>

                            <div className="weather-forecast__column">
                                <p className="weather-forecast__date"
                                    style={{ color: '#00629B' }}>Avg
                                </p>
                                <img
                                    alt=""
                                    className="weather-forecast__icon"
                                    src="https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/day.svg"
                                />
                                <p className="weather-forecast__temp" id='avgtemp'
                                    style={{ color: '#00629B' }}>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
