// Drag equation for ascending balloon

// Density of Air at sea level (kg/m3)
RHO_AIR	= 1.225

// Drag coefficient of balloon
C_D 	= 0.3               // estimate

// Standard Gavity (m/s2)
G		= 9.807

/**
 * Calculate the upwards force with a given lift
 *
 * 'lift' (kg)
 *
 * returns force (N)
 */
function force_from_lift(lift) {
  // F = m * a
  return lift*G;
}

/**
 * Returns the sea level ascent rate.
 * ASSUMING:
 *   * Standard conditions
 *   * At sea level
 *
 * upwards force (N)
 * area (m2)
 *
 * returns velocity (m/s)
 */
function sea_level_ascent_rate(upwards_force, area) {
  return ascent_rate(upwards_force, area, RHO_AIR);
}

/**
 * Returns the sea level ascent rate.
 * ASSUMING:
 *   * Standard conditions
 *   * At sea level
 *
 * upwards force (N)
 * area (m2)
 * air density (kg/m3)
 *
 * returns velocity (m/s)
 */
function ascent_rate(upwards_force, area, air_density) {
  // v = sqrt(2f/p_air*c_d*a)
  v_sq = (2*upwards_force)/(air_density*C_D*area);

  return Math.sqrt(v_sq);
}
