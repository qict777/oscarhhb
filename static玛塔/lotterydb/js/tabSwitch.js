// JavaScript Document
 $(document).ready(function(){ 
	setTab("#tabGrey","li","selectTag",".tag");
	setTab("#taemTab","li","selectTag",".tabContent");
	setTab("#tabBlue","td","selectTag",".tag");
	setTab("#tabSC","li","selectTag",".tagSC");
	function setTab(parent,child,className,cent){
		$(parent+" "+child).click(function(){
			var $Index=$(this).index();
			$(this).addClass(className).siblings(child).removeClass(className);
			$(cent).hide();
			$(cent).eq($Index).show();
		});
	};
})