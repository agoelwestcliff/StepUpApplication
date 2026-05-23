import React, { useState } from 'react';

const personalEmailDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'aol.com',
];

function isCompanyEmail(email) {
  const domain = email.trim().toLowerCase().split('@')[1];
  return domain && !personalEmailDomains.includes(domain);
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [mode, setMode] = useState('signup');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  function updateForm(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
    setMessage('');
  }

  function resetForm() {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  }

  function handleSignup(event) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!firstName || !lastName || !email || !form.password) {
      setMessage('Please fill out all fields.');
      return;
    }

    if (!isCompanyEmail(email)) {
      setMessage('Please use your company email address.');
      return;
    }

    if (employees.some((employee) => employee.email === email)) {
      setMessage('An account with this email already exists.');
      return;
    }

    const employee = {
      firstName,
      lastName,
      email,
      password: form.password,
    };

    setEmployees([...employees, employee]);
    setCurrentEmployee(employee);
    resetForm();
    setMessage('');
  }

  function handleLogin(event) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const employee = employees.find(
      (account) => account.email === email && account.password === form.password,
    );

    if (!employee) {
      setMessage('Invalid email or password.');
      return;
    }

    setCurrentEmployee(employee);
    resetForm();
    setMessage('');
  }

  function handleLogout() {
    setCurrentEmployee(null);
    setMode('login');
    setMessage('You have been logged out.');
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setMessage('');
    resetForm();
  }

  if (currentEmployee) {
    return (
      <div className="page">
        <div className="auth-box">
          <div className="logo">
            <span>S</span>
            <h1>StepUp</h1>
          </div>

          <h2>Welcome, {currentEmployee.firstName}</h2>
          <p>You are signed in with {currentEmployee.email}.</p>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  const isSignup = mode === 'signup';

  return (
    <div className="page">
      <div className="auth-box">
        <div className="logo">
          <span>S</span>
          <h1>StepUp</h1>
        </div>

        <p>
          {isSignup
            ? 'Create an employee account with your company email.'
            : 'Login with your employee account.'}
        </p>

        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          {isSignup && (
            <>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={updateForm}
                placeholder="Enter your first name"
              />

              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={updateForm}
                placeholder="Enter your last name"
              />
            </>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateForm}
            placeholder="Enter your company email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateForm}
            placeholder={isSignup ? 'Create a password' : 'Enter your password'}
          />

          {message && <p className="message">{message}</p>}

          <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>

        <button
          className="link-button"
          type="button"
          onClick={() => switchMode(isSignup ? 'login' : 'signup')}
        >
          {isSignup ? 'Already have an account? Login' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
}

export default App;
