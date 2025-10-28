export enum FilterOperationConstants {
    EqualTo = "=",
    NotEqualTo = "!=",
    Contain = "Contain",
    NotContain = "NotContain",
    GreaterThan = ">",
    GreaterThanOrEqualTo = ">=",
    LessThan = "<",
    LessThanOrEqualTo = "<=",
    Between = "Between"    
}

export enum FilterOperationStringConstants {
    EqualTo = "eq",
    NotEqualTo = "ne",
    GreaterThan = "gt",
    GreaterThanOrEqualTo = "gte",
    LessThan = "lt",
    LessThanOrEqualTo = "lte",
    Contain = "contains",
    NotContain = "notContains",
    StartWith = "startsWith",
    EndWith = "endsWith",
    In = "in",
    NotIn = "notIn",
    Between = "between",
    IsNull = "isNull",
    IsNotNull = "isNotNull"    
}

export interface FilterCriteria {
    field: string;
    operation: FilterOperationStringConstants;
    value: any
}