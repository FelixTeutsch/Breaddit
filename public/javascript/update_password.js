// const oldPw = document.getElementById('old_pw');
const newPw = document.getElementById('new_pw');
const newPwAgain = document.getElementById('new_pw_again');

newPw.addEventListener('input', checkPassword);
newPwAgain.addEventListener('input', checkPassword);
function checkPassword() {
	if (newPw.value !== newPwAgain.value) {
		newPwAgain.setCustomValidity('Passwords do not match!');
	} else {
		newPwAgain.setCustomValidity('');
	}
}
