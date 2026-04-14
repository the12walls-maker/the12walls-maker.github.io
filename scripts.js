/* ===================== scripts.js ===================== */
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

function setActive(){
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

function initAnimations(){
  const cards = document.querySelectorAll('.card');
  if (!('IntersectionObserver' in window)) {
    cards.forEach(card => card.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
}

async function joinWaitlist(buttonId, inputId, messageId){
  const input = document.getElementById(inputId);
  const button = document.getElementById(buttonId);
  const message = document.getElementById(messageId);
  const email = input.value.trim();

  if (!email) {
    message.textContent = 'Enter your email.';
    return;
  }

  button.disabled = true;
  button.textContent = 'Joining…';
  message.textContent = '';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    message.textContent = 'You’re on the list.';
    button.textContent = 'Joined';
    input.value = '';
  } catch (error) {
    message.textContent = 'Something went wrong. Please try again.';
    button.disabled = false;
    button.textContent = 'Join waitlist';
  }
}

function initSite(){
  setActive();
  initAnimations();
}

window.addEventListener('DOMContentLoaded', initSite);