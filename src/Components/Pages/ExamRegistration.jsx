import React, { useMemo, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, FormControlLabel, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox } from '@mui/material';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExamResultsModal from './ExamResultsModal';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AddIcon from '@mui/icons-material/Add';
import { examsData } from '../../data';

const ExamRegistration = () => {
  const [data, setData] = useState(examsData);
  const [openModal, setOpenModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false); // Состояние для открытия модального окна с результатами
  const [selectedStudent, setSelectedStudent] = useState(null); // Данные выбранного студента
  const [editingData, setEditingData] = useState(null); // Данные редактируемого студента
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
  const [sortConfig, setSortConfig] = useState({ key: 'registrationDate', direction: 'desc' });
  const [visibleColumns, setVisibleColumns] = useState({
    registrationDate: true,
    examDate: true,
    fioCyrillic: true,
    fioLatin: false,
    examType: true,
    passportNumber: false,
    birthDate: false,
    phone: false,
    examTry: true,
    arrived: true,
    paid: true,
    serviceProvided: true,
    passed: true,
    workAnnulled: true,
    examOption: true,
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

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
      student.fioCyrillic.toLocaleLowerCase() === fioCyrillic.toLocaleLowerCase() &&
      student.fioLatin.toLocaleLowerCase() === fioLatin.toLocaleLowerCase() &&
      student.passportNumber.toLocaleLowerCase() === passportNumber.toLocaleLowerCase() &&
      student.birthDate === birthDate
    );

    // console.log(existingStudent)

    // Устанавливаем количество попыток (1, если новый студент, иначе +1)
    const examTry = existingStudent ? existingStudent.examTry + 1 : 1;
    const examOption = "";

    const newData = {
      id: editingData ? editingData.id : Date.now(),
      fioCyrillic, fioLatin, passportNumber, birthDate, examType, examTry, phone,
      registrationDate, examDate, arrived, workAnnulled, passed, paid, serviceProvided, examOption,
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
          student.id === editingData.id ? newData : student
        )
      );
    } else {
      // console.log(newData);
      setData([...data, newData]);
    }

    clearForm();
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setData(data.filter(item => item.id !== id));
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

  const saveResults = (passportNumber, results, passed, arrived, serviceProvided, paid, examOption) => {
    setData(prevData =>
      prevData.map(student =>
        student.passportNumber === passportNumber
          ? { ...student, results, passed, arrived, serviceProvided, paid, examOption }
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

  const filteredData = useMemo(() => {
    return data.filter(student => {
      // Фильтрация только по активным колонкам
      const isWithinSearch = Object.keys(visibleColumns)
        .filter(key => visibleColumns[key]) // Учитываем только видимые колонки
        .some(key => {
          let value = student[key];

          // Преобразование логических значений в строки "Да" / "Нет"
          if (typeof value === 'boolean') {
            value = value ? "Да" : "Нет";
          }

          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        });

      // Фильтрация по диапазону дат
      const studentDate = new Date(student.registrationDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const isWithinDateRange =
        (!start && !end) || // Если даты не выбраны - ничего не фильтруем
        (!start || studentDate >= start) &&
        (!end || studentDate <= end);

      return isWithinSearch && isWithinDateRange;
    });
  }, [data, searchQuery, startDate, endDate, visibleColumns]);

  // Сортировка данных
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Функция для сортировки данных
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  const toggleColumn = (column) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const columnNames = {
    registrationDate: "Дата записи",
    examDate: "Дата экзамена",
    fioCyrillic: "ФИО (Кириллица)",
    fioLatin: "ФИО (Латиница)",
    examType: "Тип экзамена",
    passportNumber: "Номер паспорта",
    birthDate: "Дата рождения",
    phone: "Телефон",
    examTry: "Попытка",
    arrived: "Явился",
    paid: "Оплачен",
    serviceProvided: "Услуга оказана",
    passed: "Сдал",
    workAnnulled: "Аннулировано",
    examOption: 'Вариант'
  };

  return (
    <>
      <Typography display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Список записей на экзамен</Typography>
        <Button variant="contained" color="primary" onClick={openMenu} startIcon={<SettingsIcon />}>Настроить колонки</Button>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          {Object.keys(visibleColumns).map((key) => (
            <MenuItem key={key} onClick={() => toggleColumn(key)}>
              <ListItemIcon>
                <Checkbox checked={visibleColumns[key]} />
              </ListItemIcon>
              <ListItemText primary={columnNames[key]} />
            </MenuItem>
          ))}
        </Menu>
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} mt={4}>
        <Box display="flex" gap={2}>
          <TextField
            label="Поиск"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "500px" }}
          />

          <TextField
            label="От (дата записи)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
          />
          <TextField
            label="До (дата записи)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
          />
        </Box>

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal(null)}>
          Добавить запись
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: "calc(100dvh - 180px)", overflow: "auto", textAlign: 'center', border: '1px solid #ececec', borderRadius: '5px', backgroundColor: '#fff' }}>
        <Table stickyHeader>

          <TableHead>
            <TableRow sx={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1 }}>
              {visibleColumns.registrationDate && (
                <TableCell onClick={() => handleSort('registrationDate')} style={{ cursor: 'pointer' }}>
                  <b>Дата записи</b> {sortConfig.key === 'registrationDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.examDate && (
                <TableCell onClick={() => handleSort('examDate')} style={{ cursor: 'pointer' }}>
                  <b>Дата экзамена</b> {sortConfig.key === 'examDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.fioCyrillic && (
                <TableCell onClick={() => handleSort('fioCyrillic')} style={{ cursor: 'pointer' }}>
                  <b>ФИО (Кириллица)</b> {sortConfig.key === 'fioCyrillic' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.fioLatin && (
                <TableCell onClick={() => handleSort('fioLatin')} style={{ cursor: 'pointer' }}>
                  <b>ФИО (Латиница)</b> {sortConfig.key === 'fioLatin' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.examType && (
                <TableCell onClick={() => handleSort('examType')} style={{ cursor: 'pointer' }}>
                  <b>Тип экзамена</b> {sortConfig.key === 'examType' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.passportNumber && (
                <TableCell onClick={() => handleSort('passportNumber')} style={{ cursor: 'pointer' }}>
                  <b>Номер паспорта</b> {sortConfig.key === 'passportNumber' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.birthDate && (
                <TableCell onClick={() => handleSort('birthDate')} style={{ cursor: 'pointer' }}>
                  <b>Дата рождения</b> {sortConfig.key === 'birthDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.phone && (
                <TableCell onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
                  <b>Телефон</b> {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.examTry && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('examTry')} style={{ cursor: 'pointer' }}>
                  <b>Попытка</b> {sortConfig.key === 'examTry' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.arrived && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('arrived')} style={{ cursor: 'pointer' }}>
                  <b>Явился</b> {sortConfig.key === 'arrived' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.paid && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('paid')} style={{ cursor: 'pointer' }}>
                  <b>Оплачен</b> {sortConfig.key === 'paid' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.serviceProvided && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('serviceProvided')} style={{ cursor: 'pointer' }}>
                  <b>Услуга оказана </b>{sortConfig.key === 'serviceProvided' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.passed && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('passed')} style={{ cursor: 'pointer' }}>
                  <b>Сдал</b> {sortConfig.key === 'passed' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.examOption && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('examOption')} style={{ cursor: 'pointer' }}>
                  <b>Вариант</b> {sortConfig.key === 'examOption' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}

              {visibleColumns.workAnnulled && (
                <TableCell sx={{ textAlign: 'center' }} onClick={() => handleSort('workAnnulled')} style={{ cursor: 'pointer' }}>
                  <b>Аннулировано</b> {sortConfig.key === 'workAnnulled' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </TableCell>
              )}
              <TableCell sx={{ textAlign: 'center' }}>
                <b>Действия</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.passportNumber} sx={{
                backgroundColor: row.arrived && row.paid && row.serviceProvided && row.passed ? 'rgba(60, 188, 103, 0.15)' : '#fff'
              }}>
                {visibleColumns.registrationDate && <TableCell>{formatDateToRussian(row.registrationDate)}</TableCell>}
                {visibleColumns.examDate && <TableCell>{formatDateToRussian(row.examDate)}</TableCell>}
                {visibleColumns.fioCyrillic && <TableCell>{row.fioCyrillic}</TableCell>}
                {visibleColumns.fioLatin && <TableCell>{row.fioLatin}</TableCell>}
                {visibleColumns.examType && <TableCell>{row.examType}</TableCell>}
                {visibleColumns.passportNumber && <TableCell>{row.passportNumber}</TableCell>}
                {visibleColumns.birthDate && <TableCell>{formatDateToRussian(row.birthDate)}</TableCell>}
                {visibleColumns.phone && <TableCell>{row.phone}</TableCell>}
                {visibleColumns.examTry && <TableCell sx={{ textAlign: 'center' }}>{row.examTry ? row.examTry : 1}</TableCell>}
                {visibleColumns.arrived && <TableCell sx={{ textAlign: 'center' }}>{row.arrived ? 'Да' : 'Нет'}</TableCell>}
                {visibleColumns.paid && <TableCell sx={{ textAlign: 'center' }}>{row.paid ? 'Да' : 'Нет'}</TableCell>}
                {visibleColumns.serviceProvided && <TableCell sx={{ textAlign: 'center' }}>{row.serviceProvided ? 'Да' : 'Нет'}</TableCell>}
                {visibleColumns.passed && <TableCell sx={{ textAlign: 'center' }}>{row.passed ? 'Да' : 'Нет'}</TableCell>}
                {visibleColumns.examOption && <TableCell sx={{ textAlign: 'center' }}>{row.examOption ? row.examOption : '-'}</TableCell>}
                {visibleColumns.workAnnulled && <TableCell sx={{ textAlign: 'center' }}>{row.workAnnulled ? 'Да' : 'Нет'}</TableCell>}
                <TableCell>
                  <Box display="flex" justifyContent="space-around">
                    <IconButton onClick={() => handleOpenModal(row)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}><DeleteIcon /></IconButton>
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
    </>
  );
};

export default ExamRegistration;
