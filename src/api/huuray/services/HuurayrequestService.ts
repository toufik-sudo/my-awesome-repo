import * as CryptoJS from "crypto-js";
import { CatalogueParamsApi } from "../models/HuurayParams";

export class HuurayrequestService {
  public getHuurayRequest = (): CatalogueParamsApi => {
    const key = "QtAuyJfdqdbqdgbqdgbB7qkyMC03PW9Q";
    const md5 = CryptoJS.MD5("md5-" + new Date() + "rewardzaihuuraytestdev2023");
    const xApiNonce =
      new Date().getMilliseconds() * 25874 + "rewardzaihuuraytestdev2023";
    const xApiHash = CryptoJS.SHA512(key + xApiNonce).toString();
    return {
      xApiNonce: xApiNonce,
      xApiHash: xApiHash,
    };
  };
}
