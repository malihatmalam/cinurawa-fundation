import { ErrorConstants, ErrorMessageConstants } from "@foundation/Shared/Constants/ErrorCodeMessageConstants.constant";
import { BaseException } from "../BaseException";
import { IValidationError } from "./IValidationError";

export class ValidationException extends BaseException {
    public readonly errors: IValidationError[];

    constructor (errors: IValidationError[]){
        super(
            ErrorMessageConstants.ValidationError,
            ErrorConstants.ValidationError,
            {errors}
        );
        this.errors = errors;
    }
}