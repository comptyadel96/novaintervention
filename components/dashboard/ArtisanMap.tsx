"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Using a custom SVG icon for a modern look matching the theme
const mapIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A2540">
    <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"/>
  </svg>
`;

const customIcon = new L.DivIcon({
  html: `
    <div className="relative">
      <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping opacity-75"></div>
      <div className="relative w-[30px] h-[30px] filter drop-shadow-lg scale-110">
        ${mapIconSvg}
      </div>
    </div>
  `,
  className: "custom-leaflet-icon",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

export default function ArtisanMap({ missions }: { missions: any[] }) {
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  
  const mapMarkers = (missions || []).map((mission, i) => {
    const latOffset = (Math.sin((mission.id?.charCodeAt(0) || i) + i) * 60) * 0.001;
    const lngOffset = (Math.cos((mission.id?.charCodeAt(0) || i) + i) * 60) * 0.001;
    const lat = 48.8566 + latOffset;
    const lng = 2.3522 + lngOffset;
    return { ...mission, lat, lng };
  });

  return (
    <div className="w-full h-full min-h-[450px] rounded-[3rem] overflow-hidden relative z-0 border-4 border-white shadow-2xl group transition-all hover:scale-[1.01]">
      {/* Overlay de style premium */}
      <div className="absolute top-6 left-6 z-[400] flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-[1.5rem] border border-white/40 shadow-xl shadow-primary/10">
          <h3 className="font-black text-primary-dk text-xs flex items-center gap-2 uppercase tracking-tighter italic">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span> 
            Radar Nova Live
          </h3>
          <p className="text-[10px] text-text-muted mt-0.5 font-bold uppercase tracking-widest">{mapMarkers.length} Clients détectés</p>
        </div>
      </div>
      
      <div className="w-full h-full absolute inset-0 leaflet-custom-filter">
        <MapContainer 
          center={defaultCenter} 
          zoom={12} 
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          {/* CartoDB Voyager pour un style propre et clair, plus proche du design du site */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {mapMarkers.map(mission => (
            <Marker key={mission.id} position={[mission.lat, mission.lng]} icon={customIcon}>
              <Popup className="custom-popup-nova">
                <div className="p-3 bg-white rounded-2xl min-w-[200px]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-primary/5 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">
                      {mission.status === 'confirmed' ? 'En cours' : 'Urgent'}
                    </span>
                    <span className="font-black text-primary-dk">{mission.price} €</span>
                  </div>
                  <h3 className="font-extrabold text-primary-dk text-sm mb-1">{mission.customer_name || 'Client Nova'}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4 italic">
                    <MapPin size={12} className="text-orange-500" />
                    <span className="truncate">{mission.location}</span>
                  </div>
                  <button className="w-full py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dk transition-all shadow-md shadow-primary/20">
                    Accepter l'Intervention
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-custom-filter .leaflet-tile-container {
          filter: contrast(1.1) saturate(1.2);
        }
        .custom-popup-nova .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .custom-popup-nova .leaflet-popup-tip {
          background: white;
        }
        .custom-popup-nova .leaflet-popup-content {
          margin: 0;
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
