(function($){
  window.busy_dates = [];
  var dateFormat =  "mm/dd/yy",
    from = $( "#from" )
      .datepicker({
        changeMonth: true,
        beforeShowDay: disable_from_dates
      })
      .on( "change", function() {
        to.datepicker( "option", "maxDate", get_max_date_based_busy_and_selected_date( this ) );
      }),
    to = $( "#to" ).datepicker({
      changeMonth: true,
      beforeShowDay : $.datepicker.noWeekends
    })
    .on( "change", function() {
      from.datepicker( "option", "maxDate", getDate( this ) );
    });

  function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( dateFormat, element.value );
    } catch( error ) {
      date = null;
    }
    return date;
  }

  function get_max_date_based_busy_and_selected_date(selected_date){
    var max_date = getDate('01/01/2020');
    selected_date = getDate(selected_date);
    $.each(busy_dates, function(index, val) {
      var busy_date = $.datepicker.parseDate(dateFormat, val);
      if(selected_date < busy_date ){
        max_date = addDays(busy_date, -1);
        console.log(max_date);
        return false;
      }
    });
    return max_date;
  }
  function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
  }
  function disable_from_dates(date){

    var is_enabled = $.datepicker.noWeekends(date);
    if(is_enabled[0] === true){
      var formated_date = jQuery.datepicker.formatDate(dateFormat, date);
      is_enabled[0] = busy_dates.indexOf(formated_date) == -1; 
    }
    return is_enabled;
  }

  $('#teams').on('change',function(event) {
    var $this = $(this);
    busy_dates = [];
    fetch_team_schedule($this.val());
  });  

  function fetch_team_schedule(id){
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
    if(data.length){
      busy_dates = data[0].busy_dates;
    }
  }    
})(jQuery)