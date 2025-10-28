import { FilterCriteria } from "./FilterOperationConstants.constant";

export enum BooleanOperation {
    And = 'and',
    Or = 'or',
    Not = 'not' 
}

export interface BooleanExpression {
    operation: BooleanOperation;
    conditions: (FilterCriteria | BooleanExpression);
}