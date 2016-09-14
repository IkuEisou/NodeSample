function submit(){
	var call = $('input:radio[name=call]:checked').val();
	var csrf = $("#id_csrf").val();
	switch(call){
	case 'selectOne':
		var id = $("#id_so").val();
		if (id == "" || id == null) {
			printmsg("検索IDが入力されていません。");
			return;
		}
		if (!isID(id)){
		 	printmsg("IDに正数以外が入力されています。");
			return;
		}
		$.ajax({
			type: 'POST',
			url: 'srhcar',
			dataType: 'json',
			data:{
				_csrf: csrf,
				id: id
			},
			error: function(xhr, err){
				printmsg(err.msg)
			},
			success: function(data){
				if (data.type) {
					printmsg(data.msg);
				}else{
					var date = data.lastupdate ? new Date(data.lastupdate) : "";
					var html = "<tr id=showtr><td>"+data.id+"</td><td>"+data.name+"</td><td>"+data.color+
						"</td><td>"+data.zaiko+"</td><td>"+data.haikiryou+"</td><td>"+data.nenpi+"</td><td>"
						+data.milage+"</td><td>"+data.nenshiki+"</td><td>"+data.comment+"</td><td>"
						+date+"</td></tr>";
					$('body').css("background-color","#fff"); 
					$('#msgbar').empty();
					$("#shop").hide();
					$("#showcar").show();
					$("#showtable").append(html);
				}
			}
		});
		break;
	case  "insert":
		check("addcar","id_in","name_in","color_in","zaiko_in","haikiryou_in",
			"nenpi_in","milage_in","nenshiki_in","comment_in");
		break;
	case "update":
		check("updatecar","id_up","name_up","color_up","zaiko_up","haikiryou_up",
			"nenpi_up","milage_up","nenshiki_up","comment_up");
		break;
	case  "delete":
		var id = $("#id_de").val();
		if (id == "" || id == null) {
			printmsg("削除IDが入力されていません。");
			return;
		}
                if (!isID(id)){
                        printmsg("削除IDに正数以外が入力されています。");
                        return;
                }
		if (confirm("車を削除しますか？")){
			$.ajax({
				type: 'POST',
				url: 'delcar',
				dataType: 'json',
				data:{
					_csrf: csrf,
					id: id
				},
				error: function(err){
					printmsg(err.msg);
				},
				success: function(data){
					printmsg(data.msg);
				}
			});
		}
	}
}

function reset(){
	$('input:text').val("");
	$('textarea').val("");
	$('#msgbar').empty();
}

function check(action,id_input,name_input,color_input,zaiko_input,haikiryou_input,nenpi_input,
	milage_input,nenshiki_input,comment_input){
	var id = $("#"+id_input).val();
	var name = $("#"+name_input).val();
	var color = $("#"+color_input).val();
	var zaiko = $("#"+zaiko_input).val();
	var haikiryou = $("#"+haikiryou_input).val();
	var nenpi = $("#"+nenpi_input).val();
	var milage = $("#"+milage_input).val();
	var nenshiki = $("#"+nenshiki_input).val();
	var comment = $("#"+comment_input).val();
	var csrf = $("#id_csrf").val();

	if(id == "" || id == null){
		printmsg("登録/更新IDが入力されていません。");
	}else if (!isID(id)) {
		printmsg("登録/更新IDに正数以外が入力されています。");
	}
	
	else if( name== "" || name == null){
		printmsg("車名が入力されていません。");
	}
	
	else if( color == "" || color == null){
		printmsg("カラーが入力されていません。");
	}
	
	else if( zaiko == "" || zaiko == null){
		printmsg("在庫有無(有:1/無:0)が入力されていません。");
        }else if (!(zaiko==0 || zaiko==1)) {
                printmsg("在庫有無(有:1/無:0)に(0,1)以外が含まれています。");
	}
	
	else if( haikiryou == "" || haikiryou == null){
		printmsg("排気量(cc)が入力されていません。");
        }else if (isNaN(haikiryou)) {
                printmsg("排気量(cc)に数値以外が含まれています。");
	}

	else if( nenpi == "" || nenpi == null){
		printmsg("燃費が入力されていません。");
        }else if (isNaN(nenpi)) {
                printmsg("燃費に数値以外が含まれています。");
	}

	else if( milage == "" || milage == null){
		printmsg("走行距離が入力されていません。");
        }else if (isNaN(milage)) {
                printmsg("走行距離に数値以外が含まれています。");
	}

	else if( nenshiki == "" || nenshiki == null){
		printmsg("年式が入力されていません。");
        }else if (!isYear(nenshiki)) {
                printmsg("年式に1000~9999以外の値が入力されています。");
	}

	else if( comment == "" || comment == null){
		printmsg("コメントが入力されていません。");
	}

	else {
		$.ajax({
			type: 'POST',
			url: action,
			dataType: 'json',
			data:{
				_csrf: csrf,
				id: id,
				name: name,
				color: color,
				zaiko: zaiko,
				haikiryou: haikiryou,
				nenpi: nenpi,
				milage: milage,
				nenshiki: nenshiki,
				comment: comment
			},
			error: function(err){
				printmsg(err.msg)
			},
			success: function(data){
				printmsg(data.msg);
			}
		});
	}
}

function back(){
	$('body').css("background-color","#3399ff"); 
	$("#shop").show();
	$("#showcar").hide();
	$("#showtr").remove();
}

function isYear(adDate) { 
  // 1000~9999
  var pattern = /^[1-9]\d{3}$/; 
  return pattern.test(adDate); 
} 
   
function isID(id){
  var pattern = /^\d+?$/;
  return pattern.test(id);
}
