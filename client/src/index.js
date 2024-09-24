import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from 'redux-persist/integration/react';
import persistReducer from 'redux-persist/es/persistReducer';
import { Provider } from 'react-redux';

const persistConfig = {key: "root", storage, version: 1};
const persistReducer =  persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store = { store }>
      <PersistGate>
        loading = { null } persistor={persistStore(store)}
        <App />
      </PersistGate>
    </Provider>

  </React.StrictMode>
);
