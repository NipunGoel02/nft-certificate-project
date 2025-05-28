import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text, Environment, useTexture, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

// Glowing Blockchain Cube Cluster
const GlowingCubeCluster = () => {
  const groupRef = useRef();
  const positions = [
    [-1, 0, 0], [1, 0, 0], [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1], [1, 1, 1], [-1, -1, -1]
  ];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.005;
      groupRef.current.rotation.y += 0.007;

      groupRef.current.children.forEach((cube, index) => {
        const scale = 1 + 0.3 * Math.sin(state.clock.elapsedTime * 2 + index);
        cube.scale.set(scale, scale, scale);
        if (cube.material) {
          cube.material.emissiveIntensity = 0.5 + 0.5 * Math.abs(Math.sin(state.clock.elapsedTime * 3 + index));
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, 0]} >
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial 
            color="#00CED1" 
            emissive="#00CED1" 
            emissiveIntensity={1} 
            roughness={0.2} 
            metalness={0.8} 
          />
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.8, 0.8, 0.8)]} />
            <lineBasicMaterial color="#00FFFF" />
          </lineSegments>
        </mesh>
      ))}
    </group>
  );
};

// Holographic Certificate
const HolographicCertificate = () => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.2;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (materialRef.current) {
      materialRef.current.opacity = 0.7 + Math.sin(t * 2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={[2.2, 1.4, 0.05]} position={[3, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={0.05}
          emissive="#14b8a6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
        
        {/* Certificate content */}
        <mesh position={[0, 0.2, 0.51]} scale={[0.8, 0.1, 0.01]}>
          <boxGeometry />
          <meshStandardMaterial color="#0d9488" />
        </mesh>
        <mesh position={[0, 0, 0.51]} scale={[0.8, 0.05, 0.01]}>
          <boxGeometry />
          <meshStandardMaterial color="#0d9488" />
        </mesh>
        <mesh position={[0, -0.2, 0.51]} scale={[0.8, 0.05, 0.01]}>
          <boxGeometry />
          <meshStandardMaterial color="#0d9488" />
        </mesh>
        
        {/* Certificate seal */}
        <mesh position={[0.3, -0.3, 0.51]} scale={[0.15, 0.15, 0.01]}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color="gold" emissive="orange" emissiveIntensity={0.5} />
        </mesh>
      </mesh>
    </Float>
  );
};

// Futuristic Data Field - a more elegant, modern visualization
const FuturisticDataField = () => {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  const linesRef = useRef([]);
  
  // Create a beautiful pattern of floating particles
  const particleCount = 40;
  const connectionDistance = 3;
  
  // Generate particles in a more organized, aesthetic pattern
  const particles = useMemo(() => {
    const points = [];
    
    // Create a spiral galaxy-like formation
    for (let i = 0; i < particleCount; i++) {
      const angle = i * 0.4;
      const radius = 0.2 + i * 0.15;
      const spiralX = Math.cos(angle) * radius * 5;
      const spiralY = (Math.sin(i * 0.3) * 0.5) + (Math.cos(i * 0.2) * 0.5);
      const spiralZ = Math.sin(angle) * radius * 5 - 3;
      
      points.push({
        position: [spiralX, spiralY, spiralZ],
        size: Math.random() * 0.1 + 0.05,
        speed: Math.random() * 0.01 + 0.005,
        offset: Math.random() * Math.PI * 2
      });
    }
    
    return points;
  }, []);
  
  // Calculate connections between nearby particles
  const connections = useMemo(() => {
    const links = [];
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].position[0] - particles[j].position[0];
        const dy = particles[i].position[1] - particles[j].position[1];
        const dz = particles[i].position[2] - particles[j].position[2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (distance < connectionDistance) {
          links.push([i, j, distance]);
        }
      }
    }
    
    return links;
  }, [particles]);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Animate particles with gentle floating motion
    particlesRef.current.forEach((particle, i) => {
      if (particle && particles[i]) {
        const { position, speed, offset } = particles[i];
        
        // Gentle orbital motion
        particle.position.x = position[0] + Math.sin(t * speed + offset) * 0.5;
        particle.position.y = position[1] + Math.cos(t * speed * 0.7 + offset) * 0.3;
        particle.position.z = position[2] + Math.sin(t * speed * 0.5 + offset) * 0.2;
        
        // Pulsing glow effect
        if (particle.material) {
          particle.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(t + i * 0.2);
        }
      }
    });
    
    // Update connections
    linesRef.current.forEach((line, i) => {
      if (line && connections[i]) {
        const [i1, i2] = connections[i];
        const p1 = particlesRef.current[i1];
        const p2 = particlesRef.current[i2];
        
        if (p1 && p2 && line.geometry) {
          // Update line positions to follow particles
          const positions = line.geometry.attributes.position.array;
          
          positions[0] = p1.position.x;
          positions[1] = p1.position.y;
          positions[2] = p1.position.z;
          
          positions[3] = p2.position.x;
          positions[4] = p2.position.y;
          positions[5] = p2.position.z;
          
          line.geometry.attributes.position.needsUpdate = true;
          
          // Animate line opacity based on distance
          const dx = p1.position.x - p2.position.x;
          const dy = p1.position.y - p2.position.y;
          const dz = p1.position.z - p2.position.z;
          const currentDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (line.material) {
            // Fade out as particles move apart
            const opacity = Math.max(0, 1 - (currentDistance / connectionDistance));
            line.material.opacity = opacity * 0.5 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 0.1));
          }
        }
      }
    });
    
    // Slow rotation of entire field
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = Math.sin(t * 0.025) * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Particles */}
      {particles.map((particle, i) => (
        <mesh
          key={`particle-${i}`}
          ref={el => particlesRef.current[i] = el}
          position={particle.position}
        >
          <sphereGeometry args={[particle.size, 16, 16]} />
          <meshStandardMaterial
            color="#14b8a6"
            emissive="#14b8a6"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Connections */}
      {connections.map(([i1, i2, distance], i) => {
        const p1 = particles[i1].position;
        const p2 = particles[i2].position;
        
        const points = [
          new THREE.Vector3(...p1),
          new THREE.Vector3(...p2)
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Calculate opacity based on distance
        const opacity = Math.max(0, 1 - (distance / connectionDistance)) * 0.5;
        
        return (
          <line
            key={`connection-${i}`}
            ref={el => linesRef.current[i] = el}
            geometry={lineGeometry}
          >
            <lineBasicMaterial
              color="#14b8a6"
              transparent
              opacity={opacity}
              linewidth={1}
            />
          </line>
        );
      })}
      
      {/* Central glow effect */}
      <mesh position={[0, 0, -3]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#14b8a6"
          emissive="#14b8a6"
          emissiveIntensity={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Ambient light source */}
      <pointLight position={[0, 0, -3]} color="#14b8a6" intensity={5} distance={10} />
    </group>
  );
};

// Main Scene Component
const Scene = () => {
  const { camera } = useThree();
  const [showCertificate, setShowCertificate] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  
  useEffect(() => {
    // Initial camera animation
    gsap.to(camera.position, {
      z: 8,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        // Show elements sequentially
        setShowCertificate(true);
        setTimeout(() => setShowNetwork(true), 500);
      }
    });
  }, [camera]);
  
  return (
    <>
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 5, 20]} />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      
      <GlowingCubeCluster  position={[5, 0, 0]} />
      
      {showCertificate && <HolographicCertificate />}
      {showNetwork && <FuturisticDataField/>}
      
      <Sparkles 
        count={200}
        size={0.6}
        scale={12}
        speed={0.3}
        opacity={0.5}
        color="#14b8a6"
      />
      
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={true}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
};

// Main Hero Component
const Hero = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background gradient with animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-400/20 via-transparent to-transparent animate-pulse-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-screen filter blur-xl animate-blob"></div>
          <div className="absolute bottom-1/2 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/2 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
          <Scene />
        </Canvas>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex items-center">
        <div className="w-full md:w-1/2 text-white bg-transparent p-8 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent"
              >
                Learn
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text text-transparent"
              >
                Earn
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="block bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent"
              >
                Verify
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg md:text-xl mb-8 text-gray-300"
            >
              Complete courses, participate in hackathons, and earn blockchain-verified certificates that showcase your skills to the world.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/courses">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 20px rgba(20, 184, 166, 0.5)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-400 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Courses
                </motion.button>
              </Link>
              
              <Link to="/hackathons">
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 bg-transparent border-2 border-teal-400 text-teal-300 font-bold rounded-xl hover:bg-teal-900/30 transition-all duration-300"
                >
                  Join Hackathons
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Verification Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-8 inline-flex items-center bg-white/10 backdrop-blur-md px-4 py-3 rounded-full border border-teal-500/30"
            >
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
                className="w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full flex items-center justify-center mr-3"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              <span className="text-sm font-medium text-white">Blockchain Verified Certificates</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
