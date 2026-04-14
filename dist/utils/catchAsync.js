/**
 * 🎣 catchAsync Wrapper
 * Wraps an async function and catches any errors to pass them to next().
 * This eliminates the need for try-catch blocks in controllers.
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
//# sourceMappingURL=catchAsync.js.map