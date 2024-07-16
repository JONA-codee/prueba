import { Fragment, useState, useRef, useEffect } from 'react';
import './style.css'; 

const GastosList = () => {
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [gastoEditando, setGastoEditando] = useState(null);
  const categoriaRef = useRef();
  const montoRef = useRef();
  const fechaRef = useRef();
  const KEY = 'gastos';
  const [gastosOriginales, setGastosOriginales] = useState([]);

  useEffect(() => {
    try {
      const gastosGuardados = JSON.parse(localStorage.getItem(KEY)) || [];
      setGastos(gastosGuardados);
      setGastosOriginales(gastosGuardados); 
    } catch (error) {
      console.error('Error al cargar los gastos del localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(gastos));
    } catch (error) {
      console.error('Error al guardar los gastos en localStorage', error);
    }
  }, [gastos]);

  const agregarGasto = () => {
    const categoria = categoriaRef.current.value.trim();
    const monto = parseFloat(montoRef.current.value.trim());
    const fecha = fechaRef.current.value.trim();

    if (!categoria || isNaN(monto) || !fecha) {
      setError('Por favor completa todos los campos correctamente.');
      return;
    }

    if (modoEdicion) {
      const gastoActualizado = {
        id: gastoEditando.id,
        categoria,
        monto,
        fecha,
      };

      const nuevosGastos = gastos.map(gasto =>
        gasto.id === gastoActualizado.id ? gastoActualizado : gasto
      );

      setGastos(nuevosGastos);
      setModoEdicion(false);
      setGastoEditando(null);
      setGastosOriginales(nuevosGastos);
    } else {
      const nuevoGasto = {
        id: new Date().getTime(),
        categoria,
        monto,
        fecha,
      };

      setGastos(prevGastos => [...prevGastos, nuevoGasto]);
      setGastosOriginales(prevGastos => [...prevGastos, nuevoGasto]);
    }

    categoriaRef.current.value = '';
    montoRef.current.value = '';
    fechaRef.current.value = '';
    setError('');
  };

  const eliminarGasto = (id) => {
    const nuevosGastos = gastos.filter(gasto => gasto.id !== id);
    setGastos(nuevosGastos);
    setGastosOriginales(nuevosGastos);
  };

  const handleEdit = (gasto) => {
    setModoEdicion(true);
    setGastoEditando(gasto);
    categoriaRef.current.value = gasto.categoria;
    montoRef.current.value = gasto.monto;
    fechaRef.current.value = gasto.fecha;
  };

  const handleCancelEdit = () => {
    setModoEdicion(false);
    setGastoEditando(null);
    categoriaRef.current.value = '';
    montoRef.current.value = '';
    fechaRef.current.value = '';
    setError('');
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (!keyword) {
      setGastos(gastosOriginales); 
      return;
    }

    const filteredGastos = gastosOriginales.filter(gasto =>
      gasto.categoria.toLowerCase().includes(keyword) ||
      gasto.fecha.toLowerCase().includes(keyword)
    );

    setGastos(filteredGastos);
  };

  const handleSort = () => {
    const sortedGastos = [...gastos].sort((a, b) => a.categoria.localeCompare(b.categoria));
    setGastos(sortedGastos);
  };

  return (
    <Fragment>
      <h1 className="h1-title my-3">Seguimiento de Gastos y Presupuesto 💸</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar gastos..."
          onChange={handleSearch}
        />
        <button className="btn btn-info ms-2" onClick={handleSort}>
          Ordenar por Categoría
        </button>
      </div>

      <div className="input-group my-5">
        <input
          type="text"
          className="form-control"
          ref={categoriaRef}
          placeholder="Categoría"
        />
        <input
          type="number"
          className="form-control ms-2"
          ref={montoRef}
          placeholder="Monto 💸"
        />
        <input
          type="date"
          className="form-control ms-2"
          ref={fechaRef}
          placeholder="Fecha 🗓️"
        />
        {modoEdicion ? (
          <div className="btn-group ms-2">
            <button className="btn btn-success" onClick={agregarGasto}>
              Guardar Edición
            </button>
            <button className="btn btn-secondary" onClick={handleCancelEdit}>
              Cancelar Edición
            </button>
          </div>
        ) : (
          <div className="btn btn-primary ms-2" onClick={agregarGasto}>
            <i className="bi bi-cash-stack"></i> {modoEdicion ? 'Guardar Edición' : 'Agregar Gasto'}
          </div>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="container">
        <div className="row">
          {gastos.map(gasto => (
            <div key={gasto.id} className="col-12 col-md-6 col-lg-4">
              <div className="card m-2">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div className="btn-group">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarGasto(gasto.id)}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(gasto)}
                    >
                      <i className="bi bi-pencil"></i> Editar
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text">Categoría: {gasto.categoria}</p>
                  <p className="card-text">Monto : ${gasto.monto}</p>
                  <p className="card-text">Fecha: {gasto.fecha}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-5 py-4 text-center bg-light">
  <div className="container">
    <p className="mb-0">
      &copy; {new Date().getFullYear()} Todos los derechos reservados por el autor
    </p>
  </div>
</footer>

    </Fragment>
  );
};

export default GastosList;
