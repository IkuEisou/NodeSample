function printmsg(str) {
//	var msgbar = document.getElementById('msgbar');
//	var msg = document.createElement('p');
//	msg.innerHTML = str;
//	msgbar.appendChild(msg);
	$('#msgbar').empty();
	$('#msgbar').append($("<p></p>").text(str));
}
