const form = document.getElementById("personForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const dobInput = document.getElementById("dob");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const pincodeInput = document.getElementById("pincode");
const searchInput = document.getElementById("searchInput");
const personsList = document.getElementById("personsList");
const pagination = document.getElementById("pagination");

let persons = [];
let currentPage = 1;
const itemsPerPage = 3;

form.addEventListener("submit", function(event) {
  event.preventDefault();

  if (validateForm()) {
    const person = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      dob: dobInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      city: cityInput.value,
      pincode: pincodeInput.value
    };

    persons.push(person);
    clearForm();
    displayPersons();
  }
});

searchInput.addEventListener("input", function() {
  displayPersons();
});

function validateForm() {
  clearErrors();
  let isValid = true;

  const inputs = document.querySelectorAll("input[required]");
  inputs.forEach(function(input) {
    if (!input.value) {
      showError(input, "This field is required");
      isValid = false;
    }
  });

  const emailInputs = document.querySelectorAll('input[ce-email="true"]');
  emailInputs.forEach(function(input) {
    validateEmail(input);
    if (input.classList.contains("error")) {
      isValid = false;
    }
  });

  const mobileInputs = document.querySelectorAll('input[ce-mobile="true"]');
  mobileInputs.forEach(function(input) {
    validateMobile(input);
    if (input.classList.contains("error")) {
      isValid = false;
    }
  });

  return isValid;
}

function clearForm() {
  form.reset();
}

function clearErrors() {
  const errors = form.getElementsByClassName("error-message");
  Array.from(errors).forEach(function(error) {
    error.remove();
  });

  const errorInputs = form.getElementsByClassName("error");
  Array.from(errorInputs).forEach(function(input) {
    input.classList.remove("error");
  });
}

function showError(input, message) {
  input.classList.add("error");
  const error = input.nextElementSibling;
  if (error && error.classList.contains("error-message")) {
    error.textContent = message;
  } else {
    const error = document.createElement("span");
    error.classList.add("error-message");
    error.textContent = message;
    input.parentNode.insertBefore(error, input.nextSibling);
  }
}

function validateEmail(input) {
  const email = input.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showError(input, "Invalid email address");
  } else {
    clearErrors(input);
  }
}

function validateMobile(input) {
  const mobile = input.value;
  const mobileRegex = /^\+?\d{1,3}(\s)?\(?\d{3}\)?(\s|-)?\d{3}(\s|-)?\d{4}$/;
  if (!mobileRegex.test(mobile)) {
    showError(input, "Invalid mobile number");
  } else {
    clearErrors(input);
  }
}

function displayPersons() {
    const searchValue = searchInput.value.toLowerCase();
    console.log(searchValue);
  const filteredPersons = persons.filter(function(person) {
    return (
      person.firstName.toLowerCase().includes(searchValue) ||
      person.lastName.toLowerCase().includes(searchValue) ||
      person.email.toLowerCase().includes(searchValue) ||
      person.city.toLowerCase().includes(searchValue)
    );
  });
console.log(filteredPersons);
  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage);
  currentPage = Math.min(currentPage, totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedPersons = filteredPersons.slice(startIndex, endIndex);

  personsList.innerHTML = "";

  displayedPersons.forEach(function(person) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${person.firstName} ${person.lastName}</h3>
      <p><strong>Date of Birth:</strong> ${person.dob}</p>
      <p><strong>Email:</strong> ${person.email}</p>
      <p><strong>Phone:</strong> ${person.phone}</p>
      <p><strong>City:</strong> ${person.city}</p>
      <p><strong>Pincode/Zipcode:</strong> ${person.pincode}</p>
    `;
    personsList.appendChild(card);
  });

  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = i;
    if (i === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", function() {
      currentPage = i;
      displayPersons();
    });
    pagination.appendChild(link);
  }
}

// Apply input mask
function applyMobileInputMask(input, _mask) {
    const num = input.value;
    const endNum = num.slice(-4);
    const maskNum = endNum.padStart(num.length, "*");
    input.value = maskNum;
}

// Handle custom directives/attributes
function handleCustomDirectives() {
  const emailInputs = document.querySelectorAll('input[ce-email="true"]');
  emailInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      validateEmail(input);
    });
  });

  const mobileInputs = document.querySelectorAll('input[ce-mobile="true"]');
  mobileInputs.forEach(function(input) {
    input.addEventListener("input", function() {
      validateMobile(input);
    });
    const mask = input.getAttribute("ce-mask");
    if (mask) {
      applyMobileInputMask(input, mask);
    }
  });
}

// Run initialization code
handleCustomDirectives();
displayPersons();
