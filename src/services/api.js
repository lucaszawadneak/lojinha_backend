import axios from 'axios';

const siga = axios.create({
    baseURL: 'https://siga.ufpr.br:8380',
});

export default siga;
