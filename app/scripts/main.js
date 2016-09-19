(function($){
  window.busy_dates = [];
  var dateFormat = "yy-mm-dd",
    from = $( "#from" )
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 3,
        beforeShowDay: disable_from_dates
      })
      .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
      }),
    to = $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
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