import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-7e3d7.firebaseio.com/'
});

export default instance;