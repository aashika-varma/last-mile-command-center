import { useMemo } from "react";
import { geoAlbersUsa } from "d3-geo";
import {
  US_NATION_PATH,
  US_STATE_BORDERS_PATH,
  US_PROJECTION,
  US_VIEWBOX,
} from "@/lib/us-geo";
import {
  HIGHLIGHT_ROUTE,
  STORE_LOCATIONS,
  type StoreLocation,
} from "@/lib/stores";

type Props = {
  /** Swap in real store coordinates here */
  stores?: StoreLocation[];
  /** Ordered list of store ids to draw as a highlighted route */
  route?: string[];
  className?: string;
};

/** Projects WGS84 lat/lng into the same coordinate space as the map paths. */
function useProjector() {
  return useMemo(() => {
    const proj = geoAlbersUsa()
      .scale(US_PROJECTION.scale)
      .translate(US_PROJECTION.translate);
    return (s: StoreLocation) => proj([s.lng, s.lat]);
  }, []);
}

/** Rounded so SSR and client render byte-identical coordinates. */
const round = (n: number) => Math.round(n * 100) / 100;

export function UsStoreMap({
  stores = STORE_LOCATIONS,
  route = HIGHLIGHT_ROUTE,
  className,
}: Props) {
  const project = useProjector();

  const points = useMemo(
    () =>
      stores
        .map((s) => {
          const xy = project(s);
          return xy
            ? { store: s, x: round(xy[0]), y: round(xy[1]) }
            : null;
        })
        .filter((p): p is { store: StoreLocation; x: number; y: number } => !!p),
    [stores, project],
  );

  const routeD = useMemo(() => {
    const byId = new Map(points.map((p) => [p.store.id, p]));
    const pts = route.map((id) => byId.get(id)).filter(Boolean) as typeof points;
    if (pts.length < 2) return null;
    return `M${pts.map((p) => `${p.x},${p.y}`).join(" L")}`;
  }, [points, route]);

  return (
    <svg viewBox={US_VIEWBOX} className={className} fill="none" role="img"
      aria-label="Map of the United States showing the store network and an active delivery route">
      {/* land */}
      <path
        d={US_NATION_PATH}
        fill="var(--primary)"
        fillOpacity="0.07"
        stroke="var(--primary)"
        strokeOpacity="0.55"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* state borders */}
      <path
        d={US_STATE_BORDERS_PATH}
        stroke="var(--primary)"
        strokeOpacity="0.28"
        strokeWidth="0.7"
      />

      {/* highlighted route */}
      {routeD && (
        <>
          <path
            d={routeD}
            stroke="var(--signal)"
            strokeOpacity="0.85"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle r="3.5" fill="var(--signal)">
            <animateMotion dur="7s" repeatCount="indefinite" path={routeD} />
          </circle>
        </>
      )}

      {/* stores */}
      {points.map(({ store, x, y }, i) => {
        const isDc = store.type === "dc";
        return (
          <g key={store.id}>
            {isDc && (
              <circle cx={x} cy={y} r="7" fill="var(--primary)" fillOpacity="0.12">
                <animate
                  attributeName="r"
                  values="5;11;5"
                  dur="3.6s"
                  begin={`${i * 0.35}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  values="0.18;0;0.18"
                  dur="3.6s"
                  begin={`${i * 0.35}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={x}
              cy={y}
              r={isDc ? 4 : 2.6}
              fill={isDc ? "var(--signal)" : "var(--primary)"}
              fillOpacity={isDc ? 1 : 0.85}
            />
            <title>{store.name}</title>
          </g>
        );
      })}
    </svg>
  );
}
