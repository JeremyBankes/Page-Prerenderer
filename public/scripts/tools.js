function request(method, url, callback, data) {
	const request = new XMLHttpRequest();
	request.onreadystatechange = () => {
		if (request.readyState == 4 && request.status == 200) {
			callback(request.responseText);
		}
	};
	request.open(method, url, true);
	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	request.send(JSON.stringify(data));
}

function get(url, callback, data) {
	request('GET', url, callback, data);
}

function post(url, callback, data) {
	request('POST', url, callback, data);
}