// Select the file input elements
const profilePictureInput = document.getElementById('profile-picture-input');
const bannerPictureInput = document.getElementById('banner-picture-input');

// Select the image elements
const profilePicture = document.getElementById('profile_picture');
const bannerPicture = document.getElementById('banner_picture');

// Add event listeners for file input change events
profilePictureInput.addEventListener('change', handleProfilePictureChange);
bannerPictureInput.addEventListener('change', handleBannerPictureChange);

// Function to handle profile picture change event
function handleProfilePictureChange(event) {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			profilePicture.setAttribute('src', e.target.result);
		};
		reader.readAsDataURL(file);
	}
}

// Function to handle banner picture change event
function handleBannerPictureChange(event) {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			bannerPicture.setAttribute('src', e.target.result);
		};
		reader.readAsDataURL(file);
	}
}
