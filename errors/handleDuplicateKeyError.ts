import { IGenericErrorMessage } from '../interfaces/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateKeyError = (error: any) => {
  const duplicateKey = Object.keys(error.keyValue)[0];
  const duplicateErrorMessage = `Duplicate value '${error.keyValue[duplicateKey]}' for '${duplicateKey}' field`;
  const errors: IGenericErrorMessage[] = [
    {
      path: duplicateKey,
      message: duplicateErrorMessage,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: 'Duplicate Key Error',
    errorMessages: errors,
  };
};
export default handleDuplicateKeyError;
