// JavaScript Document
//添加当前第几轮数据
function addRounds(){
	var table=$("<table></table>");
	$(table).attr("width","100%");
	var col=Math.ceil(arrRd.length/2);
	for(i=0;i<2;i++)
	{
		var tr=$("<tr></tr>");
		for(j=0;j<col;j++)
		{
			var td=$("<td></td>");
			if(arrRd[(j+(i*(col-1))+i)])
			{
				$(td).html("<a href='#' onclick='writeRoundsDel("+(j+(i*(col-1))+i)+")'>"+(j+(i*(col-1))+1+i)+"</a>");
			}				
			$(tr).append(td);	
			}
		$(table).append(tr);
		}
		$(".rdTable").append(table);
		var th=$("<th></th>");
		$(th).html("<p>当前</p><p>第22轮</p>");
		$(th).attr("rowspan",2);
		$(th).prependTo($(".rdTable").find("tr:eq(0)"));
}
//添加年份select数据
function addYearSel(){
	//$(".yearSel").html("");
	$.each(arrYears,function(i){
	$(".yearSel").append("<option value='>"+arrYears[i]+"'>"+arrYears[i]+"</option>");		
		});
	}
//添加年份对应的球队select数据
function addBoolSel(i,val){	
	$(".boolSel").html("");
	$.each(arrBoolSel[i],function(j){		
		$(".boolSel").append("<option value='>"+arrBoolSel[i][j]+"'>"+arrBoolSel[i][j]+"</option>");		
		});
	}
//生产dom元素,o是元素 cls是样式名 text是内容
function createDom(o,cls,text){
	var obj=$("<"+o+"></"+o+">");
	if(cls!=null &&cls!="")
		$(obj).attr("class",cls);
	if(text!=null &&text!="")
		$(obj).html(text);
	return obj;
	}
//根据teamId到arrTm['t19']查找名称
//写入当前第几轮数据对应的详情数据
function writeRoundsDel(roun){
	$("#showRound").find("tr").eq(1).nextAll().remove();
	$.each(arrRd[roun],function(i){
		var tr=createDom("tr",null,null);
			$(tr).append(createDom("td",null,roun+1));
		/*$.each(arrRd[roun][i],function(j){
			$(tr).append(createDom("td",null,arrRd[roun][i][j]));
			
		});*/
		var ht="t"+arrRd[roun][i][2];
		var at="t"+arrRd[roun][i][4];
		$(tr).append(createDom("td",null,formatDate(arrRd[roun][i][1])));
		$(tr).append(createDom("td",null,arrTm[ht][1]));
		$(tr).append(createDom("td",null,arrRd[roun][i][3]));
		$(tr).append(createDom("td",null,arrTm[at][1]));
		$(tr).append(createDom("td",null,arrRd[roun][i][5]));
		$(tr).append(createDom("td",null,arrRd[roun][i][6]));
		$(tr).append(createDom("td",null,arrRd[roun][i][7]));
		$(tr).append(createDom("td",null,arrRd[roun][i][8]));
		$(tr).append(createDom("td",null,"<em><a href='#'>情</a><a href='#'>欧</a><a href='#'>亚</a><a href='#'>析</a><a href='#'>大</a></em>"));
		$(tr).append(createDom("td",null,arrRd[roun][i][9]));
		$("#showRound").append(tr);
		});
	//调用背景色程序
	rdTableCol(roun);
	}
//给轮赛场数添加点击背景色
function rdTableCol(i){	
	/*$(".rdTable a").click(function(){
		$(".rdTable a").attr("style","");
		$(this).css({"background-color":"#7399E6","color":"#fff"});
		});*/
		$(".rdTable a").attr("style","");
		$($(".rdTable a")[i]).css({"background-color":"#7399E6","color":"#fff"});	
	}
//格式化时间
function formatDate(str){
	var t=str.split(" ");
	var a=[];
	a[0]=t[0].split("-");
	a[1]=t[1].split(":");	
	return a[0][1]+'-'+a[0][2]+"<br />"+a[1][0]+':'+a[1][1];
	
	}
//写入积分数据
function writeScore(){
	writeScoreSon("arrTotal",arrTotal);	
	writeScoreSon("arrHome",arrHome);	
	writeScoreSon("arrAway",arrAway);	
	
	}
//写入积分数据子fun
function writeScoreSon(cls,arr){	
	$.each(arr,function(i){
		var tr=createDom("tr",null,null);
		$(tr).append(createDom("th",null,i+1));
		//截取近六轮数据
		if(cls=="arrTotal")
		{
			var newArr=arr[i].slice(14);		
				arr[i][14]="";			
			var ht="t"+arr[i][0];
				arr[i][0]=arrTm[ht][1];
			$.each(newArr,function(n){
				arr[i][14]+="<i class='fontLS'>"+newArr[n]+"</i>";
				});
		}
		$.each(arr[i],function(j){		
			if(j<=14)
			{				
				var td=createDom("td",null,arr[i][j]);	
			}
			$(tr).append(td);
		
			});
		$("."+cls).append(tr);
	});
		$("."+cls+" tr:even").attr("class","trGreyBG");
	}
$(function(){
	addRounds();
	addYearSel();
	//addBoolSel(0,null);
	writeRoundsDel(0);
	//年份联动对应球队数据
	$(".yearSel").change(function(){
		var index=$(".yearSel").children("option:selected").index();
		//addBoolSel(index,null);
		
		});
	//更改球队图标
	$("#teamLogo").attr("src","images/leagues/"+arrLg[0]+".jpg");
	  var imgsrc = $("#teamLogo").attr("src");
                $("#teamLogo").load(function(){
                 }).error(function() {
                     $("#teamLogo").attr("src","images/teamLogo.png");
                 }) ;
				 
	//写入赛制信息
	$(".lgName").html(arrLg[1]);
	$(".textBox").html(arrLg[2]);
	//调用积分榜
	writeScore();
})
