import { useGLTF, Float } from '@react-three/drei'

function CertificateModel(props) {
  const { nodes } = useGLTF('/certificate.glb')
  
  return (
    <Float speed={3} rotationIntensity={0.5}>
      <mesh
        geometry={nodes.Certificate.geometry}
        position={props.position}
        rotation={[0, Math.PI/4, 0]}
      >
        <meshStandardMaterial 
          color="#fde68a" 
          metalness={0.4}
          roughness={0.2}
          emissive="#fde68a"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}
