const slider = document.querySelector("[length-slider]");
const display_length = document.querySelector("[display-lengthdata]");
const uppercheckbox = document.querySelector("#uppercase");
const lowercheckbox = document.querySelector("#lowercase");
const numbercheckbox = document.querySelector("#numbers");
const symbolcheckbox = document.querySelector("#symbols");
const displaypassword = document.querySelector("[data-display]");
const checkboxAll = document.querySelectorAll("input[type=checkbox]");
const generatebutton = document.querySelector("[generatebtn]");
const copybtn = document.querySelector("[data-copybtn]");
const indicator = document.querySelector("[data-indicator]");
const copyMsg = document.querySelector("[data-copyMSG]");


let password = "";
let password_length = 15;
let box_selected = 0;
const symbolsArr = '!"#$%&()*+,-./:;<=>?@[]^_`{|}~';

function handle_slider() {
    slider.value = password_length;
    display_length.innerText = password_length;

    let min = slider.min;
    let max = slider.max;

    slider.style.backgroundSize = ((password_length - min) * 100/ (max - min)) + "% 100%"
}

handle_slider();

slider.addEventListener('input', () => {
    if (slider.value < box_selected) {
        slider.value = box_selected;
        handle_slider();
        return;
    }
    password_length = slider.value;
    handle_slider();
});

function generateRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateNumber() {
    return generateRandomInteger(0, 9);
}

function generateUppercase() {
    return String.fromCharCode(generateRandomInteger(65, 90));
}

function generateLowercase() {
    return String.fromCharCode(generateRandomInteger(97, 122));
}

function generateSymbol() {
    index = generateRandomInteger(0, symbolsArr.length);
    return symbolsArr[index];
}

function sufflestring(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function calculate_checkedbox() {
    box_selected = 0;

    checkboxAll.forEach((element) => {
        if (element.checked) box_selected++;
    })

    if (box_selected > password_length) {
        password_length = box_selected;
        handle_slider();
    }
}

checkboxAll.forEach((element) => {
    element.addEventListener('change', calculate_checkedbox);
});


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercheckbox.checked) hasUpper = true;
    if (lowercheckbox.checked) hasLower = true;
    if (numbercheckbox.checked) hasNum = true;
    if (symbolcheckbox.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && password_length >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        password_length >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(displaypassword.value);
        copyMsg.innerText = "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

copybtn.addEventListener('click', () => {
    if(displaypassword.value)
        copyContent();
});

generatebutton.addEventListener('click', () => {

    // console.log('hi');
    if (box_selected == 0) return;

    if (password_length < box_selected) {
        password_length = box_selected;
        handle_slider();
    }

    // console.log('hi');
    password = "";

    let funArr = [];

    if (uppercheckbox.checked) funArr.push(generateUppercase);
    if (lowercheckbox.checked) funArr.push(generateLowercase);
    if (numbercheckbox.checked) funArr.push(generateNumber);
    if (symbolcheckbox.checked) funArr.push(generateSymbol);

    // console.log('boxselected', box_selected);
    // console.log('hi');
    for (i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }
    // console.log('hi');
    // console.log(funArr.length);
    for (i = 0; i < password_length - funArr.length; i++) {
        let index = generateRandomInteger(0, funArr.length);
        password += funArr[index]();
    }
    // console.log('hi');
    sufflestring(Array.from(password));
    // console.log('hi');
    displaypassword.value = password

    calcStrength();
});