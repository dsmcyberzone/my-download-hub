// assets/js/theme.js
(function () {
  const savedSettings = JSON.parse(localStorage.getItem('hub_settings')) || {
    theme: 'system',
    accent: 'blue',
    animations: 'enabled',
    language: 'en'
  };

  // Apply Theme Mode
  function applyTheme(theme) {
    const root = document.documentElement;
    let explicitDark = theme === 'dark';
    
    if (theme === 'system') {
      explicitDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    if (explicitDark) {
      root.classList.add('dark');
      root.style.setProperty('--bg-primary', '#0b0f19');
      root.style.setProperty('--bg-secondary', '#161b26');
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--text-secondary', '#9ca3af');
      root.style.setProperty('--border-color', '#242b3d');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--bg-primary', '#f9fafb');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#111827');
      root.style.setProperty('--text-secondary', '#4b5563');
      root.style.setProperty('--border-color', '#e5e7eb');
    }
  }

  // Apply Accent Color Hexes
  function applyAccent(accent) {
    const root = document.documentElement;
    const colors = {
      blue: { primary: '#3b82f6', hover: '#2563eb' },
      purple: { primary: '#8b5cf6', hover: '#7c3aed' },
      green: { primary: '#10b981', hover: '#059669' },
      orange: { primary: '#f97316', hover: '#ea580c' },
      red: { primary: '#ef4444', hover: '#dc2626' }
    };
    const choice = colors[accent] || colors.blue;
    root.style.setProperty('--accent-color', choice.primary);
    root.style.setProperty('--accent-hover', choice.hover);
  }

  // Apply Animations Setup
  function applyAnimations(status) {
    document.documentElement.setAttribute('data-animations', status);
  }

  // Initialize immediately before body renders
  applyTheme(savedSettings.theme);
  applyAccent(savedSettings.accent);
  applyAnimations(savedSettings.animations);

  // Expose configuration functions globally for settings panels
  window.HubThemeEngine = { applyTheme, applyAccent, applyAnimations };
})();