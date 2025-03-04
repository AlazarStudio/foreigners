import React, { useState, useEffect } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

const ExamResultsModal = ({ open, onClose, studentData, onSaveResults }) => {
  const [results, setResults] = useState(Array(20).fill(0));
  const [passed, setPassed] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [serviceProvided, setServiceProvided] = useState(false);
  const [paid, setPaid] = useState(false);
  const [examOption, setExamOption] = useState();

  useEffect(() => {
    if (open && studentData) {
      setResults(studentData.results || Array(20).fill(0));
      setPassed(studentData.passed || false);
      setArrived(studentData.arrived || false);
      setServiceProvided(studentData.serviceProvided || false);
      setPaid(studentData.paid || false);
      setExamOption(studentData.examOption || '');
    }
  }, [open, studentData]);

  const handleInputChange = (index, value) => {
    const updatedResults = [...results];
    updatedResults[index] = value === '1' ? 1 : 0;
    setResults(updatedResults);
  };

  // Подсчет баллов
  const russianLanguage = results.slice(0, 9).reduce((acc, val) => acc + val, 0);
  const history = results.slice(9, 14).reduce((acc, val) => acc + val, 0);
  const law = results.slice(14, 20).reduce((acc, val) => acc + val, 0);
  const total = russianLanguage + history + law;

  useEffect(() => {
    if (russianLanguage >= 5 && history >= 2 && law >= 3) {
      setPassed(true);
      setArrived(true);
      setServiceProvided(true);
      setPaid(true);
    } else {
      setPassed(false);
      setArrived(false);
      setServiceProvided(false);
      setPaid(false);
    }
  }, [results]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
        <span>Результаты экзамена <b>{studentData?.fioCyrillic}</b></span>
        <TextField
          label="Вариант экзамена"
          type="text"
          value={examOption}
          onChange={(e) => setExamOption(e.target.value)}
          size="small"
          sx={{ ml: 1, width: "280px" }}
        />

      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection={"column"} justifyContent="space-between" gap={2}>
          {/* Русский язык */}
          <Box flex={1} p={2} sx={{ textAlign: 'center', border: '1px solid #ececec', borderRadius: '5px' }}>
            <Typography variant="h6" mb={2}>Русский язык</Typography>

            <Box display="flex" justifyContent="space-between">
              {Array.from({ length: 9 }, (_, index) => (
                <Box key={index} mb={1}>
                  <Typography>{index + 1}</Typography>
                  <TextField
                    type="number"
                    value={results[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    inputProps={{ min: 0, max: 1 }}
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" gap={2}>
            {/* История */}
            <Box flex={1} p={2} sx={{ textAlign: 'center', border: '1px solid #ececec', borderRadius: '5px' }}>
              <Typography variant="h6" mb={2}>История</Typography>

              <Box display="flex" justifyContent="space-between">
                {Array.from({ length: 5 }, (_, index) => (
                  <Box key={index} mb={1}>
                    <Typography>{index + 10}</Typography>
                    <TextField
                      type="number"
                      value={results[index + 9]}
                      onChange={(e) => handleInputChange(index + 9, e.target.value)}
                      inputProps={{ min: 0, max: 1 }}
                      size="small"
                      sx={{
                        width: '60px',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Законодательство */}
            <Box flex={1} p={2} sx={{ textAlign: 'center', border: '1px solid #ececec', borderRadius: '5px' }}>
              <Typography variant="h6" mb={2}>Законодательство</Typography>

              <Box display="flex" justifyContent="space-between" gap={'12px'}>
                {Array.from({ length: 6 }, (_, index) => (
                  <Box key={index} mb={1}>
                    <Typography>{index + 15}</Typography>
                    <TextField
                      type="number"
                      value={results[index + 14]}
                      onChange={(e) => handleInputChange(index + 14, e.target.value)}
                      inputProps={{ min: 0, max: 1 }}
                      size="small"
                      sx={{
                        width: '60px',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </Box>

        {/* Итоговый блок */}
        <Box p={2} mt={2} sx={{ border: '1px solid #ececec', borderRadius: '5px' }}>
          <Typography variant="h6">Итого</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Русский язык</TableCell>
                  <TableCell>{russianLanguage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>История</TableCell>
                  <TableCell>{history}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Законодательство</TableCell>
                  <TableCell>{law}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Общий балл</b></TableCell>
                  <TableCell><b>{total}</b></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Сдал</b></TableCell>
                  <TableCell><b>{passed ? 'Да' : 'Нет'}</b></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отменить</Button>
        <Button onClick={() => onSaveResults(studentData.passportNumber, results, passed, arrived, serviceProvided, paid, examOption)} variant="contained" color="primary">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamResultsModal;
