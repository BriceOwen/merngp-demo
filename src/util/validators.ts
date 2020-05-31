import { InputErrorInterface } from './interface';

export const validateRegisterInput = (
  username: string,
  email: string,
  password: string
) => {
  const errors: InputErrorInterface = {};
  let valid = true;

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
    valid = false;
  }

  if (email.trim() === '') {
    errors.email = 'Email must not be empty';
    valid = false;
  } else {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(regex)) {
      errors.email = 'Email must be a valid email adress';
      valid = false;
    }
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
    valid = false;
  }

  return {
    errors,
    valid,
  };
};

export const validateLoginInput = (username: string, password: string) => {
  const errors: InputErrorInterface = {};
  let valid = true;

  if (username.trim() === '') {
    errors.username = 'Username must not be empty';
    valid = false;
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
    valid = false;
  }

  return {
    errors,
    valid,
  };
};
