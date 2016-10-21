// Equations for mylar balloon shape

/**
 * area
 */
function mylar_balloon_area(major_axis, midsection, seam_width) {
  midsection = midsection || 0;
  seam_width = seam_width || 0;

  // circle
  radius      = major_axis/2;
  r_squared   = Math.pow(radius + seam_width, 2);
  circle_area = Math.PI*r_squared;

  // midsection
  middle_area = (major_axis+seam_width) * midsection;

  return 2*(middle_area+circle_area); // two gores
}


/**
 * volume
 */
function mylar_balloon_volume(major_axis, midsection) {
  midsection = midsection || 0;

  // mylar balloon
  radius        = major_axis/2;
  mylar_balloon = 1.2185 * Math.pow(radius, 3);   // Paulsen 1994

  // midsection
  inflated_radius   = 0.7627 * radius;           // Paulsen 1994
  midsection_csa    = 2 * Math.pow(inflated_radius, 2); // Mladenov 2008 Eqn 50
  midsection_volume = midsection_csa * midsection;

  return mylar_balloon + midsection_volume;
}
