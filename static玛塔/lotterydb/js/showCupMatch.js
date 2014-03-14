
//写入积分数据子fun
function writeScoreSon(A,arr,n){
	if(n==0)
	{
		var th=createDom("tr",null,"<td colspan='10'>"+A+"-积分排名</td>");
		$("#arrPoints").append(th);	
	}
	$.each(arr,function(i){		
		var tr=createDom("tr",null,null);
		$(tr).append(createDom("th",null,arr[i][0]));		
		var ht="t"+arr[i][1];
		if(arrTm[ht]&&arrTm[ht][1])
			arr[i][1]=arrTm[ht][1];
		$.each(arr[i].slice(1),function(j){
			var td=createDom("td",null,arr[i][j+1]);
			$(tr).append(td);	
			});
		$("#arrPoints").append(tr);	
	});
		$("#arrPoints tr:even").attr("class","trGreyBG");
}
//写入积分数据,n代表是否总、所有积分
function writeScore(str,A,n){
	$("#arrPoints").find("tr").eq(0).nextAll().remove();
	if(n!=-1)
	{		
		var arr=arrPoints[str][A];
		if(arr)
			writeScoreSon(A,arr,1);	
	}
	else
	{
		//console.log(getKeys(arrPoints[str]));
		var arrKeys=getKeys(arrPoints[str]);
		$.each(arrKeys,function(i){
			//console.log(arrPoints[str][this]);
			var arr=arrPoints[str][this];
			if(arr)
				writeScoreSon(this,arr,0);				
			});
	}
	/*writeScoreSon("arrHome",arrHome);	
	writeScoreSon("arrAway",arrAway);*/		
	}
//给轮赛场数添加点击背景色
function rdTableCol(i){	
		$(".chooseTable a").click(function(){
			$(this).addClass("cupBgB").parent().siblings().children().removeClass("cupBgB");			
			});
		$("#tabBlue a").attr("style","");
		if(i!=-1)
		{	
			$($("#tabBlue a")[i]).css({"display":"block","background-color":"#7399E6","color":"#fff"});	
		}
		else
			$($("#tabBlue a").last()).css({"display":"block","background-color":"#7399E6","color":"#fff"});		
			
	}
//添加组数据obj
function addZu(str){
	$("#tabBlue").html("").show();
	var obj=groups[str];
	if(obj&&obj.rounds>1)
	{
		var table=$("<table width='100%'></table>");
		var tr=$("<tr></tr>");
		$(tr).append(createDom("td",null,"分组"));
		for(var i=0;i<obj.rounds;i++)
		{
			/*if(lgType!=2)
			{*/
				var s=getChar(i);
				var td=createDom("td",null,"<a href='javascript:void(0);' onclick=writeRoundsDel('"+str+"','"+s+"',"+i+");writeScore('"+str+"','"+s+"',0)>"+s+"</a>")
			/*}
			else
			{
				var td=createDom("td",null,"<a href='javascript:void(0);' onclick=writeRoundsDel('"+str+"','R_"+(i+1)+"',(i+1))>"+(i+1)+"</a>")
				}*/
			$(tr).append(td);
		}
		
		$(tr).append(createDom("td",null,"<a href='javascript:void(0);' onclick=writeRoundsDel('"+str+"','0','-1');writeScore('"+str+"','总','-1')>总</a>"));
		$("#tabBlue").append($(table).append(tr));		
		
	}
	
}
/*$(function(){
	//调用积分榜,-1代表查所有小组积分
	writeScore(getKey("groups"),null,-1);
	
})*/