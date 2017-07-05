// Functions for International Standard Atmosphere

// Layer Heights h0 -> h7 (km)
h_tab = [0.0, 11.0, 20.0, 32.0, 47.0, 51.0, 71.0, 84.852]
// Base Pressures p0 -> p7 (k-hPa)
p_tab = [1, 2.2336110E-1, 5.4032950E-2, 8.5666784E-3,
         1.0945601E-3, 6.6063531E-4, 3.9046834E-5, 3.68501E-6]
// Lapse Rate l0 -> l7 (K/km)
l_tab = [-6.5, 0, 1.0, 2.8, 0, -2.8, -2.0, 0]
// Base Temperatures t0 -> t7 (K)
t_tab = [288.15, 216.65, 216.65, 228.65, 270.65, 270.65, 214.65, 186.946]
// Base Densities d0 -> d7 (kg/m3)
d_tab = [1.225, 3.6480012E-1, 8.8908289E-2, 1.3554521E-2,
         1.4963864E-3, 9.0681358E-4, 7.1949692E-5, 8.4205180E-6]

// translated from C at http://www.pdas.com/atmosdownload.html

FT2METERS       = 0.3048           // mult. ft. to get meters (exact)
KELVIN2RANKINE  = 1.8              // mult deg K to get deg R
PSF2NSM         = 47.880258        // mult lb/sq.ft to get N/sq.m
SCF2KCM         = 515.379          // mult slugs/cu.ft to get kg/cu.m
TZERO           = 288.15           // sea-level temperature, kelvins
PZERO           = 101325.0         // sea-level pressure, N/sq.m
RHOZERO         = 1.225            // sea-level density, kg/cu.m
AZERO           = 340.294          // speed of sound at S.L. m/sec
BETAVISC        = 1.458E-6         // viscosity constant
SUTH            = 110.4            // Sutherland's constant, kelvins
REARTH          = 6369.0           // Volumetric Mean Radius of the Earth
GMR             = 34.163195        // Gas constant

/**
 * Retruns parameters about the atmosphere at a given altitude
 * See http://www.dept.aoe.vt.edu/~mason/Mason_f/CAtxtAppE7.pdf
 *
 * altitude in km
 */
function atmosphere_from_altitude(altitude) {

  // geometric to geopotential altitude
  h = altitude * REARTH / (altitude + REARTH);

  // find the zone
  for (i = 0; i < 7 && h > h_tab[i+1]; i+=1);

  tgrad = l_tab[i];             // temperature lapse rate
  tbase = t_tab[i];             // base temperature
  deltah = h - h_tab[i];
  tlocal = tbase + tgrad * deltah; // local temperature

  theta = tlocal / TZERO;      // temperature ratio (theta)

  // compute pressure ratio (delta)
  if (tgrad == 0) {
    delta = p_tab[i] * Math.exp(-GMR * deltah / tbase); // isothermic
  } else {
    delta = p_tab[i] * Math.pow(tbase / tlocal, GMR / tgrad); // normal layer
  }

  sigma = delta / theta;         // density ratio (sigma)

  // absolute temperature in Kelvins
  temperature = TZERO * theta;
  // viscosity in kg/(m-sec)
  viscosity   = BETAVISC * Math.pow(temperature, 3/2) / (temperature + SUTH);

  return {
    temperature: temperature,
    pressure: PZERO * delta,
    density: RHOZERO * sigma,
    asound: AZERO * Math.sqrt(theta),
    viscosity: viscosity,
  };
}

/**
 * Returns the altitude of a given density.
 * See http://www.dept.aoe.vt.edu/~mason/Mason_f/CAtxtAppE7.pdf
 *
 * density in kg/m3
 */
function altitude_from_density(density) {

  // find the zone
  for (i = 0; i < 7 && density < d_tab[i+1]; i+=1);

  tgrad = l_tab[i];             // temperature lapse rate
  sigma = density / RHOZERO;     // density ratio (sigma)

  alpha = sigma * t_tab[i] / (p_tab[i] * TZERO);

  if (tgrad == 0) {             // Isothermal
    beta     = -Math.log(alpha);
    delta_h  = beta * t_tab[1] / GMR;

  } else {                        // Normal
    exponent = (GMR / tgrad) + 1;
    theta    = 1 / Math.pow(alpha, 1 / exponent); // tlocal / t_tab
    delta_t  = t_tab[i] * (theta - 1);
    delta_h  = delta_t / tgrad;
  }

  h = h_tab[i] + delta_h;

  // geopotential to geometric altitude
  return h * REARTH / (REARTH - h);
}

function get_points(start, stop, inc, func) {
  list = []

  for (var i = start; i <= stop; i += inc) {
    list.push([i].concat(func(i)));
  }
  return list
}


// Unit-test altitude_from_density
// console.log(get_points(45, function(x) {
//   density = atmosphere_from_altitude(x).density;
//   altitude = altitude_from_density(density);

//   return Math.round((altitude*1e6))/1e6;
// }));

// console.log(atmosphere_from_altitude(12).density.toExponential(7));
