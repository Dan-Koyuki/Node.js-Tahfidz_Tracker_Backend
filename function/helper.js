import CustomError from "./customError.js";

// Helper functions
export const handleSuccess = (res, response) => {
  res.status(response.statusCode).json(response.data);
};

export const handleError = (res, error) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  res.status(500).json({
    error: error.message || "Unexpected Server Error. Please try again later.",
  });
};
