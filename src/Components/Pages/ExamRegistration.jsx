import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, FormControlLabel, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, Autocomplete } from '@mui/material';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

import ExamResultsModal from './ExamResultsModal';
import ReportModal from './ReportModal';
import ReportsListModal from './ReportsListModal';

import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

import { DELETE_fetchRequest, GET_fetchRequest, POST_fetchRequest, PUT_fetchRequest, adress } from '../../data';

const ExamRegistration = ({ examData }) => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openResultsModal, setOpenResultsModal] = useState(false); // Состояние для открытия модального окна с результатами
  const [selectedStudent, setSelectedStudent] = useState(null); // Данные выбранного студента
  const [editingData, setEditingData] = useState(null); // Данные редактируемого студента
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setData(examData)
  }, [examData]);

  const [reportModalOpen, setReportModalOpen] = useState(false);

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
  const [sortConfig, setSortConfig] = useState({ key: 'examDate', direction: 'desc' });
  const [visibleColumns, setVisibleColumns] = useState({
    registrationDate: false,
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

  const clearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setSortConfig({ key: 'examDate', direction: 'desc' });
  };

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

  useEffect(() => {
    if (!editingData) {
      // Если создается новая запись, устанавливаем сегодняшнюю дату
      const today = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD
      setRegistrationDate(today);
    }
  }, [openModal, editingData]);

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

  const handleSave = async () => {
    const examOption = "";

    const newData = {
      fioCyrillic,
      fioLatin,
      passportNumber,
      birthDate,
      examType,
      examTry: examTry ? examTry : 1,
      phone,
      registrationDate,
      examDate,
      arrived,
      workAnnulled,
      passed,
      paid,
      serviceProvided,
      examOption,
      results: editingData ? editingData.results : Array(20).fill(0) // Сохраняем старые оценки
    };

    // Проверка на пустые обязательные поля
    if (!fioCyrillic || !fioLatin || !passportNumber || !examType || !phone || !examDate) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    if (editingData) {
      setData(prevData =>
        prevData.map(student =>
          student.id === editingData.id ? newData : student
        )
      );
      await PUT_fetchRequest(newData, 'exam', editingData.id);

    } else {
      let result = await POST_fetchRequest(newData, 'exam');
      setData([...data, result]);
    }

    clearForm();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setData(data.filter(item => item.id !== id));

      await DELETE_fetchRequest(id, 'exam');
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

  const saveResults = async (studentData, passportNumber, results, passed, arrived, serviceProvided, paid, examOption) => {

    let dataExamInfo = { ...studentData, results, passed, arrived, serviceProvided, paid, examOption }
    const { id, ...dataExamInfoPUT } = dataExamInfo;

    await PUT_fetchRequest(dataExamInfoPUT, 'exam', dataExamInfo.id);

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
      const studentDate = new Date(student.examDate);
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

  const uniqueStudents = useMemo(() => {
    const map = new Map();
    data.forEach(student => {
      if (!map.has(student.passportNumber)) {
        map.set(student.passportNumber, student);
      }
    });
    return Array.from(map.values());
  }, [data]);

  const handleSelectStudent = (event, selectedStudent) => {
    if (selectedStudent) {
      setFioCyrillic(selectedStudent.fioCyrillic);
      setFioLatin(selectedStudent.fioLatin);
      setPassportNumber(selectedStudent.passportNumber);
      setBirthDate(selectedStudent.birthDate);
      setPhone(selectedStudent.phone);

      // Определяем количество попыток (увеличиваем, если студент уже есть)
      const attempts = data.filter(s => s.fioCyrillic === selectedStudent.fioCyrillic).length + 1;
      setExamTry(attempts);
    }
  };

  const [open, setOpen] = useState(false);

  const [reports, setReports] = useState([]);

  useEffect(() => {
    GET_fetchRequest('report', setReports);
  }, [reportModalOpen, open]);

  const handleDeleteReport = async (reportToDelete) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись?')) {
      setReports(reports.filter(report => report.id !== reportToDelete));

      await DELETE_fetchRequest(reportToDelete, 'report');
    }
  };

  const handleExit = () => {
    localStorage.clear();
    window.location.reload();
  }
  return (
    <>
      <Typography display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" gap={2}>
          <Typography variant="h5">Список записей на экзамен</Typography>
          <Button variant="outlined" color="primary" onClick={openMenu} startIcon={<SettingsIcon />}>Настроить колонки</Button>
        </Box>

        <Button variant="outlined" color="primary" startIcon={<LogoutIcon />} onClick={handleExit}>Выход</Button>
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
            label="От (дата экзамена)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="small"
          />
          <TextField
            label="До (дата экзамена)"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="small"
          />

          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={clearFilters}
          >
            Очистить фильтры
          </Button>
        </Box>

        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Открыть список отчетов
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenModal(null)}>
            Добавить запись
          </Button>
        </Box>
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
                {visibleColumns.examTry && <TableCell sx={{ textAlign: 'center' }}>{row.examTry}</TableCell>}
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
          <TextField sx={{ display: 'none' }} label="Дата записи" type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <TextField label="Дата экзамена" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />

          {/* Автодополнение для ФИО (Кириллица) */}
          {!editingData ?
            <Autocomplete
              freeSolo
              options={uniqueStudents}
              getOptionLabel={(option) => option.fioCyrillic}
              onChange={handleSelectStudent}
              renderInput={(params) => (
                <TextField {...params} label="ФИО (Кириллица)" value={fioCyrillic} onChange={(e) => setFioCyrillic(e.target.value)} fullWidth margin="dense" />
              )}
            />
            :
            <TextField label="ФИО (Кириллица)" value={fioCyrillic} onChange={(e) => setFioCyrillic(e.target.value)} fullWidth margin="dense" />
          }
          <TextField label="ФИО (Латиница)" value={fioLatin} onChange={(e) => setFioLatin(e.target.value)} fullWidth margin="dense" />
          <TextField label="Текущая попытка" value={examTry ? examTry : 1} onChange={(e) => setExamTry(e.target.value)} fullWidth margin="dense" disabled />

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

      {/* Модальное окно для выбора отчета */}
      <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} data={data} />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        {Object.keys(visibleColumns).map((key) => (
          <MenuItem key={key} onClick={() => toggleColumn(key)} sx={{ padding: '0px', width: '218px' }}>
            <ListItemIcon>
              <Checkbox checked={visibleColumns[key]} />
            </ListItemIcon>
            <ListItemText primary={columnNames[key]} />
          </MenuItem>
        ))}
      </Menu>

      <ReportsListModal
        open={open}
        onClose={() => setOpen(false)}
        reports={reports}
        onDelete={handleDeleteReport}
        setReportModalOpen={setReportModalOpen}
      />
    </>
  );
};

export default ExamRegistration;
