const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// set strength clicle color gray

// set password Length
function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}
function setIndecator(color) {
  indicator.style.backgroundColor = color;
}
function getRanInteger(min, max) {
 return  Math.floor(Math.random() * (max - min)) + min;
}
function generateRanNumber() {
  return getRanInteger(0, 9);
}
function generateUpperCase() {
  return String.fromCharCode(getRanInteger(65, 91));
}
function generateLowerCase() {
  return String.fromCharCode(getRanInteger(97, 123));
}

function generateSymbols() {
  const randomNum = getRanInteger(0, symbols.length);
  return symbols.charAt(randomNum);
}


function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;
  if (hasUpper && hasLower && (hasSym || hasNum) && passwordLength >= 8) {
    setIndecator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndecator("#ff0");
  } else {
    setIndecator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }
  // to make copy wala span visible
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 3000);
}


function shufflePassword(array) {
  // fisher yates method
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i inclusive
    const  j = Math.floor(Math.random() * (i + 1));
    // Swap arr[i] with the element
    // at random index
    const temp = array[i];
    array[i] = array[j];
    array[j]= temp;

  }
  let str ="";
  array.forEach((el)=>(str+=el));
  return str;
}


function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });
  // special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}


allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
});


copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});



generateBtn.addEventListener("click", () => {
  // none if the checkbox are selected
  if (checkCount == 0) return;
  if (passwordLength<checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
  // new password find
  console.log("start new journey ")
  // remove old password
  password = "";
  // let's put the stuff mentioned by checkboxes

  let funcArray = [];
  if (uppercaseCheck.checked) {
    funcArray.push(generateUpperCase);
  }
  if (lowercaseCheck.checked) {
    funcArray.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArray.push(generateRanNumber);
  }
  if (symbolsCheck.checked) {
    funcArray.push(generateSymbols);
  }
  for (let i = 0; i < funcArray.length; i++) {
    password += funcArray[i]();
  }
  console.log("compulsory addition done")
  // remaning addition
  for (let i = 0; i < passwordLength-funcArray.length; i++) {
    let randIndex = getRanInteger(0, funcArray.length);
    console.log("randIndex: " + randIndex);
    password += funcArray[randIndex]();
  }
  console.log("remaning addition done")
  // shuffle the password
  password = shufflePassword(Array.from(password));
  console.log("shuffling  done")

  // show in UI
  passwordDisplay.value = password;
  console.log("UI addition done")

  // cal strength
  calcStrength();
});
