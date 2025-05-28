import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { gsap } from 'gsap';

// Model component to load 3D models
const Model = ({ modelPath, position }) => {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} position={position} />;
};

const Design = () => {
  // Animation for text, description, and button on load
  useEffect(() => {
    gsap.to('.hero-text', {
      opacity: 1,
      y: 0,
      duration: 2,
      delay: 0.5,
      ease: 'power2.out',
    });

    gsap.to('.hero-description', {
      opacity: 1,
      y: 0,
      duration: 2,
      delay: 0.8,
      ease: 'power2.out',
    });

    gsap.to('.button', {
      opacity: 1,
      y: 0,
      duration: 2,
      delay: 1.1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-black">
      <div className="absolute top-0 left-0 w-full h-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />

          {/* Models */}
          <Model modelPath="./crypto_wallet.glb" position={[0, 0, 0]} />
         

          <OrbitControls />
        </Canvas>
      </div>

      <div className="relative text-center text-white z-10">
        <h1 className="hero-text text-5xl font-bold opacity-0 transform translate-y-12">
          Explore the Future of Blockchain
        </h1>
        <p className="hero-description mt-4 text-xl opacity-0 transform translate-y-12">
          Dive into the world of Web3, NFTs, Crypto, and Digital Certificates.
        </p>
        <button className="button mt-8 px-8 py-4 text-xl bg-orange-600 text-white rounded-lg opacity-0 transform translate-y-12">
          Start Now
        </button>
      </div>
    </section>
  );
};

export default Design;
// 