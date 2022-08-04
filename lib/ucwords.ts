function ucwords(str: string) {
	return (' ' + str).replace(/ \w/g, a => a.toLocaleUpperCase()).trim();
}

export { ucwords };