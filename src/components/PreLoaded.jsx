import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import "../styles/preloader.css";
import { particlesConfig } from '../styles/particles';

const EnhancedPreloader = ({ onLoadingComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const loadingProgressRef = useRef(null);
  const loadingTextRef = useRef(null);
  
  useEffect(() => {
     if (window.particlesJS) {
      window.particlesJS('particles-js', particlesConfig);
    }   
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio);
    
    // Create blockchain geometry
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const blockMaterial = new THREE.MeshPhongMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.7,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.2,
      side: THREE.DoubleSide,
      wireframe: false
    });
    
    // Create multiple blocks in a chain
    const blocks = [];
    const blockCount = 5;
    
    for (let i = 0; i < blockCount; i++) {
      const block = new THREE.Mesh(blockGeometry, blockMaterial);
      block.position.x = (i - blockCount / 2) * 1.5;
      block.position.y = Math.sin(i * 0.5) * 0.5;
      block.position.z = -5;
      block.scale.set(0, 0, 0);
      scene.add(block);
      blocks.push(block);
      
      // Animate each block
      gsap.to(block.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        delay: i * 0.2,
        ease: "elastic.out(1, 0.5)"
      });
      
      // Add connecting lines between blocks
      if (i > 0) {
        const lineMaterial = new THREE.LineBasicMaterial({ 
          color: 0x14b8a6,
          transparent: true,
          opacity: 0.5
        });
        const points = [];
        points.push(new THREE.Vector3(blocks[i-1].position.x, blocks[i-1].position.y, blocks[i-1].position.z));
        points.push(new THREE.Vector3(block.position.x, block.position.y, block.position.z));
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
      }
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x14b8a6, 2, 100);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate blocks
      blocks.forEach((block, i) => {
        block.rotation.x += 0.01;
        block.rotation.y += 0.01;
        block.position.y = Math.sin((Date.now() * 0.001) + i) * 0.3;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Complete loading animation
        gsap.to(loadingProgressRef.current, {
          width: '100%',
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(loadingTextRef.current, {
              opacity: 0,
              duration: 0.5
            });
            
            // Animate blocks flying away
            blocks.forEach((block, i) => {
              gsap.to(block.position, {
                z: -20,
                duration: 1.5,
                delay: i * 0.1,
                ease: "power3.in"
              });
            });
            
            // Fade out the entire preloader
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 1,
              delay: 1.5,
              onComplete: () => {
                if (onLoadingComplete) onLoadingComplete();
              }
            });
          }
        });
      } else {
        gsap.to(loadingProgressRef.current, {
          width: `${progress}%`,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    }, 200);
    
    // Text animation
    const letters = document.querySelectorAll('.logo-letter');
    letters.forEach((letter, i) => {
      gsap.fromTo(letter, 
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          delay: i * 0.1,
          ease: "back.out(1.7)"
        }
      );
    });
    
    // Certificate animation
    const certificate = document.querySelector('.certificate-svg');
    gsap.fromTo(certificate,
      { opacity: 0, scale: 0.5 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 1,
        delay: 1,
        ease: "elastic.out(1, 0.5)"
      }
    );
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      // Dispose of objects in the scene
scene.traverse((object) => {
  // Dispose geometries
  if (object.geometry) {
    object.geometry.dispose();
  }
  
  // Dispose materials
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => material.dispose());
    } else {
      object.material.dispose();
    }
  }
});

// Remove all objects from the scene
while(scene.children.length > 0) { 
  scene.remove(scene.children[0]); 
}

// If you have a renderer, dispose its render lists
if (renderer) {
  renderer.renderLists.dispose();
}

      renderer.dispose();
    };
  }, [onLoadingComplete]);
  
  return (
    <div ref={containerRef} className="enhanced-preloader">
      <canvas ref={canvasRef} className="preloader-canvas"></canvas>
      
      <div className="preloader-content">
        <div className="certificate-container">
          <svg className="certificate-svg" viewBox="0 0 100 70">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <rect className="certificate-body" x="10" y="10" width="80" height="50" rx="2" filter="url(#glow)" />
            <line className="certificate-line" x1="20" y1="25" x2="80" y2="25" />
            <line className="certificate-line" x1="20" y1="35" x2="80" y2="35" />
            <line className="certificate-line" x1="20" y1="45" x2="60" y2="45" />
            <circle className="certificate-seal" cx="70" cy="45" r="8" filter="url(#glow)" />
          </svg>
        </div>
        
        <div className="logo-container">
          {['C','e','r','t','i','C','h','a','i','n'].map((letter, i) => (
            <span key={i} className={`logo-letter ${i === 5 ? 'highlight' : ''}`}>{letter}</span>
          ))}
        </div>
        
        <div className="loading-container">
          <div className="loading-bar">
            <div ref={loadingProgressRef} className="loading-progress"></div>
          </div>
          <div ref={loadingTextRef} className="loading-text">
            <span className="loading-text-value">Securing blockchain...</span>
          </div>
        </div>
      </div>
      
      <div className="particles-container"></div>
        <div id="particles-js" className="particles-container"></div>
    </div>
  );
};

export default EnhancedPreloader;
