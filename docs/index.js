const tipForm = document.getElementById('tip-form');
const tipOptions = document.getElementById('options');
const customTip = document.getElementById('custom-tip-input');
const tipAmountResult = document.getElementById('tip-amount-result');
const totalAmountResult = document.getElementById('total-amount-result');
const resetButton = document.getElementById('reset-button');

const noneValidation = {
    bill: (value) => true,
    'custom-tip': (value) => true,
    people: (value) => true,
};

resetButton.addEventListener('click', () => {
    clearSuccess();
    resetButton.classList.remove('form__reset-button--enabled');
    const errors = getFlagErros(tipForm, noneValidation);
    showErrors(errors);
});

const clearTip = () => {
    const radioInputs = tipOptions.querySelectorAll('input[type="radio"');
    radioInputs.forEach((radioInput) => {
        radioInput.checked = false;
    });
    if (formIsResetable(tipForm)) {
        resetButton.disabled = false;
        resetButton.classList.add('form__reset-button--enabled');
    } else {
        resetButton.disabled = true;
        resetButton.classList.remove('form__reset-button--enabled');
    }
    clearSuccess();
};

const clearCustomTip = () => {
    customTip.value = '';
};

customTip.addEventListener('focus', clearTip);

// get all labels inside options
const allTipLabels= tipOptions.querySelectorAll('label');

allTipLabels.forEach((tipButton) => {
    tipButton.addEventListener('click', clearCustomTip);
});

const dataIsValid = (name, value, validations) => {
    return validations[name](value);
};

const formIsFilled = (form, validations) => {
    let isFilled = true;
    const data = Object.fromEntries(new FormData(form));

    if ('tip' in data) {
        delete data['custom-tip'];
    }

    Object.keys(data).forEach((name) => {
        if (!dataIsValid(name, data[name], validations)) {
            isFilled = false;
        }
    });

    return isFilled;
}

const formIsValid = (form, validations) => {
    let isValid = true;
    const data = Object.fromEntries(new FormData(form));

    if ('tip' in data) {
        delete data['custom-tip'];
    }

    Object.keys(data).forEach((name) => {
        if (!dataIsValid(name, data[name], validations)) {
            isValid = false;
        }
    });

    return isValid;
};

const calculateTotalTip = (form) => {
    const data = Object.fromEntries(new FormData(form));

    const bill = parseFloat(data['bill']);
    const people = parseFloat(data['people']);
    const tip = data['tip']
        ? parseFloat(data['tip'])
        : parseFloat(data['custom-tip']) / 100;

    const tipAmount = (bill * tip) / people;
    const totalAmount = (bill / people) + tipAmount;

    return { tipAmount, totalAmount };
}

const renderSuccess = (totalAmount, totalTip) => {
    tipAmountResult.innerText = `$${totalTip.toFixed(2)}`;
    totalAmountResult.innerText = `$${totalAmount.toFixed(2)}`;
};

const clearSuccess = () => {
    tipAmountResult.innerText = '$0.00';
    totalAmountResult.innerText = '$0.00';
}

const getFlagErros = (form, validations) => {
    const data = Object.fromEntries(new FormData(form));

    if ('tip' in data) {
        data['custom-tip'] = data['tip'];
    }

    delete data['tip'];

    const errors = {};

    Object.keys(data).forEach((name) => {
        if (!dataIsValid(name, data[name], validations)) {
            errors[name] = true;
        } else {
            errors[name] = false;
        }
    });

    return errors;
}

const showErrors = (errors) => {
    Object.keys(errors).forEach((name) => {
        const errorContainer = document.getElementById(`${name}-error`);
        const inputContainer = document.getElementById(`${name}-input`);
        if (errors[name]) {
            errorContainer.classList.add('form__control-error--visible');
            inputContainer.classList.add('form__input--error');
        } else {
            errorContainer.classList.remove('form__control-error--visible');
            inputContainer.classList.remove('form__input--error');
        }
    });
}

const formIsResetable = (form) => {
    const data = Object.fromEntries(new FormData(form));

    let isResetable = false;

    Object.keys(data).forEach((name) => {
        if (data[name] !== '') {
            isResetable = true;
        }
    });

    return isResetable;
}

const emptyValidations = {
    bill: (value) => !!value.trim(),
    tip: (value) => !!value.trim(),
    'custom-tip': (value) => !!value.trim(),
    people: (value) => !!value.trim(),
};

const numberValidations = {
    bill: (value) => !isNaN(value) && value >= 0,
    tip: (value) => !isNaN(value),
    'custom-tip': (value) => !isNaN(value) && value > 0 && value < 100,
    people: (value) => !isNaN(value) && value > 0,
};

const handleInput = (form) => {
    if (formIsFilled(form, emptyValidations)) {
        if (formIsValid(form, numberValidations)) {
            const { tipAmount, totalAmount } = calculateTotalTip(form);
            renderSuccess(totalAmount, tipAmount);
        } else {
            clearSuccess();
        }
        const errors = getFlagErros(form, numberValidations);
        showErrors(errors);
    } else {
        clearSuccess();
        if (formIsResetable(form)) {
            resetButton.disabled = false;
            resetButton.classList.add('form__reset-button--enabled');
        } else {
            resetButton.disabled = true;
            resetButton.classList.remove('form__reset-button--enabled');
        }
    }
}

let inputTimer;
const doneInputInterval = 500;

tipForm.addEventListener('input', function () {
    clearTimeout(inputTimer);
    inputTimer = setTimeout(() => handleInput(this), doneInputInterval);
});

