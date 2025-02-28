// ************************************
// ERROR-HANDLING MIDDLEWARE FUNCTIONS
// ************************************

/**
 * Handle req that would produce a 404 status code and respons accordingly.
 */
export function error404(req, res, next) {
  next({ message: 'Not Found', status: 404 });
};

/**
 * Handle req that would produce a 500 status code and respons accordingly.
 */
export function error500(error, req, res, next) {
  res
    .status(error.status || 500)
    .json({
      error: {
        message: error.message,
      },
    });
};