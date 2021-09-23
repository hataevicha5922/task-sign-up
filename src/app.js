import './styles/styles.scss';

import { v4 as uuidv4 } from 'uuid';

import {
  passwordStrengthController,
  emailLengthValidator,
  nameValidator,
  passwordStrengthInfo,
} from './shared/validators';
import { showErrorMessage, hideErrorMessage } from './shared/error-handler';
import { ERROR_MESSAGES } from './shared/error-messages';

const users = [];

export const singUpHandler = () => {
  const signUpForm = document.querySelector('.sign-up_form');
  const password_1 = document.getElementById('password_1');
  const password_2 = document.getElementById('password_2');
  const signup_btn = document.getElementById('signup_btn');
  const emailInput = document.getElementById('email');
  const userNameInput = document.getElementById('userName');
  const preloader = document.getElementById('preloader');

  const formFields = {
    userName: {
      isValid: false,
    },
    email: {
      isValid: false,
    },
    password_1: {
      isValid: false,
    },
    password_2: {
      isValid: false,
    },
  };

  signup_btn.setAttribute('disabled', true);
  signup_btn.addEventListener('click', () => {
    preloader.style.display = 'block';
  });

  userNameInput.oninput = () => {
    if (nameValidator(userNameInput.value)) {
      formFields.userName.isValid = true;
      userNameInput.classList.remove('invalid');
      hideErrorMessage('userNameError');
    } else {
      formFields.userName.isValid = false;
      userNameInput.classList.add('invalid');
    }
    checkFormValid();
  };

  userNameInput.onblur = () => {
    !nameValidator(userNameInput.value)
      ? showErrorMessage('userNameError', ERROR_MESSAGES.userName)
      : hideErrorMessage('userNameError');
  };

  emailInput.oninput = () => {
    if (emailLengthValidator(emailInput.value)) {
      formFields.email.isValid = true;
      hideErrorMessage('emailError');
      emailInput.classList.remove('invalid');
    } else {
      formFields.email.isValid = false;
      emailInput.classList.add('invalid');
    }
    checkFormValid();
  };

  emailInput.onblur = () => {
    !emailLengthValidator(emailInput.value)
      ? showErrorMessage('emailError', ERROR_MESSAGES.email)
      : hideErrorMessage('emailError');
  };

  password_1.oninput = () => {
    formFields.password_1.isValid = passwordStrengthController(
      password_1.value
    );
    checkFormValid();
  };

  password_2.oninput = () => {
    formFields.password_2.isValid =
      formFields.password_1 && password_1.value === password_2.value;
    checkFormValid();
  };

  password_2.onblur = () => {
    password_1.value !== password_2.value
      ? showErrorMessage(
          'passwordsCompereError',
          ERROR_MESSAGES.passwordsComparer
        )
      : hideErrorMessage('passwordsCompereError');
  };

  const checkFormValid = () => {
    const isFormValid = Object.values(formFields).every(
      (value) => value.isValid
    );
    isFormValid
      ? signup_btn.removeAttribute('disabled')
      : signup_btn.setAttribute('disabled', true);
  };

  signUpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = {
          firstName: userNameInput.value,
          email: emailInput.value,
          password: password_1.value,
          userId: uuidv4(),
        };
        resolve(user);
      }, 2000);
    });

    p.then((result) => {
      preloader.style.display = 'none';
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = JSON.stringify(result);
          resolve(user);
        }, 1000);
      }).then(() => {
        alert(`User completed`);
        userNameInput.value = null;
        emailInput.value = null;
        password_1.value = null;
        password_2.value = null;
        passwordStrengthInfo.style.display = 'none';
      });
    });
  });
};

singUpHandler();
