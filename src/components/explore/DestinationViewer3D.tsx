import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Maximize2, RotateCcw } from 'lucide-react';

interface DestinationViewer3DProps {
  destination: {
    name: string;
    description?: string;
    imageUrl?: string;
    type?: 'temple' | 'monument' | 'nature' | 'city' | 'heritage';
  };
  onClose?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

// Floating cultural artifact based on destination type
const CulturalArtifact: React.FC<{ type: string }> = ({ type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'temple':
        // Pagoda-like structure
        return (
          <group ref={meshRef as any}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 0.5, 2]} />
              <meshStandardMaterial color="#c4a35a" metalness={0.3} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <boxGeometry args={[1.5, 1, 1.5]} />
              <meshStandardMaterial color="#b8860b" metalness={0.4} roughness={0.6} />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <coneGeometry args={[1.2, 1, 4]} />
              <meshStandardMaterial color="#8b0000" metalness={0.2} roughness={0.8} />
            </mesh>
            <mesh position={[0, 2.3, 0]}>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
      case 'monument':
        // Obelisk structure
        return (
          <group ref={meshRef as any}>
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
              <meshStandardMaterial color="#d4af37" metalness={0.5} roughness={0.5} />
            </mesh>
            <mesh position={[0, 3.2, 0]}>
              <coneGeometry args={[0.35, 0.5, 4]} />
              <meshStandardMaterial color="#ffd700" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        );
      case 'nature':
        // Tree-like structure
        return (
          <group ref={meshRef as any}>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 1, 8]} />
              <meshStandardMaterial color="#8b4513" roughness={0.9} />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color="#228b22" roughness={0.8} />
            </mesh>
          </group>
        );
      case 'city':
        // Building cluster
        return (
          <group ref={meshRef as any}>
            <mesh position={[-0.5, 0.75, 0]}>
              <boxGeometry args={[0.6, 1.5, 0.6]} />
              <meshStandardMaterial color="#708090" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.3, 1, 0.2]}>
              <boxGeometry args={[0.5, 2, 0.5]} />
              <meshStandardMaterial color="#778899" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.5, -0.4]}>
              <boxGeometry args={[0.7, 1, 0.7]} />
              <meshStandardMaterial color="#696969" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        );
      default:
        // Heritage - Globe
        return (
          <mesh ref={meshRef}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color="#1e90ff" 
              metalness={0.3} 
              roughness={0.6}
              wireframe
            />
          </mesh>
        );
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {getGeometry()}
    </Float>
  );
};

// Particle system for ambient atmosphere
const ParticleField: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  
  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffd700"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Ground plane with cultural pattern
const GroundPlane: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <circleGeometry args={[8, 64]} />
      <meshStandardMaterial 
        color="#2d2d2d" 
        metalness={0.2} 
        roughness={0.8}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};

// Loading fallback
const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="flex items-center gap-2 text-primary">
      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Loading 3D view...</span>
    </div>
  </Html>
);

const DestinationViewer3D: React.FC<DestinationViewer3DProps> = ({
  destination,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-background'
    : 'w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden';

  return (
    <Card className={containerClass}>
      <CardContent className="p-0 h-full relative">
        {/* Controls overlay */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {onToggleFullscreen && (
            <Button
              variant="secondary"
              size="icon"
              onClick={onToggleFullscreen}
              className="bg-background/80 backdrop-blur-sm"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="secondary"
              size="icon"
              onClick={onClose}
              className="bg-background/80 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Destination info overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <h3 className="font-semibold text-foreground">{destination.name}</h3>
            {destination.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                {destination.description}
              </p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute top-3 left-3 z-10">
          <div className="bg-background/60 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              Drag to rotate • Scroll to zoom
            </p>
          </div>
        </div>

        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [5, 3, 5], fov: 50 }}
          style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b6b" />
            <spotLight
              position={[0, 10, 0]}
              angle={0.3}
              penumbra={1}
              intensity={0.5}
              color="#ffd700"
            />

            {/* Main artifact */}
            <CulturalArtifact type={destination.type || 'heritage'} />

            {/* Atmosphere */}
            <ParticleField />
            <GroundPlane />

            {/* Environment */}
            <Environment preset="night" />

            {/* Controls */}
            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={15}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </CardContent>
    </Card>
  );
};

export default DestinationViewer3D;
