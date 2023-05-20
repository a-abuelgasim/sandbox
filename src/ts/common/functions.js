async function fetchFn(url:string, options = {}, log = false) {
	let data = null;
	const response = await fetch(url, options);

	if (response.status !== 200) {
		console.error(`Error. Response status: ${response.status}`);

		// if 429, too many requets, response
		if (response.status === 429) {
			try {
				const delay = 1000 * parseInt(response.headers.get('retry-after'));
				console.log(`Retrying after ${delay}ms...`);
				await new Promise(resolve => setTimeout(resolve, delay));
				return fetchFn(url, options, log);
			} catch (error) {
				console.error(error);
			}
		}
	} else {
		data = await response.json();
		if (log) {
			console.log('data', data);
		}
	}
	return data;
}

export { fetchFn };
