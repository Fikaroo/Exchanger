let inCur, outCur;
const url = 'https://api.exchangerate.host/latest';
const activeBtn = document.querySelectorAll('.btn-active');
const btnIn = document.querySelectorAll('.input-select .btn-value');
const btnOut = document.querySelectorAll('.output-select .btn-value');
const curRateIn = document.querySelector('.input-area .currency-rate');
const curRateOut = document.querySelector('.output-area .currency-rate');
const inputIn = document.querySelector('.input-area .amount');
const inputOut = document.querySelector('.output-area .amount');
const menuBtn = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-content ul');
const container = document.querySelector('.container');
let curApiRateIn, curApiRateOut, space = 0;

activeBtn.forEach((item, index) => {
    if (index == 0)
        inCur = item.value;
    if (index == 1)
        outCur = item.value;
});


const callApi = async (e) => {
    window.addEventListener('offline', () => {
        throw alert('No Internet Connection');
    })
    if (inCur == outCur) {
        curApiRateIn = 1;
        curApiRateOut = 1;
    }
    const resIn = await fetch(`${url}?base=${inCur}&symbols=${outCur}`);
    const resOut = await fetch(`${url}?base=${outCur}&symbols=${inCur}`);
    const dataIn = await resIn.json();
    const dataOut = await resOut.json();
    curApiRateIn = await Object.values(dataIn.rates)[0];
    curApiRateOut = await Object.values(dataOut.rates)[0];
    appendRate(e);
}

callApi().catch(error => alert('something wrong'));

function appendRate(e) {
    curRateIn.textContent = `1 ${inCur} = ${curApiRateIn} ${outCur}`;
    curRateOut.textContent = `1 ${outCur} = ${curApiRateOut} ${inCur}`;
    if (e == 'output-select') {
        if (inputOut.value != '') {
            inputOut.value = +(inputIn.value.replaceAll(" ", "") * curApiRateIn).toFixed(6).substring(0, 13);
        } else {
            inputOut.value = '';
        }
    }
    if (e == 'input-select') {
        if (inputIn.value != '') {
            inputIn.value = +(inputOut.value.replaceAll(" ", "") * curApiRateOut).toFixed(6).substring(0, 13);
        } else {
            inputIn.value = '';
        }
    }
}
inputIn.addEventListener('keyup', (e) => {
    if (e.target.value.length < 14) {
        if (e.target.value == '') {
            inputOut.value = "";
        }
        inputOut.value = +(e.target.value.replaceAll(" ", "") * curApiRateIn).toFixed(6).substring(0, 13);
        inputOut.value = commify(inputOut.value);
    }
});

inputOut.addEventListener('keyup', (e) => {
    if (e.target.value.length < 14) {
        if (e.target.value == '') {
            inputIn.value = '';
        }
        inputIn.value = +(e.target.value.replaceAll(" ", "") * curApiRateOut).toFixed(6).substring(0, 13);
        inputIn.value = commify(inputIn.value);
    }
});


eventListener();

function eventListener() {
    btnIn.forEach(item => item.addEventListener('click', changeCurIn));
    btnOut.forEach(item => item.addEventListener('click', changeCurOut));
    menuBtn.addEventListener('click', openMenu);
}

function changeCurIn(e) {
    const activeBtnIn = document.querySelectorAll('.input-select .btn-active');
    activeBtnIn.forEach(item => item.classList.remove('btn-active'));
    e.target.classList.add('btn-active');
    inCur = e.target.value;
    callApi(e.target.parentElement.classList[1]);
}

function changeCurOut(e) {
    const activeBtnOut = document.querySelectorAll('.output-select .btn-active');
    activeBtnOut.forEach(item => item.classList.remove('btn-active'))
    e.target.classList.add('btn-active');
    outCur = e.target.value;
    callApi(e.target.parentElement.classList[1]);
}

function openMenu(e) {
    e.target.classList.toggle('is-active');
    menu.classList.toggle('is-active');
}

var numberMask = IMask(inputIn, {
    mask: Number, // enable number mask
    // other options are optional with defaults below
    scale: 6, // digits after point, 0 for integers
    signed: false, // disallow negative
    thousandsSeparator: ' ', // any single char
    padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
    normalizeZeros: true, // appends or removes zeros at ends
    radix: '.', // fractional delimiter
    mapToRadix: [','], // symbols to process as radix
});

var numberMask = IMask(inputOut, {
    mask: Number, // enable number mask
    // other options are optional with defaults below
    scale: 6, // digits after point, 0 for integers
    signed: false, // disallow negative
    thousandsSeparator: ' ', // any single char
    padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
    normalizeZeros: true, // appends or removes zeros at ends
    radix: '.', // fractional delimiter
    mapToRadix: [','], // symbols to process as radix
});

function commify(n) {
    var parts = n.toString().split(".");
    const numberPart = parts[0];
    const decimalPart = parts[1];
    const thousands = /\B(?=(\d{3})+(?!\d))/g;
    return (
        numberPart.replace(thousands, " ") + (decimalPart ? "." + decimalPart : "")
    );
}