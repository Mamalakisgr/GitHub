// Slider functionality
const sliderContainer = document.querySelector('.slider-container');
const sliderItems = document.querySelectorAll('.slider-item');
const itemWidth = sliderItems[0].offsetWidth;

let position = 0;

function slide(direction) {
  position += direction * itemWidth;
  position = Math.min(Math.max(position, 0), itemWidth * (sliderItems.length - 2));
  sliderContainer.style.transform = `translateX(-${position}px)`;
}

// Previous button click event
document.getElementById('prev-btn').addEventListener('click', () => {
  slide(-1);
});

// Next button click event
document.getElementById('next-btn').addEventListener('click', () => {
  slide(1);
});

// Side Menu
const menuButton = document.querySelector('.menu-button');
const sideMenu = document.querySelector('.side-menu');
const closeButton = document.querySelector('.close-button');

// Add click event listener to the menu button
menuButton.addEventListener('click', () => {
  sideMenu.classList.toggle('show');
});

// Add click event listener to the close button
closeButton.addEventListener('click', () => {
  sideMenu.classList.remove('show');
  menuButton.style.display = 'block';
});
