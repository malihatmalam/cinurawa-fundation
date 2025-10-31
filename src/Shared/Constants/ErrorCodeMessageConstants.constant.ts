import { HttpStatusCodeConstants } from "./HttpStatusCodeConstants.constant";

export const ExceptionText = "Exception";

export enum ErrorConstants {
    // ==========================================
    // 1. VALIDATION ERRORS (1000-1999)
    // ==========================================
    ValidationError = 'ValidationError', // 1000
    InvalidInput = 'InvalidInput', // 1001
    RequiredFieldMissing = 'RequiredFieldMissing', // 1002
    InvalidFormat = 'InvalidFormat', // 1003
    InvalidEmail = 'InvalidEmail', // 1004
    InvalidPhone = 'InvalidPhone', // 1005
    InvalidUrl = 'InvalidUrl', // 1006
    InvalidDate = 'InvalidDate', // 1007
    InvalidUuid = 'InvalidUuid', // 1008
    StringTooShort = 'StringTooShort', // 1009
    StringTooLong = 'StringTooLong', // 1010
    NumberTooSmall = 'NumberTooSmall', // 1011
    NumberTooLarge = 'NumberTooLarge', // 1012
    ArrayTooSmall = 'ArrayTooSmall', // 1013
    ArrayTooLarge = 'ArrayTooLarge', // 1014
    InvalidEnumValue = 'InvalidEnumValue', // 1015
    InvalidPasswordFormat = 'InvalidPasswordFormat', // 1016
    PasswordTooWeak = 'PasswordTooWeak', // 1017
    InvalidFileType = 'InvalidFileType', // 1018
    FileTooLarge = 'FileTooLarge', // 1019
    InvalidJson = 'InvalidJson', // 1020

    // ==========================================
    // 2. AUTHENTICATION ERRORS (2000-2999)
    // ==========================================
    Unauthorized = 'Unauthorized', // 2000
    InvalidCredentials = 'InvalidCredentials', // 2001
    TokenExpired = 'TokenExpired', // 2002
    TokenInvalid = 'TokenInvalid', // 2003
    TokenMissing = 'TokenMissing', // 2004
    RefreshTokenExpired = 'RefreshTokenExpired', // 2005
    RefreshTokenInvalid = 'RefreshTokenInvalid', // 2006
    SessionExpired = 'SessionExpired', // 2007
    AccountLocked = 'AccountLocked', // 2008
    AccountDisabled = 'AccountDisabled', // 2009
    EmailNotVerified = 'EmailNotVerified', // 2010
    TwoFactorRequired = 'TwoFactorRequired', // 2011
    InvalidTwoFactorCode = 'InvalidTwoFactorCode', // 2012

    // ==========================================
    // 3. AUTHORIZATION ERRORS (3000-3999)
    // ==========================================
    Forbidden = 'Forbidden', // 3000
    InsufficientPermissions = 'InsufficientPermissions', // 3001
    AccessDenied = 'AccessDenied', // 3002
    RoleRequired = 'RoleRequired', // 3003
    ResourceForbidden = 'ResourceForbidden', // 3004
    OperationNotAllowed = 'OperationNotAllowed', // 3005

    // ==========================================
    // 4. RESOURCE ERRORS (4000-4999)
    // ==========================================
    NotFound = 'NotFound', // 4000
    EntityNotFound = 'EntityNotFound', // 4001
    UserNotFound = 'UserNotFound', // 4002
    ResourceNotFound = 'ResourceNotFound', // 4003
    PageNotFound = 'PageNotFound', // 4004
    EndpointNotFound = 'EndpointNotFound', // 4005

    // ==========================================
    // 5. CONFLICT ERRORS (5000-5999)
    // ==========================================
    Conflict = 'Conflict', // 5000
    AlreadyExists = 'AlreadyExists', // 5001
    DuplicateEntry = 'DuplicateEntry', // 5002
    EmailAlreadyExists = 'EmailAlreadyExists', // 5003
    UsernameAlreadyExists = 'UsernameAlreadyExists', // 5004
    ResourceAlreadyExists = 'ResourceAlreadyExists', // 5005
    ConcurrentModification = 'ConcurrentModification', // 5006
    VersionConflict = 'VersionConflict', // 5007

    // ==========================================
    // 6. BUSINESS LOGIC ERRORS (6000-6999)
    // ==========================================
    BusinessRuleViolation = 'BusinessRuleViolation', // 6000
    InvalidState = 'InvalidState', // 6001
    OperationFailed = 'OperationFailed', // 6002
    InsufficientBalance = 'InsufficientBalance', // 6003
    QuotaExceeded = 'QuotaExceeded', // 6004
    LimitReached = 'LimitReached', // 6005
    ExpiredResource = 'ExpiredResource', // 6006
    InactiveResource = 'InactiveResource', // 6007
    InvalidOperation = 'InvalidOperation', // 6008
    PreconditionFailed = 'PreconditionFailed', // 6009
    DependencyNotMet = 'DependencyNotMet', // 6010

    // ==========================================
    // 7. EXTERNAL SERVICE ERRORS (7000-7999)
    // ==========================================
    ExternalServiceError = 'ExternalServiceError', // 7000
    PaymentGatewayError = 'PaymentGatewayError', // 7001
    EmailServiceError = 'EmailServiceError', // 7002
    SmsServiceError = 'SmsServiceError', // 7003
    StorageServiceError = 'StorageServiceError', // 7004
    ThirdPartyApiError = 'ThirdPartyApiError', // 7005
    IntegrationError = 'IntegrationError', // 7006

    // ==========================================
    // 8. SYSTEM ERRORS (8000-8999)
    // ==========================================
    InternalServerError = 'InternalServerError', // 8000
    DatabaseError = 'DatabaseError', // 8001
    CacheError = 'CacheError', // 8002
    QueueError = 'QueueError', // 8003
    FileSystemError = 'FileSystemError', // 8004
    NetworkError = 'NetworkError', // 8005
    TimeoutError = 'TimeoutError', // 8006
    ServiceUnavailable = 'ServiceUnavailable', // 8007
    MaintenanceMode = 'MaintenanceMode', // 8008
    ConfigurationError = 'ConfigurationError', // 8009

    // ==========================================
    // 9. RATE LIMITING (9000-9999)
    // ==========================================
    RateLimitExceeded = 'RateLimitExceeded', // 9000
    TooManyRequests = 'TooManyRequests', // 9001
    RequestThrottled = 'RequestThrottled', // 9002
    DailyLimitExceeded = 'DailyLimitExceeded', // 9003
    HourlyLimitExceeded = 'HourlyLimitExceeded', // 9004
}

export const ErrorCodeConstants: Record<ErrorConstants, number> = {
    // Validation Errors (400)
    [ErrorConstants.ValidationError]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidInput]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.RequiredFieldMissing]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidFormat]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidEmail]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidPhone]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidUrl]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidDate]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidUuid]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.StringTooShort]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.StringTooLong]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.NumberTooSmall]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.NumberTooLarge]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.ArrayTooSmall]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.ArrayTooLarge]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidEnumValue]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidPasswordFormat]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.PasswordTooWeak]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidFileType]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.FileTooLarge]: HttpStatusCodeConstants.BadRequest,
    [ErrorConstants.InvalidJson]: HttpStatusCodeConstants.BadRequest,

    // Authentication Errors (401)
    [ErrorConstants.Unauthorized]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.InvalidCredentials]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.TokenExpired]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.TokenInvalid]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.TokenMissing]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.RefreshTokenExpired]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.RefreshTokenInvalid]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.SessionExpired]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.AccountLocked]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.AccountDisabled]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.EmailNotVerified]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.TwoFactorRequired]: HttpStatusCodeConstants.UnAuthorized,
    [ErrorConstants.InvalidTwoFactorCode]: HttpStatusCodeConstants.UnAuthorized,

    // Authorization Errors (403)
    [ErrorConstants.Forbidden]: HttpStatusCodeConstants.Forbidden,
    [ErrorConstants.InsufficientPermissions]: HttpStatusCodeConstants.Forbidden,
    [ErrorConstants.AccessDenied]: HttpStatusCodeConstants.Forbidden,
    [ErrorConstants.RoleRequired]: HttpStatusCodeConstants.Forbidden,
    [ErrorConstants.ResourceForbidden]: HttpStatusCodeConstants.Forbidden,
    [ErrorConstants.OperationNotAllowed]: HttpStatusCodeConstants.Forbidden,

    // Not Found Errors (404)
    [ErrorConstants.NotFound]: HttpStatusCodeConstants.NotFound,
    [ErrorConstants.EntityNotFound]: HttpStatusCodeConstants.NotFound,
    [ErrorConstants.UserNotFound]: HttpStatusCodeConstants.NotFound,
    [ErrorConstants.ResourceNotFound]: HttpStatusCodeConstants.NotFound,
    [ErrorConstants.PageNotFound]: HttpStatusCodeConstants.NotFound,
    [ErrorConstants.EndpointNotFound]: HttpStatusCodeConstants.NotFound,

    // Conflict Errors (409)
    [ErrorConstants.Conflict]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.AlreadyExists]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.DuplicateEntry]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.EmailAlreadyExists]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.UsernameAlreadyExists]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.ResourceAlreadyExists]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.ConcurrentModification]: HttpStatusCodeConstants.Conflict,
    [ErrorConstants.VersionConflict]: HttpStatusCodeConstants.Conflict,

    // Business Logic Errors (422)
    [ErrorConstants.BusinessRuleViolation]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.InvalidState]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.OperationFailed]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.InsufficientBalance]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.QuotaExceeded]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.LimitReached]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.ExpiredResource]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.InactiveResource]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.InvalidOperation]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.PreconditionFailed]: HttpStatusCodeConstants.UnprocessableEntity,
    [ErrorConstants.DependencyNotMet]: HttpStatusCodeConstants.UnprocessableEntity,

    // External Service Errors (502)
    [ErrorConstants.ExternalServiceError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.PaymentGatewayError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.EmailServiceError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.SmsServiceError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.StorageServiceError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.ThirdPartyApiError]: HttpStatusCodeConstants.BadGateway,
    [ErrorConstants.IntegrationError]: HttpStatusCodeConstants.BadGateway,
    
    // System Errors (500)
    [ErrorConstants.InternalServerError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.DatabaseError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.CacheError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.QueueError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.FileSystemError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.NetworkError]: HttpStatusCodeConstants.InternalServerError,
    [ErrorConstants.TimeoutError]: HttpStatusCodeConstants.GatewayTimeout,
    [ErrorConstants.ServiceUnavailable]: HttpStatusCodeConstants.ServiceUnavailable,
    [ErrorConstants.MaintenanceMode]: HttpStatusCodeConstants.ServiceUnavailable,
    [ErrorConstants.ConfigurationError]: HttpStatusCodeConstants.InternalServerError,

    // Rate Limiting (429)
    [ErrorConstants.RateLimitExceeded]: HttpStatusCodeConstants.TooManyRequests,
    [ErrorConstants.TooManyRequests]: HttpStatusCodeConstants.TooManyRequests,
    [ErrorConstants.RequestThrottled]: HttpStatusCodeConstants.TooManyRequests,
    [ErrorConstants.DailyLimitExceeded]: HttpStatusCodeConstants.TooManyRequests,
    [ErrorConstants.HourlyLimitExceeded]: HttpStatusCodeConstants.TooManyRequests
};

export const ErrorMessageConstants: Record<ErrorConstants, string> = {
    // Validation Errors
    [ErrorConstants.ValidationError]: "Validation failed",
    [ErrorConstants.InvalidInput]: "Invalid input provided",
    [ErrorConstants.RequiredFieldMissing]: "Required field is missing",
    [ErrorConstants.InvalidFormat]: "Invalid format",
    [ErrorConstants.InvalidEmail]: "Invalid email address",
    [ErrorConstants.InvalidPhone]: "Invalid phone number",
    [ErrorConstants.InvalidUrl]: "Invalid URL",
    [ErrorConstants.InvalidDate]: "Invalid date format",
    [ErrorConstants.InvalidUuid]: "Invalid UUID format",
    [ErrorConstants.StringTooShort]: "String is too short",
    [ErrorConstants.StringTooLong]: "String is too long",
    [ErrorConstants.NumberTooSmall]: "Number is too small",
    [ErrorConstants.NumberTooLarge]: "Number is too large",
    [ErrorConstants.ArrayTooSmall]: "Array has too few items",
    [ErrorConstants.ArrayTooLarge]: "Array has too many items",
    [ErrorConstants.InvalidEnumValue]: "Invalid enum value",
    [ErrorConstants.InvalidPasswordFormat]: "Invalid password format",
    [ErrorConstants.PasswordTooWeak]: "Password is too weak",
    [ErrorConstants.InvalidFileType]: "Invalid file type",
    [ErrorConstants.FileTooLarge]: "File size exceeds limit",
    [ErrorConstants.InvalidJson]: "Invalid JSON format",

    // Authentication Errors
    [ErrorConstants.Unauthorized]: "Authentication required",
    [ErrorConstants.InvalidCredentials]: "Invalid credentials",
    [ErrorConstants.TokenExpired]: "Authentication token expired",
    [ErrorConstants.TokenInvalid]: "Invalid authentication token",
    [ErrorConstants.TokenMissing]: "Authentication token missing",
    [ErrorConstants.RefreshTokenExpired]: "Refresh token expired",
    [ErrorConstants.RefreshTokenInvalid]: "Invalid refresh token",
    [ErrorConstants.SessionExpired]: "Session expired",
    [ErrorConstants.AccountLocked]: "Account is locked",
    [ErrorConstants.AccountDisabled]: "Account is disabled",
    [ErrorConstants.EmailNotVerified]: "Email not verified",
    [ErrorConstants.TwoFactorRequired]: "Two-factor authentication required",
    [ErrorConstants.InvalidTwoFactorCode]: "Invalid two-factor authentication",

    // Authorization Errors
    [ErrorConstants.Forbidden]: "Access forbidden",
    [ErrorConstants.InsufficientPermissions]: "Insufficient permissions",
    [ErrorConstants.AccessDenied]: "Access denied",
    [ErrorConstants.RoleRequired]: "Required role not found",
    [ErrorConstants.ResourceForbidden]: "Resource access forbidden",
    [ErrorConstants.OperationNotAllowed]: "Operation not allowed",

    // Resource Errors
    [ErrorConstants.NotFound]: "Resource not found",
    [ErrorConstants.EntityNotFound]: "Entity not found",
    [ErrorConstants.UserNotFound]: "User not found",
    [ErrorConstants.ResourceNotFound]: "Resource not found",
    [ErrorConstants.PageNotFound]: "Page not found",
    [ErrorConstants.EndpointNotFound]: "Endpoint not found",

    // Conflict Errors
    [ErrorConstants.Conflict]: "Resource conflict",
    [ErrorConstants.AlreadyExists]: "Resource already exists",
    [ErrorConstants.DuplicateEntry]: "Duplicate entry",
    [ErrorConstants.EmailAlreadyExists]: "Email already exists",
    [ErrorConstants.UsernameAlreadyExists]: "Username already exists",
    [ErrorConstants.ResourceAlreadyExists]: "Resource already exists",
    [ErrorConstants.ConcurrentModification]: "Concurrent modification detected",
    [ErrorConstants.VersionConflict]: "Version conflict",

    // Business Logic Errors
    [ErrorConstants.BusinessRuleViolation]: "Business rule violation",
    [ErrorConstants.InvalidState]: "Invalid state",
    [ErrorConstants.OperationFailed]: "Operation failed",
    [ErrorConstants.InsufficientBalance]: "Insufficient balance",
    [ErrorConstants.QuotaExceeded]: "Quota exceeded",
    [ErrorConstants.LimitReached]: "Limit reached",
    [ErrorConstants.ExpiredResource]: "Resource expired",
    [ErrorConstants.InactiveResource]: "Resource inactive",
    [ErrorConstants.InvalidOperation]: "Invalid operation",
    [ErrorConstants.PreconditionFailed]: "Precondition failed",
    [ErrorConstants.DependencyNotMet]: "Dependency not met",

    // External Service Errors
    [ErrorConstants.ExternalServiceError]: "External service error",
    [ErrorConstants.PaymentGatewayError]: "Payment gateway error",
    [ErrorConstants.EmailServiceError]: "Email service error",
    [ErrorConstants.SmsServiceError]: "SMS service error",
    [ErrorConstants.StorageServiceError]: "Storage service error",
    [ErrorConstants.ThirdPartyApiError]: "Third-party API error",
    [ErrorConstants.IntegrationError]: "Integration error",

    // System Errors
    [ErrorConstants.InternalServerError]: "Internal server error",
    [ErrorConstants.DatabaseError]: "Database error",
    [ErrorConstants.CacheError]: "Cache error",
    [ErrorConstants.QueueError]: "Queue error",
    [ErrorConstants.FileSystemError]: "File system error",
    [ErrorConstants.NetworkError]: "Network error",
    [ErrorConstants.TimeoutError]: "Request timeout",
    [ErrorConstants.ServiceUnavailable]: "Service unavailable",
    [ErrorConstants.MaintenanceMode]: "Service under maintenance",
    [ErrorConstants.ConfigurationError]: "Configuration error",

    // Rate Limiting
    [ErrorConstants.RateLimitExceeded]: "Rate limit exceeded",
    [ErrorConstants.TooManyRequests]: "Too many requests",
    [ErrorConstants.RequestThrottled]: "Request throttled",
    [ErrorConstants.DailyLimitExceeded]: "Daily limit exceeded",
    [ErrorConstants.HourlyLimitExceeded]: "Hourly limit exceeded"
}