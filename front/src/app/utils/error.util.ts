export function extractErrorMessage(error: any): string {
    if (error.error) {
        if (typeof error.error === 'string') {
            return error.error;
        } else if (error.error.message) {
            return error.error.message;
        }
    }
    return 'An error occurred. Please try again.';
}