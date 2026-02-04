// Theme Toggle - Mode sombre/clair
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) {
    html.classList.add('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark-mode');
    const isNowDark = html.classList.contains('dark-mode');
    localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
  });
});
