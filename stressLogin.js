// Stress Login

import http from 'k6/http';
import { check, fail } from 'k6';
import {sleep} from 'k6';
import { Httpx } from 'https://jslib.k6.io/httpx/0.1.0/index.js';

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
           stages: [
        { duration: "15s", target: 50 }, // traffic ramp-up from 1 to a higher 50 users over 5 minutes.
        { duration: "30s", target: 50 }, // stay at higher 50 users for 20 minutes
        { duration: "7s", target: 0 }, // ramp-down to 0 users

      ],
    },
  },
};

const BASE_URL = 'https://test.zebrasign.com';
const EMAIL = 'deivistest@zebra.com';
const PASSWORD = 'Testing1-';


export default () => {
    let response = http.get(`${BASE_URL}/csrf-token`)
     const cookie = response.cookies['XSRF-TOKEN'].find((cookie) => cookie.name === 'XSRF-TOKEN');

    const loginRes = http.post(`${BASE_URL}/login`, {
        email: EMAIL,
        password: PASSWORD,
    }, {
        headers: {
            'X-Xsrf-Token': cookie.value.replace("%3D", "="),
        }
    });
    sleep(0.5);

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