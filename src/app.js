(function () {
  var mode = 'signup';
  var employees = [];
  var currentEmployee = null;

  var authPage = document.getElementById('auth-page');
  var dashboard = document.getElementById('dashboard');
  var profileView = document.getElementById('profile-view');
  var passwordView = document.getElementById('password-view');
  var showPasswordPageButton = document.getElementById('show-password-page');
  var backToProfileButton = document.getElementById('back-to-profile');
  var profileAvatar = document.getElementById('profile-avatar');
  var form = document.getElementById('auth-form');
  var formDescription = document.getElementById('form-description');
  var firstName = document.getElementById('firstName');
  var lastName = document.getElementById('lastName');
  var email = document.getElementById('email');
  var password = document.getElementById('password');
  var message = document.getElementById('message');
  var submitButton = document.getElementById('submit-button');
  var switchModeButton = document.getElementById('switch-mode');
  var logoutButton = document.getElementById('logout-button');
  var profileName = document.getElementById('profile-name');
  var profileEmail = document.getElementById('profile-email');
  var passwordForm = document.getElementById('password-form');
  var currentPassword = document.getElementById('currentPassword');
  var newPassword = document.getElementById('newPassword');
  var confirmPassword = document.getElementById('confirmPassword');
  var passwordMessage = document.getElementById('password-message');
  var signupFields = document.querySelectorAll('.signup-field');

  function findEmployeeByEmail(value) {
    for (var index = 0; index < employees.length; index += 1) {
      if (employees[index].email === value) {
        return employees[index];
      }
    }

    return null;
  }

  function setMessage(text, type) {
    message.textContent = text;
    message.className = type === 'success' ? 'message success' : 'message';
  }

  function setPasswordMessage(text, type) {
    passwordMessage.textContent = text;
    passwordMessage.className = type === 'success' ? 'message success' : 'message';
  }

  function clearForm() {
    form.reset();
  }

  function renderAuth() {
    var isSignup = mode === 'signup';

    formDescription.textContent = isSignup
      ? 'Create an employee account with your email.'
      : 'Login with your account.';

    submitButton.textContent = isSignup ? 'Sign Up' : 'Login';
    switchModeButton.textContent = isSignup
      ? 'Already have an account? Login'
      : 'Need an account? Sign up';
    password.placeholder = isSignup ? 'Create a password' : 'Enter your password';

    for (var index = 0; index < signupFields.length; index += 1) {
      signupFields[index].className = isSignup ? 'signup-field' : 'signup-field hidden';
    }
  }

  function showProfileView() {
    profileView.className = 'app-main';
    passwordView.className = 'app-main hidden';
  }

  function showPasswordView() {
    profileView.className = 'app-main hidden';
    passwordView.className = 'app-main';
    passwordForm.reset();
    setPasswordMessage('');
    currentPassword.focus();
  }

  function renderDashboard() {
    if (!currentEmployee) {
      authPage.className = 'page';
      dashboard.className = 'app hidden';
      renderAuth();
      return;
    }

    authPage.className = 'page hidden';
    dashboard.className = 'app';
    profileName.textContent = currentEmployee.firstName + ' ' + currentEmployee.lastName;
    profileEmail.textContent = currentEmployee.email;
    profileAvatar.textContent =
      currentEmployee.firstName.charAt(0) + currentEmployee.lastName.charAt(0);
    passwordForm.reset();
    setPasswordMessage('');
    showProfileView();
  }

  function updatePassword() {
    if (!currentEmployee) {
      return;
    }

    if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
      setPasswordMessage('Please fill out all password fields.');
      return;
    }

    if (currentPassword.value !== currentEmployee.password) {
      setPasswordMessage('Current password is incorrect.');
      return;
    }

    if (newPassword.value.length < 3) {
      setPasswordMessage('New password is too short.');
      return;
    }

    if (newPassword.value !== confirmPassword.value) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (newPassword.value === currentPassword.value) {
      setPasswordMessage('New password must be different from the current password.');
      return;
    }

    currentEmployee.password = newPassword.value;
    passwordForm.reset();
    setPasswordMessage('Password updated successfully.', 'success');
  }

  function signup() {
    var cleanFirstName = firstName.value.trim();
    var cleanLastName = lastName.value.trim();
    var cleanEmail = email.value.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName || !cleanEmail || !password.value) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (findEmployeeByEmail(cleanEmail)) {
      setMessage('An account with this email already exists.');
      return;
    }

    var employee = {
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      password: password.value,
    };

    employees.push(employee);
    currentEmployee = employee;
    clearForm();
    setMessage('');
    renderDashboard();
  }

  function login() {
    var cleanEmail = email.value.trim().toLowerCase();
    var employee = findEmployeeByEmail(cleanEmail);

    if (!employee || employee.password !== password.value) {
      setMessage('Invalid email or password.');
      return;
    }

    currentEmployee = employee;
    clearForm();
    setMessage('');
    renderDashboard();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (mode === 'signup') {
      signup();
    } else {
      login();
    }
  });

  form.addEventListener('input', function () {
    setMessage('');
  });

  switchModeButton.addEventListener('click', function () {
    mode = mode === 'signup' ? 'login' : 'signup';
    clearForm();
    setMessage('');
    renderAuth();
  });

  showPasswordPageButton.addEventListener('click', function () {
    showPasswordView();
  });

  backToProfileButton.addEventListener('click', function () {
    showProfileView();
  });

  passwordForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updatePassword();
  });

  passwordForm.addEventListener('input', function () {
    setPasswordMessage('');
  });

  logoutButton.addEventListener('click', function () {
    currentEmployee = null;
    mode = 'login';
    clearForm();
    renderDashboard();
    setMessage('You have been logged out.', 'success');
  });

  renderDashboard();
})();
