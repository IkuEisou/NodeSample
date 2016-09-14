var csrf = $("#id_csrf").val();
function regist(){
	var username = $("#id_name").val();
	var password = $("#id_pass").val();

	if (username==""||password=="") {
		printmsg("ユーザーID/パスワードが入力されていません。");
	}else{
		$.ajax({
			type: 'POST',
			url: 'register',
			dataType: 'json',
			data: {
				_csrf: csrf,
				name: username,
				pass: password
			},
			error: function(err){
				printmsg(err.msg);
			},
			success: function(result){
				printmsg(result.msg);
			}
		});
	}
}

function deluser(){
	var username = $("#id_de").val();
	var csrf = $("#id_csrf").val();

	if (username=="") {
		printmsg("ユーザーIDが入力されていません。");
	}else{
		if (!confirm(username + "を削除しますか？")) {return;}
		$.ajax({
			type: 'POST',
			url :'deluser',
			dataType:'json',
			data: {
				_csrf: csrf,
				delname: username
			},
			error: function(err){
				printmsg(err.msg)
			},
			success: function(result){
				printmsg(result.msg);
			}
		});
	}
}

function deltable(){
 	if (!confirm("車テーブルを削除しますか?")) {return;}
	$.ajax({
		type: 'POST',
		url :'delcartab',
		dataType:'json',
		data:{
			_csrf: csrf
		},
		error: function(err){
			printmsg(err.msg);
		},
		success: function(data){
			printmsg(data.msg);
		}
	});
}

function cretable(){
	$.ajax({
		type: 'POST',
		url :'crtcartab',
		dataType:'json',
		data:{
			_csrf: csrf
		},
		error: function(err){
			printmsg(err.msg);
		},
		success: function(data){
			printmsg(data.msg);
		}
	});
}