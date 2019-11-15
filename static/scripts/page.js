const form = document.getElementById('form');

form.addEventListener('submit', event => {
  console.log(event);
  event.preventDefault();

  const formData = new FormData(event.target);
  const formValue = {};

  formData.forEach((value, name) => {
    formValue[name] = value;
  });

  console.log(formValue);
});
