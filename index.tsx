import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';

/** --- GLOBAL CONFIGURATION --- **/
const GLOBAL_BIRTH_RATE_PER_SEC = 4.34; 
const ROTATION_SPEED = 0.22;

const REGION_WEIGHTS = [
  { name: 'India', weight: 0.18, coords: [78.9629, 20.5937], radius: 10 },
  { name: 'China', weight: 0.08, coords: [104.1954, 35.8617], radius: 12 },
  { name: 'Nigeria', weight: 0.07, coords: [8.6753, 9.0820], radius: 6 },
  { name: 'Pakistan', weight: 0.05, coords: [69.3451, 30.3753], radius: 5 },
  { name: 'Indonesia', weight: 0.04, coords: [113.9213, -0.7893], radius: 8 },
  { name: 'Brazil', weight: 0.02, coords: [-51.9253, -14.2350], radius: 10 },
  { name: 'USA', weight: 0.03, coords: [-95.7129, 37.0902], radius: 15 },
  { name: 'Europe', weight: 0.04, coords: [2.3522, 48.8566], radius: 15 },
  { name: 'Central Africa', weight: 0.15, coords: [20.2714, 0.2248], radius: 15 },
  { name: 'SE Asia', weight: 0.05, coords: [100.9925, 15.8700], radius: 10 },
  { name: 'South America', weight: 0.04, coords: [-60, -20], radius: 20 },
  { name: 'Other', weight: 0.25, coords: [0, 0], radius: 180 },
];

const PACIFIER_PATH = "M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 14h-4v-1h4v1zm.65-3.07l-.65.46V14h-4v-.61l-.65-.46C8.52 12.33 8 11.23 8 10c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.23-.52 2.33-1.35 2.93z";

const Globe = ({ events }: { events: any[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const rotationRef = useRef<number>(0);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(setGeoData)
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    const radius = Math.min(width, height) / 2.2;

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection);

    const render = () => {
      projection.rotate([rotationRef.current, -12]);
      
      svg.selectAll('.globe-bg').data([null]).join('circle')
        .attr('class', 'globe-bg')
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .attr('r', radius)
        .attr('fill', '#1e1b4b')
        .attr('opacity', 0.6);

      svg.selectAll('.country').data(geoData.features).join('path')
        .attr('class', 'country')
        .attr('d', path as any)
        .attr('fill', '#7c3aed')
        .attr('stroke', '#a78bfa')
        .attr('stroke-width', 0.5)
        .attr('opacity', 0.6);

      const currentRot = projection.rotate();
      const visibleEvents = events.filter(e => {
        const geoPoint: [number, number] = [e.lng, e.lat];
        return d3.geoDistance([-currentRot[0], -currentRot[1]], geoPoint) < Math.PI / 2;
      });

      const markers = svg.selectAll('.marker').data(visibleEvents, (d: any) => d.id);
      
      markers.join(
        enter => enter.append('g')
          .attr('class', 'marker')
          .each(function(d) {
            const pos = projection([d.lng, d.lat]);
            if (pos) {
              const g = d3.select(this).attr('transform', `translate(${pos[0]}, ${pos[1]})`);
              
              g.append('path')
                .attr('d', PACIFIER_PATH)
                .attr('transform', 'translate(-12, -12) scale(1.2)')
                .attr('fill', '#FACC15');

              g.append('circle')
                .attr('r', 8)
                .attr('fill', 'none')
                .attr('stroke', '#FACC15')
                .attr('stroke-width', 2)
                .transition().duration(2500)
                .attr('r', 80)
                .attr('opacity', 0)
                .remove();
            }
          })
          .transition().duration(5000).attr('opacity', 0).remove(),
        update => update.each(function(d) {
          const pos = projection([d.lng, d.lat]);
          if (pos) {
            d3.select(this).attr('transform', `translate(${pos[0]}, ${pos[1]})`);
          }
        })
      );

      rotationRef.current += ROTATION_SPEED;
    };

    const timer = d3.timer(render);
    return () => timer.stop();
  }, [geoData, events]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full overflow-visible" />
    </div>
  );
};

const UIOverlay = ({ totalToday }: { totalToday: number }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const passedSeconds = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();
  const dayProgress = passedSeconds / 86400;

  return (
    <div className="fixed inset-0 p-16 ui-overlay flex flex-col justify-between pointer-events-none">
      <div className="pointer-events-auto">
        <h1 className="text-2xl font-black text-[#D946EF] tracking-[0.3em] flex flex-col cursor-default">
          <span className="mb-2 uppercase">Mother & Child Care — Women's Health</span>
          <div className="h-[3px] w-96 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.7)]" />
        </h1>
      </div>

      <div className="flex flex-col gap-10 max-w-2xl pointer-events-auto">
        <div className="flex flex-col">
          <span className="text-[14px] font-black tracking-[0.6em] text-yellow-500/80 uppercase mb-4 block">Global Birth Count Today</span>
          <div className="text-[10rem] md:text-[11rem] font-black text-yellow-400 tabular-nums leading-none tracking-tighter neon-text select-none">
            {totalToday.toLocaleString()}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-end text-[12px] font-bold tracking-[0.4em] uppercase">
            <span className="text-slate-500">System Diurnal Phase</span>
            <span className="text-yellow-500">{Math.round(dayProgress * 100)}% Synchronized</span>
          </div>
          <div className="h-2 w-full max-w-md bg-slate-900 border border-slate-800 rounded-full overflow-hidden progress-bar-shadow">
            <div 
              className="h-full bg-yellow-500 shadow-[0_0_20px_#eab308] transition-all duration-1000 ease-linear" 
              style={{ width: `${dayProgress * 100}%` }}
            />
          </div>
          
          <div className="pt-6">
            <div className="inline-flex items-center justify-center bg-black/80 border border-yellow-500/10 px-10 py-5 rounded-2xl backdrop-blur-3xl shadow-2xl">
              <span className="text-yellow-400 font-bold tabular-nums tracking-[0.4em] text-2xl">
                {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 tracking-[0.7em] uppercase pointer-events-auto">
        <div className="flex items-center gap-4">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_#22c55e]"></span>
          Active Telemetry Stream
        </div>
        <span>Deployment #197 — Source: Demographic Matrix</span>
      </div>
    </div>
  );
};

const App = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const elapsed = (Date.now() - startOfDay) / 1000;
    const startTotal = Math.floor(elapsed * GLOBAL_BIRTH_RATE_PER_SEC);
    setTotalToday(startTotal);

    const interval = setInterval(() => {
      const rand = Math.random();
      let cumWeight = 0;
      const region = REGION_WEIGHTS.find(rw => (cumWeight += rw.weight) >= rand) || REGION_WEIGHTS[0];
      
      const newEvent = {
        id: Math.random().toString(36).substring(2, 11),
        lat: region.coords[1] + (Math.random() - 0.5) * region.radius,
        lng: region.coords[0] + (Math.random() - 0.5) * region.radius,
        time: Date.now()
      };
      
      setEvents(prev => [...prev.slice(-60), newEvent]);
      setTotalToday(prev => prev + 1);
    }, 1000 / GLOBAL_BIRTH_RATE_PER_SEC);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black selection:bg-yellow-500/40">
      <div className="globe-container">
        <Globe events={events} />
      </div>
      <UIOverlay totalToday={totalToday} />
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}