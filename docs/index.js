const customTipInput = document.getElementById('custom-tip');
const optionsContainer = document.getElementById('options');

customTipInput.addEventListener('focus', function () {
    const radioInputs = optionsContainer.querySelectorAll('input[type="radio"');
    radioInputs.forEach((radioInput) => radioInput.checked = false);
});
