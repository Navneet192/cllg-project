import React from 'react';
import WeatherForecast from './WeatherForecast';
import styles from './Weather.module.css';

const Weather = () => {
    return (
        <div className={styles.container}>
            <h2>Weather Forecast</h2>
            <WeatherForecast />
        </div>
    );
};

export default Weather; 