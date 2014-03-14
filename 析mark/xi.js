// JavaScript Document
//写入select的选项
function writeSel(str,n){
	$("#"+str).children().remove();
	for(var i=1;i<=n;i++)
	{
		$("#"+str).append("<option value='"+i+"'>"+i+"</option>");
	}
	$("#"+str).val(n);
}
//写入对赛类型
function writeType(s,arr){
	if(arr.length>0)
	{
		var str='';
		str=arr[0][0];
		$.each(arr,function(i){
			if(str!=arr[i][0])
			{
				$("#"+s).append("<input type='checkbox' onclick='t_onclick(this);' checked='checked' name='v_l'><label>"+str+"</label>");
				str=arr[i][0];				
			}
			else
			{
				if(i==arr.length-1)
				{
					$("#"+s).append("<input type='checkbox' onclick='t_onclick(this);' checked='checked' name='v_l'><label>"+str+"</label>");
				}
			}
		});
	}	
	
}
//写入普通记录数据
function showDel(obj,arr){
	$("#"+obj).find("tr").eq(1).nextAll().remove();
	$(arr).each(function(index) {
		var tr=$("<tr></tr>");
        $(arr[index]).each(function(j) {
            $(tr).append("<td>"+arr[index][j]+"</td>");
        });
		$("#"+obj).append(tr);
    });
}
//写入对赛往绩
function showdswj(str,arr){
	$("#"+str).find("tr").eq(1).nextAll().remove();
	var arrScore=[];
	var win='';
	$(arr).each(function(i) {
		var tr=$("<tr id='trhn_"+arr[i][7]+"'></tr>");
       /* $(arr[i]).each(function(j) {
            $(tr).append("<td>"+arr[index][j]+"</td>");
        });*/
		//获取比分
		var score=arr[i][3].split("-");
		win=parseInt(score[0])>parseInt(score[1])?"胜":(parseInt(score[0])<parseInt(score[1])?"负":"平");
		arrScore.push(arr[i][3]);
		$(tr).append("<td>"+arr[i][0]+"</td>");
		$(tr).append("<td>"+arr[i][1]+"</td>");
		$(tr).append("<td>"+arr[i][2]+"</td>");
		$(tr).append("<td><a href='#"+arr[i][7]+"'>"+arr[i][3]+"</a>("+arr[i][4]+")</td>");
		$(tr).append("<td>"+arr[i][5]+"</td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$(tr).append("<td>"+win+"</td>");
		$(tr).append("<td></td>");
		$(tr).append("<td></td>");
		$("#"+str).append(tr);
    });	
	showdswjYP(str,1);
	showdswjYP(str,2);
	changeTotalDT(arrScore,null,null);
}
//获取单行tr对应的亚盘欧赔数据
function getyapan(tab,id,col){
	var arr=[];
	$.each(tab,function(){
		if(this[0]==id&&this[1]==col)
		{
			arr=this.slice(2);
			return false;
		}
	});
	return arr;	
}
//获取盘口文字
function getpkName(n){
	var str="";
 	$.each(pankou,function(){
		if(this[0]==n)
		{
			str=this[1];
			return false;
		}
	});
	return str;
}
//写入亚盘欧赔数据
function showdswjYP(tab,n){
	var trs=$("#"+tab+" tr").eq(1).nextAll("tr");
	var total=0,d=0,win=0;
	$.each(trs,function(i){
		var id=parseInt($(this).attr("id").slice(5));
		var col=$($(".sel"+(n==2?'1':'')+tab)[0]).val();
		var col1=$($(".sel"+(n==2?'1':'')+tab)[1]).val();
		//获取比分
		var score=$(this.cells[3]).find("a").text().split("(")[0];
		var s1=parseInt(score.split("-")[0]),s2=parseInt(score.split("-")[1]);
		var score1=s1+s2;	
		var arr0=getyapan(n==2?table_odd:table_even,id,col);
		//console.log(arr0);
		//定义tr中第几列开始处理
		var a=6;
		if(n==2)
		{
			a=9;
		}
		if(arr0.length>0)
		{
			if(s2-s1>(col1==0?arr0[1]:arr0[4]))
			{
				res='赢';
				win+=1;
			}
			else if(s2-s1<(col1==0?arr0[1]:arr0[4]))
			{
				res='输';
			}
			else
			{
				res='走';			
			}
			if(col1==0)
			{
				this.cells[a-1].innerHTML=arr0[0];
				this.cells[a].innerHTML=n==2?arr0[1]:getpkName(arr0[1]);
				this.cells[a+1].innerHTML=arr0[2];
			}
			else
			{
				this.cells[a-1].innerHTML=arr0[3];
				this.cells[a].innerHTML=n==2?arr0[4]:getpkName(arr0[4]);
				this.cells[a+1].innerHTML=arr0[5];
			}
			if(n!=2)//亚盘
			{
				this.cells[12].innerHTML=res;
				this.cells[13].innerHTML=arr0[6]>score1?"小":(arr0[6]<score1?"大":"走");
				total+=1;
				if(arr0[6]<score1)
				{
					d+=1;
				}
			}
		}
		else
		{
			this.cells[a-1].innerHTML="";
			this.cells[a].innerHTML="";
			this.cells[a+1].innerHTML="";
			if(n!=2)//亚盘
			{			
				this.cells[12].innerHTML="";
				this.cells[13].innerHTML="";
			}
		}
	});
	if(n!=2)//亚盘
	{
		changeTotalDT(null,(d/total*100).toFixed(0),(win/total*100).toFixed(0));
	}
}
//写入欧赔数据
function showdswjOP(tab){
	var trs=$("#"+tab+" tr").eq(1).nextAll("tr");
	$.each(trs,function(i){
		var id=parseInt($(this).attr("id").slice(5));
		var col=$($(".sel1"+tab)[0]).val();
		var col1=$($(".sel1"+tab)[1]).val();
		var arr0=getyapan(table_odd,id,col);
		if(arr0.length>0)
		{
			if(col1==0)
			{
				this.cells[8].innerHTML=arr0[0];
				this.cells[9].innerHTML=arr0[1];
				this.cells[10].innerHTML=arr0[2];
			}
			else
			{
				this.cells[8].innerHTML=arr0[3];
				this.cells[9].innerHTML=arr0[4];
				this.cells[10].innerHTML=arr0[5];
			}
		}
		else
		{
			this.cells[8].innerHTML="";
			this.cells[9].innerHTML="";
			this.cells[10].innerHTML="";	
		}
	});
}
//主客相同
function zhuKe(arr,id){
	var newarr=[];
	if($("#checkzk").attr("checked")=="checked")
		$(arr).each(function(i) {
			//if(arr[i][4]==arr[i][6])
			if(arr[i][2]==id)
			{
				newarr.push(arr[i]);	
			}
			//console.log(arr[i][4]+","+arr[i][6]);
		})
	return newarr;
}

//球队选择
function qiuDui(arr,str){
	var newarr=[],term='';
	if(str!="")
	{
		var arrStr=str.split("|");
		$.each(arrStr,function(i){
			if(i!=arrStr.length-1)
			{
				term+="arr[i][0]=='"+this+"'||";
			}
			else
			{
				term+="arr[i][0]=='"+this+"'";
			}
		});
		//console.log(term);
		$(arr).each(function(i) {		
			if(eval(term))
			{
				newarr.push(arr[i]);	
			}
		});
	}
	return newarr;
}	
//获取选择的类型
function getChType(id){
	var str='';
	 $("#"+id+" input").each(function(){
		if($(this).attr("checked"))
		{
			str+=$(this).next("label").text()+"|";
		}
	 
	 })
	 return str.substring(0,str.length-1);	
}
//按比赛类型选择数据
function t_onclick(obj)
{
	var newarr=[],newarr1=[],id=0;	
	var parId=$(obj).parent().attr("id");
	if(parId=="checkv_l")
	{		
		newarr=v_data;
		id=36;
	}
	else
	{		
		newarr=v_data;
		id=36;
	}
	var str=getChType(parId);
	if(str!="")
	{
		newarr1=qiuDui(newarr,str);		
		if($("#"+parId).children("input").first().attr("checked"))
		{
			newarr1=zhuKe(newarr1,id);
		}	
	}
	if(newarr1.length>0)
	{
		showdswj("table_even",newarr1);
		writeSel('seldswj',newarr1.length);
	}
	else
	{
		showdswj("table_even",newarr1);
		writeSel('seldswj',0);
	}
}
//近几场
function s_onchange(obj)
{
	var count=$(obj).children().length;
	var arr=v_data.slice(0,$(obj).val());
	showdswj("table_even",arr);	
	//writeSel(obj,count);
	/*$("#table_even tr").show();
	$("#table_even tr").eq(parseInt(id)+1).nextAll().hide();*/
	
	}
//及时赔率比较
function showv_data0()
{
	var newArr=[],firstCol=[],A=0,B=0;
	A=v_data0[0][0];
	//firstCol.push([1,v_country[0][1]]);
	$.each(v_data0,function(i){
		if(v_data0[i][0]!=A)
		{			
			firstCol.push([B,v_country[(A-1)][1]]);	
			A=v_data0[i][0];
			B=1;	
		}
		else
		{
			B+=1;
			if(i==v_data0.length-1)
			{
				firstCol.push([B,v_country[(A-1)][1]]);					
			}
		}	
		newArr.push(v_data0[i].slice(1));
		//console.log(firstCol);
	});
	showDel("data0",newArr);
	var row=0;
	$.each(firstCol,function(i)
	{
		//console.log(this[0]);
		$("#data0 tr").eq(row).prepend("<td rowspan='"+this[0]+"'>"+this[1]+"</td>");
		row+=this[0];
	});
}
//场次以及胜负比率
function changeTotalDT(arr,f7,f6){	
	var obj=$(".totalDT");
	if(arr&&arr.length>0)
	{
		var f2=0,f3=0,f4=0,f8=0;
		$.each(arr,function(){
			if(this.length>0)
			{
				var newarr=this.split("-");	
				if(newarr[0]>newarr[1])
				{
					f2+=1;
				}
				else if(newarr[0]==newarr[1])
				{
					f3+=1;
				}
				else
				{
					f4+=1;
				}
				//单率计算
				//console.log(parseInt(newarr[0])+parseInt(newarr[1]));
				if((parseInt(newarr[0])+parseInt(newarr[1]))%2!=0)
				{f8+=1;}
			}
		});
		$(obj).find(".f1").text(arr.length)
		.end().find(".f2").text(f2)
		.end().find(".f3").text(f3)
		.end().find(".f4").text(f4)
		.end().find(".f5").text((f2/arr.length*100).toFixed(0)+"%")
		.end().find(".f8").text((f8/arr.length*100).toFixed(0)+"%");
	}
	if(f6!=null && !isNaN(f6))
	{
		$(obj).find(".f6").text(f6+"%");
	}
	if(f7!=null && !isNaN(f7))
	{
		$(obj).find(".f7").text(f7+"%");
	}
}
$(function(){
	showv_data0();
	writeType("checkv_l",v_data);
	showdswj("table_even",v_data);
	//写第几场
	writeSel('seldswj',v_data.length);
	$("#table_even tr:even").css({"background":"#bbbbbb"});
})