import React from 'react';
import Ahorcado from '../games/Ahorcado/Ahorcado';
import Rompecabezas from '../games/Rompecabezas/Rompecabezas';
import Acertijo from '../games/Acertijo/Acertijo';
import OrdenarIMG from '../games/OrdenarIMG/OrdenarIMG'; 
import Blockly from '../games/Blockly/Blockly';
import Sudoku from '../games/Sudoku/Sudoku';
import DiagramasFlujo from '../games/DiagramasFlujo/DiagramasFlujo';
import Pixelart from '../games/Pixelart/Pixelart';
import Memorama from '../games/Memorama/GeneradorMemorama';
import CalculoMental from '../games/CalculoMental/CalculadoraMental';
import Crucigrama from '../games/Crucigrama/Crucigrama';
import DesarrolloAlgoritmos from '../games/DesarrolloAlgoritmos/Algoritmos';

export const games = {
  Ahorcado: <Ahorcado />,
  Rompecabezas: <Rompecabezas />,
  Acertijo: <Acertijo />,
  OrdenarIMG: <OrdenarIMG />,
  Blockly: <Blockly />,
  Sudoku: <Sudoku />,
  DiagramasFlujo: <DiagramasFlujo />,
  Pixelart: <Pixelart />,
  Memorama: <Memorama />,
  CalculoMental: <CalculoMental />,
  Crucigrama: <Crucigrama />,
  'desarrollo-algoritmos': <DesarrolloAlgoritmos />
};