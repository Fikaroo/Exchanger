let inCur, outCur;
const url = 'https://api.exchangerate.host/latest';
const activeBtn = document.querySelectorAll('.btn-active');
const btnIn = document.querySelectorAll('.input-select .btn-value');
const btnOut = document.querySelectorAll('.output-select .btn-value');
const curRateIn = document.querySelector('.input-area .currency-rate');
const curRateOut = document.querySelector('.output-area .currency-rate');
const inputIn = document.querySelector('.input-area .amount');
const inputOut = document.querySelector('.output-area .amount');
const errorTextIn = document.querySelector('.input .errorText');
const errorNumIn = document.querySelector('.input .errorNum');
const errorTextOut = document.querySelector('.output .errorText');
const errorNumOut = document.querySelector('.output .errorNum');
const menuBtn = document.querySelector('.hamburger');
const menu = document.querySelector('.nav-content ul');
const container = document.querySelector('.container');
let curApiRateIn, curApiRateOut,space = 0;

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
            inputOut.value = +(inputIn.value * curApiRateIn).toFixed(6).substring(0, 13);
        } else {
            inputOut.value = '';
        }
    }
    if (e == 'input-select') {
        if (inputIn.value != '') {
            inputIn.value = +(inputOut.value * curApiRateOut).toFixed(6).substring(0, 13);
        } else {
            inputIn.value = '';
        }
    }

    inputIn.addEventListener('keyup', (e) => {
        if (e.target.value.length < 14) {
            if(e.target.value.length == 4){
            e.target.value = e.target.value.replace(/([0-9])([0-9][0-9][0-9])/g, '$1 $2')
            console.log(e.target.value.length)
        } 
        if (e.target.value.length == 8){
            e.target.value = e.target.value.replace(" ","")
            e.target.value = e.target.value.replace(/([0-9])([0-9][0-9][0-9])([0-9][0-9][0-9])/g, '$1 $2 $3')
        }
        // if (e.target.value.length == 8){
        //     e.target.value = e.target.value.replace(" ","")
        //     e.target.value = e.target.value.replace(/([0-9][0-9])([0-9][0-9][0-9])([0-9][0-9][0-9])/g, '$1 $2 $3')
        // }
        if (e.target.value.length == 7){
            e.target.value = e.target.value.replace(" ","")
            e.target.value = e.target.value.replace(/([0-9][0-9][0-9])([0-9][0-9][0-9])/g, '$1 $2')
        }
            if (e.target.value.length == 6){
                e.target.value = e.target.value.replace(" ","")
                e.target.value = e.target.value.replace(/([0-9][0-9])([0-9][0-9][0-9])/g, '$1 $2')

            }
            if (e.target.value == '') {
                errorTextIn.style.display = 'none';
                errorNumIn.style.display = 'none';
                inputOut.value = '';
            } 
            else if (e.target.value.includes(',')) {
                e.target.value = e.target.value.replace(',', '.');
            } else if (isNaN(e.target.value.replace(' ',''))) {
                inputOut.value = '';
                errorTextIn.style.display = 'block';
                errorNumIn.style.display = 'none';
            } else if (e.target.value.includes('-')) {
                inputOut.value = '';
                errorNumIn.style.display = 'block';
                errorTextIn.style.display = 'none';
            } else {
                inputOut.value = +(e.target.value * curApiRateIn).toFixed(6).substring(0, 13);
                errorTextIn.style.display = 'none';
                errorNumIn.style.display = 'none';
            }
        }
    });

    inputOut.addEventListener('keyup', (e) => {
        if (e.target.value.length < 14) {
            if (e.target.value == '') {
                errorTextOut.style.display = 'none';
                errorNumOut.style.display = 'none';
                inputIn.value = '';
            } else if (isNaN(e.target.value.replace(' ',''))) {
                errorTextOut.style.display = 'block';
                errorNumOut.style.display = 'none';
                inputIn.value = '';
            } else if (e.target.value.includes('-')) {
                errorNumOut.style.display = 'block';
                errorTextOut.style.display = 'none';
                inputIn.value = '';
            } else {
                inputIn.value = +(e.target.value.replace(' ','') * curApiRateOut).toFixed(6).substring(0, 13);
                errorTextOut.style.display = 'none';
                errorNumOut.style.display = 'none';
            }
        }
    });
}

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
    errorTextIn.style.display = 'none';
    errorNumIn.style.display = 'none';
    callApi(e.target.parentElement.classList[1]);
}

function changeCurOut(e) {
    const activeBtnOut = document.querySelectorAll('.output-select .btn-active');
    activeBtnOut.forEach(item => item.classList.remove('btn-active'))
    e.target.classList.add('btn-active');
    outCur = e.target.value;
    errorTextOut.style.display = 'none';
    errorNumOut.style.display = 'none';
    callApi(e.target.parentElement.classList[1]);
}

function openMenu(e) {
    e.target.classList.toggle('is-active');
    menu.classList.toggle('is-active');
}