import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { listFarms } from "../api/farm.api";
import { useFarmStore } from "../store/farmStore";

const DEFAULT_CENTER: [number, number] = [15.3173, 75.7139];

export function LandMapPage() {
  const setFarm = useFarmStore((s) => s.setFarm);
  const selectedFarmId = useFarmStore((s) => s.selectedFarmId);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["farms", "map"], queryFn: () => listFarms() });

  const farmsWithLocation = data.filter((farm) => farm.latitude != null && farm.longitude != null);
  const center = useMemo<[number, number]>(() => {
    const first = farmsWithLocation[0];
    return first?.latitude != null && first?.longitude != null ? [first.latitude, first.longitude] : DEFAULT_CENTER;
  }, [farmsWithLocation]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Land Map</h1>
        <p className="text-sm text-white/70">View farm locations and select the land parcel to analyze.</p>
      </div>

      {isLoading && <p className="text-sm text-white/70">Loading farms...</p>}
      {error && <p className="text-sm text-agri-red">{(error as Error).message}</p>}

      <div className="h-[520px] overflow-hidden rounded-lg border border-agri-border">
        <MapContainer center={center} zoom={6} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {farmsWithLocation.map((farm) => (
            <CircleMarker
              key={farm.id}
              center={[farm.latitude as number, farm.longitude as number]}
              radius={farm.id === selectedFarmId ? 12 : 8}
              pathOptions={{
                color: farm.id === selectedFarmId ? "#4ade80" : "#60a5fa",
                fillColor: farm.id === selectedFarmId ? "#4ade80" : "#60a5fa",
                fillOpacity: 0.75,
              }}
              eventHandlers={{ click: () => setFarm(farm.id) }}
            >
              <Popup>
                <strong>{farm.name}</strong>
                <br />
                {farm.region}
                <br />
                {farm.soilType}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {data.length > 0 && farmsWithLocation.length === 0 && (
        <p className="rounded-md border border-agri-border p-4 text-sm text-white/70">
          Farms loaded, but none have latitude and longitude yet. Add coordinates to show markers.
        </p>
      )}
    </div>
  );
}
