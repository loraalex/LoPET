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
  getPentestDetail(payload) {
    devConsole.log("Sending request to get penTest detail from server..");
    return appApi.post(`${SECURITY}/get-pentest`, payload);
  },
  getAttackDetail(payload) {
    devConsole.log(
      "Sending request to get Attack detail from server.."
    );
    return appApi.post(`${SECURITY}/get-attack`, payload);
  },
  getAttackDetailCount(payload) {
    devConsole.log(
      "Sending request to get Attack detail count from server.."
    );
    return appApi.post(`${SECURITY}/message-count`, payload);
  },
}