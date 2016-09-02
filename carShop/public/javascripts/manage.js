var csrf = $("#id_csrf").val();
function regist(){
	var username = $("#id_name").val();
	var password = $("#id_pass").val();

	if (username==""||password=="") {
		alert("ユーザーID/パスワードが入力されていません。");
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
				alert(err.msg);
			},
			success: function(result){
				alert(result.msg);
			}
		});
	}
}

function deluser(){
	var username = $("#id_de").val();
	var csrf = $("#id_csrf").val();

	if (username=="") {
		alert("ユーザーIDが入力されていません。");
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
				alert(err.msg)
			},
			success: function(result){
				alert(result.msg);
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
			alert(err.msg);
		},
		success: function(data){
			alert(data.msg);
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
			alert(err.msg);
		},
		success: function(data){
			alert(data.msg);
		}
	});
}
