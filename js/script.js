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
  try {
    app = firebase.initializeApp(firebaseConfig); // Use firebase.initializeApp
    console.log("Firebase Initialized Successfully (compat)!"); 
    // Get references using compat syntax (will use later)
    // const auth = firebase.auth(); 
    // const db = firebase.firestore(); 
  } catch (error) {
    console.error("Firebase initialization failed:", error); 
  }
  
  
  // --- Event Listener for DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Setting up splash screen and validation."); 
  
    // --- Splash Screen Logic ---
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content'); 
    const animationDuration = 6000; 
  
    console.log("Attempting to get splash/main elements:", splashScreen, mainContent); 
  
    if (splashScreen && mainContent) {
      console.log(`Setting timeout for splash screen removal (${animationDuration}ms)`); 
      setTimeout(() => {
        console.log("TIMEOUT REACHED: Attempting to hide splash, show main."); 
        splashScreen.classList.add('hidden'); 
        mainContent.classList.remove('hidden'); 
        console.log("Splash hidden, main shown (classes manipulated)."); 
      }, animationDuration); 
    } else {
      console.error('Error: Splash screen or main content element not found *inside* DOMContentLoaded!'); 
    }
  
    // --- Registration Form Validation Logic ---
    const registrationForm = document.querySelector('#main-content form'); 
    const formMessages = document.getElementById('form-messages');
    const requiredInputs = registrationForm ? registrationForm.querySelectorAll('input[required]') : [];
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');
  
    function setError(inputElement, message) {
      if (!inputElement.classList.contains('border-red-500')) {
          console.log(`--> Setting error style for: ${inputElement.id}`); 
      }
      inputElement.classList.remove('border-gray-600', 'focus:ring-blue-500'); 
      inputElement.classList.add('border-red-500', 'focus:ring-red-500'); 
    }
  
    function clearError(inputElement) {
      if (inputElement.classList.contains('border-red-500')) {
          console.log(`--> Clearing error style for: ${inputElement.id}`); 
          inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
          inputElement.classList.add('border-gray-600', 'focus:ring-blue-500');
      }
    }
  
    if (registrationForm) {
      registrationForm.addEventListener('submit', (event) => {
        console.log("--- Form submit event triggered ---"); 
        event.preventDefault(); 
  
        let errors = []; 
        formMessages.textContent = ''; 
        formMessages.classList.remove('text-red-400', 'text-green-400'); 
  
        console.log("Clearing previous errors..."); 
        requiredInputs.forEach(clearError);
  
        console.log("Checking required fields..."); 
        requiredInputs.forEach(input => {
// CORRECT line:
console.log(`Checking input: ${input.id}, value: '${input.value.trim()}'`);          if (input.value.trim() === '') {
            console.log(`   ${input.id} is EMPTY.`); 
            errors.push(`${input.labels[0]?.textContent || input.name || input.id} is required.`); 
            setError(input, 'Required'); 
          }
        });
  
        console.log("Checking password match..."); 
        if (passwordInput && passwordConfirmInput && passwordInput.value && passwordConfirmInput.value) {
          if (passwordInput.value !== passwordConfirmInput.value) {
            console.log("   Passwords MISMATCH."); 
            errors.push('Passwords do not match.');
            setError(passwordInput, 'Mismatch'); 
            setError(passwordConfirmInput, 'Mismatch'); 
          } else {
            console.log("   Passwords MATCH."); 
          }
        } else if (passwordInput && passwordConfirmInput && (passwordInput.value || passwordConfirmInput.value)) {
            if(!passwordInput.value && passwordConfirmInput.value){
               // Error handled by required check
            } else if(passwordInput.value && !passwordConfirmInput.value){
                errors.push(`Confirm Password is required.`);
                setError(passwordConfirmInput, 'Required');
            } else {
                 console.log("   Password match check skipped (one or both empty).");
            }
        } else {
           console.log("   Password match check skipped (both empty).");
        }
  
        console.log("Displaying messages/final state..."); 
        if (errors.length > 0) {
          formMessages.textContent = errors.join(' '); 
          formMessages.classList.add('text-red-400');
          console.log(`   Errors found: ${errors.length}`); 
        } else {
          formMessages.textContent = 'Validation successful! (No backend yet)'; 
          formMessages.classList.add('text-green-400');
          console.log("   No errors found. Validation successful."); 
          // --- TODO: Add Firebase Authentication call here using firebase.auth() ---
          // --- TODO: Add transition to app-shell here later ---
        }
        console.log("--- Form submit handler finished ---"); 
      });
    } else {
        console.error("Registration form element not found!");
    }
  
  }); // End of DOMContentLoaded listener