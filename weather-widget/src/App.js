import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import WeatherWidget from './WeatherWidget';

// Налаштування Redux
const weatherReducer = (state = { weather: null, error: null, loading: false, cache: {} }, action) => {
  switch (action.type) {
    case 'SET_WEATHER':
      return { ...state, weather: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, weather: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CACHE':
      return { ...state, cache: { ...state.cache, ...action.payload } };
    default:
      return state;
  }
};

const store = configureStore({ reducer: weatherReducer });

function App() {
  return (
    <Provider store={store}>
      <div className="App" style={{ padding: 20 }}>
        <h1>Прогноз погоди</h1>
        <WeatherWidget />
      </div>
    </Provider>
  );
}

export default App;