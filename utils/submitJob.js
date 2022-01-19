async function submitJob(transaction) {
	console.log('powco.job.submit', transaction);

	let resp = await fetch(`https://pow.co/node/api/jobs`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ transaction })
	});

	let body = await resp.json();

	return body;
}

export default submitJob;
