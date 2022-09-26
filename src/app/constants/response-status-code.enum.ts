export enum ResponseStatusCode {
    OK = 200,
    Created,
    Accepted,

    BadRequest = 400,
    Unauthorized,
    PaymentRequired,
    Forbidden,
    NotFound,

    InternalError = 500
}
