import React from 'react';

function App() {
  return (
    <div className="page">
      <div className="signup-box">
        <div className="logo">
          <span>S</span>
          <h1>StepUp</h1>
        </div>

        <p>
          Start your wellness journey alongside others who are working toward
          healthier daily habits.
        </p>

        <form>
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" type="text" placeholder="Enter your first name" />

          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" type="text" placeholder="Enter your last name" />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Enter your email" />

          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Create a password" />

          <button type="button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default App;
