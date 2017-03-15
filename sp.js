// Equations for Superpressure balloon

// Molar Masses (kg/mol)
MM_H2  = 2.01588E-3
MM_HE  = 4.0026E-3
MM_AIR = 28.97E-3

// Gas constant (J/Kelvin-mol)
R = 8.314462

// Standard conditions
STP_T = 273+20   // Kelvin
STP_P = 1E5      // Pascals

/**
 * Gas volume at standard temperature and pressure
 *
 * molar mass of gas (kg/mol)
 * mass that gas is lifting (kg)
 *
 * returns volume (m^3)
 */
function gas_volume_stp(gas_mm, gas_mass) {
  // Ideal gas equation
  return gas_mass * R * STP_T / (gas_mm * STP_P);
}

/**
 * Calucate the mass of gas inside the balloon.
 * ASSUMING:
 *   * Zero supertemperature
 *   * Zero superpressure (envelope is slack)
 *
 * This is the case at launch, and we further assume no gas leaks
 * during the flight.
 *
 * molar mass of gas (kg/mol)
 * mass that gas is lifting (kg)
 *
 * returns mass (kg)
 */
function gas_mass_at_launch(mm, lift_mass) {
  mols_of_lift_gas = lift_mass / (MM_AIR - mm);

  return mols_of_lift_gas * mm;
}

/**
 * Returns the density of a balloon system
 *
 * molar mass of gas (kg/mol)
 * mass that gas is lifting (kg)
 * volume of system (m^3)
 *
 * returns density (kg/m^3)
 */
function system_density(gas_mm, lift_mass, volume) {
  gas_mass = gas_mass_at_launch(gas_mm, lift_mass);

  return (lift_mass + gas_mass) / volume;
}

/**
 * Returns the pressure-thermal ratio of a balloon system
 *
 * molar mass of gas (kg/mol)
 * mass that gas is lifting (kg)
 * volume of system (m^3)
 *
 * returns pressure-thermal ratio (Pa/K)
 */
function pressure_thermal_ratio(gas_mm, lift_mass, volume) {
  gas_mass = gas_mass_at_launch(gas_mm, lift_mass);

  // Ideal gas equation
  return gas_mass * R / (gas_mm * volume);
}
