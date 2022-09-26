"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exports.rootPath = "BidArt"; //server
export const rootPath = `http://staging.bidart.sensationsolutions.in/BidArt`; //local
exports.loginURL = exports.rootPath + "/Login";
exports.forgotPasswordURL = exports.rootPath + "/ForgotPassword";
exports.resetPasswordURL = exports.rootPath + "/UpdatePassword";
exports.activateAccountURL = exports.rootPath + "/ActivateUserAccount";
exports.createUserURL = exports.rootPath + "/CreateUser";
exports.updateUserURL = exports.rootPath + "/UpdateUser";
exports.getUserListURL = exports.rootPath + "/GetAllUsers";
exports.getUserbyIdURL = exports.rootPath + "/GetUserById";
exports.deleteUserbyIdURL = exports.rootPath + "/DeleteUserById";
exports.addUpdateAlternate = exports.rootPath + "/AddUpdateAlternates";
exports.getAlternateListURL = exports.rootPath + "/GetProjectAlternates";
exports.addUpdateAllowance = exports.rootPath + "/AddUpdateAllowances";
exports.getAllowanceListURL = exports.rootPath + "/GetProjectAllowances";
exports.addUpdateUnit = exports.rootPath + "/AddUpdateUnitPrices";
exports.getUnitListURL = exports.rootPath + "/GetAddUpdateUnitPrices";
exports.addUpdateAddendum = exports.rootPath + "/AddUpdateAddendums";
exports.getAddendumListURL = exports.rootPath + "/GetProjectAddendumList";
//# sourceMappingURL=api.constant.js.map