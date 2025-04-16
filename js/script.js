// Wait until the HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Setting up splash screen and validation."); // DEBUG
  
    // --- Splash Screen Logic ---
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const animationDuration = 6000; // 6 seconds in milliseconds
  
    if (splashScreen && mainContent) {
      setTimeout(() => {
        console.log("Hiding splash screen, showing main content."); // DEBUG
        splashScreen.classList.add('hidden'); 
        mainContent.classList.remove('hidden'); 
      }, animationDuration); 
    } else {
      console.error('Error: Splash screen or main content element not found!');
    }
  
    // --- Registration Form Validation Logic ---
    const registrationForm = document.querySelector('#main-content form'); 
    const formMessages = document.getElementById('form-messages');
    const requiredInputs = registrationForm ? registrationForm.querySelectorAll('input[required]') : [];
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');
  
    // Helper function to set error state on an input
    function setError(inputElement, message) {
      console.log(`--> setError called for: ${inputElement.id}, message: ${message}`); // DEBUG
      console.log(`    ${inputElement.id} classes BEFORE: ${inputElement.className}`); // DEBUG
      inputElement.classList.remove('border-gray-600', 'focus:ring-blue-500'); 
      inputElement.classList.add('border-red-500', 'focus:ring-red-500'); 
      console.log(`    ${inputElement.id} classes AFTER: ${inputElement.className}`); // DEBUG
    }
  
    // Helper function to clear error state from an input
    function clearError(inputElement) {
      // Only remove/add if the error class is actually present
      if (inputElement.classList.contains('border-red-500')) {
          console.log(`--> clearError called for: ${inputElement.id}`); // DEBUG
          inputElement.classList.remove('border-red-500', 'focus:ring-red-500');
          inputElement.classList.add('border-gray-600', 'focus:ring-blue-500');
      }
    }
  
    // Add event listener for form submission
    if (registrationForm) {
      registrationForm.addEventListener('submit', (event) => {
        console.log("--- Form submit event triggered ---"); // DEBUG
        event.preventDefault(); 
  
        let errors = []; 
        formMessages.textContent = ''; 
        formMessages.classList.remove('text-red-400', 'text-green-400'); 
  
        // Clear previous errors on all required inputs
        console.log("Clearing previous errors..."); // DEBUG
        requiredInputs.forEach(clearError);
  
        // 1. Check for empty required fields
        console.log("Checking required fields..."); // DEBUG
        requiredInputs.forEach(input => {
          console.log(`Checking input: <span class="math-inline">\{input\.id\}, value\: '</span>{input.value}'`); // DEBUG
          if (input.value.trim() === '') {
            console.log(`   ${input.id} is EMPTY.`); // DEBUG
            errors.push(`${input.previousElementSibling.textContent || input.name || input.id} is required.`); 
            setError(input, 'Required'); 
          }
        });
  
        // 2. Check if passwords match (only if both are filled)
        console.log("Checking password match..."); // DEBUG
        if (passwordInput && passwordConfirmInput && passwordInput.value && passwordConfirmInput.value) {
          if (passwordInput.value !== passwordConfirmInput.value) {
            console.log("   Passwords MISMATCH."); // DEBUG
            errors.push('Passwords do not match.');
            setError(passwordInput, 'Mismatch'); 
            setError(passwordConfirmInput, 'Mismatch'); 
          } else {
            console.log("   Passwords MATCH."); // DEBUG
          }
        } else {
          console.log("   Password match check skipped (one or both empty)."); // DEBUG
        }
  
        // Display errors or success message
        console.log("Displaying messages/final state..."); // DEBUG
        if (errors.length > 0) {
          formMessages.textContent = errors.join(' '); 
          formMessages.classList.add('text-red-400');
          console.log(`   Errors found: ${errors.length}`); // DEBUG
        } else {
          formMessages.textContent = 'Validation successful! (Form not submitted)'; 
          formMessages.classList.add('text-green-400');
          console.log("   No errors found. Validation successful."); // DEBUG
        }
        console.log("--- Form submit handler finished ---"); // DEBUG
      });
    } else {
        console.error("Registration form element not found!");
    }
  
  }); // End of DOMContentLoaded listener