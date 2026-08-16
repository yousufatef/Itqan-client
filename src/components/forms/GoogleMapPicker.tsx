import { useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  CustomLocationSearch,
  type LocationData,
} from '@/components/shared/customs/CustomLocationSearch';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
  ControlPosition,
  type MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

import FieldMessage from './FieldMessage';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
};

// Default center: Rome, Italy
const DEFAULT_CENTER = { lat: 41.9028, lng: 12.4964 };

export type MapLocation = {
  address: string;
  lat: string;
  lng: string;
};

type GoogleMapPickerProps = {
  fieldName: string;
  label?: string;
  value?: MapLocation;
  onChange?: (location: MapLocation) => void;
  onLocationSelect?: (location: LocationData) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hasError?: boolean;
  errorMessage?: string;
};

function MapComponent({
  value,
  fieldName,
  onChange,
  onLocationSelect,
  hasError,
}: {
  value?: MapLocation;
  fieldName: string;
  onChange?: (location: MapLocation) => void;
  onLocationSelect?: (location: LocationData) => void;
  hasError?: boolean;
}) {
  const map = useMap();
  const geocodingLibrary = useMapsLibrary('geocoding');
  const form = useFormContext();

  const parsedLat = value ? parseFloat(value.lat) : NaN;
  const parsedLng = value ? parseFloat(value.lng) : NaN;
  const hasPin = !isNaN(parsedLat) && !isNaN(parsedLng);
  const pinPosition = hasPin ? { lat: parsedLat, lng: parsedLng } : null;
  const mapCenter = pinPosition ?? DEFAULT_CENTER;

  useEffect(() => {
    if (map && pinPosition) {
      map.panTo(pinPosition);
      map.setZoom(15);
    }
  }, [map, pinPosition?.lat, pinPosition?.lng]);

  const onMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (!e.detail.latLng || !geocodingLibrary) return;

      const geocoder = new geocodingLibrary.Geocoder();
      geocoder.geocode({ location: e.detail.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const address = results[0].formatted_address;
          const lat = e.detail.latLng!.lat;
          const lng = e.detail.latLng!.lng;

          if (onChange) {
            onChange({
              address,
              lat: lat.toString(),
              lng: lng.toString(),
            });
          }
          if (onLocationSelect) {
            onLocationSelect({
              address,
              lat,
              lng,
              placeId: results[0].place_id,
              formattedAddress: address,
              name: address.split(',')[0],
            });
          }
          if (form) {
            form.setValue(fieldName, address, { shouldValidate: true, shouldDirty: true });
          }
        }
      });
    },
    [geocodingLibrary, onChange, onLocationSelect, form, fieldName],
  );

  return (
    <div
      className={cn(
        '[&_.gm-control-active]:bg-primary-500! [&_.gm-control-active:hover]:bg-primary-600! overflow-hidden rounded-lg border shadow-sm transition-all [&_.gm-control-active_img]:brightness-0! [&_.gm-control-active_img]:invert!',
        hasError ? 'border-red-500 ring-2 ring-red-500' : 'border-neutral-200',
      )}
    >
      <Map
        style={MAP_CONTAINER_STYLE}
        defaultCenter={mapCenter}
        defaultZoom={hasPin ? 15 : 6}
        center={pinPosition ?? undefined}
        onClick={onMapClick}
        disableDefaultUI={false}
        zoomControl={true}
        zoomControlOptions={{ position: ControlPosition.TOP_LEFT }}
        streetViewControl={false}
        mapTypeControl={false}
        fullscreenControl={false}
        cameraControl={false}
        mapId='DEMO_MAP_ID'
        gestureHandling='greedy'
      >
        {pinPosition && (
          <AdvancedMarker position={pinPosition}>
            <Pin
              background='var(--color-primary-500, #b49855)'
              borderColor='var(--color-primary-700, #806c3c)'
              glyphColor='#ffffff'
            />
          </AdvancedMarker>
        )}
      </Map>
    </div>
  );
}

export default function GoogleMapPicker({
  fieldName,
  label,
  value,
  onChange,
  onLocationSelect,
  placeholder = 'Search address...',
  className,
  inputClassName,
  hasError,
  errorMessage,
}: GoogleMapPickerProps) {
  const form = useFormContext();
  const errors = form?.formState?.errors;
  const latError = errors?.latitude?.message as string | undefined;
  const lngError = errors?.longitude?.message as string | undefined;

  const displayError = errorMessage || latError || lngError;
  const isInvalid = hasError || Boolean(latError || lngError);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''}>
        <CustomLocationSearch
          fieldName={fieldName}
          label={label}
          placeholder={placeholder}
          onLocationSelect={onLocationSelect}
          className={inputClassName}
        />
        <MapComponent
          value={value}
          fieldName={fieldName}
          onChange={onChange}
          onLocationSelect={onLocationSelect}
          hasError={isInvalid}
        />
        {displayError && <FieldMessage error={displayError} />}
      </APIProvider>
    </div>
  );
}
