// NOTE: NO import statements at the top

// ========================================================
// == Your Firebase Config Object ==
// ========================================================
const firebaseConfig = {
    apiKey: "AIzaSyA2m93RIc_Tev8Nps6eOEuYMQ7t1W37qSY",
    authDomain: "wave-ge.firebaseapp.com",
    projectId: "wave-ge",
    storageBucket: "wave-ge.firebasestorage.app", // Using the value you provided
    messagingSenderId: "871633670289",
    appId: "1:871633670289:web:b663e5e6fac98fa4846f30",
    measurementId: "G-5BX1MRY2ZC"
  };
// ========================================================

// Initialize Firebase using the global firebase object (from compat scripts)
let app;
let auth; // Declare auth variable
try {
  app = firebase.initializeApp(firebaseConfig); // Use firebase.initializeApp
  auth = firebase.auth(); // Initialize Auth service
  console.log("Firebase Initialized Successfully (compat)!");
  // const db = firebase.firestore(); // Initialize later if needed
} catch (error) {
  console.error("Firebase initialization failed:", error);
}


// --- Event Listener for DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Loaded. Setting up.");

  // --- Get Element References ---
  const splashScreen = document.getElementById('splash-screen');
  const registrationContainer = document.getElementById('main-content'); // Renamed for clarity
  const loginContainer = document.getElementById('login-content');     // Get login container
  const appShell = document.getElementById('app-shell');         // Get app shell
  
  const registrationForm = document.getElementById('registration-form'); // Use ID
  const loginForm = document.getElementById('login-form');             // Use ID
  
  const regFormMessages = document.getElementById('form-messages');
  const loginFormMessages = document.getElementById('login-form-messages');

  // --- Splash Screen Logic ---
  const animationDuration = 6000;
  console.log("Attempting to get splash/registration elements:", splashScreen, registrationContainer);
  if (splashScreen && registrationContainer) { // Show registration after splash
    console.log(`Setting timeout for splash screen removal (${animationDuration}ms)`);
    setTimeout(() => {
      console.log("TIMEOUT REACHED: Hiding splash, showing registration form.");
      splashScreen.classList.add('hidden');
      registrationContainer.classList.remove('hidden'); // Show registration by default
      console.log("Splash hidden, registration shown.");
    }, animationDuration);
  } else {
    console.error('Error: Splash screen or registration container element not found!');
  }

  // --- Helper Functions for Validation Styling ---
  function setError(inputElement, message) {
    // ... (setError function remains the same as before) ...
    if (!inputElement.classList.contains('border-red-500')) {
        console.log(`--> Setting error style for: ${inputElement.id}`); 
    }
    inputElement.classList.remove('border-gray-600', 'focus:ring-blue-500'); 
    inputElement.classList.add('border-red-500', 'focus:ring-red-500'); 
  }

  function clearError(inputElement) {
    // ... (clearError function remains the same as before) ...
     if (inputElement.classList.contains('border-red-500')) {
        console.log(`--> Clearing error style for: ${inputElement.id}`); 
        inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
        inputElement.classList.add('border-gray-600', 'focus:ring-blue-500');
    }
  }
  
  // --- Registration Form Logic ---
  if (registrationForm && auth) { 
    const regRequiredInputs = registrationForm.querySelectorAll('input[required]');
    const regPasswordInput = document.getElementById('password');
    const regPasswordConfirmInput = document.getElementById('password_confirm');

    registrationForm.addEventListener('submit', (event) => {
      console.log("--- Registration Form submit event triggered ---"); 
      event.preventDefault(); 
      let errors = []; 
      regFormMessages.textContent = ''; 
      regFormMessages.classList.remove('text-red-400', 'text-green-400', 'text-yellow-500'); 
      console.log("Clearing previous registration errors..."); 
      regRequiredInputs.forEach(clearError);
      
      // Visual Validation Checks (same as before)
      console.log("Checking required fields..."); 
      regRequiredInputs.forEach(input => { /* ... same checks ... */ 
          if (input.value.trim() === '') {
            const label = document.querySelector(`label[for='${input.id}']`);
            errors.push(`${label?.textContent || input.name || input.id} is required.`); 
            setError(input, 'Required'); 
          }
      });
      console.log("Checking password match..."); 
      if (regPasswordInput && regPasswordConfirmInput && regPasswordInput.value && regPasswordConfirmInput.value) { /* ... same check ... */ 
          if (regPasswordInput.value !== regPasswordConfirmInput.value) {
             errors.push('Passwords do not match.');
             setError(regPasswordInput, 'Mismatch'); 
             setError(regPasswordConfirmInput, 'Mismatch'); 
           }
      } else if (regPasswordInput?.value && !regPasswordConfirmInput?.value) {
           errors.push(`Confirm Password is required.`);
           setError(regPasswordConfirmInput, 'Required');
      }
      // --- End Visual Validation ---

      if (errors.length > 0) {
        regFormMessages.textContent = errors.join(' '); 
        regFormMessages.classList.add('text-red-400');
        console.log(`   Errors found: ${errors.length}`); 
      } else {
        // --- Firebase Registration Attempt ---
        console.log("Validation successful. Attempting Firebase registration...");
        regFormMessages.textContent = 'Processing registration...'; 
        regFormMessages.classList.remove('text-red-400', 'text-green-400', 'text-yellow-500');
        
        const email = document.getElementById('email').value;
        const password = regPasswordInput.value; 

        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log('Firebase user created:', user.uid, 'Verified:', user.emailVerified);
            user.sendEmailVerification()
              .then(() => {
                console.log('Verification email sending initiated.');
                regFormMessages.textContent = 'Registration successful! Please check your email (' + email + ') for a verification link.';
                regFormMessages.classList.add('text-green-400');
                registrationForm.reset(); 
              })
              .catch((error) => {
                 console.error("Error sending verification email:", error);
                 regFormMessages.textContent = 'Registration successful, but failed to send verification email.';
                 regFormMessages.classList.add('text-yellow-500'); 
              });
            // Still need to save other details to Firestore later
          })
          .catch((error) => {
            console.error("Firebase registration failed:", error.code, error.message);
            let errorMessage = `Registration failed: ${error.message}`;
            // ... (same specific error message handling as before) ...
            if (error.code === 'auth/email-already-in-use') { /*...*/ setError(document.getElementById('email'), 'In use'); }
            else if (error.code === 'auth/weak-password') { /*...*/ setError(regPasswordInput, 'Too weak'); }
             else if (error.code === 'auth/invalid-email') { /*...*/ setError(document.getElementById('email'), 'Invalid'); }
            regFormMessages.textContent = errorMessage;
            regFormMessages.classList.add('text-red-400');
          });
      }
      console.log("--- Registration submit handler finished ---"); 
    });
  } else { /* Error logging */ }


  // --- NEW: Login Form Logic ---
  if (loginForm && auth) {
      const loginEmailInput = document.getElementById('login-email');
      const loginPasswordInput = document.getElementById('login-password');

      loginForm.addEventListener('submit', (event) => {
          console.log("--- Login Form submit event triggered ---");
          event.preventDefault();
          loginFormMessages.textContent = 'Processing login...';
          loginFormMessages.classList.remove('text-red-400', 'text-green-400', 'text-yellow-500');
          clearError(loginEmailInput); // Clear previous errors
          clearError(loginPasswordInput);

          const email = loginEmailInput.value;
          const password = loginPasswordInput.value;

          // Basic empty check
          let loginErrors = [];
          if (email.trim() === '') {
              loginErrors.push('Email is required.');
              setError(loginEmailInput);
          }
           if (password.trim() === '') {
              loginErrors.push('Password is required.');
              setError(loginPasswordInput);
          }
          if(loginErrors.length > 0){
              loginFormMessages.textContent = loginErrors.join(' ');
              loginFormMessages.classList.add('text-red-400');
              console.log("Login validation errors found.");
              return; // Stop if fields are empty
          }

          // Attempt Firebase Login
          auth.signInWithEmailAndPassword(email, password)
              .then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;
                  console.log('Login successful:', user.uid, 'Email verified:', user.emailVerified);

                  if (user.emailVerified) {
                      // Email IS verified - show the main app!
                      console.log('Email IS verified. Showing app shell.');
                      loginFormMessages.textContent = 'Login successful!';
                      loginFormMessages.classList.add('text-green-400');

                      // Hide login and registration, show app shell
                      if(loginContainer) loginContainer.classList.add('hidden');
                      if(registrationContainer) registrationContainer.classList.add('hidden');
                      if(appShell) appShell.classList.remove('hidden');

                  } else {
                      // Email NOT verified - tell user to verify
                      console.log('Email NOT verified. Please check email.');
                      loginFormMessages.textContent = 'Please verify your email address first. Check your inbox (and spam folder) for the verification link.';
                      loginFormMessages.classList.add('text-yellow-500');
                      // Optional: Sign the user out immediately if not verified
                      auth.signOut(); 
                      console.log('User signed out as email is not verified.');
                  }
              })
              .catch((error) => {
                  // Handle login errors
                  console.error("Login failed:", error.code, error.message);
                  let loginErrorMessage = `Login failed: ${error.message}`;
                   if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                       loginErrorMessage = 'Login failed: Invalid email or password.';
                       setError(loginEmailInput);
                       setError(loginPasswordInput);
                   } else if (error.code === 'auth/invalid-email') {
                       loginErrorMessage = 'Login failed: Please enter a valid email address.';
                       setError(loginEmailInput);
                   }
                  loginFormMessages.textContent = loginErrorMessage;
                  loginFormMessages.classList.add('text-red-400');
              });
           console.log("--- Login submit handler finished ---");
      });
  } else { /* Error logging */ }
  
  // --- NEW: Logic to toggle between Register and Login forms ---
  const showLoginLink = document.getElementById('show-login-link');
  const showRegisterLink = document.getElementById('show-register-link');

  if (showLoginLink && showRegisterLink && registrationContainer && loginContainer) {
      showLoginLink.addEventListener('click', (e) => {
          e.preventDefault();
          registrationContainer.classList.add('hidden');
          loginContainer.classList.remove('hidden');
      });

      showRegisterLink.addEventListener('click', (e) => {
          e.preventDefault();
          loginContainer.classList.add('hidden');
          registrationContainer.classList.remove('hidden');
      });
  }

}); // End of DOMContentLoaded listener