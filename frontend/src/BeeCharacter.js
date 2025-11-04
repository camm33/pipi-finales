import React from "react";
import Lottie from "react-lottie-player";
import beeAnimation from "./animations/bee.json"; // Ruta corregida dentro de src/

export default function BeeCharacter({
  width = 140,
  height = 140,
  loop = true,
  play = true,
  speed = 1
}) {
  return (
    <div className="bee-wrapper" aria-hidden="false">
      <Lottie
        loop={loop}
        play={play}
        animationData={beeAnimation}
        speed={speed}
        style={{ width, height }}
      />
    </div>
  );
}