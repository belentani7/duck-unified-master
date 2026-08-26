import { useEffect, useRef, useState } from "react";

const loadingSteps = ["Inicializando o estúdio", "Sincronizando projetos", "Armando ferramentas", "Tudo pronto para criar"];

export function LoadingScreen({ phrase, indeterminate = false }: { phrase: string; indeterminate?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(8);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    let frame = 0;
    const drawShader = () => {
      if (canvas && context) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < 12; index += 1) {
          const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, `hsla(${140 + index * 13}, 95%, 65%, .08)`);
          gradient.addColorStop(1, "transparent");
          context.strokeStyle = gradient;
          context.lineWidth = 1 + index % 2;
          context.beginPath();
          for (let x = 0; x <= canvas.width; x += 24) { const y = canvas.height / 2 + Math.sin(x * .008 + frame * .012 + index) * (22 + index * 7); if (x === 0) context.moveTo(x, y); else context.lineTo(x, y); }
          context.stroke();
        }
      }
      frame += 1;
      requestAnimationFrame(drawShader);
    };
    const animation = requestAnimationFrame(drawShader);
    return () => cancelAnimationFrame(animation);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(96, value + 7));
      setStep((value) => (value + 1) % loadingSteps.length);
    }, 260);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="loading-screen"><img className="logo-watermark" src="/manus-storage/Untitled2_3621346a.png" alt="Duck Produção Musical" /><canvas ref={canvasRef} className="loading-canvas" /><div className="loading-orbit orbit-a" /><div className="loading-orbit orbit-b" /><div className="loading-grid" /><div className="loading-content"><div className="loading-logo"><span className="duck-mark large">D</span><span>DUCK<span className="green-dot">.</span>OS</span></div><span className="loading-label">RITMO & FREQUÊNCIA · LOCAL CORE</span><div className="loading-visual"><div className="loading-ring"><i /><b>{indeterminate ? "···" : String(progress).padStart(2, "0")}</b></div><div className="loading-bars">{Array.from({ length: 24 }).map((_, index) => <i key={index} style={{ height: `${18 + ((index * 37) % 70)}%` }} />)}</div></div><p className="loading-step">{indeterminate ? "Conectando ao núcleo local/online" : loadingSteps[step]}<span>...</span></p><p className="loading-phrase">“{phrase}”</p><div className={`loading-progress${indeterminate ? " indeterminate" : ""}`}><i style={indeterminate ? undefined : { width: `${progress}%` }} /></div><span className="loading-hint">Seus dados permanecem sob seu controle</span></div></div>;
}
