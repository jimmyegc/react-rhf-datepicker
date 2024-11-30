const LazyLoadedComponent = () => {
  return (
    <div
      style={{
        padding: "20px",
        margin: "20px auto",
        maxWidth: "400px",
        textAlign: "center",
        backgroundColor: "#4CAF50",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <h2>Componente cargado dinámicamente</h2>
      <p>
        Este componente fue cargado usando <b>React.lazy</b> y <b>Suspense</b>.
      </p>
    </div>
  );
};

export default LazyLoadedComponent;
