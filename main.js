/*
  Superpressure balloon calculator
*/
/*
  Some code from the habhub.org burst calculator -
  Code Copyright (c) 2013 Adam Greig, Rossen Georgiev

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function get_value(id) {
  return parseFloat(document.getElementById(id).value);
}


function mb_update() {
  // Get input values and check them
  var major = get_value('major');
  var midsection = get_value('midsection');
  var fd = get_value('fd');
  var ft = get_value('ft');

  // envelope area
  var ea = mylar_balloon_area(major, midsection, 0.02); // TODO seam width
  // envelope mass
  var em = ea * ft * fd / 1000;
  // envelope volume
  var ev = mylar_balloon_volume(major, midsection);

  $('#em').val(em.toFixed(3));
  $('#ev').val(ev.toFixed(3));
}
function sp_update(altitude_graph, pressure_graph) {

  // Get input values and check them
  var em = get_value('em');
  var ev = get_value('ev');
  var pm = get_value('pm');
  var fl = get_value('fl');

  var mm = MM_HE;           // Helium
  var lift_mass = em + (pm+fl)/1000; // Total lift mass (kg)

  var gm = gas_mass_at_launch(mm, lift_mass); // (kg)
  var gv = gas_volume_stp(mm, gm);  // (m^3)
  var ef = gv / ev;

  var system_mass = em + (pm/1000) + gm; // Mass of system (kg)

  document.getElementById('gm').innerHTML = gm.toFixed(4) + " kg";
  document.getElementById('gv').innerHTML = gv.toFixed(3) + " m<sup>3</sup>";
  document.getElementById('ef').innerHTML = (ef*100).toFixed(1) + " %";

  // update plots
  altitude_gamma = get_points(1, 2.5, 0.02, function(gamma) {
    var volume = ev * gamma;   // (m^3)
    var density = system_mass / volume; // (kg/m^3)

    return altitude_from_density(density); // (km)
  });
  altitude_graph.update(altitude_gamma);

  pressure_thermal_gamma = get_points(1, 2.5, 0.02, function(gamma) {
    var volume = ev * gamma;   // (m^3)

    return pressure_thermal_ratio(mm, lift_mass, volume); // (Pa/K)
  });
  pressure_graph.update(pressure_thermal_gamma);
}

$(document).ready(function() {

  // data = get_points(0, 30, 0.2, function(x) {
  //   return atmosphere_from_altitude(x).density; });
  // ;
  // drawLineGraph("#density", 400, 800, data, "Density (kg/m^3)", "Altitude (km)");


  // init page title
  // $('#page_title').text("balloon burst calculator");
  // $('#page_subtitle').html("<a href='#'>About</a> | <a href='#'>Help</a>");

  // validate input fields, numeric only
  $('input.numeric').keypress(function(event) {
    if(event.which == 0 // arrows and other essential keys
       || event.which == 46 // '.'
       || event.which < 32 // not printable chars + backspace, tab etc
       || (event.which >= 48 && event.which <= 57) // numbers 0-9
      ) return;
    event.preventDefault();

    $(this).stop(true,true).css({'background-color':'#FE727C'}).delay(50).animate({backgroundColor: 'white'}, 100);
  });

  // // adjust input field value with mousewheel
  // $('input.scrollable').bind('mousewheel', function(event, delta) {
  //   event.preventDefault();
  //   var elm = $(this);
  //   var x = parseFloat(elm.val());
  //   if(isNaN(x)) return false;
  //   // different fields can use different step value
  //   // step value has to be defined on the element by 'rel' attribute
  //   var step = parseFloat(elm.attr('data-step'));
  //   // maximum value for the field
  //   var max = parseFloat(elm.attr('data-max'));
  //   if(isNaN(step)) step = 5;

  //   x = x + (step * delta);
  //   if(x <= 0) return; // no numbers below zero
  //   if(!isNaN(max) && x > max) return;

  //   x = Math.round(x*100)/100; //round to two decimal places

  //   elm.val(x);
  //   elm.change(); // calculate result

  //   return false;
  // })
  //   .focus(function() { focusedElement = $(this); });

  // // adjust value on portable devices with a swipe
  // $(document).bind('rotate', function(a, event) {
  //   if(!focusedElement) return;
  //   var elm = focusedElement;
  //   var x = parseFloat(elm.val());
  //   if(isNaN(x)) return false;
  //   // different fields can use different step value
  //   // step value has to be defined on the element by 'rel' attribute
  //   var step = parseFloat(elm.attr('data-step'));
  //   // maximum value for the field
  //   var max = parseFloat(elm.attr('data-max'));

  //   if(isNaN(step)) step = 5;

  //   x += step * event.direction.vector;
  //   if(x <= 0) return; // no numbers bellow zero
  //   if(!isNaN(max) && x > max) return;

  //   x = Math.round(x*100)/100; //round to two decimal places

  //   elm.val(x);
  //   elm.change(); // calculate result

  //   return false;
  // });

  var altitude_graph = lineGraph("#altitude_graph", 400, 800,
                                 "Gamma Γ", "Altitude (km)");
  var pressure_graph = lineGraph("#pressure_graph", 400, 800,
                                 "Gamma Γ", "Pressure-Thermal ratio (Pa/K)");

  // calculate result on change
  var mb_ids = ['major', 'midsection', 'ft', 'fd'];
  $('#' + mb_ids.join(", #")).bind('keyup change',function() {
    mb_update();
    sp_update(altitude_graph, pressure_graph);
  });

  var sp_ids = ['em', 'ev', 'pm', 'fl'];
  $('#' + sp_ids.join(", #")).bind('keyup change',function() {
    sp_update(altitude_graph, pressure_graph);
  });


  mb_update();
  sp_update(altitude_graph, pressure_graph);
});
