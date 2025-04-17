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
let auth;
let db; // <<< Declare db variable
try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth(); // Initialize Auth service
  db = firebase.firestore(); // <<< Initialize Firestore service
  console.log("Firebase Initialized Successfully (compat)!");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}


// --- Event Listener for DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Loaded. Setting up.");

  // --- Get Element References ---
  const splashScreen = document.getElementById('splash-screen');
  const registrationContainer = document.getElementById('main-content');
  const loginContainer = document.getElementById('login-content');
  const appShell = document.getElementById('app-shell');
  const pageContent = document.getElementById('page-content');

  const registrationForm = document.getElementById('registration-form');
  const loginForm = document.getElementById('login-form');

  const regFormMessages = document.getElementById('form-messages');
  const loginFormMessages = document.getElementById('login-form-messages');

  // Links to toggle between login/register
  const showLoginLink = document.getElementById('show-login-link');
  const showRegisterLink = document.getElementById('show-register-link');

  // Navigation Links & Page Content Sections
  const navLinks = document.querySelectorAll('#app-shell .nav-link');
  const pageSections = pageContent ? pageContent.querySelectorAll('.page') : [];


  // --- Splash Screen Logic ---
  const animationDuration = 6000; // Set lower (e.g., 100) for faster testing
  if (splashScreen && registrationContainer) {
    setTimeout(() => {
      splashScreen.classList.add('hidden');
      registrationContainer.classList.remove('hidden');
    }, animationDuration);
  } else { /* error log */ }

  // --- Helper Functions for Validation Styling ---
  function setError(inputElement, message) { /* ... same as before ... */ if(!inputElement.classList.contains('border-red-500')){console.log(`--> Setting error style for: ${inputElement.id}`);} inputElement.classList.remove('border-gray-600','focus:ring-blue-500'); inputElement.classList.add('border-red-500','focus:ring-red-500'); }
  function clearError(inputElement) { /* ... same as before ... */ if(inputElement.classList.contains('border-red-500')){console.log(`--> Clearing error style for: ${inputElement.id}`); inputElement.classList.remove('border-red-500','focus:ring-red-500'); inputElement.classList.add('border-gray-600','focus:ring-blue-500');}}

  // --- Registration Form Logic ---
  if (registrationForm && auth && db) { // Check for db too
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
      // ... (empty field checks, password match checks) ...
        console.log("Checking required fields..."); 
        regRequiredInputs.forEach(input => { if (input.value.trim() === '') {const label = document.querySelector(`label[for='${input.id}']`); errors.push(`${label?.textContent || input.name || input.id} is required.`); setError(input, 'Required');}});
        console.log("Checking password match..."); if (regPasswordInput && regPasswordConfirmInput && regPasswordInput.value && regPasswordConfirmInput.value) { if (regPasswordInput.value !== regPasswordConfirmInput.value) { errors.push('Passwords do not match.'); setError(regPasswordInput, 'Mismatch'); setError(regPasswordConfirmInput, 'Mismatch');}} else if (regPasswordInput?.value && !regPasswordConfirmInput?.value) { errors.push(`Confirm Password is required.`); setError(regPasswordConfirmInput, 'Required');}
        
      if (errors.length > 0) {
        regFormMessages.textContent = errors.join(' ');
        regFormMessages.classList.add('text-red-400');
        console.log(`   Errors found: ${errors.length}`);
        console.log("--- Registration submit handler finished (validation errors) ---");
        return; 
      }

      // --- If validation passes, attempt Firebase registration & Firestore write ---
      console.log("Validation successful. Attempting Firebase registration...");
      regFormMessages.textContent = 'Processing registration...';
      regFormMessages.classList.remove('text-red-400', 'text-green-400', 'text-yellow-500');

      // Get all form values
      const email = document.getElementById('email').value;
      const password = regPasswordInput.value;
      const username = document.getElementById('username').value;
      const firstName = document.getElementById('first_name').value;
      const lastName = document.getElementById('last_name').value;
      const phone = document.getElementById('phone').value;

      // 1. Create user in Firebase Authentication
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Firebase user created successfully:', user.uid, 'Email verified:', user.emailVerified);

          // 2. Save additional user info to Firestore
          console.log('Attempting to save user details to Firestore...');
          const userData = {
              username: username,
              firstName: firstName,
              lastName: lastName,
              email: email, // Store email here too for convenience
              phone: phone,
              createdAt: firebase.firestore.FieldValue.serverTimestamp() // Record creation time
              // Add wallet info structure here later if needed
          };

          // Use user.uid as the document ID in the 'users' collection
          db.collection("users").doc(user.uid).set(userData)
            .then(() => {
                console.log("User data successfully written to Firestore!");

                // 3. Send verification email (after data saved or concurrently)
                user.sendEmailVerification()
                  .then(() => {
                    console.log('Verification email sending initiated.');
                    regFormMessages.textContent = 'Registration successful! User data saved. Please check your email (' + email + ') for a verification link.';
                    regFormMessages.classList.add('text-green-400');
                    registrationForm.reset(); // Clear the form on complete success
                  })
                  .catch((error) => {
                     console.error("Error sending verification email:", error);
                     regFormMessages.textContent = 'Registration successful & data saved, but failed to send verification email.';
                     regFormMessages.classList.add('text-yellow-500');
                  });
            })
            .catch((error) => {
                console.error("Error writing user data to Firestore:", error);
                // Decide how to handle this - user exists in Auth but not Firestore
                // Might want to delete the auth user or prompt retry? For now, show error.
                regFormMessages.textContent = 'User account created, but failed to save profile data. Please contact support.';
                regFormMessages.classList.add('text-red-400');
                // Potentially delete the auth user if data saving fails critically?
                // user.delete().catch(delErr => console.error("Failed to delete auth user after firestore error", delErr));
            });

        })
        .catch((error) => {
          // Handle Firebase Authentication registration errors
          console.error("Firebase registration failed:", error.code, error.message);
          let errorMessage = `Registration failed: ${error.message}`;
          // ... (same specific error message handling as before) ...
           if (error.code === 'auth/email-already-in-use') {errorMessage = 'Registration failed: This email address is already registered.'; setError(document.getElementById('email'), 'In use');} else if (error.code === 'auth/weak-password') { errorMessage = 'Registration failed: Password should be at least 6 characters long.'; setError(passwordInput, 'Too weak'); } else if (error.code === 'auth/invalid-email') { errorMessage = 'Registration failed: The email address is not valid.'; setError(document.getElementById('email'), 'Invalid'); }
          regFormMessages.textContent = errorMessage;
          regFormMessages.classList.add('text-red-400');
        });

      console.log("--- Registration submit handler finished (Firebase call initiated) ---");
    });
  } else { /* Error logging */ }


  // --- Login Form Logic ---
  if (loginForm && auth && db) { // Check for db too
      const loginEmailInput = document.getElementById('login-email');
      const loginPasswordInput = document.getElementById('login-password');
      loginForm.addEventListener('submit', (event) => { /* ... same login logic as before ... */
            console.log("--- Login Form submit event triggered ---"); event.preventDefault(); loginFormMessages.textContent = 'Processing login...'; loginFormMessages.classList.remove('text-red-400','text-green-400','text-yellow-500'); clearError(loginEmailInput); clearError(loginPasswordInput);
            const email = loginEmailInput.value; const password = loginPasswordInput.value;
            let loginErrors = []; if(email.trim()===''){loginErrors.push('Email is required.');setError(loginEmailInput);} if(password.trim()===''){loginErrors.push('Password is required.');setError(loginPasswordInput);} if(loginErrors.length > 0){loginFormMessages.textContent=loginErrors.join(' ');loginFormMessages.classList.add('text-red-400');console.log("Login validation errors found."); return;}
            auth.signInWithEmailAndPassword(email, password)
              .then((userCredential) => { const user = userCredential.user; console.log('Login successful:', user.uid,'Email verified:', user.emailVerified);
                  if (user.emailVerified) { console.log('Email IS verified. Showing app shell.'); loginFormMessages.textContent = 'Login successful!'; loginFormMessages.classList.add('text-green-400'); if(loginContainer) loginContainer.classList.add('hidden'); if(registrationContainer) registrationContainer.classList.add('hidden'); if(appShell) appShell.classList.remove('hidden');} 
                  else { console.log('Email NOT verified. Please check email.'); loginFormMessages.textContent = 'Please verify your email address first. Check your inbox (and spam folder) for the verification link.'; loginFormMessages.classList.add('text-yellow-500'); auth.signOut(); console.log('User signed out as email is not verified.');}
              })
              .catch((error) => { console.error("Login failed:", error.code, error.message); let loginErrorMessage=`Login failed: ${error.message}`; if(error.code === 'auth/user-not-found'||error.code === 'auth/wrong-password'||error.code === 'auth/invalid-credential'){loginErrorMessage='Login failed: Invalid email or password.';setError(loginEmailInput);setError(loginPasswordInput);} else if(error.code==='auth/invalid-email'){loginErrorMessage='Login failed: Please enter a valid email address.';setError(loginEmailInput);} loginFormMessages.textContent=loginErrorMessage;loginFormMessages.classList.add('text-red-400'); });
           console.log("--- Login submit handler finished ---");
      });
  } else { /* Error logging */ }

  // --- Logic to toggle between Register and Login forms ---
  if (showLoginLink && showRegisterLink && registrationContainer && loginContainer) { /* ... same toggle logic ... */ 
        showLoginLink.addEventListener('click',(e)=>{e.preventDefault();registrationContainer.classList.add('hidden');loginContainer.classList.remove('hidden');}); showRegisterLink.addEventListener('click',(e)=>{e.preventDefault();loginContainer.classList.add('hidden');registrationContainer.classList.remove('hidden');});
  }

  // --- Page Switching Logic for Nav Links ---
  if (navLinks.length > 0 && pageSections.length > 0) { /* ... same page switching logic ... */ 
        function switchPage(targetId){console.log(`Switching to page: ${targetId}`); pageSections.forEach(section=>{section.classList.add('hidden');}); const targetPage=document.getElementById(targetId); if(targetPage){targetPage.classList.remove('hidden');} else {console.error(`Target page section with ID '${targetId}' not found!`);} navLinks.forEach(link=>{link.classList.remove('bg-gray-900','text-white'); link.classList.add('text-gray-300','hover:bg-gray-700','hover:text-white'); if(link.getAttribute('data-target')===targetId){link.classList.remove('text-gray-300','hover:bg-gray-700','hover:text-white'); link.classList.add('bg-gray-900','text-white');}});}
        navLinks.forEach(link=>{link.addEventListener('click',(event)=>{event.preventDefault(); const targetPageId=link.getAttribute('data-target'); if(targetPageId){switchPage(targetPageId);}});});
  } else { /* Warn if elements missing */ }

  // --- Mobile Menu Toggle Logic ---
  const mobileMenuButton = document.getElementById('mobile-menu-button'); /* ... same mobile toggle logic ... */
  const mobileMenu = document.getElementById('mobile-menu'); const menuIconClosed = document.getElementById('menu-icon-closed'); const menuIconOpen = document.getElementById('menu-icon-open'); if(mobileMenuButton&&mobileMenu&&menuIconClosed&&menuIconOpen){mobileMenuButton.addEventListener('click',()=>{mobileMenu.classList.toggle('hidden');menuIconClosed.classList.toggle('hidden');menuIconOpen.classList.toggle('hidden');});} else { console.warn("Could not find mobile menu elements."); }

}); // End of DOMContentLoaded listener