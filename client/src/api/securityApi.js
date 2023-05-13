import appApi from "./index";
import devConsole from "../devConsole";

import { SECURITY } from "../services/URLs";

export default {
  getPentests(payload) {
    devConsole.log("Sending request to get penTests from server..");
    return appApi.post(SECURITY, payload);
  },
  getCountOfPentests() {
    devConsole.log(
      "Sending request to get count of penTests from server.."
    );
    return appApi.get(SECURITY); 
  },
  createPentest(payload) {
    devConsole.log(
      "Sending request to create new penTest.."
    );
    return appApi.post(`${SECURITY}/create-pentest`, payload);
  },
}