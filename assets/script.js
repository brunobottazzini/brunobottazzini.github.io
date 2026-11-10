const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const copyButton = document.querySelector('.copy-email');
if (copyButton && navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try {
      await navigator.clipboard.writeText('bottazzinibruno@gmail.com');
      status.textContent = document.documentElement.lang === 'it' ? 'Indirizzo copiato.' : 'Email address copied.';
    } catch {
      status.textContent = document.documentElement.lang === 'it' ? 'Puoi copiare l’indirizzo qui sopra.' : 'You can copy the address above.';
    }
  });
}
