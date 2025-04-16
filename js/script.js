// Wait until the HTML document is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the splash screen and main content elements
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
  
    // Duration of the splash screen animation in milliseconds (6 seconds)
    const animationDuration = 6000; 
  
    // Check if both elements were found
    if (splashScreen && mainContent) {
      // Set a timer to execute code after the animation duration
      setTimeout(() => {
        // Hide the splash screen by adding the 'hidden' class
        splashScreen.classList.add('hidden'); 
  
        // Show the main content by removing the 'hidden' class
        mainContent.classList.remove('hidden'); 
  
      }, animationDuration); // Use the duration variable here
    } else {
      // Log an error if elements couldn't be found (for debugging)
      console.error('Error: Splash screen or main content element not found!');
    }
  
  });