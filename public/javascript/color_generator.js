function getColorFromString(str) {
	console.log('Generating color for string:', str);
	// Generate a unique number based on the string
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Convert the number to a hexadecimal color code
	let color = (hash & 0x00ffffff).toString(16);

	// Add leading zeros if needed
	while (color.length < 6) {
		color = '0' + color;
	}

	// Adjust the brightness of the color
	const brightnessThreshold = 0.5;
	const r = parseInt(color.substr(0, 2), 16);
	const g = parseInt(color.substr(2, 2), 16);
	const b = parseInt(color.substr(4, 2), 16);
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;

	if (brightness > brightnessThreshold) {
		// Darken the color if it is too bright
		const darkenFactor = 0.8;
		color = darkenColor(color, darkenFactor);
	} else {
		// Lighten the color if it is too dark
		const lightenFactor = 1.2;
		color = lightenColor(color, lightenFactor);
	}
	return '#' + color;
}

function darkenColor(color, factor) {
	const r = parseInt(color.substr(0, 2), 16);
	const g = parseInt(color.substr(2, 2), 16);
	const b = parseInt(color.substr(4, 2), 16);
	const darkenedR = Math.max(0, Math.floor(r * factor));
	const darkenedG = Math.max(0, Math.floor(g * factor));
	const darkenedB = Math.max(0, Math.floor(b * factor));
	return toHex(darkenedR) + toHex(darkenedG) + toHex(darkenedB);
}

function lightenColor(color, factor) {
	const r = parseInt(color.substr(0, 2), 16);
	const g = parseInt(color.substr(2, 2), 16);
	const b = parseInt(color.substr(4, 2), 16);
	const lightenedR = Math.min(255, Math.floor(r * factor));
	const lightenedG = Math.min(255, Math.floor(g * factor));
	const lightenedB = Math.min(255, Math.floor(b * factor));
	return toHex(lightenedR) + toHex(lightenedG) + toHex(lightenedB);
}

function toHex(value) {
	const hex = value.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}
