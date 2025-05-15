import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './ActivityModern.css';

// Helper to shuffle array for random question selection
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Sample balanced chemical equations and problem types
const MOLE_CONVERSION_PROBLEMS = [
  {
    equation: "2 H₂ + O₂ → 2 H₂O",
    stoichiometry: { H2: 2, O2: 1, H2O: 2 },
    questionTypes: [
      { from: 'H2', to: 'O2', text: (moles) => `If you have ${moles} moles of H₂, how many moles of O₂ are required?` },
      { from: 'H2', to: 'H2O', text: (moles) => `If ${moles} moles of H₂ react completely, how many moles of H₂O are produced?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If you have ${moles} moles of O₂, how many moles of H₂O can be produced?` },
      { from: 'O2', to: 'H2', text: (moles) => `To produce H₂O with ${moles} moles of O₂, how many moles of H₂ are needed?` },
      { from: 'H2O', to: 'H2', text: (moles) => `To produce ${moles} moles of H₂O, how many moles of H₂ are required?` },
      { from: 'H2O', to: 'O2', text: (moles) => `If ${moles} moles of H₂O are formed, how many moles of O₂ were consumed?` },
    ]
  },
  {
    equation: "N₂ + 3 H₂ → 2 NH₃",
    stoichiometry: { N2: 1, H2: 3, NH3: 2 },
    questionTypes: [
      { from: 'N2', to: 'H2', text: (moles) => `To react completely with ${moles} moles of N₂, how many moles of H₂ are needed?` },
      { from: 'H2', to: 'NH3', text: (moles) => `If ${moles} moles of H₂ react, how many moles of NH₃ are formed?` },
      { from: 'N2', to: 'NH3', text: (moles) => `From ${moles} moles of N₂, how many moles of NH₃ can be synthesized?` },
      { from: 'NH3', to: 'N2', text: (moles) => `To produce ${moles} moles of NH₃, how many moles of N₂ are required?` },
      { from: 'NH3', to: 'H2', text: (moles) => `The formation of ${moles} moles of NH₃ requires how many moles of H₂?` },
    ]
  },
  {
    equation: "CH₄ + 2 O₂ → CO₂ + 2 H₂O",
    stoichiometry: { CH4: 1, O2: 2, CO2: 1, H2O: 2 },
    questionTypes: [
      { from: 'CH4', to: 'O2', text: (moles) => `How many moles of O₂ are needed to completely burn ${moles} moles of CH₄?` },
      { from: 'CH4', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of CH₄ produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed in the combustion of CH₄, how many moles of H₂O are formed?` },
      { from: 'CO2', to: 'CH4', text: (moles) => `To produce ${moles} moles of CO₂ from CH₄ combustion, how many moles of CH₄ are needed?` },
      { from: 'H2O', to: 'O2', text: (moles) => `If ${moles} moles of H₂O are produced by CH₄ combustion, how many moles of O₂ were used?` },
    ]
  },
  // Added New Equations and Question Types:
  {
    equation: "2 KClO₃ → 2 KCl + 3 O₂", // Decomposition
    stoichiometry: { KClO3: 2, KCl: 2, O2: 3 },
    questionTypes: [
      { from: 'KClO3', to: 'O2', text: (moles) => `If ${moles} moles of KClO₃ decompose, how many moles of O₂ are produced?` },
      { from: 'KClO3', to: 'KCl', text: (moles) => `Decomposition of ${moles} moles of KClO₃ will yield how many moles of KCl?` },
      { from: 'O2', to: 'KClO3', text: (moles) => `To produce ${moles} moles of O₂, how many moles of KClO₃ must decompose?` },
      { from: 'KCl', to: 'O2', text: (moles) => `If ${moles} moles of KCl are formed, how many moles of O₂ are also produced?` },
    ]
  },
  {
    equation: "Fe₂O₃ + 3 CO → 2 Fe + 3 CO₂", // Redox in blast furnace
    stoichiometry: { Fe2O3: 1, CO: 3, Fe: 2, CO2: 3 },
    questionTypes: [
      { from: 'Fe2O3', to: 'Fe', text: (moles) => `How many moles of Fe can be produced from ${moles} moles of Fe₂O₃?` },
      { from: 'CO', to: 'CO2', text: (moles) => `If ${moles} moles of CO react, how many moles of CO₂ are formed?` },
      { from: 'Fe2O3', to: 'CO', text: (moles) => `To react completely with ${moles} moles of Fe₂O₃, how many moles of CO are needed?` },
      { from: 'Fe', to: 'CO', text: (moles) => `Production of ${moles} moles of Fe requires how many moles of CO?` },
      { from: 'CO2', to: 'Fe2O3', text: (moles) => `If ${moles} moles of CO₂ are produced, how many moles of Fe₂O₃ reacted?` },
    ]
  },
  {
    equation: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O", // Propane combustion
    stoichiometry: { C3H8: 1, O2: 5, CO2: 3, H2O: 4 },
    questionTypes: [
      { from: 'C3H8', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of propane (C₃H₈) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed, how many moles of H₂O are formed during propane combustion?` },
      { from: 'C3H8', to: 'O2', text: (moles) => `How many moles of O₂ are required to burn ${moles} moles of C₃H₈ completely?` },
      { from: 'H2O', to: 'C3H8', text: (moles) => `If ${moles} moles of H₂O are produced from burning C₃H₈, how much C₃H₈ was used?` },
    ]
  },
  {
    equation: "2 Al + 3 Cl₂ → 2 AlCl₃", // Synthesis
    stoichiometry: { Al: 2, Cl2: 3, AlCl3: 2 },
    questionTypes: [
      { from: 'Al', to: 'AlCl3', text: (moles) => `Reaction of ${moles} moles of Al will produce how many moles of AlCl₃?` },
      { from: 'Cl2', to: 'AlCl3', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of AlCl₃ are formed?` },
      { from: 'AlCl3', to: 'Al', text: (moles) => `To synthesize ${moles} moles of AlCl₃, how many moles of Al are needed?` },
    ]
  },
  {
    equation: "Zn + 2 HCl → ZnCl₂ + H₂", // Single displacement
    stoichiometry: { Zn: 1, HCl: 2, ZnCl2: 1, H2: 1 },
    questionTypes: [
      { from: 'Zn', to: 'H2', text: (moles) => `If ${moles} moles of Zn react with HCl, how many moles of H₂ are produced?` },
      { from: 'HCl', to: 'ZnCl2', text: (moles) => `Reaction of ${moles} moles of HCl will produce how many moles of ZnCl₂?` },
      { from: 'ZnCl2', to: 'HCl', text: (moles) => `Formation of ${moles} moles of ZnCl₂ requires how many moles of HCl?` },
    ]
  },
  {
    equation: "AgNO₃ + NaCl → AgCl + NaNO₃", // Double displacement (precipitation)
    stoichiometry: { AgNO3: 1, NaCl: 1, AgCl: 1, NaNO3: 1 },
    questionTypes: [
      { from: 'AgNO3', to: 'AgCl', text: (moles) => `If ${moles} moles of AgNO₃ react, how many moles of AgCl precipitate?` },
      { from: 'NaCl', to: 'NaNO3', text: (moles) => `Reaction of ${moles} moles of NaCl will produce how many moles of NaNO₃?` },
    ]
  },
  {
    equation: "C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O", // Glucose combustion
    stoichiometry: { C6H12O6: 1, O2: 6, CO2: 6, H2O: 6 },
    questionTypes: [
      { from: 'C6H12O6', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of glucose (C₆H₁₂O₆) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are used to burn glucose, how many moles of H₂O are formed?` },
      { from: 'CO2', to: 'O2', text: (moles) => `Production of ${moles} moles of CO₂ from glucose requires how many moles of O₂?` },
    ]
  },
  {
    equation: "2 SO₂ + O₂ → 2 SO₃", // Sulfur dioxide oxidation
    stoichiometry: { SO2: 2, O2: 1, SO3: 2 },
    questionTypes: [
      { from: 'SO2', to: 'SO3', text: (moles) => `If ${moles} moles of SO₂ react, how many moles of SO₃ are formed?` },
      { from: 'O2', to: 'SO3', text: (moles) => `Reaction of ${moles} moles of O₂ with SO₂ produces how many moles of SO₃?` },
    ]
  },
  {
    equation: "P₄ + 5 O₂ → P₄O₁₀", // Phosphorus combustion
    stoichiometry: { P4: 1, O2: 5, P4O10: 1 },
    questionTypes: [
      { from: 'P4', to: 'P4O10', text: (moles) => `Combustion of ${moles} moles of P₄ produces how many moles of P₄O₁₀?` },
      { from: 'O2', to: 'P4O10', text: (moles) => `If ${moles} moles of O₂ react to form P₄O₁₀, how many moles of P₄O₁₀ are made?` },
    ]
  },
  {
    equation: "WO₃ + 3 H₂ → W + 3 H₂O", // Tungsten oxide reduction
    stoichiometry: { WO3: 1, H2: 3, W: 1, H2O: 3 },
    questionTypes: [
      { from: 'WO3', to: 'W', text: (moles) => `Reduction of ${moles} moles of WO₃ with H₂ yields how many moles of W?` },
      { from: 'H2', to: 'H2O', text: (moles) => `If ${moles} moles of H₂ are used to reduce WO₃, how many moles of H₂O are produced?` },
    ]
  },
  {
    equation: "C₂H₅OH + 3 O₂ → 2 CO₂ + 3 H₂O", // Ethanol combustion
    stoichiometry: { C2H5OH: 1, O2: 3, CO2: 2, H2O: 3 },
    questionTypes: [
      { from: 'C2H5OH', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of ethanol (C₂H₅OH) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed to burn ethanol, how many moles of H₂O are formed?` },
    ]
  },
  {
    equation: "SiCl₄ + 2 Mg → Si + 2 MgCl₂", // Silicon production
    stoichiometry: { SiCl4: 1, Mg: 2, Si: 1, MgCl2: 2 },
    questionTypes: [
      { from: 'SiCl4', to: 'Si', text: (moles) => `Reaction of ${moles} moles of SiCl₄ with Mg produces how many moles of Si?` },
      { from: 'Mg', to: 'MgCl2', text: (moles) => `If ${moles} moles of Mg react, how many moles of MgCl₂ are formed?` },
    ]
  },
  {
    equation: "4 Fe + 3 O₂ → 2 Fe₂O₃", // Rusting of Iron
    stoichiometry: { Fe: 4, O2: 3, Fe2O3: 2 },
    questionTypes: [
      { from: 'Fe', to: 'Fe2O3', text: (moles) => `If ${moles} moles of Fe rust completely, how many moles of Fe₂O₃ are formed?` },
      { from: 'O2', to: 'Fe2O3', text: (moles) => `Reaction of ${moles} moles of O₂ with Fe produces how many moles of Fe₂O₃?` },
    ]
  },
  {
    equation: "2 Na + Cl₂ → 2 NaCl", // Sodium and Chlorine reaction
    stoichiometry: { Na: 2, Cl2: 1, NaCl: 2 },
    questionTypes: [
        { from: 'Na', to: 'NaCl', text: (moles) => `How many moles of NaCl are produced from ${moles} moles of Na?` },
        { from: 'Cl2', to: 'NaCl', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of NaCl are formed?` },
    ]
  },
  {
    equation: "Mg + I₂ → MgI₂", // Magnesium and Iodine reaction
    stoichiometry: { Mg: 1, I2: 1, MgI2: 1 },
    questionTypes: [
        { from: 'Mg', to: 'MgI2', text: (moles) => `Reaction of ${moles} moles of Mg with I₂ produces how many moles of MgI₂?` },
        { from: 'I2', to: 'MgI2', text: (moles) => `How many moles of MgI₂ can be formed from ${moles} moles of I₂?` },
    ]
  },
  {
    equation: "2 C₂H₂ + 5 O₂ → 4 CO₂ + 2 H₂O", // Acetylene combustion
    stoichiometry: { C2H2: 2, O2: 5, CO2: 4, H2O: 2 },
    questionTypes: [
        { from: 'C2H2', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of acetylene (C₂H₂) produces how many moles of CO₂?` },
        { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are used to burn C₂H₂, how many moles of H₂O are formed?` },
        { from: 'C2H2', to: 'O2', text: (moles) => `How many moles of O₂ are needed to completely combust ${moles} moles of C₂H₂?` },
    ]
  },
  {
    equation: "CS₂ + 3 O₂ → CO₂ + 2 SO₂", // Carbon disulfide combustion
    stoichiometry: { CS2: 1, O2: 3, CO2: 1, SO2: 2 },
    questionTypes: [
        { from: 'CS2', to: 'CO2', text: (moles) => `If ${moles} moles of CS₂ are burned, how many moles of CO₂ are produced?` },
        { from: 'O2', to: 'SO2', text: (moles) => `Combustion using ${moles} moles of O₂ will produce how many moles of SO₂ (from CS₂)?` },
    ]
  },
  {
    equation: "Sn + 2 Cl₂ → SnCl₄", // Tin (IV) chloride synthesis
    stoichiometry: { Sn: 1, Cl2: 2, SnCl4: 1 },
    questionTypes: [
        { from: 'Sn', to: 'SnCl4', text: (moles) => `How many moles of SnCl₄ can be made from ${moles} moles of Sn?` },
        { from: 'Cl2', to: 'SnCl4', text: (moles) => `If ${moles} moles of Cl₂ react, how many moles of SnCl₄ are formed?` },
    ]
  },
  {
    equation: "3 CaCl₂ + 2 Na₃PO₄ → Ca₃(PO₄)₂ + 6 NaCl", // Calcium phosphate precipitation
    stoichiometry: { CaCl2: 3, Na3PO4: 2, Ca3PO4_2: 1, NaCl: 6 }, // Note: Ca3(PO4)2 key needs to be valid JS identifier
    questionTypes: [
        { from: 'CaCl2', to: 'Ca3PO4_2', text: (moles) => `Reaction of ${moles} moles of CaCl₂ produces how many moles of Ca₃(PO₄)₂?` },
        { from: 'Na3PO4', to: 'NaCl', text: (moles) => `If ${moles} moles of Na₃PO₄ react, how many moles of NaCl are formed?` },
    ]
  },
  // ----- NEW EQUATIONS START HERE -----
  {
    equation: "2 Al(OH)₃ + 3 H₂SO₄ → Al₂(SO₄)₃ + 6 H₂O", // Acid-Base Neutralization
    stoichiometry: { AlOH3: 2, H2SO4: 3, Al2SO4_3: 1, H2O: 6 }, // Key Al(OH)3 as AlOH3, Al2(SO4)3 as Al2SO4_3
    questionTypes: [
      { from: 'AlOH3', to: 'H2O', text: (moles) => `If ${moles} moles of Al(OH)₃ react, how many moles of H₂O are formed?` },
      { from: 'H2SO4', to: 'Al2SO4_3', text: (moles) => `Reaction of ${moles} moles of H₂SO₄ will produce how many moles of Al₂(SO₄)₃?` },
      { from: 'Al2SO4_3', to: 'AlOH3', text: (moles) => `To produce ${moles} moles of Al₂(SO₄)₃, how many moles of Al(OH)₃ are needed?` },
      { from: 'H2O', to: 'H2SO4', text: (moles) => `Formation of ${moles} moles of H₂O requires how many moles of H₂SO₄?` },
    ]
  },
  {
    equation: "C₂H₄ + 3 O₂ → 2 CO₂ + 2 H₂O", // Ethene Combustion
    stoichiometry: { C2H4: 1, O2: 3, CO2: 2, H2O: 2 },
    questionTypes: [
      { from: 'C2H4', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of ethene (C₂H₄) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are used to burn ethene, how many moles of H₂O are formed?` },
      { from: 'CO2', to: 'C2H4', text: (moles) => `To produce ${moles} moles of CO₂ from ethene combustion, how much C₂H₄ was burned?` },
    ]
  },
  {
    equation: "2 NaBr + Cl₂ → 2 NaCl + Br₂", // Single Displacement (Halogen)
    stoichiometry: { NaBr: 2, Cl2: 1, NaCl: 2, Br2: 1 },
    questionTypes: [
      { from: 'NaBr', to: 'NaCl', text: (moles) => `If ${moles} moles of NaBr react with chlorine, how many moles of NaCl are formed?` },
      { from: 'Cl2', to: 'Br2', text: (moles) => `Reaction of ${moles} moles of Cl₂ will produce how many moles of Br₂?` },
      { from: 'Br2', to: 'NaBr', text: (moles) => `To produce ${moles} moles of Br₂, how many moles of NaBr are required?` },
    ]
  },
  {
    equation: "H₂ + Cl₂ → 2 HCl", // Hydrogen and Chlorine Synthesis
    stoichiometry: { H2: 1, Cl2: 1, HCl: 2 },
    questionTypes: [
      { from: 'H2', to: 'HCl', text: (moles) => `How many moles of HCl are produced from ${moles} moles of H₂ reacting with Cl₂?` },
      { from: 'Cl2', to: 'HCl', text: (moles) => `If ${moles} moles of Cl₂ react with H₂, how many moles of HCl are formed?` },
      { from: 'HCl', to: 'H2', text: (moles) => `To produce ${moles} moles of HCl, how many moles of H₂ are needed?` },
    ]
  },
  {
    equation: "2 HgO → 2 Hg + O₂", // Mercury(II) Oxide Decomposition
    stoichiometry: { HgO: 2, Hg: 2, O2: 1 },
    questionTypes: [
      { from: 'HgO', to: 'Hg', text: (moles) => `Decomposition of ${moles} moles of HgO produces how many moles of Hg?` },
      { from: 'HgO', to: 'O2', text: (moles) => `How many moles of O₂ are formed from the decomposition of ${moles} moles of HgO?` },
      { from: 'O2', to: 'HgO', text: (moles) => `To produce ${moles} moles of O₂, how many moles of HgO must decompose?` },
    ]
  },
  {
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄ + 2 NaCl", // Precipitation Reaction
    stoichiometry: { BaCl2: 1, Na2SO4: 1, BaSO4: 1, NaCl: 2 },
    questionTypes: [
      { from: 'BaCl2', to: 'BaSO4', text: (moles) => `If ${moles} moles of BaCl₂ react, how many moles of BaSO₄ precipitate?` },
      { from: 'Na2SO4', to: 'NaCl', text: (moles) => `Reaction of ${moles} moles of Na₂SO₄ produces how many moles of NaCl?` },
      { from: 'BaSO4', to: 'Na2SO4', text: (moles) => `Formation of ${moles} moles of BaSO₄ implies how many moles of Na₂SO₄ reacted?` },
    ]
  },
  {
    equation: "NH₄NO₃ → N₂O + 2 H₂O", // Ammonium Nitrate Decomposition
    stoichiometry: { NH4NO3: 1, N2O: 1, H2O: 2 },
    questionTypes: [
      { from: 'NH4NO3', to: 'N2O', text: (moles) => `Decomposition of ${moles} moles of NH₄NO₃ produces how many moles of N₂O?` },
      { from: 'NH4NO3', to: 'H2O', text: (moles) => `How many moles of H₂O are formed from ${moles} moles of NH₄NO₃ decomposing?` },
    ]
  },
  {
    equation: "C₆H₆ + Cl₂ → C₆H₅Cl + HCl", // Benzene Chlorination (Simplified)
    stoichiometry: { C6H6: 1, Cl2: 1, C6H5Cl: 1, HCl: 1 },
    questionTypes: [
      { from: 'C6H6', to: 'C6H5Cl', text: (moles) => `Chlorination of ${moles} moles of benzene (C₆H₆) produces how many moles of C₆H₅Cl?` },
      { from: 'Cl2', to: 'HCl', text: (moles) => `If ${moles} moles of Cl₂ are used to chlorinate benzene, how many moles of HCl are formed?` },
    ]
  },
  {
    equation: "2 KBr + I₂ → 2 KI + Br₂", // Halogen displacement (less reactive I2)
    stoichiometry: { KBr: 2, I2: 1, KI: 2, Br2: 1 }, // Note: This reaction typically does not proceed spontaneously as written.
    questionTypes: [
        { from: 'KBr', to: 'KI', text: (moles) => `If ${moles} moles of KBr react, how many moles of KI could be formed (theoretically)?` },
        { from: 'I2', to: 'Br2', text: (moles) => `Reaction of ${moles} moles of I₂ would produce how many moles of Br₂ (theoretically)?` },
    ]
  },
  {
    equation: "SiO₂ + 2 C → Si + 2 CO", // Silicon production from sand
    stoichiometry: { SiO2: 1, C: 2, Si: 1, CO: 2 },
    questionTypes: [
      { from: 'SiO2', to: 'Si', text: (moles) => `Reduction of ${moles} moles of SiO₂ with carbon yields how many moles of Si?` },
      { from: 'C', to: 'CO', text: (moles) => `If ${moles} moles of C are used to reduce SiO₂, how many moles of CO are produced?` },
    ]
  },
  {
    equation: "Pb(NO₃)₂ + 2 KI → PbI₂ + 2 KNO₃", // Lead(II) Iodide Precipitation
    stoichiometry: { PbNO3_2: 1, KI: 2, PbI2: 1, KNO3: 2 }, // Key Pb(NO3)2 as PbNO3_2
    questionTypes: [
      { from: 'PbNO3_2', to: 'PbI2', text: (moles) => `If ${moles} moles of Pb(NO₃)₂ react, how many moles of PbI₂ precipitate?` },
      { from: 'KI', to: 'KNO3', text: (moles) => `Reaction of ${moles} moles of KI produces how many moles of KNO₃?` },
      { from: 'PbI2', to: 'KI', text: (moles) => `To precipitate ${moles} moles of PbI₂, how many moles of KI are needed?` },
    ]
  },
  {
    equation: "2 HCl + Mg(OH)₂ → MgCl₂ + 2 H₂O", // Acid-Base Neutralization
    stoichiometry: { HCl: 2, MgOH2: 1, MgCl2: 1, H2O: 2 }, // Key Mg(OH)2 as MgOH2
    questionTypes: [
      { from: 'HCl', to: 'H2O', text: (moles) => `Neutralization of Mg(OH)₂ with ${moles} moles of HCl produces how many moles of H₂O?` },
      { from: 'MgOH2', to: 'MgCl2', text: (moles) => `If ${moles} moles of Mg(OH)₂ react, how many moles of MgCl₂ are formed?` },
    ]
  },
  {
    equation: "C₅H₁₂ + 8 O₂ → 5 CO₂ + 6 H₂O", // Pentane Combustion
    stoichiometry: { C5H12: 1, O2: 8, CO2: 5, H2O: 6 },
    questionTypes: [
      { from: 'C5H12', to: 'CO2', text: (moles) => `Combustion of ${moles} moles of pentane (C₅H₁₂) produces how many moles of CO₂?` },
      { from: 'O2', to: 'H2O', text: (moles) => `If ${moles} moles of O₂ are consumed to burn pentane, how many moles of H₂O are formed?` },
    ]
  },
  {
    equation: "H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O", // Sulfuric Acid and Sodium Hydroxide
    stoichiometry: { H2SO4: 1, NaOH: 2, Na2SO4: 1, H2O: 2 },
    questionTypes: [
      { from: 'H2SO4', to: 'Na2SO4', text: (moles) => `If ${moles} moles of H₂SO₄ react, how many moles of Na₂SO₄ are produced?` },
      { from: 'NaOH', to: 'H2O', text: (moles) => `Reaction of ${moles} moles of NaOH produces how many moles of H₂O?` },
    ]
  },
  {
    equation: "Fe + S → FeS", // Iron and Sulfur Synthesis
    stoichiometry: { Fe: 1, S: 1, FeS: 1 },
    questionTypes: [
      { from: 'Fe', to: 'FeS', text: (moles) => `Reaction of ${moles} moles of Fe with sulfur produces how many moles of FeS?` },
      { from: 'S', to: 'FeS', text: (moles) => `If ${moles} moles of S react with iron, how many moles of FeS are formed?` },
    ]
  }
  // ----- NEW EQUATIONS END HERE -----
  // Add more equations and question types here
];

const MoleToMoleActivity = ({ onBack, savedState, setSavedState, onPeriodicTable }) => {
  const [currentProblemSet, setCurrentProblemSet] = useState(() => savedState?.currentProblemSet || shuffleArray([...MOLE_CONVERSION_PROBLEMS]));
  const [problemIndex, setProblemIndex] = useState(() => savedState?.problemIndex || 0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState(() => savedState?.userAnswer || '');
  const [feedback, setFeedback] = useState(() => savedState?.feedback || null);
  const [showFeedback, setShowFeedback] = useState(() => savedState?.showFeedback || false);
  const [score, setScore] = useState(() => savedState?.score || 0);
  const [questionsAttempted, setQuestionsAttempted] = useState(() => savedState?.questionsAttempted || 0);

  const generateQuestion = useCallback(() => {
    if (problemIndex >= currentProblemSet.length) {
      console.log("Completed all problems in this set!");
      setFeedback({ type: 'info', message: `Set complete! Your score: ${score}/${questionsAttempted}. Starting new set.` });
      setShowFeedback(true);
      return; 
    }

    const problem = currentProblemSet[problemIndex];
    const questionTypeIndex = Math.floor(Math.random() * problem.questionTypes.length);
    const questionTemplate = problem.questionTypes[questionTypeIndex];
    
    const givenMoles = parseFloat((Math.random() * 9 + 1).toFixed(1)); 
    const fromSubstance = questionTemplate.from;
    const toSubstance = questionTemplate.to;

    const molesFromCoefficient = problem.stoichiometry[fromSubstance];
    const molesToCoefficient = problem.stoichiometry[toSubstance];
    
    const correctAnswer = (givenMoles / molesFromCoefficient) * molesToCoefficient;

    setCurrentQuestion({
      equation: problem.equation,
      text: questionTemplate.text(givenMoles),
      correctAnswer: parseFloat(correctAnswer.toFixed(3)),
      fromSubstance,
      toSubstance,
      givenMoles,
      molesFromCoefficient, 
      molesToCoefficient   
    });
    
    setUserAnswer('');
  }, [problemIndex, currentProblemSet, score, questionsAttempted]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion, problemIndex]); // Regenerate if problemIndex changes (e.g. next question)

  // Save state whenever key variables change
  useEffect(() => {
    if (setSavedState) {
      setSavedState({
        currentProblemSet,
        problemIndex,
        score,
        questionsAttempted,
        userAnswer, 
        feedback,   
        showFeedback 
      });
    }
  }, [currentProblemSet, problemIndex, score, questionsAttempted, userAnswer, feedback, showFeedback, setSavedState]);


  const checkAnswer = (answerString) => {
    if (!currentQuestion || showFeedback) return; // Don't check if no question or feedback shown

    const answer = parseFloat(answerString);
    if (isNaN(answer)) {
        setFeedback({ type: 'incorrect', message: 'Please enter a valid number.' });
        setShowFeedback(true);
        return;
    }

    setQuestionsAttempted(prev => prev + 1);

    if (Math.abs(answer - currentQuestion.correctAnswer) < 0.01) {
      setFeedback({ type: 'correct', message: 'Correct! Great job!' });
      setScore(prev => prev + 1);
    } else {
      const { equation, fromSubstance, toSubstance, givenMoles, correctAnswer, molesFromCoefficient, molesToCoefficient } = currentQuestion;
      
      const explanation = `Let's break it down for the reaction: ${equation}\n\n` +
        `1. You started with: ${givenMoles} moles of ${fromSubstance}.\n` +
        `2. The problem asks for moles of ${toSubstance}.\n` +
        `3. From the balanced equation, the stoichiometric coefficients are:\n` +
        `   - ${fromSubstance}: ${molesFromCoefficient}\n` +
        `   - ${toSubstance}: ${molesToCoefficient}\n` +
        `4. This means the mole ratio of ${fromSubstance} to ${toSubstance} is ${molesFromCoefficient} : ${molesToCoefficient}.\n` +
        `5. To calculate the moles of ${toSubstance}:\n` +
        `   (${givenMoles} moles ${fromSubstance}) * (${molesToCoefficient} moles ${toSubstance} / ${molesFromCoefficient} moles ${fromSubstance})\n` +
        `   = ${correctAnswer.toFixed(3)} moles of ${toSubstance}.\n\n` +
        `So, the correct answer is ${correctAnswer.toFixed(3)} moles.`;

      setFeedback({ 
        type: 'incorrect', 
        message: `Not quite.\n${explanation}`
      });
    }
    setShowFeedback(true);
  };

  const handleUserSubmit = () => {
    checkAnswer(userAnswer);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setFeedback(null);

    if (problemIndex >= currentProblemSet.length -1 && feedback?.type === 'info' && feedback.message.startsWith('Set complete!')) {
        setCurrentProblemSet(shuffleArray([...MOLE_CONVERSION_PROBLEMS]));
        setProblemIndex(0);
    } else if (problemIndex < currentProblemSet.length) {
        setProblemIndex(prev => prev + 1);
    }
  };

  if (showFeedback && feedback?.type === 'info' && feedback.message.startsWith('Set complete!')) {
    return (
      <div className="activity-container">
        <div className="activity-card" style={{ textAlign: 'center' }}>
          <h2 className="activity-title">Set Complete!</h2>
          <div className={`feedback-container feedback-${feedback.type}`}>
            <h3>Info:</h3>
            <p>{feedback.message}</p>
          </div>
          <div className="button-row">
            <button className="activity-btn" onClick={handleNextQuestion}>Start New Set</button>
            <button className="back-btn" onClick={onBack}>Back to Topics</button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="activity-container">
        <div className="activity-card" style={{ textAlign: 'center' }}>
          <p className="question-text">Loading mole conversion question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-container">
      <div className="activity-card">
        <h2 className="activity-title">Mole-to-Mole Conversions</h2>
        
        <div className="question-area">
          <p className="question-equation">
            {currentQuestion.equation.split(' ').map((part, index) => 
              isNaN(parseInt(part)) ? <span key={index}>{part} </span> : <strong key={index}>{part} </strong>
            )}
          </p>
          <p className="question-text">{currentQuestion.text}</p>
        </div>

        <div className="form-group">
          <input 
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer (moles)"
            className="activity-input"
            style={{ margin: '10px 0 20px 0' }}
            disabled={showFeedback}
          />
        </div>

        {showFeedback && feedback && (
          <div 
            className={`feedback-container feedback-${feedback.type}`}
          >
            <h3>
              {feedback.type === 'correct' ? 'Correct!' : feedback.type === 'incorrect' ? 'Incorrect.' : 'Info:'}
            </h3>
            <p>
              {feedback.message}
            </p>
          </div>
        )}

        <div className="button-row">
          {showFeedback ? (
            <button className="activity-btn" onClick={handleNextQuestion}>Next Question</button>
          ) : (
            <button className="activity-btn" onClick={handleUserSubmit} disabled={!userAnswer || showFeedback}>Submit</button>
          )}
          <button className="activity-btn" onClick={onPeriodicTable}>Periodic Table</button>
          <button className="back-btn" onClick={onBack}>Back to Topics</button>
        </div>
        <p className="score-display">Score: {score} / {questionsAttempted}</p>
      </div>
    </div>
  );
};

MoleToMoleActivity.propTypes = {
  onBack: PropTypes.func.isRequired,
  savedState: PropTypes.object,
  setSavedState: PropTypes.func,
  onPeriodicTable: PropTypes.func.isRequired,
};

export default MoleToMoleActivity; 