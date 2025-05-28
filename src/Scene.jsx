import { Canvas } from '@react-three/fiber'
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'

function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={Math.PI} color="#404040" />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={Math.PI * 2} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* 3D Models */}
      <CertificateModel position={[-2, 0, 0]} />
      <FloatingNFT position={[2, 0, 0]} />

      {/* Post-processing */}
      <EffectComposer multisampling={8}>
        <SSAO 
          radius={0.4} 
          intensity={40} 
          luminanceInfluence={0.6} 
        />
        <Bloom 
          intensity={1.2} 
          kernelSize={3} 
          luminanceThreshold={0.9}
        />
      </EffectComposer>
    </Canvas>
  )
}
