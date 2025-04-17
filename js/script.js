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
let db; // Declare db variable
try {
  app = firebase.initializeApp(firebaseConfig);
  auth = firebase.auth(); // Initialize Auth service
  db = firebase.firestore(); // Initialize Firestore service
  console.log("Firebase Initialized Successfully (compat)!");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}


// --- Event Listener for DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM Loaded. Setting up.");

  // --- Get Element References ---
  const splashScreen = document.getElementById('splash-screen');
  const backgroundLayer = document.getElementById('background-layer');
  const registrationContainer = document.getElementById('main-content');
  const loginContainer = document.getElementById('login-content');
  const appShell = document.getElementById('app-shell');
  const pageContent = document.getElementById('page-content');
  const registrationForm = document.getElementById('registration-form');
  const loginForm = document.getElementById('login-form'); // Get login form
  const addReForm = document.getElementById('add-re-form');
  const regFormMessages = document.getElementById('form-messages');
  const loginFormMessages = document.getElementById('login-form-messages');
  const showLoginLink = document.getElementById('show-login-link');
  const showRegisterLink = document.getElementById('show-register-link');
  const navLinks = document.querySelectorAll('#app-shell .nav-link');
  const pageSections = pageContent ? pageContent.querySelectorAll('.page') : [];
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconClosed = document.getElementById('menu-icon-closed');
  const menuIconOpen = document.getElementById('menu-icon-open');

  // --- Splash Screen Logic ---
  const animationDuration = 6000; // Adjust for testing if needed
  if (splashScreen && backgroundLayer && registrationContainer) {
    console.log(`Setting timeout for splash removal/transition (${animationDuration}ms)`);
    setTimeout(() => {
      console.log("TIMEOUT REACHED: Hiding splash, showing background & initial form.");
      splashScreen.classList.add('hidden');
      backgroundLayer.classList.remove('hidden', 'opacity-0');
      backgroundLayer.classList.add('fade-in');
      // Show registration form by default after splash
      registrationContainer.classList.remove('hidden');
      console.log("Splash hidden, background faded in started, registration form shown.");
    }, animationDuration);
  } else { console.error('Error: Could not find splash/bg/main elements!'); }

  // --- Helper Functions for Validation Styling ---
  function setError(inputElement, message) { if(!inputElement.classList.contains('border-red-500')){console.log(`--> Setting error style for: ${inputElement.id}`);} inputElement.classList.remove('border-gray-300','focus:ring-indigo-500', 'focus:border-indigo-500'); inputElement.classList.add('border-red-500','focus:ring-red-500','focus:border-red-500'); }
  function clearError(inputElement) { if(inputElement.classList.contains('border-red-500')){console.log(`--> Clearing error style for: ${inputElement.id}`); inputElement.classList.remove('border-red-500','focus:ring-red-500','focus:border-red-500'); inputElement.classList.add('border-gray-300','focus:ring-indigo-500','focus:border-indigo-500');}}

  // --- Registration Form Logic ---
  if (registrationForm && auth && db) {
      const regRequiredInputs = registrationForm.querySelectorAll('input[required]'); const regPasswordInput = document.getElementById('password'); const regPasswordConfirmInput = document.getElementById('password_confirm'); registrationForm.addEventListener('submit', (event) => { event.preventDefault(); let errors = []; regFormMessages.textContent = ''; regFormMessages.classList.remove('text-red-400', 'text-green-400', 'text-yellow-500'); regRequiredInputs.forEach(clearError); regRequiredInputs.forEach(input => { if (input.value.trim() === '') {const label = document.querySelector(`label[for='${input.id}']`); errors.push(`${label?.textContent || input.name || input.id} is required.`); setError(input, 'Required');}}); if (regPasswordInput && regPasswordConfirmInput && regPasswordInput.value && regPasswordConfirmInput.value) { if (regPasswordInput.value !== regPasswordConfirmInput.value) { errors.push('Passwords do not match.'); setError(regPasswordInput, 'Mismatch'); setError(regPasswordConfirmInput, 'Mismatch');}} else if (regPasswordInput?.value && !regPasswordConfirmInput?.value) { errors.push(`Confirm Password is required.`); setError(regPasswordConfirmInput, 'Required');} if (errors.length > 0) { regFormMessages.textContent = errors.join(' '); regFormMessages.classList.add('text-red-400'); return; } const email = document.getElementById('email').value; const password = regPasswordInput.value; const username = document.getElementById('username').value; const firstName = document.getElementById('first_name').value; const lastName = document.getElementById('last_name').value; const phone = document.getElementById('phone').value; regFormMessages.textContent = 'Processing registration...'; auth.createUserWithEmailAndPassword(email, password) .then((userCredential) => { const user = userCredential.user; const userData = { username: username, firstName: firstName, lastName: lastName, email: email, phone: phone, createdAt: firebase.firestore.FieldValue.serverTimestamp() }; db.collection("users").doc(user.uid).set(userData) .then(() => { user.sendEmailVerification() .then(() => { regFormMessages.textContent = 'Registration successful! Please check your email (' + email + ') for a verification link.'; regFormMessages.classList.add('text-green-400'); registrationForm.reset(); }) .catch((error) => { regFormMessages.textContent = 'Registration successful & data saved, but failed to send verification email.'; regFormMessages.classList.add('text-yellow-500'); }); }) .catch((error) => { regFormMessages.textContent = 'User account created, but failed to save profile data.'; regFormMessages.classList.add('text-red-400'); }); }) .catch((error) => { let errorMessage = `Registration failed: ${error.message}`; if (error.code === 'auth/email-already-in-use') {errorMessage = 'Registration failed: This email address is already registered.'; setError(document.getElementById('email'), 'In use');} else if (error.code === 'auth/weak-password') { errorMessage = 'Registration failed: Password should be at least 6 characters long.'; setError(regPasswordInput, 'Too weak'); } else if (error.code === 'auth/invalid-email') { errorMessage = 'Registration failed: The email address is not valid.'; setError(document.getElementById('email'), 'Invalid'); } regFormMessages.textContent = errorMessage; regFormMessages.classList.add('text-red-400'); }); console.log("--- Registration submit handler finished ---"); });
  } else { console.error("Registration form or Firebase services not ready."); }


  // --- Login Form Logic (Restored Full Version) ---
  if (loginForm && auth) {
      const loginEmailInput = document.getElementById('login-email');
      const loginPasswordInput = document.getElementById('login-password');
      loginForm.addEventListener('submit', (event) => {
           console.log("--- Login Form submit event triggered ---"); // Should see this now
           event.preventDefault(); 
           loginFormMessages.textContent = 'Processing login...'; 
           loginFormMessages.classList.remove('text-red-400','text-green-400','text-yellow-500'); 
           clearError(loginEmailInput); clearError(loginPasswordInput);
           
           const email = loginEmailInput.value; 
           const password = loginPasswordInput.value;
           let loginErrors = []; 
           if(email.trim()===''){loginErrors.push('Email is required.');setError(loginEmailInput);} 
           if(password.trim()===''){loginErrors.push('Password is required.');setError(loginPasswordInput);} 
           if(loginErrors.length > 0){loginFormMessages.textContent=loginErrors.join(' '); loginFormMessages.classList.add('text-red-400'); console.log("Login validation errors found."); return;}

           auth.signInWithEmailAndPassword(email, password)
             .then((userCredential) => {
                 const user = userCredential.user;
                 console.log('Login successful:', user.uid, 'Email verified:', user.emailVerified); // Check this log

                 if (user.emailVerified) {
                     console.log('Email IS verified. Showing app shell.'); // Check this log
                     loginFormMessages.textContent = 'Login successful!'; 
                     loginFormMessages.classList.add('text-green-400'); 

                     // --- This is the crucial part ---
                     console.log('Attempting to hide forms and show app shell...'); 
                     if(loginContainer) loginContainer.classList.add('hidden');
                     if(registrationContainer) registrationContainer.classList.add('hidden'); 
                     if(appShell) appShell.classList.remove('hidden'); // Show the main app
                     // ---------------------------------

                 } else {
                     console.log('Email NOT verified. Please check email.'); // Or check this log
                     loginFormMessages.textContent = 'Please verify your email address first. Check your inbox (and spam folder) for the verification link.';
                     loginFormMessages.classList.add('text-yellow-500');
                     auth.signOut();
                     console.log('User signed out as email is not verified.');
                 }
             })
             .catch((error) => { 
                 console.error("Login failed:", error.code, error.message); // Check for errors here
                 let loginErrorMessage=`Login failed: ${error.message}`; 
                 if(error.code === 'auth/user-not-found'||error.code === 'auth/wrong-password'||error.code === 'auth/invalid-credential'){loginErrorMessage='Login failed: Invalid email or password.';setError(loginEmailInput);setError(loginPasswordInput);} 
                 else if(error.code==='auth/invalid-email'){loginErrorMessage='Login failed: Please enter a valid email address.';setError(loginEmailInput);} 
                 loginFormMessages.textContent=loginErrorMessage;
                 loginFormMessages.classList.add('text-red-400'); 
              });
          console.log("--- Login submit handler finished ---"); // Should see this
      });
      console.log("Login submit listener attached successfully."); // Confirm listener attached
  } else { console.error("Login form or Firebase Auth service not ready - cannot attach listener."); }

  // --- Logic to toggle between Register and Login forms ---
  if (showLoginLink && showRegisterLink && registrationContainer && loginContainer) { showLoginLink.addEventListener('click',(e)=>{e.preventDefault();registrationContainer.classList.add('hidden');loginContainer.classList.remove('hidden');}); showRegisterLink.addEventListener('click',(e)=>{e.preventDefault();loginContainer.classList.add('hidden');registrationContainer.classList.remove('hidden');});}

  // --- Page Switching Logic for Nav Links & Profile Buttons ---
  if (appShell && navLinks.length > 0 && pageSections.length > 0) {
      appShell.addEventListener('click', (event) => {
          let targetPageId = null;
          if (event.target.closest('.nav-link')) { // Check if click was on or inside a nav link
              event.preventDefault();
              targetPageId = event.target.closest('.nav-link').getAttribute('data-target');
          } else if (event.target.matches('#add-re-button')) { targetPageId = 'add-real-estate-form-page'; }
            else if (event.target.matches('#add-car-button')) { targetPageId = 'add-car-form-page'; }
            else if (event.target.matches('#add-auc-button')) { targetPageId = 'add-auction-form-page'; }
            else if (event.target.matches('.form-back-button')) { targetPageId = event.target.getAttribute('data-target') || 'profile-page-content'; }
          
          if (targetPageId) { switchPage(targetPageId); }
      });

      function switchPage(targetId){ if(!targetId||!pageContent)return; const pageSections=pageContent.querySelectorAll('.page'); console.log(`Switching page view to: ${targetId}`); pageSections.forEach(section=>{section.classList.add('hidden');}); const targetPage=document.getElementById(targetId); if(targetPage){targetPage.classList.remove('hidden');} else {console.error(`Target page section with ID '${targetId}' not found!`);} navLinks.forEach(link=>{link.classList.remove('bg-indigo-100','text-indigo-700'); link.classList.add('text-gray-500','hover:bg-gray-200','hover:text-gray-900'); if(link.getAttribute('data-target')===targetId){link.classList.remove('text-gray-500','hover:bg-gray-200','hover:text-gray-900'); link.classList.add('bg-indigo-100','text-indigo-700');}}); if(mobileMenu&&!mobileMenu.classList.contains('hidden')){mobileMenu.classList.add('hidden');menuIconClosed.classList.remove('hidden');menuIconOpen.classList.add('hidden');}}
      switchPage('map-page-content'); // Initialize map view on load (only matters if app shell shown initially)
  } else { console.warn("Could not set up nav link/page switching listeners."); }

  // --- Mobile Menu Toggle Logic ---
  if (mobileMenuButton && mobileMenu && menuIconClosed && menuIconOpen) { mobileMenuButton.addEventListener('click',()=>{mobileMenu.classList.toggle('hidden');menuIconClosed.classList.toggle('hidden');menuIconOpen.classList.toggle('hidden');});} else { console.warn("Could not find mobile menu elements."); }

}); // End of DOMContentLoaded listener