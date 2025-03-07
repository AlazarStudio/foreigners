import axios from "axios";

export const adress = 'http://192.168.1.173:5000'
// let adress = 'http://62.217.177.31:5000'
// let adress = 'https://www.backend.ncsa-lk.ru'

export const admin = { login: "admin", password: 'admin' };

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
