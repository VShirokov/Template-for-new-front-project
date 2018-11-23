setTimeout(function()
{
	var max = 100;
  var tot, str;
  $('.mainBlock__text').each(function() {
  	str = String($(this).html());
  	tot = str.length;
    str = (tot <= max)
    	? str
      : str.substring(0,(max + 1))+"...";
    $(this).html(str);
  });
},500); // Delayed for example only. 