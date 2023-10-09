// === Ramping VUs Login page ===

//API for testing: https://test-api.k6.io/auth/token/login/

import http from "k6/http";

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "ramping-arrival-rate",
      startRate: 300,
      timeUnit: "15s",
      preAllocatedVUs: 50,

           stages: [
        { target: 300, duration: "15s" },
        { target: 600, duration: "15s" },
        { target: 900, duration: "15s" },
        { target: 300, duration: "15s" },

      ],
    },
  },
};

export default function () {
  const BASE_URL = "https://test.zebrasign.com";
  const responses = http.batch([
    ["GET", `${BASE_URL}/lt.json`],
  ]);
}