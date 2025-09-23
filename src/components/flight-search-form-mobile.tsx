"use client"

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { ArrowLeftRight, Calendar as CalendarIcon, Search, Users, Plus, X } from 'lucide-react'
import {
  searchAirportsGrouped,
  GroupedSearchResult,
  Airport,
  getNearbyAirports,
  debounce,
  formatAirportName,
} from '@/lib/utils'
import { motion } from 'framer-motion'
import { Coordinates } from '../app/page';
import HighlightedText from './ui/highlighted-text';
import { useRouter } from 'next/navigation';

// Remove duplicate City interface - using Airport from utils instead

interface FlightSearchFormMobileProps {
  fromInput: string;
  setFromInput: React.Dispatch<React.SetStateAction<string>>;
  toInput: string;
  setToInput: React.Dispatch<React.SetStateAction<string>>;
  fromSelection: Airport | null;
  setFromSelection: React.Dispatch<React.SetStateAction<Airport | null>>;
  toSelection: Airport | null;
  setToSelection: React.Dispatch<React.SetStateAction<Airport | null>>;
  tripType: string;
  setTripType: React.Dispatch<React.SetStateAction<string>>;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  setPassengers: React.Dispatch<React.SetStateAction<{
    adults: number;
    children: number;
    infants: number;
  }>>;
  departureDate: Date | null;
  setDepartureDate: React.Dispatch<React.SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: React.Dispatch<React.SetStateAction<Date | null>>;
  multiSegments: { from: string; to: string; date: Date | null; fromSelection: Airport | null; toSelection: Airport | null }[];
  setMultiSegments: React.Dispatch<React.SetStateAction<{ from: string; to: string; date: Date | null; fromSelection: Airport | null; toSelection: Airport | null }[]>>;
  multiPopovers: boolean[];
  setMultiPopovers: React.Dispatch<React.SetStateAction<boolean[]>>;
  multiFromSuggestions: GroupedSearchResult[][];
  setMultiFromSuggestions: React.Dispatch<React.SetStateAction<GroupedSearchResult[][]>>;
  multiToSuggestions: GroupedSearchResult[][];
  setMultiToSuggestions: React.Dispatch<React.SetStateAction<GroupedSearchResult[][]>>;
  multiShowFromSuggestions: boolean[];
  setMultiShowFromSuggestions: React.Dispatch<React.SetStateAction<boolean[]>>;
  multiShowToSuggestions: boolean[];
  setMultiShowToSuggestions: React.Dispatch<React.SetStateAction<boolean[]>>;
  coords: Coordinates | null;
}

// Calendar with scrollable months
const ScrollableCalendar: React.FC<{
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate: Date;
  departureFlash: boolean;
  onDepartureFlashEnd: () => void;
}> = ({ selectedDate, onDateSelect, minDate, departureFlash, onDepartureFlashEnd }) => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const generateMonths = () => {
    const months = []
    const startDate = new Date(minDate)
    startDate.setDate(1)
    
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(startDate)
      monthDate.setMonth(startDate.getMonth() + i)
      months.push(monthDate)
    }
    
    return months
  }
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Empty days at the beginning of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }
  
  const isDateDisabled = (date: Date) => {
    return date < minDate
  }

  useEffect(() => {
    if (departureFlash) {
      const timeout = setTimeout(() => {
        onDepartureFlashEnd();
      }, 500); // 500ms animation duration
      return () => clearTimeout(timeout);
    }
  }, [departureFlash, onDepartureFlashEnd]);
  
  return (
    <div className="max-h-[100vh] overflow-y-auto">
      {generateMonths().map((monthDate, monthIndex) => (
        <div key={monthIndex} className="mb-6">
          <h3 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 px-4">
            {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
          </h3>
          
          <div className="grid grid-cols-7 gap-1 px-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-poppins font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            
            {getDaysInMonth(monthDate).map((date, dayIndex) => (
              <div key={dayIndex} className="aspect-square">
                {date && (
                  <button
                    onClick={() => !isDateDisabled(date) && onDateSelect(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-lg font-poppins font-medium text-sm transition-all ${
                      isDateSelected(date)
                        ? 'bg-[#0ABAB5] text-white'
                        : isDateDisabled(date)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#0D2B29] hover:bg-[#F0FBFA] cursor-pointer'
                    } ${isDateSelected(date) && departureFlash ? 'animate-flash' : ''}`}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// BottomSheet component
const BottomSheet: React.FC<{ open: boolean, onClose: () => void, children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl shadow-lg w-full h-[85vh] p-4 animate-slide-up flex flex-col">
      <button className="absolute right-4 top-4 cursor-pointer" onClick={onClose}><X size={24} /></button>
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

const FlightSearchFormMobile: React.FC<FlightSearchFormMobileProps> = ({
  fromInput,
  setFromInput,
  toInput,
  setToInput,
  fromSelection,
  setFromSelection,
  toSelection,
  setToSelection,
  tripType,
  setTripType,
  selectedClass,
  setSelectedClass,
  passengers,
  setPassengers,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  multiSegments,
  setMultiSegments,
  multiPopovers,
  setMultiPopovers,
  multiFromSuggestions,
  setMultiFromSuggestions,
  multiToSuggestions,
  setMultiToSuggestions,
  multiShowFromSuggestions,
  setMultiShowFromSuggestions,
  multiShowToSuggestions,
  setMultiShowToSuggestions,
  coords,
}) => {
  const [fromSuggestions, setFromSuggestions] = useState<GroupedSearchResult[]>([])
  const [toSuggestions, setToSuggestions] = useState<GroupedSearchResult[]>([])
  
  // type OpenPopover = 'trip' | 'class' | 'passengers' | null
  // const [openPopover, setOpenPopover] = useState<OpenPopover>(null)
  const [activeModal, setActiveModal] = useState<'from' | 'to' | 'calendar' | 'multi-from' | 'multi-to' | 'multi-calendar' | null>(null)
  const [calendarMode, setCalendarMode] = useState<'departure' | 'return'>('departure')
  const [activeMultiIndex, setActiveMultiIndex] = useState<number>(0)
  const [departureFlash, setDepartureFlash] = useState(false)
  const [returnTabFlash, setReturnTabFlash] = useState(false)
  const [isSubmitting] = useState(false);
  const [submissionStatus] = useState<'success' | 'error' | null>(null);
  const [submissionMessage] = useState('');
  const [showNearby, setShowNearby] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const router = useRouter();

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string, type: 'from' | 'to') => {
        if (value.length > 1) {
          const filtered = searchAirportsGrouped(value, 10);
          if (type === 'from') {
            setFromSuggestions(filtered);
          } else {
            setToSuggestions(filtered);
          }
        } else {
          if (type === 'from') {
            setFromSuggestions([]);
          } else {
            setToSuggestions([]);
          }
        }
      }, 300),
    [setFromSuggestions, setToSuggestions]
  );

  useEffect(() => {
    if (coords && !fromInput && !toInput) {
      const nearby = getNearbyAirports(coords.latitude, coords.longitude, 5);
      setFromSuggestions(nearby.map((a: Airport) => ({ ...a, type: 'airport', id: a.code })));
      setShowNearby(true);
    } else {
      setShowNearby(false);
    }
  }, [coords, fromInput, toInput]);

  // Multi-city segments
  // const [multiSegments, setMultiSegments] = useState<{ from: string; to: string; date: Date | null; fromSelection: Airport | null; toSelection: Airport | null }[]>([])
  // const [multiPopovers, setMultiPopovers] = useState<boolean[]>([])
  // const [multiFromSuggestions, setMultiFromSuggestions] = useState<City[][]>([])
  // const [multiToSuggestions, setMultiToSuggestions] = useState<City[][]>([])
  // const [multiShowFromSuggestions, setMultiShowFromSuggestions] = useState<boolean[]>([])
  // const [multiShowToSuggestions, setMultiShowToSuggestions] = useState<boolean[]>([])
  
  // При выборе Multi-city сразу появляется одна доп. форма
  useEffect(() => {
    if (tripType === 'Multi-city' && multiSegments.length === 0) {
      setMultiSegments([{ from: '', to: '', date: null, fromSelection: null, toSelection: null }])
      setMultiPopovers([false])
      setMultiFromSuggestions([[]])
      setMultiToSuggestions([[]])
      setMultiShowFromSuggestions([false])
      setMultiShowToSuggestions([false])
    }
    if (tripType !== 'Multi-city' && multiSegments.length > 0) {
      setMultiSegments([])
      setMultiPopovers([])
      setMultiFromSuggestions([])
      setMultiToSuggestions([])
      setMultiShowFromSuggestions(shows => shows.map(() => false))
      setMultiShowToSuggestions(shows => shows.map(() => false))
    }
  }, [tripType, multiSegments.length])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Validation helpers for enabling Search button(s)
  const getTotalPassengers = () => passengers.adults + passengers.children + passengers.infants;
  const isMainFormComplete = !!fromSelection && !!toSelection && !!departureDate && (tripType !== 'Round Trip' || !!returnDate) && getTotalPassengers() >= 1 && !!selectedClass;
  const isMultiCityComplete = tripType !== 'Multi-city' || (
    !!fromSelection && !!toSelection && !!departureDate &&
    multiSegments.every(seg => !!seg.fromSelection && !!seg.toSelection && !!seg.date)
  );

  const handleSearch = async () => {
    let query;
    if (tripType === 'Multi-city') {
      // Include main form data as first segment
      const allSegments = [
        {
          fromSelection: fromSelection,
          toSelection: toSelection,
          date: departureDate
        },
        ...multiSegments
      ];
      
      const segments = allSegments.map(s => 
        `from=${s.fromSelection?.code}&to=${s.toSelection?.code}&departureDate=${s.date ? `${s.date.getFullYear()}-${String(s.date.getMonth() + 1).padStart(2, '0')}-${String(s.date.getDate()).padStart(2, '0')}` : ''}`
      ).join('&');
      query = new URLSearchParams(segments);
      query.set('tripType', tripType);
      query.set('passengers', (passengers.adults + passengers.children + passengers.infants).toString());
      query.set('adults', passengers.adults.toString());
      query.set('children', passengers.children.toString());
      query.set('infants', passengers.infants.toString());
      query.set('class', selectedClass);
    } else {
      const totalPassengers = passengers.adults + passengers.children + passengers.infants;
      query = new URLSearchParams({
        from: fromSelection?.code || '',
        to: toSelection?.code || '',
        departureDate: departureDate ? `${departureDate.getFullYear()}-${String(departureDate.getMonth() + 1).padStart(2, '0')}-${String(departureDate.getDate()).padStart(2, '0')}` : '',
        tripType: tripType,
        passengers: totalPassengers.toString(),
        adults: passengers.adults.toString(),
        children: passengers.children.toString(),
        infants: passengers.infants.toString(),
        class: selectedClass,
      });

      if (tripType === 'Round Trip' && returnDate) {
        query.set('returnDate', `${returnDate.getFullYear()}-${String(returnDate.getMonth() + 1).padStart(2, '0')}-${String(returnDate.getDate()).padStart(2, '0')}`);
      }
    }

    router.push(`/searching?${query.toString()}`);
  };

  const handleCitySelect = (result: GroupedSearchResult | Airport, type: 'from' | 'to') => {
    const isAirport = (r: GroupedSearchResult | Airport): r is Airport => 'code' in r;
    const airportToSet = isAirport(result) ? result : result.airports![0];
    const airportDisplayName = formatAirportName(airportToSet.name);

    if (type === 'from') {
        setFromInput(airportDisplayName);
        setFromSelection(airportToSet);
    } else {
        setToInput(airportDisplayName);
        setToSelection(airportToSet);
    }
    setCitySheetOpen(false);
  };

  const handleFromInputChange = (value: string) => {
    setFromInput(value)
    setFromSelection(null)
    debouncedSearch(value, 'from');
  }

  const handleToInputChange = (value: string) => {
    setToInput(value)
    setToSelection(null)
    debouncedSearch(value, 'to');
  }

  const handleSwapCities = () => {
    const tempInput = fromInput
    const tempSelection = fromSelection
    setFromInput(toInput)
    setFromSelection(toSelection)
    setToInput(tempInput)
    setToSelection(tempSelection)
  }

  const handleMultiFromInputChange = (idx: number, value: string) => {
    const newSegments = [...multiSegments]
    newSegments[idx] = { ...newSegments[idx], from: value, fromSelection: null }
    setMultiSegments(newSegments)
    
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value, 10)
      const newSuggestions = [...multiFromSuggestions]
      newSuggestions[idx] = filtered
      setMultiFromSuggestions(newSuggestions)
    } else {
      const newSuggestions = [...multiFromSuggestions]
      newSuggestions[idx] = []
      setMultiFromSuggestions(newSuggestions)
    }
  }

  const handleMultiToInputChange = (idx: number, value: string) => {
    const newSegments = [...multiSegments]
    newSegments[idx] = { ...newSegments[idx], to: value, toSelection: null }
    setMultiSegments(newSegments)
    
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value, 10)
      const newSuggestions = [...multiToSuggestions]
      newSuggestions[idx] = filtered
      setMultiToSuggestions(newSuggestions)
    } else {
      const newSuggestions = [...multiToSuggestions]
      newSuggestions[idx] = []
      setMultiToSuggestions(newSuggestions)
    }
  }

  const handleMultiCitySelect = (idx: number, result: GroupedSearchResult | Airport, type: 'from' | 'to') => {
    const isAirport = (r: GroupedSearchResult | Airport): r is Airport => 'code' in r;
    const airportToSet = isAirport(result) ? result : result.airports![0];
    const airportDisplayName = formatAirportName(airportToSet.name);
    
    setMultiSegments(prev => {
      const newSegments = [...prev];
      if (type === 'from') {
        newSegments[idx].from = airportDisplayName;
        newSegments[idx].fromSelection = airportToSet;
      } else {
        newSegments[idx].to = airportDisplayName;
        newSegments[idx].toSelection = airportToSet;
      }
      return newSegments;
    });

    setMultiCityModalOpen(false);
    setActiveMultiIndex(0); // Reset after selection
  };

  const handleAddSegment = () => {
    setMultiSegments([...multiSegments, { from: '', to: '', date: null, fromSelection: null, toSelection: null }]);
    setMultiPopovers([...multiPopovers, false]);
    setMultiFromSuggestions([...multiFromSuggestions, []]);
    setMultiToSuggestions([...multiToSuggestions, []]);
    setMultiShowFromSuggestions([...multiShowFromSuggestions, false]);
    setMultiShowToSuggestions([...multiShowToSuggestions, false]);
  }

  const handleRemoveSegment = (idx: number) => {
    if (multiSegments.length === 1) {
      setTripType('One-way')
      setMultiSegments([])
      setMultiPopovers([])
      setMultiFromSuggestions([])
      setMultiToSuggestions([])
      setMultiShowFromSuggestions([])
      setMultiShowToSuggestions([])
    } else {
      setMultiSegments(segs => segs.filter((_, i) => i !== idx))
      setMultiPopovers(pops => pops.filter((_, i) => i !== idx))
      setMultiFromSuggestions(suggs => suggs.filter((_, i) => i !== idx))
      setMultiToSuggestions(suggs => suggs.filter((_, i) => i !== idx))
      setMultiShowFromSuggestions(shows => shows.filter((_, i) => i !== idx))
      setMultiShowToSuggestions(shows => shows.filter((_, i) => i !== idx))
    }
  }

  const handleClearAll = () => {
    setFromInput('')
    setToInput('')
    setFromSelection(null)
    setToSelection(null)
    setDepartureDate(null)
    setReturnDate(null)
    setMultiSegments([{ from: '', to: '', date: null, fromSelection: null, toSelection: null }])
    setMultiPopovers([])
    setMultiFromSuggestions([[]])
    setMultiToSuggestions([[]])
    setMultiShowFromSuggestions([false])
    setMultiShowToSuggestions([false])
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container') && !target.closest('.calendar-container')) {
        // setOpenPopover(null)
        setMultiPopovers(pops => pops.map(() => false))
      }
      if (!target.closest('.autocomplete-container')) {
        // Remove unused calls
        setMultiShowFromSuggestions(shows => shows.map(() => false))
        setMultiShowToSuggestions(shows => shows.map(() => false))
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updatePassengerCount = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
    setPassengers(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
      return { ...prev, [type]: newCount }
    })
  }

  const [openSheet, setOpenSheet] = useState<null | 'passengers'>(null)

  // Для анимации departure date:
  // const [departureFlash, setDepartureFlash] = useState(false)
  // const [returnTabFlash, setReturnTabFlash] = useState(false)

  useEffect(() => {
    if (returnTabFlash) {
      const timeout = setTimeout(() => setReturnTabFlash(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [returnTabFlash])

  // 1. Добавляю состояния:
  const [cityTab, setCityTab] = useState<'from' | 'to'>('from')
  const [citySheetOpen, setCitySheetOpen] = useState(false)

  // 1. Состояния:
  const [multiCityTab, setMultiCityTab] = useState<'from' | 'to'>('from')
  const [multiCityModalOpen, setMultiCityModalOpen] = useState(false)
  const [multiCityActiveIndex, setMultiCityActiveIndex] = useState<number>(0)

  const handleKeyDown = (e: React.KeyboardEvent, type: 'from' | 'to') => {
    const suggestions = type === 'from' ? fromSuggestions : toSuggestions;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && focusedIndex > -1) {
      e.preventDefault();
      const selected = suggestions[focusedIndex];
      if (selected.type === 'city') {
        handleCitySelect(selected.airports![0], type)
      } else {
        handleCitySelect(selected, type);
      }
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-0">
      {/* Trip Type Selection */}
      <div className="flex justify-center mb-4" style={{ zIndex: 10, pointerEvents: 'auto' }}>
        <div className="bg-white rounded-full p-1 ring-1 ring-gray-200 relative" style={{ zIndex: 15, pointerEvents: 'auto' }}>
          <div className="flex relative">
            {['Round Trip', 'One-way', 'Multi-city'].map((type) => {
              const isSelected = type === tripType;
              
              return (
                <button
                   key={type}
                   onClick={() => setTripType(type)}
                   className={`relative px-4 py-2 font-poppins font-medium text-xs transition-colors duration-200 cursor-pointer flex-1 whitespace-nowrap ${
                     isSelected 
                       ? 'text-white' 
                       : 'text-[#0D2B29] hover:text-[#0ABAB5]'
                   }`}
                   style={{ pointerEvents: 'auto', zIndex: 20, touchAction: 'manipulation' }}
                   tabIndex={0}
                 >
                   {isSelected && (
                     <motion.div
                       layoutId="activeTabMobile"
                       className="absolute inset-0 bg-[#0ABAB5] rounded-full"
                       style={{ pointerEvents: 'none' }}
                       initial={{ opacity: 1 }}
                       animate={{ opacity: 1 }}
                       transition={{
                         type: "spring",
                         stiffness: 300,
                         damping: 30
                       }}
                     />
                   )}
                   <span className="relative z-10">{type}</span>
                 </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden autocomplete-container">
        {/* From */}
        <div className="px-4 py-4 border-b border-gray-100" onClick={() => { setCityTab('from'); setCitySheetOpen(true) }}>
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="text-[#0ABAB5]" style={{width: '16px'}} />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
              <div className="font-poppins text-sm text-[#0D2B29]" title={fromSelection?.name}>
                {fromSelection ? formatAirportName(fromSelection.name) : fromInput || 'Flying from?'}
              </div>
            </div>
            {fromSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                {fromSelection.code}
              </div>
            )}
            {(fromInput || fromSelection) && (
              <button
                onClick={(e) => { e.stopPropagation(); setFromInput(''); setFromSelection(null); setFromSuggestions([]); }}
                className="ml-1 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Clear from"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="relative">
          <button
            onClick={handleSwapCities}
            className="absolute right-4 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors rotate-90" />
          </button>
        </div>

        {/* To */}
        <div className="px-4 py-4 border-b border-gray-100" onClick={() => { setCityTab('to'); setCitySheetOpen(true) }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="text-[#0ABAB5]" style={{width: '16px'}} />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
              <div className="font-poppins text-sm text-[#0D2B29]" title={toSelection?.name}>
                {toSelection ? formatAirportName(toSelection.name) : toInput || 'Where are you flying?'}
              </div>
            </div>
            {toSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                {toSelection.code}
              </div>
            )}
            {(toInput || toSelection) && (
              <button
                onClick={(e) => { e.stopPropagation(); setToInput(''); setToSelection(null); setToSuggestions([]); }}
                className="ml-1 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                aria-label="Clear to"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex border-b border-gray-100">
          {/* Departure */}
          <div className={`${tripType === 'Round Trip' ? 'w-1/2' : 'w-full'} calendar-container`}>
            <div 
              className="px-4 py-4 cursor-pointer border-r border-gray-100"
              onClick={() => {
                setCalendarMode('departure')
                setActiveModal('calendar')
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                  <CalendarIcon size={16} className="text-[#0ABAB5]" />
                </div>
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                  <div className={`font-poppins text-sm ${departureDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                    {departureDate ? formatDate(departureDate) : 'Select Date'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Return - только для Round Trip */}
            {tripType === 'Round Trip' && (
            <div className="w-1/2 calendar-container">
              <div 
                className="px-4 py-4 cursor-pointer"
                onClick={() => {
                  setCalendarMode('return')
                  setActiveModal('calendar')
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">RETURN</div>
                    <div className={`font-poppins text-sm ${returnDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                      {returnDate ? formatDate(returnDate) : '+ Add return'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Passengers */}
        <div className="px-4 py-4 cursor-pointer border-b border-gray-100" onClick={() => setOpenSheet('passengers')}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <Users size={16} className="text-[#0ABAB5]" />
            </div>
              <div className="flex-1">
                <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">
                  {passengers.adults + passengers.children + passengers.infants} {passengers.adults + passengers.children + passengers.infants === 1 ? 'Passenger' : 'Passengers'}
                </div>
                <div className="font-poppins text-base text-gray-500">
                  {(selectedClass || '').replace(' class', '')}
                </div>
              </div>
          </div>
        </div>
      </div>

      {/* Multi-city дополнительные формы */}
      {tripType === 'Multi-city' && (
        <div className="mt-4 space-y-4">
          {multiSegments.map((segment, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl shadow-lg p-4">
              <button
                onClick={() => handleRemoveSegment(idx)}
                className="absolute -top-3 right-0 w-7 h-7 p-0 bg-red-500 text-white rounded-full flex items-center justify-center text-base hover:bg-red-600 transition-colors cursor-pointer z-20 shadow-md"
                aria-label="Remove segment"
              >
                <X size={16} />
              </button>
              
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setMultiCityTab('from')
                  setMultiCityActiveIndex(idx)
                  setMultiCityModalOpen(true)
                }}
              >
                <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="text-[#0ABAB5]" style={{width: '16px'}} />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
                  <div className="font-poppins text-sm text-[#0D2B29]" title={segment.fromSelection?.name}>
                    {segment.fromSelection ? formatAirportName(segment.fromSelection.name) : segment.from || 'Flying from?'}
                  </div>
                </div>
                {segment.fromSelection && (
                  <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                    {segment.fromSelection.code}
                  </div>
                )}
              </div>
              
              <div 
                className="flex items-center gap-3 mb-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setMultiCityTab('to')
                  setMultiCityActiveIndex(idx)
                  setMultiCityModalOpen(true)
                }}
              >
                <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="text-[#0ABAB5]" style={{width: '16px'}} />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
                  <div className="font-poppins text-sm text-[#0D2B29]" title={segment.toSelection?.name}>
                    {segment.toSelection ? formatAirportName(segment.toSelection.name) : segment.to || 'Where are you flying?'}
                  </div>
                </div>
                {segment.toSelection && (
                  <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                    {segment.toSelection.code}
                  </div>
                )}
              </div>
              
              <div 
                className="flex items-center gap-3 cursor-pointer p-2 -m-2 rounded-lg hover:bg-[#F0FBFA]"
                onClick={() => {
                  setActiveMultiIndex(idx)
                  setActiveModal('multi-calendar')
                }}
              >
                <CalendarIcon size={16} className="text-[#0ABAB5]" />
                <div className="flex-1">
                  <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                  <div className={`font-poppins text-sm ${segment.date ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                    {segment.date ? formatDate(segment.date) : 'Select Date'}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Кнопки для Multi-city */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex w-full gap-3 justify-center">
              <button
                onClick={handleAddSegment}
                className="h-12 px-6 bg-white border border-gray-300 text-[#0D2B29] font-poppins font-semibold text-base rounded-full hover:border-[#0ABAB5] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} />
                Add a Flight
              </button>
              <button
                onClick={handleClearAll}
                className="h-12 px-6 bg-white border border-gray-300 text-[#0D2B29] font-poppins font-semibold text-base rounded-full hover:border-[#0ABAB5] transition-colors cursor-pointer"
              >
                Clear All
              </button>
            </div>
            

            
            <button 
              onClick={handleSearch}
              disabled={isSubmitting || !isMultiCityComplete}
              className="h-12 w-full mt-2 bg-[#EC5E39] text-white font-poppins font-semibold text-base rounded-full hover:bg-opacity-90 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={18} />
              {isSubmitting ? 'Sending...' : 'SEARCH FLIGHTS'}
            </button>
          </div>
        </div>
      )}



      {/* Search Button - для One-way и Round Trip */}
      {tripType !== 'Multi-city' && (
        <button 
          onClick={handleSearch}
          disabled={isSubmitting || !isMainFormComplete}
          className="w-full bg-[#EC5E39] text-white font-poppins font-bold text-lg py-4 rounded-2xl hover:bg-opacity-90 transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search size={18} />
          {isSubmitting ? 'Sending...' : 'SEARCH'}
        </button>
      )}

      {/* Modal для Calendar */}
      {activeModal === 'calendar' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Date</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Date Type Selector */}
          {tripType === 'Round Trip' && (
            <div className="flex border-b relative h-14">
              <button
                onClick={() => setCalendarMode('departure')}
                className={`flex-1 h-full font-poppins z-10 transition-colors duration-200 ${calendarMode === 'departure' ? 'text-white' : 'text-gray-600'}`}
                style={{ position: 'relative', paddingTop: 0, paddingBottom: 0 }}
              >
                <div className="py-3 flex flex-col items-center justify-center">
                  <span className={`text-xs font-medium ${departureDate ? (calendarMode === 'departure' ? 'opacity-80' : 'opacity-70') : 'font-semibold text-sm'}`}>Departure Date</span>
                  <span className={`text-sm font-semibold mt-1 ${calendarMode === 'departure' ? 'opacity-100' : 'opacity-90'}`}>
                    {departureDate ? formatDate(departureDate) : 'Select date'}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setCalendarMode('return')}
                className={`flex-1 h-full font-poppins z-10 transition-colors duration-200 ${calendarMode === 'return' ? 'text-white' : 'text-gray-600'}`}
                style={{ position: 'relative', paddingTop: 0, paddingBottom: 0 }}
              >
                <div className="py-3 flex flex-col items-center justify-center">
                  <span className={`text-xs font-medium ${returnDate ? (calendarMode === 'return' ? 'opacity-80' : 'opacity-70') : 'font-semibold text-sm'}`}>Return Date</span>
                  <span className={`text-sm font-semibold mt-1 ${calendarMode === 'return' ? 'opacity-100' : 'opacity-90'}`}>
                    {returnDate ? formatDate(returnDate) : 'Select date'}
                  </span>
                </div>
              </button>
              <motion.div
                layout
                className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
                animate={{ x: calendarMode === 'return' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ zIndex: 1 }}
              />
            </div>
          )}
          
          {/* Calendar */}
          <div className="flex-1 p-4">
            <ScrollableCalendar
              selectedDate={calendarMode === 'departure' ? departureDate : returnDate}
              onDateSelect={(date) => {
                if (calendarMode === 'departure') {
                  setDepartureDate(date)
                  
                  // For Multi-city: validate and clear subsequent segments if their dates become invalid
                  if (tripType === 'Multi-city') {
                    const updatedSegments = multiSegments.map((segment, index) => {
                      const minDateForSegment = new Date(date)
                      minDateForSegment.setDate(minDateForSegment.getDate() + index + 1)
                      
                      if (segment.date && segment.date < minDateForSegment) {
                        return { ...segment, date: null }
                      }
                      return segment
                    })
                    setMultiSegments(updatedSegments)
                    setActiveModal(null) // Close calendar immediately for Multi-city
                  } else if (tripType === 'Round Trip') {
                     // For Round Trip: continue to return date selection
                     setReturnTabFlash(true)
                     setCalendarMode('return')
                     setActiveModal('calendar')
                   } else {
                     // For One Way: close calendar immediately
                     setActiveModal(null)
                   }
                } else {
                  setReturnDate(date)
                  setActiveModal(null)
                }
              }}
              minDate={(calendarMode === 'departure') ? new Date() : (() => {
                const today = new Date();
                today.setHours(0,0,0,0);
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                if (departureDate) {
                  const dep = new Date(departureDate);
                  dep.setHours(0,0,0,0);
                  return dep.getTime() <= today.getTime() ? tomorrow : dep;
                }
                return tomorrow;
              })()}
              departureFlash={departureFlash}
              onDepartureFlashEnd={() => setDepartureFlash(false)}
            />
          </div>
        </div>
      )}

      {/* Modal для Multi-city From */}
      {activeModal === 'multi-from' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">From</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                value={multiSegments[activeMultiIndex]?.from || ''}
                onChange={(e) => handleMultiFromInputChange(activeMultiIndex, e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base pr-8"
                autoFocus
              />
              {multiSegments[activeMultiIndex]?.from && (
                <button
                  onClick={() => handleMultiFromInputChange(activeMultiIndex, '')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {multiFromSuggestions[activeMultiIndex]?.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4">
              {multiFromSuggestions[activeMultiIndex].map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(activeMultiIndex, city, 'from')
                    setActiveModal(null)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(city.name)} highlight={multiSegments[activeMultiIndex]?.from || ''} /></div>
                        <div className="font-poppins text-sm text-gray-500"><HighlightedText text={city.country} highlight={multiSegments[activeMultiIndex]?.from || ''} /></div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal для Multi-city To */}
      {activeModal === 'multi-to' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">To</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                value={multiSegments[activeMultiIndex]?.to || ''}
                onChange={(e) => handleMultiToInputChange(activeMultiIndex, e.target.value)}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base pr-8"
                autoFocus
              />
              {multiSegments[activeMultiIndex]?.to && (
                <button
                  onClick={() => handleMultiToInputChange(activeMultiIndex, '')}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {multiToSuggestions[activeMultiIndex]?.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4">
              {multiToSuggestions[activeMultiIndex].map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleMultiCitySelect(activeMultiIndex, city, 'to')
                    setActiveModal(null)
                  }}
                  className="w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                      <div>
                        <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(city.name)} highlight={multiSegments[activeMultiIndex]?.to || ''} /></div>
                        <div className="font-poppins text-sm text-gray-500"><HighlightedText text={city.country} highlight={multiSegments[activeMultiIndex]?.to || ''} /></div>
                      </div>
                    </div>
                    <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                      {city.code}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal для Multi-city Calendar */}
      {activeModal === 'multi-calendar' && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Date</h2>
            <button onClick={() => setActiveModal(null)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          
          {/* Calendar */}
          <div className="flex-1 p-4">
            <ScrollableCalendar
              selectedDate={multiSegments[activeMultiIndex]?.date || null}
              onDateSelect={(date) => {
                const newSegments = [...multiSegments]
                newSegments[activeMultiIndex] = { ...newSegments[activeMultiIndex], date }
                
                // Validate and clear subsequent segments if their dates become invalid
                for (let i = activeMultiIndex + 1; i < newSegments.length; i++) {
                  const nextSegment = newSegments[i]
                  if (nextSegment.date) {
                    const minDateForNext = new Date(date)
                    minDateForNext.setDate(minDateForNext.getDate() + (i - activeMultiIndex))
                    
                    if (nextSegment.date < minDateForNext) {
                      newSegments[i] = { ...nextSegment, date: null }
                    }
                  }
                }
                
                setMultiSegments(newSegments)
                setActiveModal(null)
              }}
              minDate={(() => {
                // Calculate minimum date for this segment
                let minDate = new Date()
                
                if (activeMultiIndex === 0) {
                  // First multi-city segment: minimum date is the day after main departure date
                  if (departureDate) {
                    minDate = new Date(departureDate)
                    minDate.setDate(minDate.getDate() + 1)
                  }
                } else {
                  // Subsequent segments: minimum date is the day after previous segment's date
                  const prevSegment = multiSegments[activeMultiIndex - 1]
                  if (prevSegment.date) {
                    minDate = new Date(prevSegment.date)
                    minDate.setDate(minDate.getDate() + 1)
                  } else if (departureDate) {
                    // If previous segment has no date, use main departure date + days
                    minDate = new Date(departureDate)
                    minDate.setDate(minDate.getDate() + activeMultiIndex + 1)
                  }
                }
                
                return minDate
              })()}
              departureFlash={departureFlash}
              onDepartureFlashEnd={() => setDepartureFlash(false)}
            />
          </div>
        </div>
      )}





      {/* BottomSheet для Passengers */}
      <BottomSheet open={openSheet === 'passengers'} onClose={() => setOpenSheet(null)}>
        <h2 className="font-poppins font-semibold text-lg text-[#0D2B29] mb-4 text-center">Passengers</h2>
        <div className="flex flex-col gap-3">
          {/* Adults */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-poppins font-medium text-[#0D2B29]">Adults</div>
              <div className="font-poppins text-xs text-gray-500">12+ years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('adults', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.adults <= 1}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.adults}</span>
              <button
                onClick={() => updatePassengerCount('adults', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-poppins font-medium text-[#0D2B29]">Children</div>
              <div className="font-poppins text-xs text-gray-500">2-11 years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('children', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.children <= 0}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.children}</span>
              <button
                onClick={() => updatePassengerCount('children', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
          {/* Infants */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-poppins font-medium text-[#0D2B29]">Lap Infants</div>
              <div className="font-poppins text-xs text-gray-500">under 2 years</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updatePassengerCount('infants', false)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                disabled={passengers.infants <= 0}
                tabIndex={0}
              >
                −
              </button>
              <span className="w-8 text-center font-poppins font-medium">{passengers.infants}</span>
              <button
                onClick={() => updatePassengerCount('infants', true)}
                className="w-12 h-12 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer text-lg"
                tabIndex={0}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Service Class */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-poppins font-medium text-[#0D2B29] mb-3">Service Class</h3>
            <div className="flex flex-col gap-2">
              {['Business class', 'First class'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`flight-class-pointer w-full px-4 py-3 text-left rounded-xl font-poppins text-[#0D2B29] text-base transition-colors ${
                    selectedClass === cls 
                      ? 'bg-[#0ABAB5] text-white' 
                      : 'bg-gray-50 hover:bg-[#F0FBFA]'
                  }`}
                  style={{cursor: 'pointer !important'}}
                  tabIndex={0}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>
          
          {/* Done Button */}
          <div className="mt-6 pt-4">
            <button
              onClick={() => setOpenSheet(null)}
              className="w-full bg-[#ec5e39] text-white font-poppins font-semibold py-4 rounded-xl hover:bg-[#d54d2a] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* BottomSheet для From/Going to */}
      {citySheetOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Cities</h2>
            <button onClick={() => setCitySheetOpen(false)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex border-b relative h-14">
            <button
              onClick={() => setCityTab('from')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${cityTab === 'from' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">From</span>
            </button>
            <button
              onClick={() => setCityTab('to')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${cityTab === 'to' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">Going to</span>
            </button>
            <motion.div
              layout
              className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
              animate={{ x: cityTab === 'to' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="p-4">
            {cityTab === 'from' && (
              <div className="relative mb-4">
                <input
                  type="text"
                  value={fromInput}
                  onChange={e => handleFromInputChange(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, 'from')}
                  placeholder="City or airport"
                  className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base pr-8"
                  autoFocus
                />
                {fromInput && (
                  <button
                    onClick={() => {
                      setFromInput('');
                      setFromSelection(null);
                      setFromSuggestions([]);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    aria-label="Clear from input"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            {cityTab === 'to' && (
              <div className="relative mb-4">
                <input
                  type="text"
                  value={toInput}
                  onChange={e => handleToInputChange(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, 'to')}
                  placeholder="City or airport"
                  className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base pr-8"
                  autoFocus
                />
                {toInput && (
                  <button
                    onClick={() => {
                      setToInput('');
                      setToSelection(null);
                      setToSuggestions([]);
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    aria-label="Clear to input"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-0">
              {cityTab === 'from' && showNearby && fromSuggestions.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-600">Nearby airports</div>
              )}
              {cityTab === 'from' && fromInput.length > 1 && fromSuggestions.length === 0 && (
                <div className="p-4 text-center text-gray-500">No results found.</div>
              )}
              {cityTab === 'from' && fromSuggestions.map((result, idx) => (
                 <div key={result.id}>
                  {result.type === 'city' ? (
                    <>
                      {/* City header */}
                      <div 
                        className="px-4 py-2 bg-gray-50 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCitySelect(result, 'from')}
                      >
                        <Image src="/icons/footer/map-pin.svg" width={14} height={14} alt="city" className="mr-3 text-[#0ABAB5] h-auto w-auto" style={{width: '16px'}} />
                        <div>
                          <div className="font-poppins font-semibold text-[#0D2B29] text-sm"><HighlightedText text={formatAirportName(result.name)} highlight={fromInput}/></div>
                          <div className="font-poppins text-xs text-gray-500"><HighlightedText text={result.country} highlight={fromInput}/></div>
                        </div>
                      </div>
                      {/* Аэропорты в городе */}
                      {result.airports?.map((airport, airportIndex) => (
                        <button
                          key={`${result.id}-airport-${airportIndex}`}
                          onClick={() => handleCitySelect(airport, 'from')}
                          className={`w-full px-4 py-3 pl-8 text-left hover:bg-[#F0FBFA] cursor-pointer border-b border-gray-50 last:border-b-0 ${airportIndex === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                          tabIndex={0}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image src="/icons/airport-from.svg" width={14} height={14} alt="airport" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                              <div>
                                <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(airport.name)} highlight={fromInput}/></div>
                                <div className="font-poppins text-sm text-gray-500"><HighlightedText text={airport.country} highlight={fromInput}/></div>
                              </div>
                            </div>
                            <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                              {airport.code}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    /* Одиночный аэропорт */
                    <button
                      key={result.id}
                      onClick={() => handleCitySelect(result, 'from')}
                      className={`w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100 ${idx === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                          <div>
                            <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(result.name)} highlight={fromInput}/></div>
                            <div className="font-poppins text-sm text-gray-500"><HighlightedText text={`${result.city}, ${result.country}`} highlight={fromInput}/></div>
                          </div>
                        </div>
                        <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                          {result.code}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
              {cityTab === 'to' && toInput.length > 1 && toSuggestions.length === 0 && (
                <div className="p-4 text-center text-gray-500">No results found.</div>
              )}
              {cityTab === 'to' && toSuggestions.map((result, idx) => (
                 <div key={result.id}>
                  {result.type === 'city' ? (
                    <>
                      {/* Заголовок города */}
                      <div 
                        className="px-4 py-2 bg-gray-50 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleCitySelect(result, 'to')}
                      >
                        <Image src="/icons/footer/map-pin.svg" width={14} height={14} alt="city" className="mr-3 text-[#0ABAB5] h-auto w-auto" style={{width: '16px'}} />
                        <div>
                          <div className="font-poppins font-semibold text-[#0D2B29] text-sm"><HighlightedText text={formatAirportName(result.name)} highlight={toInput}/></div>
                          <div className="font-poppins text-xs text-gray-500"><HighlightedText text={result.country} highlight={toInput}/></div>
                        </div>
                      </div>
                      {/* Аэропорты в городе */}
                      {result.airports?.map((airport, airportIndex) => (
                        <button
                          key={`${result.id}-airport-${airportIndex}`}
                          onClick={() => handleCitySelect(airport, 'to')}
                          className={`w-full px-4 py-3 pl-8 text-left hover:bg-[#F0FBFA] cursor-pointer border-b border-gray-50 last:border-b-0 ${airportIndex === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                          tabIndex={0}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image src="/icons/airport-to.svg" width={14} height={14} alt="airport" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                              <div>
                                <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(airport.name)} highlight={toInput}/></div>
                                <div className="font-poppins text-sm text-gray-500"><HighlightedText text={airport.country} highlight={toInput}/></div>
                              </div>
                            </div>
                            <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                              {airport.code}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    /* Одиночный аэропорт */
                    <button
                      key={result.id}
                      onClick={() => handleCitySelect(result, 'to')}
                      className={`w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100 ${idx === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                          <div>
                            <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(result.name)} highlight={toInput}/></div>
                            <div className="font-poppins text-sm text-gray-500"><HighlightedText text={`${result.city}, ${result.country}`} highlight={toInput}/></div>
                          </div>
                        </div>
                        <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                          {result.code}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal для Multi-city Cities */}
      {multiCityModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-poppins font-semibold text-lg text-[#0D2B29]">Select Cities</h2>
            <button onClick={() => setMultiCityModalOpen(false)} className="p-2">
              <X size={24} className="text-gray-500" />
            </button>
          </div>
          <div className="flex border-b relative h-14">
            <button
              onClick={() => setMultiCityTab('from')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${multiCityTab === 'from' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">From</span>
            </button>
            <button
              onClick={() => setMultiCityTab('to')}
              className={`flex-1 h-full font-poppins font-medium z-10 transition-colors duration-200 ${multiCityTab === 'to' ? 'text-white' : 'text-gray-500'}`}
              style={{ position: 'relative' }}
            >
              <span className="py-4 block">Going to</span>
            </button>
            <motion.div
              layout
              className="absolute top-0 left-0 h-full w-1/2 rounded-md pointer-events-none"
              animate={{ x: multiCityTab === 'to' ? '100%' : '0%', backgroundColor: '#EC5E39' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ zIndex: 1 }}
            />
          </div>
          <div className="p-4">
            {multiCityTab === 'from' && (
              <input
                type="text"
                value={multiSegments[multiCityActiveIndex]?.from || ''}
                onChange={e => handleMultiFromInputChange(multiCityActiveIndex, e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'from')}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            {multiCityTab === 'to' && (
              <input
                type="text"
                value={multiSegments[multiCityActiveIndex]?.to || ''}
                onChange={e => handleMultiToInputChange(multiCityActiveIndex, e.target.value)}
                onKeyDown={e => handleKeyDown(e, 'to')}
                placeholder="City or airport"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base mb-4"
                autoFocus
              />
            )}
            <div className="flex-1 overflow-y-auto px-0">
              {multiCityTab === 'from' && multiFromSuggestions[multiCityActiveIndex]?.map((result, idx) => (
                <div key={result.id}>
                  {result.type === 'city' ? (
                    <>
                      {/* Заголовок города */}
                      <div 
                        className="px-4 py-2 bg-gray-50 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleMultiCitySelect(multiCityActiveIndex, result, 'from')}
                      >
                        <Image src="/icons/footer/map-pin.svg" width={14} height={14} alt="city" className="mr-3 text-[#0ABAB5] h-auto w-auto" style={{width: '16px'}} />
                        <div>
                          <div className="font-poppins font-semibold text-[#0D2B29] text-sm"><HighlightedText text={formatAirportName(result.name)} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                          <div className="font-poppins text-xs text-gray-500"><HighlightedText text={result.country} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                        </div>
                      </div>
                      {/* Аэропорты в городе */}
                      {result.airports?.map((airport, airportIndex) => (
                        <button
                          key={`${result.id}-airport-${airportIndex}`}
                          onClick={() => handleMultiCitySelect(multiCityActiveIndex, airport, 'from')}
                          className={`w-full px-4 py-3 pl-8 text-left hover:bg-[#F0FBFA] cursor-pointer border-b border-gray-50 last:border-b-0 ${airportIndex === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                          tabIndex={0}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image src="/icons/airport-from.svg" width={14} height={14} alt="airport" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                              <div>
                                <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(airport.name)} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                                <div className="font-poppins text-sm text-gray-500"><HighlightedText text={airport.country} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                              </div>
                            </div>
                            <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                              {airport.code}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    /* Одиночный аэропорт */
                    <button
                      key={result.id}
                      onClick={() => handleMultiCitySelect(multiCityActiveIndex, result, 'from')}
                      className={`w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100 ${idx === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                          <div>
                            <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(result.name)} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                            <div className="font-poppins text-sm text-gray-500"><HighlightedText text={`${result.city}, ${result.country}`} highlight={multiSegments[multiCityActiveIndex]?.from || ''} /></div>
                          </div>
                        </div>
                        <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                          {result.code}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
              {multiCityTab === 'to' && multiToSuggestions[multiCityActiveIndex]?.map((result, idx) => (
                 <div key={result.id}>
                  {result.type === 'city' ? (
                    <>
                      {/* Заголовок города */}
                      <div 
                        className="px-4 py-2 bg-gray-50 flex items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleMultiCitySelect(multiCityActiveIndex, result, 'to')}
                      >
                        <Image src="/icons/footer/map-pin.svg" width={14} height={14} alt="city" className="mr-3 text-[#0ABAB5] h-auto w-auto" style={{width: '16px'}} />
                        <div>
                          <div className="font-poppins font-semibold text-[#0D2B29] text-sm"><HighlightedText text={formatAirportName(result.name)} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                          <div className="font-poppins text-xs text-gray-500"><HighlightedText text={result.country} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                        </div>
                      </div>
                      {/* Аэропорты в городе */}
                      {result.airports?.map((airport, airportIndex) => (
                        <button
                          key={`${result.id}-airport-${airportIndex}`}
                          onClick={() => handleMultiCitySelect(multiCityActiveIndex, airport, 'to')}
                          className={`w-full px-4 py-3 pl-8 text-left hover:bg-[#F0FBFA] cursor-pointer border-b border-gray-50 last:border-b-0 ${airportIndex === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                          tabIndex={0}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Image src="/icons/airport-to.svg" width={14} height={14} alt="airport" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                              <div>
                                <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(airport.name)} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                                <div className="font-poppins text-sm text-gray-500"><HighlightedText text={airport.country} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                              </div>
                            </div>
                            <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                              {airport.code}
                            </div>
                          </div>
                        </button>
                      ))}
                    </>
                  ) : (
                    /* Одиночный аэропорт */
                    <button
                      key={result.id}
                      onClick={() => handleMultiCitySelect(multiCityActiveIndex, result, 'to')}
                      className={`w-full px-4 py-4 text-left hover:bg-[#F0FBFA] border-b border-gray-100 ${idx === focusedIndex ? 'bg-[#F0FBFA]' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                          <div>
                            <div className="font-poppins font-medium text-[#0D2B29]"><HighlightedText text={formatAirportName(result.name)} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                            <div className="font-poppins text-sm text-gray-500"><HighlightedText text={`${result.city}, ${result.country}`} highlight={multiSegments[multiCityActiveIndex]?.to || ''} /></div>
                          </div>
                        </div>
                        <div className="bg-[#0ABAB5] text-white font-bold text-xs rounded-lg px-2 py-1">
                          {result.code}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Submission Status Messages */}
      {submissionStatus && (
        <div className={`mt-4 text-center p-3 rounded-lg ${submissionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submissionMessage}
        </div>
      )}
    </div>
  )
}

export default FlightSearchFormMobile