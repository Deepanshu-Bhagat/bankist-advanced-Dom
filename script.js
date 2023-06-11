'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabscontainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const allImgs = document.querySelectorAll('img[data-src]');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const allSlides = document.querySelectorAll('.slide');
const dotContainer = document.querySelector('.dots');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////

// scroll btn
btnScrollTo.addEventListener('click', function () {
  // const coords = section1.getBoundingClientRect();
  // const s1coordsX = coords.x;
  // const s1coordsY = coords.y;
  // window.scrollTo({
  //   left: s1coordsX + window.scrollX,
  //   top: s1coordsY + window.scrollY,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

// navigation to sections
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  if (!e.target.classList.contains('nav__link')) return;
  const id = e.target.getAttribute('href').slice(1);

  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
});

// Tabs container
tabscontainer.addEventListener('click', function (e) {
  e.preventDefault();
  const btn = e.target.closest('.operations__tab');
  if (!btn) return;

  // buttons
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  btn.classList.add('operations__tab--active');

  // content
  const contentNumber = btn.dataset.tab;
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${contentNumber}`)
    .classList.add('operations__content--active');
});

// NavBar Fade
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};
nav.addEventListener('mouseover', handleHover.bind('0.5'));
nav.addEventListener('mouseout', handleHover.bind('1'));

// Sticky NavBar
// window.addEventListener('scroll', function () {
//   const coords = section1.getBoundingClientRect();
//   if (coords.y <= 0) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// sticky navbar using Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) nav.classList.remove('sticky');
  else nav.classList.add('sticky');
};
const options = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, options);
headerObserver.observe(header);

// Revealing Sections on scroll
const revealSections = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
    // else  entry.target.classList.add('section--hidden');      // it will again hide the sections
  });
};
const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
allImgs.forEach(img => {
  imgObserver.observe(img);
});

// ..... Slider
let curSlide = 0;
const maxSlides = allSlides.length;

// create dots
const createDots = function () {
  allSlides.forEach((_, i) => {
    const text = `<button class='dots__dot dot-${i}' data-slide=${i}></button>`;
    dotContainer.insertAdjacentHTML('beforeend', text);
  });
};
createDots();

// go to slide number
const goToSlide = function (slide) {
  allSlides.forEach((s, i) => {
    s.style.transform = `translateX(${(i - slide) * 100}%)`;
  });
};
goToSlide(0);

// next dot
const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(btn => btn.classList.remove('dots__dot--active'));
  document.querySelector(`.dot-${slide}`).classList.add('dots__dot--active');
};
activeDot(0);

// Next Slide
const nextSlide = function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
};

// Prev Slide
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlides - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    prevSlide();
  }
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const {slide} = e.target.dataset;
  goToSlide(slide);
  activeDot(slide);
});
