/**
 * A function that debounces actions with request cancellation support
 * @param {Function} func - The function to be debounced
 * @param {number} wait - The time to wait before executing the function
 * @param {boolean} immediate - If true, the function will be executed immediately
 * @returns {Function} - The debounced function
 */
export default function debounce(func, wait, immediate) {
  let timeout;
  let currentController;
  
  return function () {
    const context = this;
    const args = arguments;
    
    // Cancel previous request if it exists
    if (currentController) {
      currentController.abort();
    }
    
    const later = function () {
      timeout = null;
      if (!immediate) {
        currentController = new AbortController();
        func.apply(context, [...args, currentController.signal]);
      }
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      currentController = new AbortController();
      func.apply(context, [...args, currentController.signal]);
    }
  };
}
