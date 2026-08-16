import { useCallback, useEffect, useRef, useState } from 'react';

import { Loader2, MapPin, Search, X } from 'lucide-react';
import { type ControllerRenderProps, type FieldValues, useFormContext } from 'react-hook-form';

import FieldLayout from '@/components/forms/FieldLayout';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useTranslation } from 'react-i18next';

export interface LocationData {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
  formattedAddress?: string;
  name?: string;
}

type CustomLocationSearchProps = {
  fieldName: string;
  label?: string;
  subLable?: string;
  placeholder: string;
  className?: string;
  formItemClassName?: string;
  disabled?: boolean;
  optional?: boolean;
  isGettingLocation?: boolean;
  onLocationSelect?: (location: LocationData) => void;
};

export function CustomLocationSearch({
  fieldName,
  label,
  subLable,
  placeholder,
  className = '',
  formItemClassName = '',
  disabled = false,
  optional = false,
  isGettingLocation = false,
  onLocationSelect,
}: CustomLocationSearchProps) {
  const form = useFormContext();
  const { isSubmitting } = form.formState;
  const {
    t,
    i18n: { language: locale },
  } = useTranslation();
  const placesLibrary = useMapsLibrary('places');
  const isLoading = !placesLibrary || isGettingLocation;

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setPredictions([]);
  }, []);

  useEffect(() => {
    if (!placesLibrary) return;

    if (!autocompleteServiceRef.current) {
      autocompleteServiceRef.current = new placesLibrary.AutocompleteService();
    }
    if (!placesServiceRef.current) {
      const dummy = document.createElement('div');
      placesServiceRef.current = new placesLibrary.PlacesService(dummy);
    }
  }, [placesLibrary]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  // We removed form.watch to prevent premature dropdown closing.

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    const val = event.target.value;
    setInputValue(val);
    field.onChange(val); // Update form field as user types

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!placesLibrary || !autocompleteServiceRef.current) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    if (!val.trim()) {
      setPredictions([]);
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      if (!autocompleteServiceRef.current) {
        setIsSearching(false);
        return;
      }

      autocompleteServiceRef.current.getPlacePredictions(
        { input: val, language: locale === 'ar' ? 'ar' : 'en' },
        (preds, status) => {
          setIsSearching(false);

          if (status !== google.maps.places.PlacesServiceStatus.OK) {
            setPredictions([]);
            setIsOpen(false);
            return;
          }

          if (preds && preds.length > 0) {
            setPredictions(preds);
            setIsOpen(true);
          } else {
            setPredictions([]);
            setIsOpen(true);
          }
        },
      );
    }, 300);
  };

  const handleSelectPrediction = (
    p: google.maps.places.AutocompletePrediction,
    field: ControllerRenderProps<FieldValues, string>,
  ) => {
    if (!placesLibrary || !placesServiceRef.current) return;

    if (!placesServiceRef.current) {
      return;
    }

    placesServiceRef.current.getDetails(
      {
        placeId: p.place_id,
        fields: ['geometry', 'formatted_address', 'name', 'address_components'],
        language: locale === 'ar' ? 'ar' : 'en',
      },
      (place, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !place?.geometry) {
          setPredictions([]);
          return;
        }

        // Check if location exists and has valid methods
        const location = place.geometry.location;
        if (!location) {
          setPredictions([]);
          return;
        }

        try {
          // Handle both function and direct property access
          const lat = typeof location.lat === 'function' ? location.lat() : location.lat;
          const lng = typeof location.lng === 'function' ? location.lng() : location.lng;

          if (typeof lat !== 'number' || typeof lng !== 'number') {
            setPredictions([]);
            return;
          }

          const locationData: LocationData = {
            address: p.description,
            lat: lat,
            lng: lng,
            placeId: p.place_id,
            formattedAddress: place.formatted_address || p.description,
            name: place.name || p.description.split(',')[0],
          };

          if (onLocationSelect) {
            field.onChange(locationData.address);
            onLocationSelect(locationData);
          } else {
            field.onChange(locationData);
          }

          setInputValue(p.description);
          closeDropdown();
        } catch (error) {
          setPredictions([]);
        }
      },
    );
  };

  if (isLoading) {
    return (
      <FieldLayout
        control={form.control}
        name={fieldName}
        label={label}
        subLabel={subLable}
        optional={optional}
        required={!optional}
        className={formItemClassName}
      >
        <Input
          placeholder={t('common.loading')}
          disabled={true}
          className={cn(
            'h-12 rounded-md border-neutral-100 p-4 text-neutral-900 ring-neutral-900 transition-all placeholder:text-neutral-400',
            className,
          )}
        />
      </FieldLayout>
    );
  }

  return (
    <FieldLayout
      control={form.control}
      name={fieldName}
      label={label}
      subLabel={subLable}
      className={formItemClassName}
    >
      {(field, fieldState) => {
        const shouldDisplayError =
          fieldState.error &&
          (fieldState.isDirty || fieldState.isTouched || form.formState.isSubmitted);

        const displayValue =
          inputValue !== ''
            ? inputValue
            : typeof field.value === 'string'
              ? field.value
              : (field.value?.address ?? '');
        const hasValue = displayValue.length > 0;

        return (
          <div
            ref={containerRef}
            className='relative w-full'
          >
            <div className='relative'>
              <Search className='absolute inset-s-4 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition-colors' />

              <Input
                placeholder={placeholder}
                disabled={isSubmitting || disabled}
                className={cn(
                  'h-12 rounded-md border-neutral-100 p-4 ps-10! pe-10! text-neutral-900 ring-neutral-900 transition-all placeholder:text-neutral-400',
                  {
                    'border-error-500 ring-error-500': shouldDisplayError,
                  },
                  className,
                )}
                value={displayValue}
                onChange={(e) => handleInputChange(e, field)}
                onFocus={() => {
                  if (predictions.length > 0) setIsOpen(true);
                }}
              />
              {isSearching ? (
                <Loader2 className='text-primary-500 absolute top-1/2 right-4 size-4 -translate-y-1/2 animate-spin' />
              ) : hasValue && !disabled && !isSubmitting ? (
                <button
                  type='button'
                  className='absolute top-1/2 right-4 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700'
                  onClick={() => {
                    setInputValue('');
                    field.onChange('');
                    closeDropdown();
                  }}
                >
                  <X className='size-3.5' />
                </button>
              ) : null}
            </div>

            {placesLibrary && isOpen && (
              <div className='animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 absolute top-full z-50 mt-1.5 w-full'>
                <div className='overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg'>
                  {isSearching && predictions.length === 0 ? (
                    <div className='flex items-center justify-center gap-2 px-4 py-6 text-sm text-neutral-500'>
                      <Loader2 className='size-4 animate-spin' />
                      <span>Searching Locations</span>
                    </div>
                  ) : predictions.length > 0 ? (
                    <div className='max-h-64 overflow-y-auto'>
                      <div className='py-1.5'>
                        {predictions.map((p, index) => {
                          const mainText =
                            p.structured_formatting?.main_text || p.description.split(',')[0];
                          const secondaryText =
                            p.structured_formatting?.secondary_text ||
                            p.description.split(',').slice(1).join(',').trim();

                          return (
                            <button
                              key={p.place_id}
                              type='button'
                              className={cn(
                                'flex w-full items-start gap-3 px-3.5 py-2.5 text-left transition-colors duration-150',
                                'hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none',
                                index !== predictions.length - 1 && 'border-b border-neutral-100',
                              )}
                              onClick={() => handleSelectPrediction(p, field)}
                            >
                              <div className='bg-primary-500/10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md'>
                                <MapPin className='text-primary-500 size-4' />
                              </div>
                              <div className='min-w-0 flex-1'>
                                <p className='truncate text-sm font-medium text-neutral-900'>
                                  {mainText}
                                </p>
                                {secondaryText && (
                                  <p className='mt-0.5 truncate text-xs text-neutral-500'>
                                    {secondaryText}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col items-center gap-1.5 px-4 py-6 text-center'>
                      <Search className='size-5 text-neutral-500' />
                      <p className='text-sm text-neutral-500'>no Locations Found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }}
    </FieldLayout>
  );
}

export default function CustomLocationSearchWrapper(props: CustomLocationSearchProps) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''}>
      <CustomLocationSearch {...props} />
    </APIProvider>
  );
}
