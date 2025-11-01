export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  
  // Log error details
  console.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle Razorpay errors specifically
  if (err.response && err.response.error) {
    return res.status(statusCode).json({
      success: false,
      message: err.response.error.description || err.message || 'Payment processing error',
      error: process.env.NODE_ENV === 'development' ? err.response.error : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

