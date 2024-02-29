const backdrop = document.querySelector('.backdrop');
const sidebar = document.querySelector('.sidebar.mobile');
const toggleButton = sidebar.querySelector('.menu-toggle');

let lastFocusedElement;
let focusRetentionCleanup;

window.addEventListener('focusin', function rememberLastFocus(event) {
    lastFocusedElement = event.relatedTarget;
});

function openSidebar() {
    sidebar.classList.add('open');
    document.body.classList.add('overlay-open');
    toggleButton.querySelector('.visually-hidden').textContent = 'Close the sidebar menu';

    focusRetentionCleanup = retainFocus(sidebar);
}

function closeSidebar() {
    sidebar.classList.remove('open');
    document.body.classList.remove('overlay-open');
    toggleButton.querySelector('.visually-hidden').textContent = 'Open the sidebar menu';

    if(typeof focusRetentionCleanup === 'function') {
        focusRetentionCleanup();
        focusRetentionCleanup = null;
    }
}

function retainFocus(element) {
    const focusedElement = lastFocusedElement ?? document.body;

    const focusableElements = element.querySelectorAll('a,button,input,textarea');

    if(focusableElements.length > 0) {
        window.addEventListener('focusin', onFocusChange);
        focusableElements[0].focus();
    }
    
    return function cleanUpFunction() {
        window.removeEventListener('focusin', onFocusChange);
        focusedElement.focus();
    };

    // ==========================================

    function onFocusChange(event) {
        const from = event.relatedTarget;
        const to = event.target;

        const isFocusedElementWithinTarget = Array.prototype.indexOf.call(focusableElements, to) !== -1;

        if(isFocusedElementWithinTarget) {
            // Focused element is within the element that is retaining focus, allow it.
            return;
        }

        const hasFirstElementLostFocus = Array.prototype.indexOf.call(focusableElements, from) === 0;

        if(hasFirstElementLostFocus) {
            // Put focus back on last focusable element within the element.
            focusableElements[focusableElements.length - 1].focus();
        } else {
            // For all other cases of focus loss, put focus on first focusable element;
            focusableElements[0].focus();
        }

    }
}

toggleButton.addEventListener('click', function toggleSidebar() {
    if(sidebar.classList.contains('open')) {
        closeSidebar();
    } else {
        openSidebar();
    }
});
