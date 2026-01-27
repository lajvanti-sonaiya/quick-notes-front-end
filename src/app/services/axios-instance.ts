import { envObj } from "@/config";
const { default: axios } = require("axios");

export const axiosInstance = axios.create({
  baseURL: envObj.BASE_URL,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },

});
