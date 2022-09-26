//Form

$(".form-control").on("focus",function(){
	var input=$(this)
	$(input).parent().addClass("md-input-focused")
});
$(".form-control").on("blur",function(){
	var input=$(this)
	if($(input).val().length==0){
	$(input).parent().removeClass("md-input-focused")
	}
});


$("#show-hide-menu").click(function(){
  $(".page-area").toggleClass("full-menu-active");
});
$(".collapse-title").click(function(){
  $(".page-area").addClass("full-menu-active");
});

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();   
});

// $(".page-area .left-menu").hover(function(){
  // $(".page-area").toggleClass("full-menu-active");
// });


$(".configuration-icon").click(function(){
  $(".page-area").toggleClass("full-menu-active");
});


$(".copy-button .fa-copy").click(function () {
	$(this).hide().delay(20).fadeOut();
	$(this).show().delay(500).fadeIn();
}); 