const backdrop = document.querySelector('.backdrop');
const sidebar = document.querySelector('.sidebar.mobile');
const toggleButton = sidebar.querySelector('.menu-toggle');

let lastFocusedElement;
let resetFocusFn;

window.addEventListener('focusin', rememberLastFocus);

window.addEventListener('resize', throttle(closeSidebar));

backdrop.addEventListener('click', closeSidebar);

toggleButton.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    if (sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    sidebar.classList.add('open');
    document.body.classList.add('overlay-open');
    toggleButton.querySelector('.visually-hidden').textContent =
        'Close the sidebar menu';

    resetFocusFn = retainFocus(sidebar);
}

function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('overlay-open');
    toggleButton.querySelector('.visually-hidden').textContent =
        'Open the sidebar menu';

    if (typeof resetFocusFn === 'function') {
        resetFocusFn();
        resetFocusFn = null;
    }
}

function rememberLastFocus(event) {
    lastFocusedElement = event.relatedTarget;
}

function retainFocus(element) {
    const focusedElement = lastFocusedElement ?? document.body;

    // Find out what elements can receive focus inside the target element.
    // There's probably more elements than can receive focus than specified
    // in the selector, but for our purposes, this will do.
    const focusableElements = element.querySelectorAll(
        'a,button,input,textarea'
    );
    
    // If there are elements inside the target that can receive focus
    if (focusableElements.length > 0) {
        // Attach the listener
        window.addEventListener('focusin', onFocusChange);
        // And set focus to first focusable element within target
        focusableElements[0].focus();
    }

    // Return a cleanup function that should be called
    // to restore proper focus functionality when the
    // target element is dismissed/unmounted from dom.
    return function cleanUpFunction() {
        window.removeEventListener('focusin', onFocusChange);
        focusedElement.focus();
    };

    // ==========================================

    function onFocusChange(event) {
        const from = event.relatedTarget;
        const to = event.target;

        // Find out if the new focused element is a child of the target element
        const isFocusedElementWithinTarget =
            Array.prototype.indexOf.call(focusableElements, to) !== -1;

        if (isFocusedElementWithinTarget) {
            // Focused element is within the element that is retaining focus, allow it.
            return;
        }

        // The focus went to an element outside the target element.
        // Find out if focus was lost when it was on the first, or last element,
        // so we can make it loop around to beginning/end of the element appropriately.
        const hasFirstElementLostFocus =
            Array.prototype.indexOf.call(focusableElements, from) === 0;

        if (hasFirstElementLostFocus) {
            // Put focus back on last focusable element within the element.
            focusableElements[focusableElements.length - 1].focus();
        } else {
            // For all other cases of focus loss, put focus on first focusable element;
            focusableElements[0].focus();
        }
    }
}

function throttle(func, ms = 500) {
    // Get initial timestamp for function call
    let timestamp = getTimestamp();

    return function throttled(...args) {
        // Get current timestamp
        let now = getTimestamp();

        // Calculate difference
        if (now - timestamp < ms) {
            // If not enough time has elapsed, do nothing.
            return;
        }

        // Else call the throttled function.
        func(...args);

        // And update last function call timestamp
        timestamp = getTimestamp();
    };

    function getTimestamp() {
        return new Date().getTime();
    }
}
