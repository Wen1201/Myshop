import axios from "axios";

const BASE_URL = "http://localhost:5000/api/"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNDBkYTdiYWJiZmFlZWM1Y2NmMWY5MyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY2NjA3MDY3NCwiZXhwIjoxNjY2MzI5ODc0fQ.voO1oGlcqr1e3LdMrtAmTorF_ni_3I-oemGTSfRebU4"

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});

export const userRequest = axios.create({
    baseURL: BASE_URL,
    header:{token: `Bearer ${TOKEN}`},
});

