const postPreview = document.getElementById('post_preview');
const postUpload = document.getElementById('post');
postUpload.addEventListener('change', (event) => {
	const file = event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = function (e) {
			postPreview.setAttribute('src', e.target.result);
		};
		reader.readAsDataURL(file);
	}
});
