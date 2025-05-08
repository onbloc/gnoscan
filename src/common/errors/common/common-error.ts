import { BaseError } from "@/common/errors";

const ERROR_VALUE = {
  FAILED_INITIALIZE_PROVIDER: {
    status: 400,
    type: "Failed to initialize Provider",
  },
  FAILED_INITIALIZE_REPOSITORY: {
    status: 401,
    type: "Failed to initialize Repository",
  },
};

type ErrorType = keyof typeof ERROR_VALUE;

export class CommonError extends BaseError {
  constructor(errorType: ErrorType, additionalInfo?: string) {
    const errorValue = { ...ERROR_VALUE[errorType] };

    if (additionalInfo) {
      errorValue.type = `${errorValue.type}: ${additionalInfo}`;
    }

    super(ERROR_VALUE[errorType]);
    Object.setPrototypeOf(this, CommonError.prototype);
  }
}
