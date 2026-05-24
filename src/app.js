(function () {
  var mode = 'signup';
  var employees = [];
  var currentEmployee = null;

  var authPanel = document.getElementById('auth-panel');
  var dashboard = document.getElementById('dashboard');
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
  var welcomeTitle = document.getElementById('welcome-title');
  var welcomeMessage = document.getElementById('welcome-message');
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

  function renderDashboard() {
    if (!currentEmployee) {
      authPanel.className = 'auth-box';
      dashboard.className = 'auth-box hidden';
      renderAuth();
      return;
    }

    authPanel.className = 'auth-box hidden';
    dashboard.className = 'auth-box';
    welcomeTitle.textContent = 'Welcome, ' + currentEmployee.firstName;
    welcomeMessage.textContent = 'You are signed in with ' + currentEmployee.email + '.';
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

  logoutButton.addEventListener('click', function () {
    currentEmployee = null;
    mode = 'login';
    clearForm();
    renderDashboard();
    setMessage('You have been logged out.', 'success');
  });

  renderDashboard();
})();
