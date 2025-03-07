import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Box, TextField } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertChartIcon from '@mui/icons-material/InsertChart';
import { Link } from "react-router-dom";
import { adress } from "../../data";

const ReportsListModal = ({ open, onClose, reports, onDelete, setReportModalOpen }) => {
    const [searchQuery, setSearchQuery] = useState("");

    // Функция для форматирования даты
    function formatDateTime(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы идут с 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    // Фильтрация и сортировка отчетов
    const filteredReports = reports
        .filter(report =>
            report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formatDateTime(report.createdAt).includes(searchQuery)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Новые вверху

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <Box display={"flex"} justifyContent={'space-between'} alignItems="center" padding={'10px 20px 0px 0px'}>
                <DialogTitle>Список отчетов</DialogTitle>
                <TextField
                    label="Поиск по названию или дате"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ width: "400px" }}
                />
                <Button startIcon={<InsertChartIcon />} variant="contained" color="primary" onClick={() => setReportModalOpen(true)}>
                    Создать отчет
                </Button>
            </Box>

            <DialogContent>
                {filteredReports.length === 0 ? (
                    <p>Отчеты не найдены.</p>
                ) : (
                    <List>
                        {filteredReports.map((report, index) => (
                            <ListItem key={index} divider>
                                <ListItemText primary={report.name} secondary={`Дата создания: ${formatDateTime(report.createdAt)}`} />
                                <Link to={`${adress}/${report.url}`}>
                                    <IconButton>
                                        <DownloadIcon />
                                    </IconButton>
                                </Link>
                                <IconButton onClick={() => onDelete(report.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReportsListModal;
