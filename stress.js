// === Stress - Load Testing ===

//API for testing: https://test-api.k6.io/auth/token/login/

import http from "k6/http";
import { sleep } from "k6";

export const options = {
 //https://k6.io/docs/using-k6/scenarios/
 //Scenarios configure how VUs and iteration schedules in granular detail.
 // With scenarios, you can model diverse workloads, or traffic patterns in load tests.
  scenarios: {
    stress: {
      //https://k6.io/docs/using-k6/scenarios/executors/
      // -> Each one schedules VUs and iterations differently, 
      //    and you'll choose one depending on the type of traffic you want to model to test your services.
      // -> ramping-arrival-rate: 	A variable number of iterations are executed in a specified period of time.
      // More info about this executor: https://k6.io/docs/using-k6/scenarios/executors/ramping-arrival-rate/
      executor: "ramping-arrival-rate",
      //Number of VUs to pre-allocate before test start to preserve runtime resources.
      preAllocatedVUs: 50,
      timeUnit: "1s",
      // Period of time to apply the startRate to the stages' target value.
      // Its value is constant for the whole duration of the scenario, it is not possible to change it for a specific stage.
      stages: [
        { duration: "10s", target: 50 },
        { duration: "20s", target: 50 },
//        { duration: "2m", target: 50 },
//        { duration: "1m", target: 5 },
      ],
    },
  },
  //k6 login cloud -t 4060058a77338bd7d88e6c112d01482dde030632befb2750f48b8ee121fe1f06
  //k6 run -o cloud smoke.js if I want to send this to k6 cloud
  ext: {
    loadimpact: {
      projectID: 1,
      // Test runs with the same name groups test runs together
      name: "Smoke demo"
    }
  }
};

export default function () {
  const BASE_URL = "https://test.zebrasign.com"; // make sure this is not production
  // -> https://k6.io/docs/javascript-api/k6-http/batch/
  // Batch multiple HTTP requests together to issue them in parallel over multiple TCP connections. 
  const responses = http.batch([
    ["GET", `${BASE_URL}/lt.json`],
    ["POST", `${BASE_URL}/login`],
    ["GET", `${BASE_URL}/document/statistics?folder_id=all&type=all`],
    ["POST", `${BASE_URL}/document/send-for-signing`],
    ["POST", `${BASE_URL}/document/sign`],


  ]);
}