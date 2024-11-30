import React from 'react';

const ProblematicComponent: React.FC = () => {
  throw new Error('Simulación de error en ProblematicComponent');
  return <div>Este componente no debería renderizarse.</div>;
};

export default ProblematicComponent;
