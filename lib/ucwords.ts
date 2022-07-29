let PATTERN = /^(.)|\s+(.)/g;

function ucwords(str: string) {
	return str.replace(PATTERN, function(match) {
		return match.toUpperCase();
	});
}

export { ucwords };