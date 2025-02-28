import React, { useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, FormControlLabel, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExamResultsModal from './ExamResultsModal';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { columnGroupsStateInitializer } from '@mui/x-data-grid/internals';

const ExamRegistration = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false); // Состояние для открытия модального окна с результатами
  const [selectedStudent, setSelectedStudent] = useState(null); // Данные выбранного студента
  const [editingData, setEditingData] = useState(null); // Данные редактируемого студента

  // Состояния формы
  const [fioCyrillic, setFioCyrillic] = useState('');
  const [fioLatin, setFioLatin] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [examType, setExamType] = useState('');
  const [examTry, setExamTry] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationDate, setRegistrationDate] = useState();
  const [examDate, setExamDate] = useState('');
  const [arrived, setArrived] = useState(false);
  const [workAnnulled, setWorkAnnulled] = useState(false);
  const [passed, setPassed] = useState(false);
  const [paid, setPaid] = useState(false);
  const [serviceProvided, setServiceProvided] = useState(false);

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingData(student);
      setFioCyrillic(student.fioCyrillic);
      setFioLatin(student.fioLatin);
      setPassportNumber(student.passportNumber);
      setBirthDate(student.birthDate);
      setExamType(student.examType);
      setExamTry(student.examTry);
      setPhone(student.phone);
      setRegistrationDate(student.registrationDate);
      setExamDate(student.examDate);
      setArrived(student.arrived);
      setWorkAnnulled(student.workAnnulled);
      setPassed(student.passed);
      setPaid(student.paid);
      setServiceProvided(student.serviceProvided);
    } else {
      setEditingData(null);
      clearForm();
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingData(null);
    clearForm();
  };

  const clearForm = () => {
    setFioCyrillic('');
    setFioLatin('');
    setPassportNumber('');
    setBirthDate('');
    setExamType('');
    setExamTry('');
    setPhone('');
    setRegistrationDate('');
    setExamDate('');
    setArrived(false);
    setWorkAnnulled(false);
    setPassed(false);
    setPaid(false);
    setServiceProvided(false);
  };

  const handleSave = () => {
    // Ищем студента с тем же ФИО, номером паспорта и датой рождения
    const existingStudent = data.find(student =>
      student.fioCyrillic === fioCyrillic &&
      student.fioLatin === fioLatin &&
      student.passportNumber === passportNumber &&
      student.birthDate === birthDate
    );

    console.log(existingStudent)

    // Устанавливаем количество попыток (1, если новый студент, иначе +1)
    const examTry = existingStudent ? existingStudent.examTry + 1 : 1;

    const newData = {
      fioCyrillic, fioLatin, passportNumber, birthDate, examType, examTry, phone,
      registrationDate, examDate, arrived, workAnnulled, passed, paid, serviceProvided,
      results: editingData ? editingData.results : Array(20).fill(0) // Сохраняем старые оценки
    };

    // Проверка на пустые обязательные поля
    if (!fioCyrillic || !fioLatin || !passportNumber || !examType || !phone || !registrationDate || !examDate) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    if (editingData) {
      setData(prevData =>
        prevData.map(student =>
          student.passportNumber === editingData.passportNumber ? newData : student
        )
      );
    } else {
      // console.log(newData);
      setData([...data, newData]);
    }

    clearForm();
    handleCloseModal();
  };


  const handleDelete = (passportNumber) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setData(data.filter(item => item.passportNumber !== passportNumber));
    }
  };

  const handleOpenResultsModal = (student) => {
    setSelectedStudent(student); // Устанавливаем выбранного студента
    setOpenResultsModal(true); // Открываем модальное окно для ввода результатов
  };

  const handleCloseResultsModal = () => {
    setOpenResultsModal(false);
    setSelectedStudent(null);
  };

  const saveResults = (passportNumber, results, passed, arrived, serviceProvided, paid) => {
    setData(prevData =>
      prevData.map(student =>
        student.passportNumber === passportNumber
          ? { ...student, results, passed, arrived, serviceProvided, paid }
          : student
      )
    );
    handleCloseResultsModal();
  };

  const formatDateToRussian = (dateString) => {
    if (!dateString) return ""; // Если пустая строка
    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Список записей на экзамен
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Запись на экзамен</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpenModal(null)}>
          Добавить запись
        </Button>
      </Box>
      <TableContainer sx={{ textAlign: 'center', border: '1px solid #ececec', borderRadius: '5px', backgroundColor: '#fff' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата записи</TableCell>
              <TableCell>Дата экзамена</TableCell>
              <TableCell>ФИО (Кириллица)</TableCell>
              {/* <TableCell>ФИО (Латиница)</TableCell> */}
              <TableCell>Тип экзамена</TableCell>
              <TableCell>Номер паспорта</TableCell>
              {/* <TableCell>Дата рождения</TableCell> */}
              <TableCell>Телефон</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Попытка</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Явился</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Оплачен</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Услуга оказана</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Сдал</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Работа аннулирована</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.passportNumber} sx={{
                backgroundColor: row.arrived && row.paid && row.serviceProvided && row.passed ? 'rgba(60, 188, 103, 0.15)' : '#fff'
              }}>
                <TableCell>{formatDateToRussian(row.registrationDate)}</TableCell>
                <TableCell>{formatDateToRussian(row.examDate)}</TableCell>
                <TableCell>{row.fioCyrillic}</TableCell>
                {/* <TableCell>{row.fioLatin}</TableCell> */}
                <TableCell>{row.examType}</TableCell>
                <TableCell>{row.passportNumber}</TableCell>
                {/* <TableCell>{formatDateToRussian(row.birthDate)}</TableCell> */}
                <TableCell>{row.phone}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.examTry ? row.examTry : 1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.arrived ? 'Да' : 'Нет'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.paid ? 'Да' : 'Нет'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.serviceProvided ? 'Да' : 'Нет'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.passed ? 'Да' : 'Нет'}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{row.workAnnulled ? 'Да' : 'Нет'}</TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="space-around">
                    <IconButton onClick={() => handleOpenModal(row)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(row.passportNumber)}><DeleteIcon /></IconButton>
                    <IconButton onClick={() => handleOpenResultsModal(row)}><FactCheckIcon /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Модальное окно для добавления/редактирования записи */}
      <Dialog open={openModal} onClose={handleCloseModal} >
        <DialogTitle>{editingData ? 'Редактировать запись' : 'Добавить запись'}</DialogTitle>
        <DialogContent>
          <TextField label="Дата записи" type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Дата экзамена" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="ФИО (Кириллица)" value={fioCyrillic} onChange={(e) => setFioCyrillic(e.target.value)} fullWidth margin="dense" />
          <TextField label="ФИО (Латиница)" value={fioLatin} onChange={(e) => setFioLatin(e.target.value)} fullWidth margin="dense" />
          <TextField
            select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            fullWidth
            margin="dense"
            SelectProps={{
              native: true,
            }}
          >
            <option value="" disabled>Выберите уровень</option>
            <option value="Уровень 1 - патент или разрешение на работу">Уровень 1 - патент или разрешение на работу</option>
            <option value="Уровень 2 - разрешение на временное проживани">Уровень 2 - разрешение на временное проживание</option>
            <option value="Уровень 3 - вид на жительство">Уровень 3 - вид на жительство</option>
          </TextField>


          <TextField label="Номер паспорта" value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} fullWidth margin="dense" />
          <TextField label="Дата рождения" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth margin="dense" />

          {editingData &&
            <>
              {/* <TextField label="Попытка" value={examTry} onChange={(e) => setExamTry(e.target.value)} fullWidth margin="dense" /> */}
              <FormControlLabel control={<Checkbox checked={arrived} onChange={(e) => setArrived(e.target.checked)} />} label="Явился" />
              <FormControlLabel control={<Checkbox checked={paid} onChange={(e) => setPaid(e.target.checked)} />} label="Оплачен" />
              <FormControlLabel control={<Checkbox checked={serviceProvided} onChange={(e) => setServiceProvided(e.target.checked)} />} label="Услуга оказана" />
              <FormControlLabel control={<Checkbox checked={workAnnulled} onChange={(e) => setWorkAnnulled(e.target.checked)} />} label="Работа аннулирована" />
            </>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Отменить</Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для ввода результатов экзамена */}
      <ExamResultsModal
        open={openResultsModal}
        onClose={handleCloseResultsModal}
        studentData={selectedStudent}
        onSaveResults={saveResults}
      />
    </div>
  );
};

export default ExamRegistration;
