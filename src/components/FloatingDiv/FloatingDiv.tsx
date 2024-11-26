import React, { useState, useEffect, useRef } from "react";

export const FloatingDiv = () => {
  const [position, setPosition] = useState(() => {
    const savedPosition = JSON.parse(localStorage.getItem("floatingDivPosition"));
    return savedPosition || { x: 100, y: 100, width: 300, height: 200 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const divRef = useRef(null);

  useEffect(() => {
    // Guardar la posición en el localStorage al desmontar
    return () => {
      localStorage.setItem("floatingDivPosition", JSON.stringify(position));
    };
  }, [position]);

  // Manejar el inicio del drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const div = divRef.current;
    div.startX = e.clientX - div.offsetLeft;
    div.startY = e.clientY - div.offsetTop;
  };

  // Manejar el movimiento
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition((prev) => ({
      ...prev,
      x: e.clientX - divRef.current.startX,
      y: e.clientY - divRef.current.startY,
    }));
  };

  // Terminar el drag
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejar redimensionamiento
  const handleResize = (e, direction) => {
    const { clientX, clientY } = e;
    setPosition((prev) => {
      const newSize = { ...prev };
      if (direction.includes("right")) {
        newSize.width = clientX - divRef.current.offsetLeft;
      }
      if (direction.includes("bottom")) {
        newSize.height = clientY - divRef.current.offsetTop;
      }
      return newSize;
    });
  };

  return isVisible ? (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        width: position.width,
        height: position.height,
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: isDragging ? "grabbing" : "grab",
        overflow: "hidden",
        resize: "both",
      }}
      onMouseDown={(e) => {
        if (e.target === divRef.current) handleMouseDown(e);
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "#ddd",
          cursor: "move",
        }}
        onMouseDown={handleMouseDown}
      >
        <button
          style={{ float: "right" }}
          onClick={() => setIsVisible(false)}
        >
          Close
        </button>
        Drag Me!
      </div>
      <div
        style={{
          padding: "10px",
        }}
      >
        Content goes here
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "10px",
          height: "10px",
          backgroundColor: "#ccc",
          cursor: "nwse-resize",
        }}
        onMouseDown={(e) => handleResize(e, "bottom-right")}
      ></div>
    </div>
  ) : (
    <button onClick={() => setIsVisible(true)}>Open Floating Div</button>
  );

}
