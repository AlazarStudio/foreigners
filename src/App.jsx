import React from "react";
import { Route, Routes } from "react-router-dom";

import Main_Page from "./Components/Pages/Main_Page";
import Non_Found_Page from "./Components/Pages/Non_Found_Page";
import Layout from "./Components/Standart/Layout/Layout";
import InstallButton from "./Components/Pages/InstallButton/InstallButton";
import Dashboard from './Components/Pages/Dashboard';
import ExamResultsPage from './Components/Pages/ExamResultsPage';
import AnalyticsPage from './Components/Pages/AnalyticsPage';
import UsersPage from './Components/Pages/UsersPage';
import SettingsPage from './Components/Pages/SettingsPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard/>} />
          <Route path="exam-results" element={<ExamResultsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Non_Found_Page />} />
        </Route>
      </Routes>

      {/* Кнопка установки */}
      <InstallButton />
    </>
  )
}

export default App
