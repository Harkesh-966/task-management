import { ErrorHandler, Injectable } from '@angular/core';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private errors: ErrorService) { }
    handleError(error: any): void {
        this.errors.show('Something went wrong. Please try again.');
    }
}
