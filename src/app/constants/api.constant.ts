import { environment } from "../../environments/environment";
export const rootPath = environment.baseUrl;
export const patientrootPath = environment.basePatientUrl;
export const lienPortalrootPath = environment.baseLienPortalUrl;


export const loginURL = `${rootPath}/Login`;
export const RefreshTokenURL = `${rootPath}/RefreshToken`;
export const LogOutURL = `${rootPath}/LogOut`;
export const forgotPasswordURL = `${rootPath}/ForgotPassword`;
export const resetPasswordURL = `${rootPath}/UpdatePassword`;
export const getLoggedUserPermissionURL = `${rootPath}/GetLoggedUserPermission`;
export const activateAccountURL = `${rootPath}/ActivateUserAccount`;
export const activateorDeactivateUserURL = `${rootPath}/ActivateOrDeactivateUser`;
export const validateVerificationLinkURL = `${rootPath}/ValidateVerificationLink`;

export const createUserURL = `${rootPath}/CreateUser`;
export const updateUserURL = `${rootPath}/UpdateUser`;
export const getUserListURL = `${rootPath}/GetAllUsers`;
export const getUserbyIdURL = `${rootPath}/GetUserById`;
export const deleteUserbyIdURL = `${rootPath}/DeleteUserById`;
export const resendUserVerificationURL = `${rootPath}/ResendUserVerification`;
export const getBusinnessUnitURL = `${rootPath}/GetBussinessUnitList`;

export const addUpdateAlternate = `${rootPath}/AddUpdateAlternates`;
export const getAlternateListURL = `${rootPath}/GetProjectAlternates`;
export const deleteAlternateByIdURL = `${rootPath}/DeleteAlternatesById`;



export const addUpdateAllowance = `${rootPath}/AddUpdateAllowances`;
export const getAllowanceListURL = `${rootPath}/GetProjectAllowances`;
export const deleteAllowanceByIdURL = `${rootPath}/DeleteAllowanceById`;




export const addUpdateUnit = `${rootPath}/AddUpdateUnitPrices`;
export const getUnitListURL = `${rootPath}/GetProjectUnitPriceList`;
export const deleteUnitByIdURL = `${rootPath}/DeleteUnitPriceById`;




export const addUpdateAddendum = `${rootPath}/AddUpdateAddendums`;
export const getAddendumListURL = `${rootPath}/GetProjectAddendumList`;
export const deleteAddendumByIdURL = `${rootPath}/DeleteAddendumById`;







