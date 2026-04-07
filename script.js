/* ============================================================
   FINS Capital — Application JS
   Modular vanilla JS · GSAP 3 for animations
   ============================================================ */

'use strict';

/* ── STATE ──────────────────────────────────────────────────── */
const State = {
  currentPage: 'home',
  currentStep: 1,
  totalSteps: 5,
  formData: {},
  stepLabels: ['Basic Details', 'Employment', 'Existing Loans', 'Balance Transfer', 'Loan Requirement'],
};

/* ── GSAP INIT ──────────────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── PAGE ROUTING ───────────────────────────────────────────── */
const Router = {
  pages: document.querySelectorAll('.page'),
  navLinks: document.querySelectorAll('[data-page]'),

  init() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-page');
        if (target) this.navigate(target);
      });
    });
  },

  navigate(pageId) {
    if (pageId === State.currentPage) return;

    const outPage = document.getElementById(`page-${State.currentPage}`);
    const inPage  = document.getElementById(`page-${pageId}`);

    if (!inPage) return;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Transition
    gsap.to(outPage, {
      opacity: 0, y: -16, duration: 0.25, ease: 'power2.in',
      onComplete: () => {
        outPage.classList.remove('active');
        outPage.style.cssText = '';
        inPage.classList.add('active');
        gsap.fromTo(inPage, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });

        State.currentPage = pageId;
        Nav.updateActive(pageId);
        Nav.closeMenu();

        // Trigger page-specific init
        if (pageId === 'home') PageHome.init();
        if (pageId === 'apply') PageApply.init();

        // Re-bind scroll triggers for new page
        setTimeout(() => Animations.bindScrollTriggers(), 100);
      }
    });
  }
};

/* ── NAVIGATION ─────────────────────────────────────────────── */
const Nav = {
  el: document.getElementById('navbar'),
  toggle: document.getElementById('navToggle'),
  linksEl: document.getElementById('navLinks'),
  menuOpen: false,

  init() {
    window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
    this.toggle.addEventListener('click', this.toggleMenu.bind(this));
    this.onScroll();
  },

  onScroll() {
    const scrolled = window.scrollY > 40;
    this.el.classList.toggle('scrolled', scrolled);

    // Hide sticky bar on apply page or when scrolled past hero on mobile
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) {
      stickyCta.style.display = (State.currentPage === 'apply') ? 'none' : 'block';
    }
  },

  updateActive(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-page') === pageId);
    });
  },

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.linksEl.classList.toggle('open', this.menuOpen);
    const spans = this.toggle.querySelectorAll('span');
    if (this.menuOpen) {
      gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.25 });
      gsap.to(spans[1], { opacity: 0, duration: 0.15 });
      gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.25 });
    } else {
      gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.25 });
    }
  },

  closeMenu() {
    if (!this.menuOpen) return;
    this.menuOpen = false;
    this.linksEl.classList.remove('open');
    const spans = this.toggle.querySelectorAll('span');
    gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.25 });
  }
};

/* ── ANIMATIONS ─────────────────────────────────────────────── */
const Animations = {
  bindScrollTriggers() {
    // Kill stale triggers before rebinding
    ScrollTrigger.getAll().forEach(t => t.kill());

    // Reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          }
        }
      );
    });

    document.querySelectorAll('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    document.querySelectorAll('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true }
        }
      );
    });

    // Staggered children
    document.querySelectorAll('.grid-3, .grid-4, .services-detail').forEach(grid => {
      const children = grid.querySelectorAll('.service-card, .metric-card, .service-detail-card, .value-card');
      gsap.fromTo(children,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: grid, start: 'top 85%', once: true }
        }
      );
    });

    // Counter animation for metrics
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isRupee = el.textContent.startsWith('₹');

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate() {
              const v = Math.round(this.targets()[0].val);
              if (target >= 100000) {
                el.textContent = (v >= 100000 ? '1.8L' : Math.round(v/1000) + 'K') + suffix;
              } else if (target === 4200) {
                el.textContent = '₹' + v + 'Cr' + suffix;
              } else {
                el.textContent = (isRupee ? '' : '') + v + suffix;
              }
            }
          });
        }
      });
    });
  },

  heroEntrance() {
    const tl = gsap.timeline();
    tl.fromTo('.hero-kicker',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.2)
      .fromTo('.hero-headline', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4)
      .fromTo('.hero-sub',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.6)
      .fromTo('.hero-actions',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0.75)
      .fromTo('.hero-trust',    { opacity: 0 },        { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.9)
      .fromTo('.loan-card',     { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.5)
      .fromTo('.floating-offer',{ opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }, 1.1);
  },

  testimonialLoop() {
    const track = document.getElementById('testimonialTrack');
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;

    let pos = 0;
    const cardWidth = 360 + 24; // card min-width + gap

    setInterval(() => {
      pos++;
      if (pos >= cards.length - 1) pos = 0;
      gsap.to(track, {
        x: -(pos * cardWidth),
        duration: 0.8,
        ease: 'power3.inOut'
      });
    }, 4000);
  }
};

/* ── HOME PAGE ──────────────────────────────────────────────── */
const PageHome = {
  init() {
    Animations.heroEntrance();
    Animations.testimonialLoop();
    setTimeout(() => Animations.bindScrollTriggers(), 200);

    // Animate hero progress bar
    setTimeout(() => {
      const bar = document.getElementById('heroProgress');
      if (bar) gsap.to(bar, { width: '94%', duration: 2, ease: 'power2.out', delay: 1.5 });
    }, 500);
  }
};

/* ── APPLY PAGE (MULTI-STEP FORM) ──────────────────────────── */
const PageApply = {
  init() {
    State.currentStep = 1;
    this.render();
  },

  render() {
    // Reset all steps
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('applySuccess')?.classList.remove('visible');
    document.getElementById('formTrust')?.style.removeProperty('display');

    const stepEl = document.getElementById(`step-${State.currentStep}`);
    if (stepEl) stepEl.classList.add('active');

    this.updateProgress();
  },

  updateProgress() {
    const { currentStep, totalSteps, stepLabels } = State;

    for (let i = 1; i <= totalSteps; i++) {
      const dot  = document.getElementById(`dot-${i}`);
      const line = document.getElementById(`line-${i}`);
      if (!dot) continue;

      dot.classList.remove('active', 'done');
      if (i < currentStep)       { dot.classList.add('done'); dot.innerHTML = '✓'; }
      else if (i === currentStep) { dot.classList.add('active'); dot.textContent = i; }
      else                        { dot.textContent = i; }

      if (line) {
        line.classList.toggle('done', i < currentStep);
      }
    }

    const label = document.getElementById('progressLabel');
    const desc  = document.getElementById('progressDesc');
    if (label) label.innerHTML = `Step <strong>${currentStep}</strong> of ${totalSteps}`;
    if (desc)  desc.textContent = stepLabels[currentStep - 1] || '';
  }
};

/* ── FORM NAVIGATION ────────────────────────────────────────── */
window.nextStep = function(from) {
  if (!validateStep(from)) return;

  collectStepData(from);

  if (from < State.totalSteps) {
    State.currentStep = from + 1;

    const outStep = document.getElementById(`step-${from}`);
    const inStep  = document.getElementById(`step-${from + 1}`);

    gsap.to(outStep, {
      opacity: 0, x: -20, duration: 0.2, ease: 'power2.in',
      onComplete: () => {
        outStep.classList.remove('active');
        outStep.style.cssText = '';
        inStep.classList.add('active');
        gsap.fromTo(inStep, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' });
        PageApply.updateProgress();
      }
    });
  }
};

window.prevStep = function(from) {
  if (from <= 1) return;
  State.currentStep = from - 1;

  const outStep = document.getElementById(`step-${from}`);
  const inStep  = document.getElementById(`step-${from - 1}`);

  gsap.to(outStep, {
    opacity: 0, x: 20, duration: 0.2, ease: 'power2.in',
    onComplete: () => {
      outStep.classList.remove('active');
      outStep.style.cssText = '';
      inStep.classList.add('active');
      gsap.fromTo(inStep, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' });
      PageApply.updateProgress();
    }
  });
};

window.submitApplication = function() {
  if (!validateStep(5)) return;
  collectStepData(5);

  const submitBtn = document.querySelector('#step-5 .btn-primary');
  if (submitBtn) {
    submitBtn.textContent = 'Processing…';
    submitBtn.disabled = true;
  }

  // Simulate API call
  setTimeout(() => {
    const stepEl = document.getElementById('step-5');
    const success = document.getElementById('applySuccess');
    const trustEl = document.getElementById('formTrust');

    if (stepEl) gsap.to(stepEl, {
      opacity: 0, scale: 0.96, duration: 0.25,
      onComplete: () => {
        stepEl.classList.remove('active');
        stepEl.style.cssText = '';
        if (trustEl) trustEl.style.display = 'none';
        if (success) {
          success.classList.add('visible');
          const refEl = document.getElementById('appRef');
          if (refEl) refEl.textContent = 'FINS-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
          gsap.fromTo(success, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
        // Reset progress dots to all done
        for (let i = 1; i <= 5; i++) {
          const dot = document.getElementById(`dot-${i}`);
          if (dot) { dot.classList.remove('active'); dot.classList.add('done'); dot.innerHTML = '✓'; }
          const line = document.getElementById(`line-${i}`);
          if (line) line.classList.add('done');
        }
      }
    });
  }, 1800);
};

window.toggleExistingLoan = function(show) {
  const group = document.getElementById('existingLoanGroup');
  if (!group) return;
  if (show) {
    group.classList.add('visible');
    gsap.fromTo(group, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
  } else {
    group.classList.remove('visible');
  }
};

/* ── VALIDATION ─────────────────────────────────────────────── */
function validateStep(step) {
  clearErrors();
  let valid = true;

  if (step === 1) {
    const name  = document.getElementById('a-name');
    const phone = document.getElementById('a-phone');
    if (!name?.value.trim() || name.value.trim().length < 2) {
      showError(name, 'Please enter your full name'); valid = false;
    }
    if (!phone?.value.trim() || !/^[6-9]\d{9}$/.test(phone.value.trim())) {
      showError(phone, 'Enter a valid 10-digit mobile number'); valid = false;
    }
  }

  if (step === 2) {
    const emp    = document.querySelector('input[name="emp"]:checked');
    const income = document.getElementById('a-income');
    if (!emp) { showRadioError('emp', 'Please select your employment type'); valid = false; }
    if (!income?.value) { showError(income, 'Please select your income range'); valid = false; }
  }

  if (step === 3) {
    const hasLoan = document.querySelector('input[name="hasLoan"]:checked');
    if (!hasLoan) { showRadioError('hasLoan', 'Please select an option'); valid = false; }
  }

  if (step === 5) {
    const loanType = document.querySelector('input[name="loanType"]:checked');
    const amount   = document.getElementById('a-amount');
    if (!loanType) { showRadioError('loanType', 'Please select a loan type'); valid = false; }
    if (!amount?.value) { showError(amount, 'Please select a loan amount'); valid = false; }
  }

  if (!valid) {
    const firstError = document.querySelector('.form-error');
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    gsap.to(document.querySelector('.apply-form-container'), { x: -6, duration: 0.08, yoyo: true, repeat: 3, ease: 'power1.inOut' });
  }
  return valid;
}

function showError(input, msg) {
  if (!input) return;
  input.classList.add('error');
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = msg;
  input.parentElement.appendChild(err);
}

function showRadioError(name, msg) {
  const group = document.querySelector(`input[name="${name}"]`)?.closest('.form-group');
  if (!group) return;
  const err = document.createElement('span');
  err.className = 'form-error';
  err.textContent = msg;
  group.appendChild(err);
}

function clearErrors() {
  document.querySelectorAll('.form-error').forEach(e => e.remove());
  document.querySelectorAll('.form-control.error').forEach(e => e.classList.remove('error'));
}

/* ── DATA COLLECTION ────────────────────────────────────────── */
function collectStepData(step) {
  if (step === 1) {
    State.formData.name  = document.getElementById('a-name')?.value.trim();
    State.formData.phone = document.getElementById('a-phone')?.value.trim();
  }
  if (step === 2) {
    State.formData.employment = document.querySelector('input[name="emp"]:checked')?.value;
    State.formData.income     = document.getElementById('a-income')?.value;
  }
  if (step === 3) {
    State.formData.hasLoan = document.querySelector('input[name="hasLoan"]:checked')?.value;
    State.formData.emi     = document.getElementById('a-emi')?.value;
  }
  if (step === 4) {
    State.formData.balanceTransfer = document.querySelector('input[name="bt"]:checked')?.value;
  }
  if (step === 5) {
    State.formData.loanType   = document.querySelector('input[name="loanType"]:checked')?.value;
    State.formData.loanAmount = document.getElementById('a-amount')?.value;
  }
}

/* ── CONTACT FORM ───────────────────────────────────────────── */
const ContactForm = {
  init() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✓ Message Sent';
        btn.style.background = 'var(--teal-400)';
        setTimeout(() => {
          form.reset();
          btn.textContent = 'Send Message →';
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }, 1200);
    });
  }
};

/* ── FORM INPUT ENHANCEMENTS ────────────────────────────────── */
const FormEnhancements = {
  init() {
    // Phone number formatting
    document.querySelectorAll('input[type="tel"]').forEach(input => {
      input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      });
    });

    // Clear error on input
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = input.parentElement.querySelector('.form-error');
        if (err) err.remove();
      });
    });
  }
};

/* ── SMOOTH SCROLL LINKS ────────────────────────────────────── */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
};

/* ── SCROLL REVEAL OBSERVER (fallback for initial page) ──────── */
const Observer = {
  init() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '';
          entry.target.style.transform = '';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
  }
};

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Router.init();
  Nav.init();
  ContactForm.init();
  FormEnhancements.init();
  SmoothScroll.init();

  // Initial page
  PageHome.init();

  // Mobile sticky CTA hide on apply page clicks
  document.getElementById('stickyCta')?.addEventListener('click', (e) => {
    e.preventDefault();
    Router.navigate('apply');
  });
});
