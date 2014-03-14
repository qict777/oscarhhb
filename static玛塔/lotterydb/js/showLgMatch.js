
//写入积分数据
function writeScore(){
	writeScoreSon("arrTotal",arrTotal);	
	writeScoreSon("arrHome",arrHome);	
	writeScoreSon("arrAway",arrAway);		
	}
//给轮赛场数添加点击背景色
function rdTableCol(i){			
		$(".chooseTable a").click(function(){
			$(this).addClass("cupBgB").parent().siblings().children().removeClass("cupBgB");			
			});
		$(".rdTable a").attr("style","");
		$($(".rdTable a")[i]).css({"background-color":"#7399E6","color":"#fff"});	
	}
//添加当前第几轮数据
function addRounds(str){	
	$(".rdTable").html("").show();
	var obj=groups[str];
	if(obj&&obj.rounds>1)
	{
		$("#scoreDet").show();
		var table=$("<table width='100%'></table>");
		var tr=$("<tr></tr>");
		var col=Math.ceil(obj.rounds/2);	
		if(obj.rounds>20)
		{
			for(i=0;i<2;i++)
			{
				var tr=$("<tr></tr>");
				for(j=0;j<col;j++)
				{			
					var s=j+i*(col-1)+1+i;
					var td=createDom("td",null,"<a href='#' onclick=writeRoundsDel('"+str+"','R_"+s+"',"+(s-1)+")>"+s+"</a>")				
					$(tr).append(td);	
				}				
			$(table).append(tr);
			}
		}
		else
		{
			for(var i=0;i<obj.rounds;i++)
			{			
				var s=1+i;
				var td=createDom("td",null,"<a href='#' onclick=writeRoundsDel('"+str+"','R_"+s+"',"+(s-1)+")>"+s+"</a>")				
				$(tr).append(td);
			}				
			$(table).append(tr);
		}
		
		$(".rdTable").append(table);
		var th=$("<th></th>");
		$(th).html("<p>当前</p><p>第22轮</p>");
		if(obj.rounds>20)
			$(th).attr("rowspan",2);			
		$(th).prependTo($(".rdTable").find("tr:eq(0)"));
		
	}
	else
		$("#scoreDet").hide();
	
}

//写入积分数据子fun
function writeScoreSon(cls,arr){	
	//$("."+cls).find("tr").eq(0).nextAll().remove();
	$.each(arr,function(i){
		var tr=createDom("tr",null,null);
		$(tr).append(createDom("th",null,arr[i][0]));
		//截取近六轮数据
		if(cls=="arrTotal")
		{
			var newArr=arr[i].slice(15);		
				arr[i][15]="";	
			$.each(newArr,function(n){
				arr[i][15]+="<i class='fontLS'>"+newArr[n]+"</i>";
				});
		}		
		var ht="t"+arr[i][1];
		//console.log(arrTm[ht][1].length);
		if(arrTm[ht]&&arrTm[ht][1])
			arr[i][1]=arrTm[ht][1].length>5?arrTm[ht][1].substring(0,4)+"…":arrTm[ht][1];
		$.each(arr[i],function(j){				
			if(cls=="arrTotal")
				var a=14;
			else
				var a=13
			if(j<=a)
			{				
				var td=createDom("td",null,arr[i][j+1]);	
			}
			$(tr).append(td);
		
			});
		$("."+cls).append(tr);
	});
		$("."+cls+" tr:even").attr("class","trGreyBG");
}
$(function(){
	
		//调用积分榜
		writeScore();
		})