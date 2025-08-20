import { useEffect, useRef, useState } from "react";

interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export const useWebcam = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [faceDetection, setFaceDetection] = useState<FaceDetection | null>(null);
  const [isSmiling, setIsSmiling] = useState(false);
  const [emotionIntensity, setEmotionIntensity] = useState(0);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (!videoRef.current) {
        videoRef.current = document.createElement('video');
        videoRef.current.style.position = 'fixed';
        videoRef.current.style.top = '-1000px'; // Hide the video element
        videoRef.current.style.width = '640px';
        videoRef.current.style.height = '480px';
        document.body.appendChild(videoRef.current);
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
      }

      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setIsActive(true);
      
      // Start face detection
      detectFaces();
    } catch (error) {
      console.warn('Webcam access denied or not available:', error);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsActive(false);
    setFaceDetection(null);
  };

  const detectFaces = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const detectFrame = () => {
      if (!videoRef.current || !isActive) return;

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Simple face detection using brightness analysis
      // This is a very basic implementation - in a real app you'd use a proper face detection library
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Analyze brightness in different regions to detect face-like patterns
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const faceRegionSize = 100;
      
      let brightness = 0;
      let pixelCount = 0;
      
      for (let y = centerY - faceRegionSize; y < centerY + faceRegionSize; y += 10) {
        for (let x = centerX - faceRegionSize; x < centerX + faceRegionSize; x += 10) {
          if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            brightness += (r + g + b) / 3;
            pixelCount++;
          }
        }
      }
      
      const avgBrightness = brightness / pixelCount;
      
      // Simple heuristic: if there's a face-like brightness pattern, consider it detected
      if (avgBrightness > 80 && avgBrightness < 200) {
        setFaceDetection({
          x: centerX - faceRegionSize,
          y: centerY - faceRegionSize,
          width: faceRegionSize * 2,
          height: faceRegionSize * 2,
          confidence: Math.min(1, (avgBrightness - 80) / 120)
        });
        
        // Detect "smiling" by analyzing brightness changes in lower face region
        let lowerFaceBrightness = 0;
        let lowerPixelCount = 0;
        
        for (let y = centerY; y < centerY + faceRegionSize; y += 15) {
          for (let x = centerX - faceRegionSize/2; x < centerX + faceRegionSize/2; x += 15) {
            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
              const i = (y * canvas.width + x) * 4;
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              lowerFaceBrightness += (r + g + b) / 3;
              lowerPixelCount++;
            }
          }
        }
        
        const lowerAvg = lowerFaceBrightness / lowerPixelCount;
        const isCurrentlySmiling = lowerAvg > avgBrightness * 1.1;
        setIsSmiling(isCurrentlySmiling);
        setEmotionIntensity(Math.abs(lowerAvg - avgBrightness) / avgBrightness);
      } else {
        setFaceDetection(null);
        setIsSmiling(false);
        setEmotionIntensity(0);
      }
      
      if (isActive) {
        requestAnimationFrame(detectFrame);
      }
    };
    
    detectFrame();
  };

  useEffect(() => {
    return () => {
      stopWebcam();
      if (videoRef.current && document.body.contains(videoRef.current)) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, []);

  return {
    isActive,
    faceDetection,
    isSmiling,
    emotionIntensity,
    startWebcam,
    stopWebcam
  };
};
