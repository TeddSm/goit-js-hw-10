import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let userSelectedDate = null;
const button = document.querySelector('[data-start]');
button.disabled = true;
const input = document.querySelector('#datetime-picker');

const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: function (selectedDates) {
    userSelectedDate = selectedDates[0];
    checkDate(userSelectedDate);
  },
};

flatpickr('#datetime-picker', options);

function checkDate(date) {
  if (date.getTime() > Date.now()) {
    button.disabled = false;
  } else {
    iziToast.error({
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    button.disabled = true;
  }
}

let clickTime = null;
let intervalId = null;

button.addEventListener('click', event => {
  clickTime = Date.now();
  intervalId = setInterval(goTime, 1000);
  input.disabled = true;
  button.disabled = true;
});

function goTime() {
  const res = userSelectedDate - Date.now();
  if (res <= 0) {
    clearInterval(intervalId);
    input.disabled = false;
    iziToast.success({
      message: 'Time is out!',
      position: 'bottomRight',
    });
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(res);
  updateTimer({ days, hours, minutes, seconds });
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
