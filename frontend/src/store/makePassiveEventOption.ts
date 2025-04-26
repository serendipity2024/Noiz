// We want to make event listeners non-passive, and to do so have to check
// that browsers support EventListenerOptions in the first place.
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support

let passiveSupported = false;

/**
 * Creates an event listener option object with passive property
 * This is used to detect if the browser supports passive event listeners
 * and to create options for event listeners
 *
 * @param passive - Whether the event listener should be passive
 * @returns Event listener options object or boolean
 */
export default function makePassiveEventOption(passive = false): any {
  try {
    const options = {
      get passive() {
        // This function will be called when the browser
        // attempts to access the passive property.
        passiveSupported = true;
        return passive;
      },
    };
    return options;
  } catch (err) {
    passiveSupported = false;
    return passiveSupported;
  }
}