// Theme configuration with user defined palettes
const themes = {
  light: {
    'bg-primary': '#F7F8F0',     // Light cream background
    'bg-secondary': '#9CD5FF',   // Soft blue accent containers
    'text-primary': '#355872',   // Deep slate blue text
    'text-secondary': '#7AAACE', // Muted steel blue text
    'border-color': '#7AAACE',
    'accent-color': '#355872'
  },
  night: {
    'bg-primary': '#212121',     // Dark charcoal background
    'bg-secondary': '#323232',   // Lighter gray for cards/containers
    'text-primary': '#14FFEC',   // Neon cyan text
    'text-secondary': '#0D7377', // Deep teal text
    'border-color': '#0D7377',
    'accent-color': '#14FFEC'
  }
};

// Function to apply colors to the document root
function applyTheme(themeName) {
  const root = document.documentElement;
  const selectedTheme = themes[themeName] || themes.light;
  
  Object.keys(selectedTheme).forEach(key => {
    root.style.setProperty(`--${key}`, selectedTheme[key]);
  });
  
  root.setAttribute('data-theme', themeName);
  localStorage.setItem('site-theme', themeName);
}

// Toggle between light and night mode
function toggleTheme() {
  const currentTheme = localStorage.getItem('site-theme') === 'night' ? 'light' : 'night';
  applyTheme(currentTheme);
}

// Initial application on load
(function() {
  const savedTheme = localStorage.getItem('site-theme') || 'light';
  applyTheme(savedTheme);
})();
