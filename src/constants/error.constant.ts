export enum ErrorEnum {
  USER_NOT_FOUND = 'User does not exist.',
  USER_EXISTS = 'User already exists.',
  USER_DEACTIVATED = 'User has been deactivated.',

  ACCESS_DENIED = 'Access denied. Admin permissions required.',

  LOGOUT_FAILED = 'Failed to log out. Try again later.',

  INVALID_EMAIL = 'Please enter a valid email.',

  VIEWS_NOT_FOUND = 'No views found.',

  POST_NOT_FOUND = 'No post found.',

  LIKE_EXISTS = 'You have already liked this post.',
  LIKE_NOT_FOUND = 'No like found.',

  MESSAGE_NOT_FOUND = 'No message found.',

  VERIFICATION_CODE_SEND_FAILED = 'Failed to send verification code.',
  VERIFICATION_CODE_INVALID = 'Incorrect verification code.',
  VERIFICATION_CODE_EXPIRED = 'Verification code expired.',
}
