const httpMessageConstants = {
  INTERNAL_SERVER_ERROR_MESSAGE: 'Internal server error',
  WRONG_AUTHORIZATION_TYPE_MESSAGE: 'Wrong authorization type, please use `Bearer`!',
  UNDEFINE_AUTHORIZATION_MESSAGE: 'Undefine Authorization, please check your authorization or login!',
  SUCCESSFULLY_REGISTRATION: 'Yeay, Successfully registration!',
  WRONG_INPUT_REGISTRATION: 'Unable to add user. Please check your input!',
  IMAGE_PROFILE_SUCCESSFULLY_UPLOADED: 'Image profile has been successfully uploaded!',
  EMAIL_NOT_FOUND: 'Email was not found. Please check again!',
  EMAIL_PASSWORD_NOT_MATCH: 'Email and Password do not match. Please check your email and password!',
  SUCCESSFULLY_SIGNIN: 'Yeay, Successfully sign in!',
  USER_NOT_FOUND: 'User not found',
  UNABLE_UPDATE_USER: 'Unable to update the user. Please check again!',
  RESET_PASSWORD_SUCCESSFULLY: 'Password reset email successfully sent!',
  TOKEN_NOT_FOUND_EXPIRED: 'Token not found or expired! Please do reset password again!',
  UNABLE_UPDATE_PASSWORD: 'Unable to update the password',
  PASSWORD_SUCCESSFULLY_RESET: 'Password reset successfully',
  UPDATE_PROFILE_SUCCESSFULY: 'Profile has been successfully updated!',
  EVENT_SUCCESSFULLY_DELETED: 'An Event has been successfully deleted!',
  EVENT_SUCCESSFULLY_EDITED: 'An Event has been successfully edited!',
  WRONG_TOKEN: 'No token provided!',
  INVALID_TOKEN: 'Invalid token!',
};

export default httpMessageConstants;
