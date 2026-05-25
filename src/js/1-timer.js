import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputPicker = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const displayDays = document.querySelector('[data-days]');
const displayHours = document.querySelector('[data-hours]');
const displayMinutes = document.querySelector('[data-minutes]');
const displaySeconds = document.querySelector('[data-seconds]');

startBtn.disabled = true;
startBtn.addEventListener('click', onStartTimer);

let userSelectedDate = null;
let timerId = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= Date.now()) {
      iziToast.error({
        title: 'Error',
        titleColor: '#fff',
        message: 'Please choose a date in the future',
        position: 'topRight',
        backgroundColor: '#ef4040',
        messageColor: '#fff',
        theme: 'dark',
      });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDates[0].getTime();
      startBtn.disabled = false;
    }
  },
};

flatpickr(inputPicker, options);

function onStartTimer() {
  startBtn.disabled = true;
  inputPicker.disabled = true;

  function updateTimer() {
    const currentDate = Date.now();
    const deltaTime = userSelectedDate - currentDate;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      inputPicker.disabled = false;
      return;
    }

    updateTimerInterface(convertMs(deltaTime));
  }

  updateTimer();

  timerId = setInterval(updateTimer, 1000);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  displayDays.textContent = addLeadingZero(days);
  displayHours.textContent = addLeadingZero(hours);
  displayMinutes.textContent = addLeadingZero(minutes);
  displaySeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
