// Stress Sign Documents

import http from 'k6/http';
import { check, fail } from 'k6';
import {sleep} from 'k6';
import {uniqueEmail} from './accounts.js';

export const options = {
  scenarios: {
    stress: {
      executor: "ramping-vus",
      startVUs: 0,
           stages: [
        { duration: "15s", target: 30 }, // traffic ramp-up from 1 to a higher 50 users over 5 minutes.
        { duration: "15s", target: 30 }, // stay at higher 50 users for 20 minutes
        { duration: "7s", target: 0 }, // ramp-down to 0 users

      ],
    },
  },
};
//

export default () => {
    const BASE_URL = 'https://test.zebrasign.com';
    const EMAIL = uniqueEmail();
    const PASSWORD = 'Testing1-';
    console.log(EMAIL);

    let response = http.get(`${BASE_URL}/csrf-token`)
    let cookie = response.cookies['XSRF-TOKEN'].find((cookie) => cookie.name === 'XSRF-TOKEN');

    const loginRes = http.post(`${BASE_URL}/login`, {
        email: EMAIL,
        password: PASSWORD,
    }, {
        headers: {
            'X-Xsrf-Token': cookie.value.replace("%3D", "="),
        }
    });
    sleep(0.1);

    console.log(EMAIL)
    const accessorRes = http.get(`${BASE_URL}/accessor/list`);

//    console.log(JSON.parse(accessorRes.body).data[0].id);
    response = http.get(`${BASE_URL}/csrf-token`)
    cookie = response.cookies['XSRF-TOKEN'].find((cookie) => cookie.name === 'XSRF-TOKEN');

    console.log("accesor id---", JSON.parse(accessorRes.body).data[0].id)
    const accessorChooseRes = http.post(`${BASE_URL}/accessor/choose-current`, {
    accessor_id: JSON.parse(accessorRes.body).data[0].id
    }, {
               headers: {
                   'X-Xsrf-Token': cookie.value.replace("%3D", "="),
//                   'Content-Type': "application/json",
                   'Accept': "application/json, text/plain, */*"
               }
           });

    const documentRes = http.get(`${BASE_URL}/document/list`);

  const checkOutput = check(
     documentRes,
     {
       'response code was 200': (documentRes) => documentRes.status == 200,
     },
   );

   if (!checkOutput) {
     fail(documentRes.status);
   };
};