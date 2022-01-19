async function fetchPricing(startTimestamp) {
	console.log('FETCH PRICING', startTimestamp);

	let resp = await fetch(`https://pow.co/node/v1/ranking-timeframes`, { method: 'GET' });

	let body = await resp.json();

	return body;
}

export default fetchPricing;
