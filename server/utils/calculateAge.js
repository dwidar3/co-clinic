// utils/calculateAge.js
import ErrorResponse from "./errorResponse.js";

// Checks if the input is a valid ISO string or a valid timestamp
const isStrictValidDate = (input) => {
  if (input instanceof Date && !isNaN(input.getTime())) return true;

  if (typeof input === "string") {
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
    if (!isoRegex.test(input)) return false;
  } else if (typeof input === "number") {
    if (!Number.isInteger(input) || input <= 0) return false;
  } else {
    return false;
  }

  const parsed = new Date(input);
  return parsed instanceof Date && !isNaN(parsed.getTime());
};


export default function calculateAge(birthDate) {
  if (!birthDate) {
    throw new ErrorResponse("No birth date provided for age calculation.", 400);
  }

  if (!isStrictValidDate(birthDate)) {
    throw new ErrorResponse(
      "Invalid birth date format. Please provide a valid ISO date string (YYYY-MM-DD) or timestamp.",
      400
    );
  }

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
