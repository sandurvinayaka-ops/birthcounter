
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { BirthEvent } from '../types';

interface WorldMapProps {
  events: BirthEvent[];
}

const WorldMap: React.FC<WorldMapProps> = ({ events }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const lastProcessedIdRef = useRef<string | null>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  useEffect(() => {
    if (!geoData || !svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Natural Earth projection for a classic "Command Center" look
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.2)
      .translate([width / 2, height / 1.6]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append('g').attr('class', 'map-layer');

    // High Contrast Land and Borders
    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', 'country-path')
      .attr('id', (d: any) => `country-${(d.id || d.properties.name).replace(/\s+/g, '-')}`)
      .attr('d', path as any)
      .attr('fill', '#1e293b') // Dark Slate Land
      .attr('stroke', '#475569') // Lighter Slate Borders for contrast
      .attr('stroke-width', 0.5);

  }, [geoData]);

  useEffect(() => {
    if (!geoData || !svgRef.current || events.length === 0) return;

    const svg = d3.select(svgRef.current);
    const mapG = svg.select('.map-layer');

    const newestEvent = events[events.length - 1];
    if (newestEvent && newestEvent.id !== lastProcessedIdRef.current) {
      lastProcessedIdRef.current = newestEvent.id;

      const feature = geoData.features.find((f: any) => d3.geoContains(f, [newestEvent.lng, newestEvent.lat]));
      
      if (feature) {
        const countryId = `country-${(feature.id || feature.properties.name).replace(/\s+/g, '-')}`;
        
        mapG.select(`#${countryId}`)
          .interrupt()
          .transition()
          .duration(50)
          .attr('fill', '#fbbf24') // Vibrant Amber Flash
          .attr('stroke', '#ffffff') // White border flash
          .attr('stroke-width', 1.5)
          .transition()
          .duration(1500)
          .attr('fill', '#1e293b') // Fade back to Land
          .attr('stroke', '#475569') // Fade back to Border
          .attr('stroke-width', 0.5);
      }
    }

  }, [events, geoData]);

  return (
    <div className="relative w-full h-full bg-black rounded-[2rem] border-2 border-slate-800 shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
    </div>
  );
};

export default WorldMap;
