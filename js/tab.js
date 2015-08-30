$(document).ready(function() {
	// console.log($('.tabLinks .tab-links a'));
    $('.tab-content #pieChart').siblings().hide();

	//On click of tab links buttons display the appropriate display option.
    $('.tab-links li a').on('click', function(e)  {
    	//retrieves the link from the html
        var currentAttrValue = $(this).attr('href');
 		// console.log($(this));

        var varName = '.tab-content '+currentAttrValue;
        // console.log(varName);
        //Show tab required and then hide other tabs
        $(varName).show().siblings().hide();
        // Change/remove current tab to active

        //Add appropriate classes to buttons
        $(this).parent('li').addClass('active').siblings().removeClass('active');
 
        e.preventDefault();
    });

});