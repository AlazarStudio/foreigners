import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Non_Found_Page from "./Components/Pages/Non_Found_Page";
import Layout from "./Components/Standart/Layout/Layout";
import InstallButton from "./Components/Pages/InstallButton/InstallButton";
import ExamRegistration from "./Components/Pages/ExamRegistration";
import { GET_fetchRequest } from "./data";

function App() {
  const [examData, setExamData] = useState(null);

  useEffect(() => {
    GET_fetchRequest('exam', setExamData);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExamRegistration examData={examData ? examData : []}/>} />
          <Route path="*" element={<Non_Found_Page />} />
        </Route>
      </Routes>

      {/* Кнопка установки */}
      <InstallButton />
    </>
  )
}

export default App
