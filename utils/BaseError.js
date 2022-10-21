class BaseError extends Error {
    constructor(status, message, error) {
        super(message)
        this.status = status
        this.error = error
    }
}
module.exports = BaseError