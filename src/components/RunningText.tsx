
import React, { useState, useEffect, useRef } from 'react';

interface RunningTextProps {
  text: string;
  accentColor: string;
}

const RunningText: React.FC<RunningTextProps> = ({ text, accentColor }) => {
  const [animationDuration, setAnimationDuration] = useState('100s');
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Efek ini berjalan sekali ketika komponen dipasang (atau dipasang ulang karena prop key).
    if (containerRef.current) {
      // Kita memiliki dua span identik, jadi total scrollWidth adalah 2x lebar konten teks sebenarnya.
      const textWidth = containerRef.current.scrollWidth / 2;
      const pixelsPerSecond = 80; // Sesuaikan untuk kecepatan yang elegan
      const duration = textWidth / pixelsPerSecond;
      
      // Tetapkan durasi minimum untuk mencegah scrolling yang sangat cepat untuk teks pendek.
      setAnimationDuration(`${Math.max(duration, 15)}s`);
      
      // Penundaan kecil sebelum memulai animasi memastikan durasi baru diterapkan.
      requestAnimationFrame(() => {
        setIsReady(true);
      });
    }
  }, [text]); // Prop key menangani pemasangan ulang, tetapi menyertakan `text` adalah praktik yang baik.

  const textElement = (
    <span
      className="font-medium px-8"
      style={{
        color: accentColor,
        fontSize: 'clamp(1.1rem, 2.5vw, 1.875rem)',
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  return (
    <div
      key={text} // Pasang ulang komponen untuk memulai ulang animasi saat teks berubah.
      ref={containerRef}
      className="whitespace-nowrap flex animate-marquee"
      style={{
        animationDuration,
        animationPlayState: isReady ? 'running' : 'paused',
      }}
    >
      {textElement}
      {textElement}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation-name: marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
};

export default RunningText;
