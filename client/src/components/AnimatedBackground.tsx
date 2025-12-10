import React from 'react';

export const AnimatedBackground: React.FC = () => {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none', backgroundColor: '#111827' }}>
            {/* Base gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #111827, #1f2937, #111827)', opacity: 0.8 }}></div>

            {/* Moving Lights Container */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
                <style>
                    {`
                        @keyframes moveRight {
                            0% { transform: translateX(-100%) skewX(-30deg); }
                            100% { transform: translateX(200%) skewX(-30deg); }
                        }
                        @keyframes moveLeft {
                            0% { transform: translateX(200%) skewX(30deg); }
                            100% { transform: translateX(-100%) skewX(30deg); }
                        }
                        .traffic-light {
                            position: absolute;
                            height: 4px;
                            border-radius: 9999px;
                            filter: blur(3px);
                            box-shadow: 0 0 10px currentColor;
                        }
                        .light-red { color: #ef4444; background: currentColor; animation: moveLeft 8s linear infinite; }
                        .light-white { color: #facc15; background: currentColor; animation: moveRight 7s linear infinite; }
                        
                        .delay-1 { animation-delay: 0s; }
                        .delay-2 { animation-delay: 2s; }
                        .delay-3 { animation-delay: 4s; }
                        .delay-4 { animation-delay: 1.5s; }
                        .delay-5 { animation-delay: 3.5s; }
                    `}
                </style>

                {/* Simulated "Roads" at different heights */}
                {/* Top Road (Horizon) */}
                <div className="traffic-light light-red" style={{ width: '16rem', top: '15%', animationDuration: '15s' }}></div>
                <div className="traffic-light light-white" style={{ width: '16rem', top: '18%', animationDuration: '12s', animationDelay: '5s' }}></div>

                {/* Middle Road */}
                <div className="traffic-light light-red delay-1" style={{ width: '24rem', top: '40%' }}></div>
                <div className="traffic-light light-red delay-2" style={{ width: '18rem', top: '42%' }}></div>
                <div className="traffic-light light-white delay-3" style={{ width: '20rem', top: '45%' }}></div>
                <div className="traffic-light light-white delay-1" style={{ width: '24rem', top: '48%' }}></div>

                {/* Bottom Road (Fastest/Closest) */}
                <div className="traffic-light light-red" style={{ width: '500px', top: '75%', opacity: 0.6, height: '6px', animationDuration: '6s' }}></div>
                <div className="traffic-light light-white" style={{ width: '500px', top: '80%', opacity: 0.6, height: '6px', animationDuration: '5s', animationDelay: '1s' }}></div>
            </div>

            {/* Mesh overlay for texture */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", opacity: 0.1, mixBlendMode: 'overlay' }}></div>
        </div>
    );
};
