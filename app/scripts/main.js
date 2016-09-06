(function($){

	var selected_date = {};
  $('#calendar').fullCalendar({
		weekends: false,
		defaultView: 'basicWeek',
    eventClick: function(event) {
			return false;
    },
   	dayClick: function (date, jsEvent, view) {
      // $(jsEvent.target).toggleClass("fc-state-highlight");
   		set_selected_date(date);
   	} 
  });

  function set_selected_date(date){
  	if(!selected_date.start){
  		selected_date.start = date;
  		selected_date.end = date;
  	}else{
  		if(selected_date.start < date){
  			selected_date.end = date;
  		}else{
  			selected_date.end = selected_date.start;
  			selected_date.start = date;
  		}
  	}
  }

  function highlight_selected_date(){
  	
  	$('.fc-day').each(function(){
  		var $this = $(this);
  		var calendar_date = moment($this.data('date'));
  		if(calendar_date.isBetween(selected_date.start, selected_date.end, 'days','[]')){
  			$this.addClass('fc-selected');
  		}else{
  			$this.removeClass('fc-selected');
  		}
  	});
  }

  var colorise = setInterval(highlight_selected_date, 300);

})(jQuery)