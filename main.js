const toggle = document.getElementById('darkModeToggle');

// Restore theme from localStorage
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
}

// Toggle dark mode and save preference
if (toggle) {
    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', toggle.checked);
        localStorage.setItem('dark-mode', toggle.checked);
    });
}
