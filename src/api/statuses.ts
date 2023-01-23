export enum ResponseStatuses {
    Ok = 200,
    Created = 201,
    BadRequest = 400,
    NotFound = 404,
    TooManyRequests = 429,
    InternalServerError = 500,
}

export enum CarStatuses {
    Started = 'started',
    Stopped = 'stopped',
    Drive = 'drive'
}
