export const ErrorMessageConstants = {
    // Domain Errors
    EntityNotFound: '{0} not found',
    EntityAlreadyExist: '{0} with id {1} already exists',

    // Validation Errors
    ValidationFailed: 'Validation failed',
    RequiredField: '{0} is required',
    InvalidFormat: '{0} invalid format',
    InvalidLength: '{0} must {1} characters',
    InvalidRange: '{0} must be between {1} and {2}',

    // Business Errors
    BusinessRuleViolation: 'Business rule violation: {0}',
    InsufficientPermissions: 'Insufficient permissions to perform this action',
    OperationNotAllowed: 'Operation {0} is not allowed',

    // Infrastructure Errors
    DatabaseError: 'Database operation failed',
    CacheError: 'Cache operation failed',
    NetworkError: 'Network operation failed',
    ExternalServiceError: 'External service {0} is unavailabe',

    // System Errors
    InternalError: 'Internal server error occurred',
    TimeoutError: 'Operation timed out',
    ConcurrentModification: 'Concurrent modification detected'
} as const;