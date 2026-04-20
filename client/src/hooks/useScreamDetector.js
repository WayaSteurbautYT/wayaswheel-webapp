import { useState, useEffect, useRef } from 'react';

export const useScreamDetector = (threshold = 0.15) => {
  const [isScreaming, setIsScreaming] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const initScreamDetection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const checkScream = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length / 255;

          if (average > threshold) {
            setIsScreaming(true);
            setTimeout(() => setIsScreaming(false), 2000); // Reset after 2 seconds
          }
          
          requestAnimationFrame(checkScream);
        };

        checkScream();
      } catch (err) {
        console.error("Scream detection failed to initialize:", err);
      }
    };

    initScreamDetection();

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [threshold]);

  return { isScreaming };
};