import TryCatch from "../middlewares/TryCatch.js";
import sanitize from "mongo-sanitize";
import { registerSchema } from "../validation/zod.js";

export const registerUser = TryCatch(async (req, res) => {
  const sanitizedBody = sanitize(req.body);

  const validation = registerSchema.safeParse(sanitizedBody);
  if (!validation.success) {
    const zodError = validation.error;
    let firstErrorMessage = "Validation failed";
    let allError = [];

    if (zodError?.issues && Array.isArray(zodError.issues)) {
      allError = zodError.issues.map((issue) => ({
        field: issue.path ? issue.path.join(".") : "unknown",
        message: issue.message || "Validation Error",
        code: issue.code,
      }));
      firstErrorMessage = allError[0]?.message || "Validation Error";
    }

    return res.status(400).json({
      message: firstErrorMessage,
      error: allError,
    });
  }

  const { name, email, password } = validation.data;

  res.json({
    name,
    email,
    password,
  });
});
