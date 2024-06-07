export enum ErrorEnum {
  USER_NOT_FOUND = 'User does not exist.',
  USER_EXISTS = 'User already exists.',
  USER_DEACTIVATED = 'User has been deactivated.',

  LOGOUT_FAILED = 'Failed to log out. Try again later.',

  INVALID_EMAIL = 'Please enter a valid email.',

  VIEWS_NOT_FOUND = 'No views found.',

  VERIFICATION_CODE_SEND_FAILED = 'Failed to send verification code.',
  VERIFICATION_CODE_INVALID = 'Incorrect verification code.',
  VERIFICATION_CODE_EXPIRED = 'Verification code expired.',
}
