// Equations for mylar balloon shape

/**
 * area
 */
function mylar_balloon_area(major_axis, seam_width) {
  seam_width = seam_width || 0;

  radius = major_axis/2;
  r_squared = Math.pow(radius + seam_width, 2);

  return 2*Math.PI*r_squared;   // two gores
}

/**
 * area
 */
function mylar_tube_area(major_axis, minor_axis, seam_width) {
  minor_axis = minor_axis || 0;
  seam_width = seam_width || 0;

  // Calculate the area of the rectanglar middle part
  middle_length = major_axis - minor_axis;
  middle_area   = (minor_axis+seam_width) * middle_length;

  // And the area in the two semicircles
  radius = major_axis/2;
  r_squared   = Math.pow(radius + seam_width, 2)
  circle_area = math.pi*r_squared

  return 2*(middle_area+circle_area); // two gores
}

/**
 * volume
 */
function mylar_balloon_volume(major_axis) {
  radius = major_axis/2;

  return 1.2185 * Math.pow(radius, 3)   // Paulsen 1994
}

/**
 * volume
 */
function mylar_tube_volume(major_axis, minor_axis) {
  // Approximate this as a mylar balloon and tube section

  // tube section
  inflated_radius = 0.7627 * radius;           // Paulsen 1994
  mylar_tube_csa  = 2 * Math.pow(inflated_radius, 2); // Mladenov 2008 Eqn 50
  mylar_tube_volume = mylar_tube_csa * (major_axis - minor_axis)

  // sum
  return mylar_balloon_volume(major_axis) + mylar_tube_volume
}
