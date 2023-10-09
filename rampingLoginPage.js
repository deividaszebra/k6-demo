// === Ramping VUs Login page ===

//API for testing: https://test-api.k6.io/auth/token/login/

import http from "k6/http";
import { sleep } from "k6";

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

export default function () {
  const BASE_URL = "https://test.zebrasign.com";
  const responses = http.batch([
    ["GET", `${BASE_URL}/lt.json`],
  ]);
}