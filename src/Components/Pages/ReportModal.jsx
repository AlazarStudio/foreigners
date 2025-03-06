import React, { useState, useEffect } from 'react';
import { Button, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { POST_fetchRequest } from '../../data';

const ReportModal = ({ open, onClose, data }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [examLevel, setExamLevel] = useState('');
    const [reportType, setReportType] = useState('');

    const filteredData = data.filter(student => {
        const studentDate = new Date(student.examDate);
        const start = new Date(startDate);
        const end = new Date(endDate);

        return (
            studentDate >= start &&
            studentDate <= end &&
            student.examType === examLevel
        );
    });

    const generateReport1 = async (filteredData) => {
        const totalStudents = filteredData.length;
        const passedStudents = filteredData.filter(student => student.passed).length;
        const failedStudents = totalStudents - passedStudents;

        const passedPercentage = totalStudents > 0 ? ((passedStudents / totalStudents) * 100).toFixed(2) : "0.00";
        const failedPercentage = totalStudents > 0 ? ((failedStudents / totalStudents) * 100).toFixed(2) : "0.00";

        let data = {
            type: reportType,
            report: {
                startDate,
                endDate,
                examLevel,
                totalStudents,
                passedStudents,
                failedStudents,
                passedPercentage,
                failedPercentage,
            },
        }

        let result = await POST_fetchRequest(data, 'report');
    };

    const generateReport2 = async (filteredData) => {
        const totalStudents = filteredData.length;

        // Фильтруем только тех, кто сдал
        const passedStudents = filteredData.filter(student => student.passed);

        // Группируем сдавших по попыткам
        const firstTry = passedStudents.filter(student => student.examTry === 1).length;
        const secondTry = passedStudents.filter(student => student.examTry === 2).length;
        const thirdTry = passedStudents.filter(student => student.examTry === 3).length;
        const fourthOrMoreTry = passedStudents.filter(student => student.examTry >= 4).length;

        let data = {
            type: reportType,
            report: {
                startDate,
                endDate,
                examLevel,
                totalStudents,
                firstTry,
                secondTry,
                thirdTry,
                fourthOrMoreTry,
            },
        }
        
        let result = await POST_fetchRequest(data, 'report');
    };

    
    const generateReport3 = (filteredData) => {
        // Оставляем только тех, кто не сдал экзамен
        const failedStudents = filteredData.filter(student => !student.passed);

        // Блоки заданий с диапазонами вопросов
        const blocks = {
            "Русский язык": { range: [0, 8], questionStats: new Array(9).fill(0), hardestQuestions: [] }, // 9 вопросов
            "История России": { range: [9, 13], questionStats: new Array(5).fill(0), hardestQuestions: [] }, // 5 вопросов
            "Основы законодательства РФ": { range: [14, 19], questionStats: new Array(6).fill(0), hardestQuestions: [] } // 6 вопросов
        };

        // Подсчет правильных ответов в каждом блоке
        failedStudents.forEach(student => {
            Object.keys(blocks).forEach(block => {
                const [start, end] = blocks[block].range;

                // Считаем правильные ответы для каждого вопроса в блоке
                student.results.slice(start, end + 1).forEach((answer, index) => {
                    if (answer === 1) {
                        blocks[block].questionStats[index]++; // Увеличиваем счетчик правильных ответов для вопроса
                    }
                });
            });
        });

        Object.keys(blocks).forEach(block => {
            const minCorrectAnswers = Math.min(...blocks[block].questionStats);
            blocks[block].hardestQuestions = blocks[block].questionStats
                .map((count, index) => ({ question: index + blocks[block].range[0] + 1, correct: count }))
                .filter(q => q.correct === minCorrectAnswers);
        });

        console.log("\nПолная статистика по блокам:", blocks);
    };

    const generateReport4 = (filteredData) => {
        // Оставляем только тех, кто не сдал экзамен
        const failedStudents = filteredData.filter(student => !student.passed);
    
        // Блоки заданий с правильными диапазонами вопросов
        const blocks = {
            "Русский язык": { range: [0, 8], stats: new Array(10).fill(0), questionStats: new Array(9).fill(0), hardestQuestions: [] }, // 9 вопросов
            "История России": { range: [9, 13], stats: new Array(6).fill(0), questionStats: new Array(5).fill(0), hardestQuestions: [] }, // 5 вопросов
            "Основы законодательства РФ": { range: [14, 19], stats: new Array(7).fill(0), questionStats: new Array(6).fill(0), hardestQuestions: [] } // 6 вопросов
        };
    
        // Подсчитываем, сколько правильных ответов в каждом блоке
        failedStudents.forEach(student => {
            Object.keys(blocks).forEach(block => {
                const [start, end] = blocks[block].range;
                const correctAnswers = student.results.slice(start, end + 1).filter(answer => answer === 1).length;
                blocks[block].stats[correctAnswers]++;
    
                // Подсчет правильных ответов по конкретным вопросам в блоке
                student.results.slice(start, end + 1).forEach((answer, index) => {
                    if (answer === 1) {
                        blocks[block].questionStats[index]++; // Увеличиваем счетчик правильных ответов для вопроса
                    }
                });
            });
        });
    
        Object.keys(blocks).forEach(block => {
            const minCorrectAnswers = Math.min(...blocks[block].questionStats);
            blocks[block].hardestQuestions = blocks[block].questionStats
                .map((count, index) => ({ question: index + blocks[block].range[0] + 1, correct: count }))
                .filter(q => q.correct === minCorrectAnswers);
        });
    
        console.log("\nПолная статистика по блокам:", blocks);
    };

    // const generateReport3 = (filteredData) => {
    //     // Оставляем только тех, кто не сдал экзамен
    //     const failedStudents = filteredData.filter(student => !student.passed);

    //     // Создаем массив для подсчета правильных ответов по каждому из 20 вопросов
    //     const questionAnalysis = new Array(20).fill(0);

    //     // Проходим по каждому студенту и суммируем правильные ответы по каждому вопросу
    //     failedStudents.forEach(student => {
    //         student.results.forEach((answer, index) => {
    //             if (answer === 1) {
    //                 questionAnalysis[index]++; // Увеличиваем счетчик для вопроса, если ответ правильный
    //             }
    //         });
    //     });

    //     console.log("📊 Отчет 3 - Анализ вопросов среди не сдавших:");
    //     questionAnalysis.forEach((count, index) => {
    //         console.log(`Вопрос ${index + 1}: ${count} правильных ответов`);
    //     });

    //     console.log("Общая статистика по вопросам:", questionAnalysis);
    // };

    // const generateReport4 = (filteredData) => {
    //     // Оставляем только тех, кто не сдал экзамен
    //     const failedStudents = filteredData.filter(student => !student.passed);

    //     // Блоки заданий с правильными диапазонами вопросов
    //     const blocks = {
    //         "Русский язык": { range: [0, 8], stats: new Array(10).fill(0) }, // 10 вариантов (0-9 правильных ответов)
    //         "История России": { range: [9, 13], stats: new Array(6).fill(0) }, // 6 вариантов (0-5)
    //         "Основы законодательства РФ": { range: [14, 19], stats: new Array(7).fill(0) } // 7 вариантов (0-6)
    //     };

    //     // Подсчитываем, сколько правильных ответов в каждом блоке
    //     failedStudents.forEach(student => {
    //         Object.keys(blocks).forEach(block => {
    //             const [start, end] = blocks[block].range;
    //             const correctAnswers = student.results.slice(start, end + 1).filter(answer => answer === 1).length;
    //             blocks[block].stats[correctAnswers]++;
    //         });
    //     });

    //     // Выводим отчет в консоль
    //     console.log("📊 Отчет 4 - Анализ неуспешных попыток по блокам заданий:");
    //     Object.keys(blocks).forEach(block => {
    //         console.log(`\n${block}:`);
    //         blocks[block].stats.forEach((count, correctAnswers) => {
    //             console.log(`Студенты, давшие верный ответ на ${correctAnswers} заданий: ${count}`);
    //         });
    //     });

    //     console.log("\nПолная статистика:", blocks);
    // };

    const handleGenerateReport = () => {
        switch (reportType) {
            case "1":
                generateReport1(filteredData);
                break;
            case "2":
                generateReport2(filteredData);
                break;
            case "3":
                generateReport3(filteredData);
                break;
            case "4":
                generateReport4(filteredData);
                break;
            default:
                console.log("Неизвестный тип отчета");
        }

        setStartDate("")
        setEndDate("")
        setExamLevel("")
        setReportType("")

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Создание отчета</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="От (дата)"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        fullWidth
                        sx={{ marginTop: '10px' }}
                    />
                    <TextField
                        label="До (дата)"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        select
                        value={examLevel}
                        onChange={(e) => setExamLevel(e.target.value)}
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled>Выберите уровень</option>
                        <option value="Уровень 1 - патент или разрешение на работу">Уровень 1 - патент или разрешение на работу</option>
                        <option value="Уровень 2 - разрешение на временное проживани">Уровень 2 - разрешение на временное проживание</option>
                        <option value="Уровень 3 - вид на жительство">Уровень 3 - вид на жительство</option>
                    </TextField>

                    <TextField
                        select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        fullWidth
                        SelectProps={{
                            native: true,
                        }}
                    >
                        <option value="" disabled>Выберите тип отчета</option>
                        <option value="1">Отчет 1 - Общее количество сдающих, успешно сдавших и не сдавших, с процентами</option>
                        <option value="2">Отчет 2 - Сколько студентов сдали экзамен с 1, 2, 3 и 4+ попытки.</option>
                        <option value="3">Отчет 3 - Количество правильных ответов среди не сдавших по каждому вопросу.</option>
                        <option value="4">Отчет 4 - Количество неуспешных попыток, сгруппированных по блокам и количеству правильных ответов.</option>

                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleGenerateReport} variant="contained" color="primary" disabled={!startDate || !endDate || !examLevel || !reportType}>
                    Создать отчет
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportModal;