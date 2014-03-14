// JavaScript Document
//生产dom元素,o是元素 cls是样式名 text是内容
function createDom(o,cls,text){
	var obj=$("<"+o+"></"+o+">");
	if(cls!=null &&cls!="")
		$(obj).attr("class",cls);
	if(text!=null &&text!="")
		$(obj).html(text);
	return obj;
	}
//处理显示赛事
function showLeagueData(obj,i){
	$(obj).parent().parent().addClass("selectTag").siblings().removeClass("selectTag");
	if(i!=0)
	{
		$(".listBox").not($(".listBox"+i)).hide();
		$(".listBox"+i).show();
	}
	else		
		$(".listBox").show();
	//changeRigLeague(i);
	}
//显示赛事tab
function showTab(){
	var ul=createDom("ul",null,null);
	$.each(arrlg,function(i){
		var span=createDom("span",null,null);
		$(span).append("<a href='javascript:void(0);' onclick='showLeagueData(this,"+arrlg[i][0]+")'>"+arrlg[i][1]+"</a>");
		if(i!=0)
		{
			var li=createDom("li",null,null);
			}
		else
		{
			var li=createDom("li","selectTag",null);
			}
		$(ul).append($(li).append(span));		
		});
	$("#tabSC").append(ul);
	
	}
//组织各个赛事为新的数组
/*$.each(arrElse,function(i){
	arrSon[i]=[];
	});*/
function makeLeagueArr(){
var arrSons="arrSon";
	var arrElse=[];
	arrElse[0]=[0,3,4];
	arrElse[1]=[1,2,5];
	$.each(arrElse,function(i){
		//分别建立各个赛事arr
		arrSons+=i;
		arrSons=[];
		$.each(arrElse[i],function(j){			
			arrSons.push(arr[j]);
			});		
		});
	}
//写入div等赛事dom
function writeSaishi(arr){
	// <![CDATA[	
	$.each(arr,function(i){
		var div=createDom("div","listBox",null);
		$(div).addClass("listBox"+arr[i][2]);
		//$(div).attr("id","");
		$(div).append(createDom("div","upList",null).append("<img src='images/leagues/"+arr[i][0]+".jpg' width='100' />"));
		var span=$("<span><a href='javascript:void(0)'>"+arr[i][1]+"<em></em></a></span>");
		var div1=$("<div class='downList mat10'></div>");		
		$(div1).addClass("downList"+arr[i][2]);
		$(div).append(div1.append(span));		
		/*var ul=createDom("ul",null,null);
		$.each(arr[i][3],function(j){
			var li=createDom("li",null,null).append("<a href='"+url+arr[i][2]+"/"+arr[i][3][3][j]+"/"+arr[i][3][0]+"'>"+arr[i][3][3][j]+"</a>");
			$(ul).append(li);
		});
	$(div).append(ul);*/
	$("#content").append(div);
	//调用添加赛季方法
	//var page = (arrSclass.length + 15) / 16; 
    arr[i]=arr[i].slice(3);
	var count=10;
	var n=Math.ceil(arr[i].length/count);
	var col=Math.ceil(arr[i].length/count);  
	//n=col;
	//10个作为一列，超出10个则分成两列
	//按照定义截断赛事显示
	var cols=i+1;
	var rows=Math.ceil(cols/8)-1;
	//console.log(rows);
	for (var a = n; a > 0; a--) {	
	//alert(n+","+col);
		if(n>col)
		{
			//for (var m = 0; m < col; m++) {
				//alert(m);
				var newarr=[];
				newarr[a]=arr[i].slice((a-1)*count,a*count);
				//console.log(newarr[a]);	return;			
				var ul=createDom("ul","listOne",null);
					//alert(cols+","+(-(a-1)*100));
				/*if(cols%(rows*8+5)==0||cols%(rows*8+6)==0||cols%(rows*8+7)==0||cols%8==0)
				{
					$(ul).css({"display":"none","left":-(a-1)*100,"z-index":(n-a+1)*100});
					}
				else
				{
					}*/
					//$(ul).addClass("listOneR");
					//$(ul).addClass("listOneR");
					$(ul).css({"display":"none","left":(a-1)*100,"z-index":(n-a+1)*100});
					$.each(newarr[a],function(j){		
						var li=createDom("li","leagues",null).append("<a href='javascript:void(0)'>"+newarr[a][j][1]+"<em></em></a>");
						$(ul).append(li.append(createSclassDiv(li,newarr[a][j][3],cols,newarr[a][j][0])));			
						//console.log(newarr[a][j][0]); newarr[a][j][0]:赛事Id
						$(span).after($(ul)); 
						});	
				//}
		}
		else
		{
			//最后一列处理
			var newarrL=arr[i].slice((n-1)*count,arr[i].length);
			var ul=createDom("ul","listOne",null);
			/*if(cols%(rows*8+5)==0||cols%(rows*8+6)==0||cols%(rows*8+7)==0||cols%8==0)
				{
					$(ul).css({"display":"none","left":-(n-1)*100,"z-index":(n-a+1)*100});
					}
				else
				{
					$(ul).css({"display":"none","left":(n-1)*100,"z-index":(n-a+1)*100});
					}*/
			//$(ul).css({"display":"none","left":(n-1)*100,"z-index":(n-a+1)*100});
					//$(ul).addClass("listOneR");
			$(ul).css({"display":"none","left":(n-1)*100,"z-index":(n-a+1)*100});
			$.each(newarrL,function(j){		
				var li=createDom("li","leagues",null).append("<a href='javascript:void(0)'>"+newarrL[j][1]+"<em> </em></a>");
				$(ul).append(li.append(createSclassDiv(li,newarrL[j][3],cols,newarrL[j][0])));			
				$(span).after($(ul)); 
				});	
			}
			col=col-1;
	}
		/*
		//输出所有为一列
		var ul=createDom("ul","listOne",null);
			$(ul).css("display","none");			
			arr[i]=arr[i].slice(3);
			$.each(arr[i],function(j){		
				var li=createDom("li","leagues",null).append("<a href='javascript:void(0)'>"+arr[i][j][1]+"<em></em></a>");
				$(ul).append(li.append(createSclassDiv(li,arr[i][j][3])));			
				$(span).after($(ul)); 
				});	*/	
		});
		
	$("#content").append(createDom("div","clear",null));
	//]]
}

//创建联赛分列的层，arrA是子级赛事名，arrB是赛季
function createSclassDiv(obj,arrA,cols,url) {
	    var ul=createDom("ul","listTwo",null);
		//$(ul).css("display","none");
		//alert(-(cols-1)*100);
		/*if(cols%(rows*8+5)==0||cols%(rows*8+6)==0||cols%(rows*8+7)==0||cols%8==0)
		{
			$(ul).css({"display":"none","left":"-90px"});
		}
		else*/
			$(ul).css({"display":"none"});
		
	$.each(arrA,function(j){
		var li=createDom("li","leaguesTime",null);
		li.append("<a href='"+url+"/"+arrA[j]+"'>"+arrA[j]+"</a>");
		obj.append($(ul).append(li));
	});
}

//显示隐藏联赛名
function hideSclass() {
  $(".downList").hover(function(){
	  $(this).find(".listOne").toggle();
	  });
  $(".leagues").hover(function(){
	$(this).find(".listTwo").toggle();
  })
}

//调整最后2行的赛事名的位置为向上
function changeBotLeague(num){
	if(num==0)
	{
		num='';
		}
	
	var arrd=$(".downList"+num);
	var start=(Math.ceil($(".downList"+num).length/8)-2)*8;
	arrd=arrd.slice(start,arrd.length);
	$.each(arrd,function(i,val){
		var obj=$(this).find(".listOne");
		$.each(obj,function(j,val1){
			var top=-(($(this).children(".leagues").length-1)/2*24)+"px";			
		    $(val).find(".listOne").css("top",top);
			$.each($(val1).children(".leagues"),function(n){
			var top1=-(($(this).children().find(".leaguesTime").length-1)/2*24)+"px";
			//console.log($(this).children().find(".leaguesTime"));
			$(this).find(".listTwo").css("top",top1);
			});
		});
	
	})
}
//调整右边4行的赛事名的位置为向左
function changeRigLeague(num){
	var arrd=$(".downList");
	//var start=(Math.ceil($(".downList").length/8)-2)*8;
	//arrd=arrd.slice(start,arrd.length);
	$.each(arrd,function(i,val){
		var obj=$(this).find(".listOne");
		$.each(obj,function(j,val1){
			var top=-(($(this).children(".leagues").length-1)/2*24)+"px";	
		    $(val).find(".listOne").css("top",top);
			$.each($(val1).children(".leagues"),function(n){
			var top1=-(($(this).children().find(".leaguesTime").length-1)/2*24)+"px";
			//console.log($(this).children().find(".leaguesTime"));
			$(this).find(".listTwo").css("top",top1);
			});
		});
	
	})
}