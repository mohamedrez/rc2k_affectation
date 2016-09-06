(function($){

	var selected_date = {};
	var busy_dates = [];
  $('#calendar').fullCalendar({
		weekends: false,
		defaultView: 'basicWeek',
    eventClick: function(event) {
			return false;
    },
   	dayClick: function (date, jsEvent, view) {
 			set_selected_date(date);
   		if(!check_availability()){
   			selected_date = {};
   			show_error_modal("L'equipe n'est pas disponible");
   		}
   	} 
  });

	function check_availability(){
  	if(!selected_date.start) return true;
  	if(!selected_date.end) return true;
  	if(!busy_dates.length) return true;
  	var is_available = true;
		$.each(busy_dates, function(index, date) {
  		if(moment(date).isBetween(selected_date.start,selected_date.end, 'days','[]')){
  			is_available = false;
  		}
		});
		return is_available;
	}

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

  function highlight_dates(){
  	$('.fc-day').each(function(){
  		var $this = $(this);
  		var calendar_date = moment($this.data('date'));
  		if(selected_date.start && calendar_date.isBetween(selected_date.start, selected_date.end, 'days','[]')){
  			$this.addClass('fc-selected');
  		}else{
  			$this.removeClass('fc-selected');
  		}
  		if(busy_dates.length){
	  		if(busy_dates.includes($this.data('date'))){
  				$this.addClass('fc-busy');
  			}
  		}
  	});
  }

  var colorise = setInterval(highlight_dates, 300);
  
  $('#teams').on('change',function(event) {
  	var $this = $(this);
  	busy_dates = [];
  	get_team_schedule($this.val());
  });

  function get_team_schedule(id){
  	$.ajax({
  		url: 'http://localhost:3000/schedules',
  		data: {team_id: id},
  	})
  	.done(set_busy_dates)
  	.fail(function(message) {
  		show_error_modal(message);
  	})
  }

  function set_busy_dates(data){
  	$('.fc-busy').removeClass('fc-busy');
  	if(data.length){
  		busy_dates = data[0].busy_dates;
  	}
  }

  function show_error_modal(message){
  	$('#error-modal #error-message').text(message);
  	$('#error-modal').modal('show');
  }

  function collect_data(){
  	return {
  		start_date : selected_date.start.format('YYYY-MM-DD'),
  		end_date : selected_date.end.format('YYYY-MM-DD'),
  		team : $('#teams').val(),
  		travaille : $('#travailles').val(),
  	}
  }

  $('#affectation_form').on('submit',function(event) {
  	// event.preventDefault();
  	var data = collect_data();
  	$.post('/path/to/file', data, function(data, textStatus, xhr) {
  		/*optional stuff to do after success */
  	});
  });
})(jQuery)