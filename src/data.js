// export const examsData = [
//   {
//     "id": "1",
//     "fioCyrillic": "Иванов Иван Иванович",
//     "fioLatin": "Ivanov Ivan Ivanovich",
//     "passportNumber": "112338456",
//     "birthDate": "1996-10-20",
//     "examType": "Уровень 1 - патент или разрешение на работу",
//     "examTry": 2,
//     "phone": "89094985069",
//     "registrationDate": "2025-03-03",
//     "examDate": "2025-03-03",
//     "arrived": false,
//     "workAnnulled": false,
//     "passed": false,
//     "paid": false,
//     "serviceProvided": false,
//     "examOption": "",
//     "results": [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1]
//   },
//   {
//     "id": "3",
//     "fioCyrillic": "Сидоров Сидор Сидорович",
//     "fioLatin": "Sidorov Sidor Sidorovich",
//     "passportNumber": "334455667",
//     "birthDate": "1992-12-01",
//     "examType": "Уровень 1 - патент или разрешение на работу",
//     "examTry": 5,
//     "phone": "89234445566",
//     "registrationDate": "2025-03-03",
//     "examDate": "2025-03-12",
//     "arrived": false,
//     "workAnnulled": false,
//     "passed": false,
//     "paid": false,
//     "serviceProvided": false,
//     "examOption": "",
//     "results": [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1]
//   },
//   {
//     "id": "5",
//     "fioCyrillic": "Морозова Анна Сергеевна",
//     "fioLatin": "Morozova Anna Sergeevna",
//     "passportNumber": "556677889",
//     "birthDate": "1999-03-10",
//     "examType": "Уровень 1 - патент или разрешение на работу",
//     "examTry": 1,
//     "phone": "89123456789",
//     "registrationDate": "2025-03-04",
//     "examDate": "2025-03-14",
//     "arrived": false,
//     "workAnnulled": false,
//     "passed": false,
//     "paid": false,
//     "serviceProvided": false,
//     "examOption": "",
//     "results": [1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1]
//   },
//   {
//     "id": "4",
//     "fioCyrillic": "Кузнецов Алексей Викторович",
//     "fioLatin": "Kuznetsov Alexey Viktorovich",
//     "passportNumber": "445566778",
//     "birthDate": "1995-07-21",
//     "examType": "Уровень 1 - патент или разрешение на работу",
//     "examTry": 1,
//     "phone": "89051234567",
//     "registrationDate": "2025-03-04",
//     "examDate": "2025-03-13",
//     "arrived": true,
//     "workAnnulled": false,
//     "passed": true,
//     "paid": true,
//     "serviceProvided": true,
//     "examOption": "1",
//     "results": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
//   },
//   {
//     "id": "2",
//     "fioCyrillic": "Петров Петр Петрович",
//     "fioLatin": "Petrov Petr Petrovich",
//     "passportNumber": "223344556",
//     "birthDate": "1988-05-15",
//     "examType": "Уровень 1 - патент или разрешение на работу",
//     "examTry": 3,
//     "phone": "89167778899",
//     "registrationDate": "2025-03-03",
//     "examDate": "2025-03-11",
//     "arrived": true,
//     "workAnnulled": false,
//     "passed": true,
//     "paid": true,
//     "serviceProvided": true,
//     "examOption": "2",
//     "results": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//   },

// ]
import axios from "axios";

let adress = 'http://192.168.1.173:5000'
// let adress = 'http://62.217.177.31:5000'
// let adress = 'https://www.backend.ncsa-lk.ru'

export const GET_fetchRequest = async (name, setRequest) => {
    try {
        const response = await axios.get(`${adress}/api/${name}`);
        setRequest(response.data);
    } catch (err) {
        console.log(err.message);
    }
};

export const POST_fetchRequest = async (addInfo, name) => {
    try {
        const response = await axios.post(
            `${adress}/api/${name}`,
            addInfo,
        );
        return response.data;
    } catch (err) {
        console.log(err.message); // Обработать ошибку
    }
};

export const PUT_fetchRequest = async (addInfo, name, id) => {
    try {
        const response = await axios.put(
            `${adress}/api/${name}/${id}`,
            addInfo,
        );
        return response.data;
    } catch (err) {
        console.log(err.message); // Обработать ошибку
    }
};

export const DELETE_fetchRequest = async (id, name) => {
    try {
        const response = await axios.delete(
            `${adress}/api/${name}/${id}`
        );
        return response.data;
    } catch (err) {
        console.log(err.message); // Обработать ошибку
    }
};
