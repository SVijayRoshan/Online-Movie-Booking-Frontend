// Suppress PostCSS from option warning
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('did not pass the `from` option')) {
    return; // Suppress the warning
  }
  originalConsoleWarn.apply(console, args);
};

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
