// Check 200 status ===

import http from 'k6/http';
import { check, fail } from 'k6';
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';

export const options = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
           stages: [
        { duration: "15s", target: 5 },
        { duration: "15s", target: 10 },
        { duration: "15s", target: 15 },
        { duration: "15s", target: 20 },
        { duration: "15s", target: 25 },
        { duration: "15s", target: 30 },
        { duration: "15s", target: 35 },
        { duration: "15s", target: 40 },
        { duration: "15s", target: 45 },
        { duration: "15s", target: 50 },
      ],
      gracefulRampDown: "1s",
    },
  },
};

const BASE_URL = 'https://test.zebrasign.com';
const EMAIL = 'deivistest@zebra.com';
const PASSWORD = 'Testing1-';


export default () => {
    const session = new Httpx({ baseURL: BASE_URL });
    let response = session.get(`${BASE_URL}/csrf-token`)
     const cookie = response.cookies['XSRF-TOKEN'].find((cookie) => cookie.name === 'XSRF-TOKEN');

    const loginRes = session.post(`${BASE_URL}/login`, {
        email: EMAIL,
        password: PASSWORD,
    }, {
        headers: {
            'X-Xsrf-Token': cookie.value.replace("%3D", "="),
        }
    });

  const checkOutput = check(
     loginRes,
     {
       'response code was 200': (loginRes) => loginRes.status == 200,
     },
   );

   if (!checkOutput) {
     fail(loginRes.status);
   };
};