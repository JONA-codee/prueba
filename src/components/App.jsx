import React, { useState, useEffect } from 'react';
import GastoItem from './components/GastoItem';
import './App.css';

const App = () => {
  const [gastos, setGastos] = useState([]);

  const eliminarGasto = (id) => {
    const nuevosGastos = gastos.filter(gasto => gasto.id !== id);
    setGastos(nuevosGastos);
  };

  const editarGasto = (id, nuevaDescripcion, nuevaCategoria, nuevoMonto, nuevaFecha, importante) => {
    const nuevosGastos = gastos.map(gasto => 
      gasto.id === id 
        ? { ...gasto, descripcion: nuevaDescripcion, categoria: nuevaCategoria, monto: nuevoMonto, fecha: nuevaFecha, importante } 
        : gasto
    );
    setGastos(nuevosGastos);
  };

  // Agrega los gastos iniciales si es necesario
  useEffect(() => {
    const gastosIniciales = [
      { id: 1, descripcion: 'Comida', categoria: 'Alimentación', monto: 50, fecha: '2023-07-01', importante: false },
      { id: 2, descripcion: 'Transporte', categoria: 'Movilidad', monto: 20, fecha: '2023-07-02', importante: true }
    ];
    setGastos(gastosIniciales);
  }, []);

  return (
    <div className="App">
      {gastos.map(gasto => (
        <GastoItem key={gasto.id} gasto={gasto} eliminarGasto={eliminarGasto} editarGasto={editarGasto} />
      ))}
    </div>
  );
};

export default App;
