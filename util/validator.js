module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  const regEx = /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  }
  if (!email.match(regEx)) {
    errors.email = "Email must be a vaild email address";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  if (password !== confirmPassword) {
    errors.password = "Passwords must match";
  }
  // 若是沒有error 則valid返回ture
  return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  // 若是沒有error 則valid返回ture
  return { errors, valid: Object.keys(errors).length < 1 };
};
