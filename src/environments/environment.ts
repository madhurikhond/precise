// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: `http://localhost:64465/api`,
  onlyDomain: `http://localhost:64465/api/`,
  // onlyDomain: `https://radlogix.radflow360.com/`,
  // baseUrl: `http://192.168.1.23:81/api`,
  // baseUrl: `https://dev-precise.radflow360.com/API/api`,
 // baseUrl: `http://localhost:64465/api`,
 baseUrl: `http://localhost:64465/api`,
  currentVersion: `1`,
  Dynamsoft: {
    resourcesPath: 'assets/dwt-resources',
    uploadTargetURL: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
