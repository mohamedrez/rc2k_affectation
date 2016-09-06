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
  
  $('#teams').on('change',function(event) {
  	var $this = $(this);
  	get_team_schedule($this.val());
  });

  function get_team_schedule(id){
  	$.ajax({
  		url: 'http://localhost:3000/schedules',
  		data: {team_id: id},
  	})
  	.done(display_busy_dates)
  	.fail(function() {
  		console.log("error");
  	})
  }

  function display_busy_dates(data){
  	var busy_dates = data[0].busy_dates;
  	console.log(busy_dates);
  }

})(jQuery)