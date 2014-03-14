// showMatch Basic function

//添加年份select数据
function addYearSel(){
	//$(".yearSel").html("");
	arrYears.reverse();
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
//添加圈数据
function addQuan(){
	$(".chooseTable").show();	
	var ul=createDom("ul",null,null);
	$.each(arrLeague,function(i){
		var li=createDom("li",null,null);
		var a=createDom("a",null,arrLeague[i][1]);
		var n=0;
		if(lgType&&lgType==2)
		{
			if(getKeys(arrPoints["G"+this[0]]).length>0)
				n=-1;
		}
		$(a).attr("onclick","chooseAdd('G"+arrLeague[i][0]+"',"+n+")");	
		if(i==0)
		{
			$(a).addClass("cupBgB");
		}
		$(ul).append($(li).append(a));
		
		});
      		
		$(ul).append("<div class='clear'></div>");
		$(".chooseTable").append(ul);
		//选择添加组或者圈，并写入轮次详情
		chooseAdd(getKeys(groups)[0],0);
	}
//获取对象的第一个key
function getKey(obj){
	var k='', len=0;;
 	for(k in obj){  
		 if(obj.hasOwnProperty(k)){  
		 len+=1;
		 }
		 if(len=1)
			k=k;
		 return k;
         }  
	}
//获取对象的所有的key
function getKeys(obj){
	var arr=[], len=0;;
 	for(var k in obj){  
		 if(obj.hasOwnProperty(k)){  
		 arr.push(k);
		 }	
         }
	arr.sort();
	return arr;
	}
//选择加载组或轮，并写入轮详细信息；str-->groups的key,n：是否为总积分
function chooseAdd(str,n){
	//n:-1代表点击分组总
	if(lgType==2)
	{
		addZu(str);
		if(n!=-1)
		{
			$("#scoreDet").hide();
			if(groups[str]&&groups[str]["A"])
				writeRoundsDel(str,'A',n);
		}
		else
		{
			//调用积分榜,-1代表查所有小组积分
			//writeScore(getKey("groups"),null,-1);	
			$("#scoreDet").show();
			$("#showRound").hide();
			//调用背景色程序
			rdTableCol(n);
			writeScore(str,null,n);
			}
	}
	else
	{
		addRounds(str);
		if(groups[str]&&groups[str]["R_1"])
			writeRoundsDel(str,'R_1',n);
	}
	}
function getChar(i){
	return String.fromCharCode(65+i);
	}
//根据teamId到arrTm['t19']查找名称
//写入当前第几轮数据对应的详情数据,A是组标识,n是第几项
function writeRoundsDel(str,A,n){
	if(n!=-1)
	{
		$("#showRound").show();
		var arrRd=groups[str][A];
		$("#showRound").find("tr").eq(1).nextAll().remove();
		$.each(arrRd,function(i){
			var tr=createDom("tr",null,null);
				$(tr).append(createDom("td",null,i+1));
			var ht="t"+arrRd[i][2];
			var at="t"+arrRd[i][4];
			$(tr).append(createDom("td",null,formatDate(arrRd[i][1])));
			$(tr).append(createDom("td",null,arrTm[ht][1]));
			$(tr).append(createDom("td",null,arrRd[i][3]));
			$(tr).append(createDom("td",null,arrTm[at][1]));
			$(tr).append(createDom("td",null,arrRd[i][5]));
			$(tr).append(createDom("td",null,arrRd[i][6]));
			$(tr).append(createDom("td",null,arrRd[i][7]));
			$(tr).append(createDom("td",null,arrRd[i][8]));
			$(tr).append(createDom("td",null,"<em><a href='#'>情</a><a href='#'>欧</a><a href='#'>亚</a><a href='#'>析</a><a href='#'>大</a></em>"));
			$(tr).append(createDom("td",null,arrRd[i][9]));
			$("#showRound").append(tr);
			});
	}
	else
		$("#showRound").hide();
	//调用背景色程序
	rdTableCol(n);
	}
//格式化时间
function formatDate(str){
	var t=str.split(" ");
	var a=[];
	a[0]=t[0].split("-");
	a[1]=t[1].split(":");	
	return a[0][1]+'-'+a[0][2]+"<br />"+a[1][0]+':'+a[1][1];
	
	}
$(function(){
	addQuan();
	addYearSel();
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
})
