"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'
import {
  searchAirportsGrouped,
  GroupedSearchResult,
  Airport,
  formatAirportName,
} from '@/lib/utils'
import { useRouter } from 'next/navigation';

interface PassengerCount {
  adults: number
  children: number
  infants: number
}

// Custom Calendar Component
const CustomCalendar: React.FC<{
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  minDate?: Date
}> = ({ selectedDate, onDateSelect, minDate }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date())
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
  
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }
  
  const isDisabled = (date: Date) => {
    if (!minDate) return false
    const startOfMinDate = new Date(minDate)
    startOfMinDate.setHours(0, 0, 0, 0)
    
    return date < startOfMinDate
  }
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  const days = getDaysInMonth(currentMonth)
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 min-w-[240px] max-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0FBFA] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} className="text-[#0ABAB5]" />
        </button>
        
        <h2 className="font-poppins font-bold text-base text-[#0D2B29]">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <button
          onClick={handleNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F0FBFA] transition-colors cursor-pointer"
        >
          <ChevronRight size={16} className="text-[#0ABAB5]" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {dayNames.map((day) => (
          <div key={day} className="h-6 flex items-center justify-center">
            <span className="font-poppins font-semibold text-xs text-gray-500 uppercase">
              {day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date, index) => (
          <div key={index} className="h-7 flex items-center justify-center">
            {date ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isDisabled(date)) {
                    onDateSelect(date)
                  }
                }}
                disabled={isDisabled(date)}
                className={`
                  w-7 h-7 flex items-center justify-center rounded-lg font-poppins font-medium text-xs transition-all cursor-pointer
                  ${isSelected(date) 
                    ? 'bg-[#0ABAB5] text-white shadow-lg scale-105' 
                    : isToday(date)
                    ? 'bg-[#E8F4F8] text-[#0ABAB5] border border-[#0ABAB5]'
                    : isDisabled(date)
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-[#0D2B29] hover:bg-[#F0FBFA] hover:scale-105'
                  }
                `}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="w-7 h-7"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface FlightSearchFormProps {
  isSticky: boolean;
  fromInput: string;
  setFromInput: React.Dispatch<React.SetStateAction<string>>;
  toInput: string;
  setToInput: React.Dispatch<React.SetStateAction<string>>;
  fromSelection: Airport | null;
  setFromSelection: React.Dispatch<React.SetStateAction<Airport | null>>;
  toSelection: Airport | null;
  setToSelection: React.Dispatch<React.SetStateAction<Airport | null>>;
  departureDate: Date | null;
  setDepartureDate: React.Dispatch<React.SetStateAction<Date | null>>;
  returnDate: Date | null;
  setReturnDate: React.Dispatch<React.SetStateAction<Date | null>>;
  passengers: PassengerCount;
  setPassengers: React.Dispatch<React.SetStateAction<PassengerCount>>;
  tripType: string;
  setTripType: React.Dispatch<React.SetStateAction<string>>;
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
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
  multiActiveInputs: ('from' | 'to' | null)[];
  setMultiActiveInputs: React.Dispatch<React.SetStateAction<('from' | 'to' | null)[]>>;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  isSticky,
  fromInput,
  setFromInput,
  toInput,
  setToInput,
  fromSelection,
  setFromSelection,
  toSelection,
  setToSelection,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  passengers,
  setPassengers,
  tripType,
  setTripType,
  selectedClass,
  setSelectedClass,
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
  multiActiveInputs,
  setMultiActiveInputs,
}) => {
  const [fromSuggestions, setFromSuggestions] = useState<GroupedSearchResult[]>([])
  const [toSuggestions, setToSuggestions] = useState<GroupedSearchResult[]>([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)
  
  type OpenPopover = 'trip' | 'passengers' | 'departure' | 'return' | null
  const [activeInput, setActiveInput] = useState<'from' | 'to' | null>(null)
  const [openPopover, setOpenPopover] = useState<OpenPopover>(null)
  const [isSubmitting] = useState(false);
  const [submissionStatus] = useState<'success' | 'error' | null>(null);
  const [submissionMessage] = useState('');
  
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  const handleFromInputChange = (value: string) => {
    setFromInput(value)
    setFromSelection(null)
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value, 10)
      setFromSuggestions(filtered)
      setShowFromSuggestions(true)
    } else {
      setFromSuggestions([])
      setShowFromSuggestions(false)
    }
  }

  const handleToInputChange = (value: string) => {
    setToInput(value)
    setToSelection(null)
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value)
      setToSuggestions(filtered)
      setShowToSuggestions(true)
    } else {
      setToSuggestions([])
      setShowToSuggestions(false)
    }
  }

  const handleCitySelect = (
    result: GroupedSearchResult | Airport,
    type: 'from' | 'to'
  ) => {
    const isAirport = (r: GroupedSearchResult | Airport): r is Airport => 'code' in r;
    const airportToSet = isAirport(result) ? result : result.airports![0];
    const airportDisplayName = formatAirportName(airportToSet.name);

    if (type === 'from') {
      setFromInput(airportDisplayName);
      setFromSelection(airportToSet);
      setShowFromSuggestions(false)
      if (toInputRef.current) {
        toInputRef.current.focus()
      }
    } else {
      setToInput(airportDisplayName);
      setToSelection(airportToSet);
      setShowToSuggestions(false)
    }
  }
  
  const handleTogglePopover = (popover: OpenPopover) => {
    if (openPopover === popover) {
      setOpenPopover(null)
    } else {
      setOpenPopover(popover)
    }
  }
  
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
  
  const updatePassengerCount = (type: keyof PassengerCount, increment: boolean) => {
    setPassengers(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }))
  }

  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants
  }
  
  const handleSwapCities = () => {
    const tempInput = fromInput
    setFromInput(toInput)
    setToInput(tempInput)

    const tempSelection = fromSelection
    setFromSelection(toSelection)
    setToSelection(tempSelection)
  }

  // Validation helpers for enabling Search button(s)
  const isMainFormComplete = !!fromSelection && !!toSelection && !!departureDate && (tripType !== 'Round Trip' || !!returnDate) && getTotalPassengers() >= 1 && !!selectedClass
  const isMultiCityComplete = tripType !== 'Multi-city' || (
    !!fromSelection && !!toSelection && !!departureDate &&
    multiSegments.every(seg => !!seg.fromSelection && !!seg.toSelection && !!seg.date)
  )

  // Compute minimum selectable return date: not today
  const getMinReturnDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (departureDate) {
      const dep = new Date(departureDate);
      dep.setHours(0, 0, 0, 0);
      // If departure is today or before, force at least tomorrow; else allow same-day return (not requested to forbid)
      return dep.getTime() <= today.getTime() ? tomorrow : dep;
    }
    return tomorrow;
  };
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container') && !target.closest('.calendar-container')) {
        setOpenPopover(null)
        setMultiPopovers(pops => pops.map(() => false))
      }
      if (!target.closest('.autocomplete-container')) {
        setShowFromSuggestions(false)
        setShowToSuggestions(false)
        setMultiShowFromSuggestions(shows => shows.map(() => false))
        setMultiShowToSuggestions(shows => shows.map(() => false))
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setMultiPopovers, setMultiShowFromSuggestions, setMultiShowToSuggestions])
  
  // Multi-city segments (дополнительные, кроме основной формы)
  // При выборе Multi-city сразу появляется одна доп. форма
  const handleAddSegment = () => {
    if (multiSegments.length >= 5) return // основная + 5 = 6 максимум
    setMultiSegments([...multiSegments, { from: '', to: '', date: null, fromSelection: null, toSelection: null }])
    setMultiPopovers([...multiPopovers, false])
    setMultiFromSuggestions([...multiFromSuggestions, []])
    setMultiToSuggestions([...multiToSuggestions, []])
    setMultiShowFromSuggestions([...multiShowFromSuggestions, false])
    setMultiShowToSuggestions([...multiShowToSuggestions, false])
    setMultiActiveInputs([...multiActiveInputs, null])
  }
  const handleSegmentChange = (idx: number, field: 'from' | 'to' | 'date' | 'fromSelection' | 'toSelection', value: string | Date | null | Airport) => {
    setMultiSegments(segs => {
      const newSegs = segs.map((s, i) => i === idx ? { ...s, [field]: value } : s);
      
      // If changing date, validate and update subsequent segments if needed
      if (field === 'date' && value instanceof Date) {
        const selectedDate = value;
        
        // Check if any subsequent segments have dates that are now invalid
        for (let i = idx + 1; i < newSegs.length; i++) {
          const nextSegment = newSegs[i];
          if (nextSegment.date) {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + (i - idx));
            
            // If the next segment's date is before the minimum allowed date, clear it
            if (nextSegment.date < nextDay) {
              newSegs[i] = { ...nextSegment, date: null };
            }
          }
        }
      }
      
      return newSegs;
    });
  }
  const handleSegmentPopover = (idx: number, open: boolean) => {
    setMultiPopovers(pops => pops.map((v, i) => i === idx ? open : v))
  }
  const handleRemoveSegment = (idx: number) => {
    // Если удаляется последняя дополнительная форма, переключаемся на One-way
    if (multiSegments.length === 1) {
      setTripType('One-way');
      // Явно очищаем все состояния для multi-city
      setMultiSegments([]);
      setMultiPopovers([]);
      setMultiFromSuggestions([]);
      setMultiToSuggestions([]);
      setMultiShowFromSuggestions([]);
      setMultiShowToSuggestions([]);
      setMultiActiveInputs([]);
    } else {
      // Иначе, просто удаляем нужный сегмент
      setMultiSegments(segs => segs.filter((_, i) => i !== idx));
      setMultiPopovers(pops => pops.filter((_, i) => i !== idx));
      setMultiFromSuggestions(suggs => suggs.filter((_, i) => i !== idx));
      setMultiToSuggestions(suggs => suggs.filter((_, i) => i !== idx));
      setMultiShowFromSuggestions(shows => shows.filter((_, i) => i !== idx));
      setMultiShowToSuggestions(shows => shows.filter((_, i) => i !== idx));
      setMultiActiveInputs(actives => actives.filter((_, i) => i !== idx));
    }
  };
  
  const handleMultiFromInput = (idx: number, value: string) => {
    handleSegmentChange(idx, 'from', value)
    handleSegmentChange(idx, 'fromSelection', null)
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value, 10)
      setMultiFromSuggestions(suggs => suggs.map((s, i) => i === idx ? filtered : s))
      setMultiShowFromSuggestions(shows => shows.map((s, i) => i === idx ? true : s))
    } else {
      setMultiShowFromSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    }
  }

  const handleMultiToInput = (idx: number, value: string) => {
    handleSegmentChange(idx, 'to', value)
    handleSegmentChange(idx, 'toSelection', null)
    if (value.length > 0) {
      const filtered = searchAirportsGrouped(value, 10)
      setMultiToSuggestions(suggs => suggs.map((s, i) => i === idx ? filtered : s))
      setMultiShowToSuggestions(shows => shows.map((s, i) => i === idx ? true : s))
    } else {
      setMultiShowToSuggestions(shows => shows.map((s, i) => i === idx ? false : s))
    }
  }

  const handleMultiCitySelect = (idx: number, result: GroupedSearchResult | Airport, type: 'from' | 'to') => {
    const isAirport = (r: GroupedSearchResult | Airport): r is Airport => 'code' in r;
    const airportToSet = isAirport(result) ? result : result.airports![0];
    const airportDisplayName = formatAirportName(airportToSet.name);

    const newSegments = [...multiSegments];
    
    if (type === 'from') {
      newSegments[idx] = { ...newSegments[idx], from: airportDisplayName, fromSelection: airportToSet };
    } else {
      newSegments[idx] = { ...newSegments[idx], to: airportDisplayName, toSelection: airportToSet };
    }
    setMultiSegments(newSegments);
    
    const newShowFromSuggestions = [...multiShowFromSuggestions];
    newShowFromSuggestions[idx] = false;
    setMultiShowFromSuggestions(newShowFromSuggestions);
    
    const newShowToSuggestions = [...multiShowToSuggestions];
    newShowToSuggestions[idx] = false;
    setMultiShowToSuggestions(newShowToSuggestions);
  };

  const handleMultiInputFocus = (idx: number, field: 'from' | 'to') => {
    setMultiActiveInputs(actives => actives.map((a, i) => i === idx ? field : a))
  }

  const handleMultiInputBlur = (idx: number) => {
    setMultiActiveInputs(actives => actives.map((a, i) => i === idx ? null : a))
  }

  const handleClearAll = () => {
    setFromInput('')
    setToInput('')
    setFromSelection(null)
    setToSelection(null)
    setDepartureDate(null)
    setReturnDate(null)

    if (tripType === 'Multi-city') {
      const clearedFirstSegment = { from: '', to: '', date: null, fromSelection: null, toSelection: null };
      setMultiSegments([clearedFirstSegment]);
      setMultiPopovers([false]);
      setMultiFromSuggestions([[]]);
      setMultiToSuggestions([[]]);
      setMultiShowFromSuggestions([false]);
      setMultiShowToSuggestions([false]);
      setMultiActiveInputs([null]);
    }
  }
  
  // Reset returnDate if it is before departureDate
  // useEffect(() => {
  //   if (departureDate && returnDate && returnDate < departureDate) {
  //     setReturnDate(null)
  //   }
  // }, [departureDate, returnDate, setReturnDate])
  

  
  return (
    <div className="w-full max-w-[1280px] mx-auto">
      {/* Trip Type Selection */}
      {!isSticky && (
      <div className={`flex items-center justify-center mb-6`}>
          <div className="bg-white rounded-full p-1 ring-1 ring-gray-200 relative">
            <div className="flex relative">
              {['Round Trip', 'One-way', 'Multi-city'].map((type) => {
                const isSelected = type === tripType;
                
                return (
                  <button
                    key={type}
                    onClick={() => setTripType(type)}
                    className={`relative px-6 py-3 font-poppins font-medium text-sm transition-colors duration-200 cursor-pointer flex-1 whitespace-nowrap ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-[#0D2B29] hover:text-[#0ABAB5]'
                    }`}
                    tabIndex={0}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#0ABAB5] rounded-full"
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
        )}
        {/* Main Form - Horizontal Layout */}
        <div className="flex flex-row w-full">
          <div className={`bg-white rounded-full shadow-lg flex items-center gap-0.5 w-full ${isSticky ? 'p-1' : 'p-2'}`}>
            {/* From */}
            <div className={`relative autocomplete-container grow-[4] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'from' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}>
              <div
                className={`flex items-center px-4 cursor-pointer w-full ${isSticky ? 'py-2' : 'py-4'}`}
                tabIndex={0}
                aria-label="From input"
                onClick={() => fromInputRef.current && fromInputRef.current.focus()}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fromInputRef.current?.focus(); } }}
              >
                <div className="flex items-center gap-1 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" style={{width: '16px'}} />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
                    <input
                      ref={fromInputRef}
                      type="text"
                      value={fromInput}
                      onChange={(e) => handleFromInputChange(e.target.value)}
                      onFocus={() => setActiveInput('from')}
                      onBlur={() => setActiveInput(null)}
                      placeholder="Flying from?"
                      className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                      tabIndex={-1}
                    />
                  </div>
                  {fromSelection && (
                    <div className="bg-[#0ABAB5] text-white font-semibold text-xs rounded-lg px-2 py-0.5 ml-2">
                      {fromSelection.code}
                    </div>
                  )}
                  {(fromInput || fromSelection) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setFromInput(''); setFromSelection(null); setFromSuggestions([]); setShowFromSuggestions(false); }}
                      className="ml-2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center"
                      aria-label="Clear from"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              {showFromSuggestions && fromSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  {fromSuggestions.map(result => (
                                        <div key={result.id}>
                                          {result.type === 'city' ? (
                                            <div>
                                              <div
                                                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer flex items-center"
                                                onClick={() => handleCitySelect(result, 'from')}
                                              >
                                                <Image
                                                  src="/icons/footer/map-pin.svg"
                                                  width={24}
                                                  height={24}
                                                  alt="city"
                                                  className="mr-3 h-auto w-auto"
                                                />
                                                <div>
                                                  <div className="font-poppins font-bold text-[#0D2B29]">
                                                    {result.name}
                                                  </div>
                                                  <div className="font-poppins text-sm text-gray-500">
                                                    {result.country}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="pl-4">
                                                {result.airports?.map(airport => (
                                                  <div
                                                    key={airport.code}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer flex items-center justify-between"
                                                    onClick={() => handleCitySelect(airport, 'from')}
                                                  >
                                                    <div className="flex items-center">
                                                      <Image
                                                        src="/icons/airport-from.svg"
                                                        width={24}
                                                        height={24}
                                                        alt="from"
                                                        className="mr-3 h-auto w-auto"
                                                        style={{width: '16px'}}
                                                      />
                                                      <div>
                                                        <div className="font-poppins font-medium text-[#0D2B29]">
                                                          {formatAirportName(
                                                            airport.name
                                                          )}
                                                        </div>
                                                        <div className="font-poppins text-sm text-gray-500">
                                                          {airport.country}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <span className="bg-[#0ABAB5] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                      {airport.code}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                                              onClick={() => handleCitySelect(result, 'from')}
                                            >
                                              <div className="flex items-center">
                                                <Image
                                                  src="/icons/airport-from.svg"
                                                  width={24}
                                                  height={24}
                                                  alt="from"
                                                  className="mr-3 h-auto w-auto"
                                                  style={{width: '16px'}}
                                                />
                                                <div>
                                                  <div className="font-poppins font-medium text-[#0D2B29]">
                                                    {formatAirportName(
                                                      result.name
                                                    )}
                                                  </div>
                                                  <div className="font-poppins text-sm text-gray-500">
                                                    {result.country}
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="bg-[#0ABAB5] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                {result.code}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
            
            {/* Divider with Swapper Button */}
            <div className="relative flex-shrink-0">
              <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
              <button
                onClick={handleSwapCities}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
                aria-label="Swap origin and destination"
              >
                <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors" />
              </button>
            </div>
            
            {/* To */}
            <div className={`relative autocomplete-container grow-[4] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'to' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}>
              <div
                className={`flex items-center px-4 cursor-pointer w-full ${isSticky ? 'py-2' : 'py-4'}`}
                tabIndex={0}
                aria-label="To input"
                onClick={() => toInputRef.current && toInputRef.current.focus()}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); toInputRef.current?.focus(); } }}
              >
                <div className="flex items-center gap-1 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" style={{width: '16px'}} />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
                    <input
                      ref={toInputRef}
                      type="text"
                      value={toInput}
                      onChange={(e) => handleToInputChange(e.target.value)}
                      onFocus={() => setActiveInput('to')}
                      onBlur={() => setActiveInput(null)}
                      placeholder="Where are you flying?"
                      className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                      tabIndex={-1}
                    />
                  </div>
                  {toSelection && (
                    <div className="bg-[#0ABAB5] text-white font-semibold text-xs rounded-lg px-2 py-0.5 ml-2">
                      {toSelection.code}
                    </div>
                  )}
                  {(toInput || toSelection) && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setToInput(''); setToSelection(null); setToSuggestions([]); setShowToSuggestions(false); }}
                      className="ml-2 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                      aria-label="Clear to"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
              {showToSuggestions && toSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-[500px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                  {toSuggestions.map(result => (
                                        <div key={result.id}>
                                          {result.type === 'city' ? (
                                            <div>
                                              <div
                                                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer flex items-center"
                                                onClick={() => handleCitySelect(result, 'to')}
                                              >
                                                <Image
                                                  src="/icons/footer/map-pin.svg"
                                                  width={24}
                                                  height={24}
                                                  alt="city"
                                                  className="mr-3 h-auto w-auto"
                                                />
                                                <div>
                                                  <div className="font-poppins font-bold text-[#0D2B29]">
                                                    {result.name}
                                                  </div>
                                                  <div className="font-poppins text-sm text-gray-500">
                                                    {result.country}
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="pl-4">
                                                {result.airports?.map(airport => (
                                                  <div
                                                    key={airport.code}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer flex items-center justify-between"
                                                    onClick={() => handleCitySelect(airport, 'to')}
                                                  >
                                                    <div className="flex items-center">
                                                      <Image
                                                        src="/icons/airport-to.svg"
                                                        width={24}
                                                        height={18}
                                                        alt="to"
                                                        className="mr-3 h-auto w-auto"
                                                        style={{width: '16px'}}
                                                      />
                                                      <div>
                                                        <div className="font-poppins font-medium text-[#0D2B29]">
                                                          {formatAirportName(
                                                            airport.name
                                                          )}
                                                        </div>
                                                        <div className="font-poppins text-sm text-gray-500">
                                                          {airport.country}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <span className="bg-[#0ABAB5] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                      {airport.code}
                                                    </span>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          ) : (
                                            <div
                                              className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
                                              onClick={() => handleCitySelect(result, 'to')}
                                            >
                                              <div className="flex items-center">
                                                <Image
                                                  src="/icons/airport-to.svg"
                                                  width={24}
                                                  height={24}
                                                  alt="to"
                                                  className="mr-3 h-auto w-auto"
                                                  style={{width: '16px'}}
                                                />
                                                <div>
                                                  <div className="font-poppins font-medium text-[#0D2B29]">
                                                    {formatAirportName(
                                                      result.name
                                                    )}
                                                  </div>
                                                  <div className="font-poppins text-sm text-gray-500">
                                                    {result.country}
                                                  </div>
                                                </div>
                                              </div>
                                              <span className="bg-[#0ABAB5] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                                {result.code}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                              </div>
            
            {/* Divider */}
            <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
            
            {/* Departure Date */}
            <div className="relative calendar-container grow-[1] shrink basis-0">
              <div 
                className={`flex items-center px-4 cursor-pointer h-full ${isSticky ? 'py-2' : 'py-4'}`}
                onClick={() => handleTogglePopover('departure')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
                    <div className={`font-poppins font-medium text-base whitespace-nowrap ${departureDate ? 'text-[#0D2B29]' : 'text-gray-400'}`}>
                        {departureDate ? (
                        departureDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                        ) : (
                        'Select Date'
                        )}
                    </div>
                  </div>
                </div>
              </div>
              {openPopover === 'departure' && (
                <div className="absolute top-full left-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
                  <CustomCalendar
                    selectedDate={departureDate}
                    onDateSelect={(date) => {
                      setDepartureDate(date)
                      if (returnDate && date > returnDate) {
                        setReturnDate(null)
                      }
                      
                      // Update multi-city segments dates if they become invalid
                      if (tripType === 'Multi City') {
                        const updatedSegments = multiSegments.map((segment, index) => {
                          const minDateForSegment = new Date(date)
                          minDateForSegment.setDate(minDateForSegment.getDate() + index + 1)
                          
                          if (segment.date && segment.date < minDateForSegment) {
                            return { ...segment, date: null }
                          }
                          return segment
                        })
                        setMultiSegments(updatedSegments)
                      }
                      
                      setOpenPopover(null)
                    }}
                    minDate={new Date()}
                  />
                </div>
              )}
            </div>
            
            {/* Return Date - for Round Trip only */}
          {tripType === 'Round Trip' && (
              <div className="relative border-l border-gray-100 flex-1">
                <div
                  className={`flex items-center gap-3 cursor-pointer h-full px-4 ${isSticky ? 'py-2' : 'py-4'}`}
                  onClick={() => handleTogglePopover('return')}
                >
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
                    <CalendarIcon size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">RETURN</div>
                    <div className={`w-full font-poppins font-medium border-none outline-none bg-transparent ${returnDate ? 'text-[#0D2B29]' : 'text-gray-400'} whitespace-nowrap`}>
                       {returnDate ? formatDate(returnDate) : '+ Add return'}
                    </div>
                  </div>
                </div>
                {openPopover === 'return' && (
                  <div className="absolute top-full right-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
                    <CustomCalendar
                      selectedDate={returnDate}
                      onDateSelect={(date) => {
                        setReturnDate(date)
                        setOpenPopover(null)
                      }}
                      minDate={getMinReturnDate()}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Divider */}
            <div className={`w-px bg-gray-200 ${isSticky ? 'h-12' : 'h-16'}`}></div>
            
            {/* Passengers */}
            <div className="relative dropdown-container w-[160px] flex-shrink-0">
              <div 
                className={`flex items-center px-4 cursor-pointer h-full ${isSticky ? 'py-2' : 'py-4'}`}
                onClick={() => handleTogglePopover('passengers')}
              >
                <div className="flex items-center gap-1 w-full">
                  <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-[#0ABAB5]" />
                  </div>
                  <div className="flex-1">
                    <div className="leading-tight">
                      <div className={`w-full font-poppins text-xs font-semibold uppercase ${getTotalPassengers() >= 1 ? 'text-[#0D2B29]' : 'text-gray-400'} mb-1`}>
                        {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Passenger' : 'Passengers'}
                      </div>
                      <div className="font-poppins font-medium text-base text-gray-500">
                        {(selectedClass || '').replace(' class', '')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {openPopover === 'passengers' && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[280px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4">
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-poppins font-medium text-[#0D2B29]">Adults</div>
                      <div className="font-poppins text-sm text-gray-500">12+ years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('adults', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.adults <= 1}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.adults}</span>
                      <button
                        onClick={() => updatePassengerCount('adults', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        tabIndex={0}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Children */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-poppins font-medium text-[#0D2B29]">Children</div>
                      <div className="font-poppins text-sm text-gray-500">2-11 years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('children', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.children <= 0}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.children}</span>
                      <button
                        onClick={() => updatePassengerCount('children', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
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
                      <div className="font-poppins text-sm text-gray-500">under 2 years</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updatePassengerCount('infants', false)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
                        disabled={passengers.infants <= 0}
                        tabIndex={0}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-poppins font-medium">{passengers.infants}</span>
                      <button
                        onClick={() => updatePassengerCount('infants', true)}
                        className="w-8 h-8 rounded-full border border-[#0ABAB5] flex items-center justify-center text-[#0ABAB5] hover:bg-[#F0FBFA] cursor-pointer"
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
                          className={`flight-class-pointer w-full px-4 py-3 text-center rounded-xl font-poppins text-[#0D2B29] text-sm transition-colors ${
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
                </div>
              )}
            </div>


            {/* Search Button */}
            {tripType !== 'Multi-city' && (
              <button
                onClick={handleSearch}
                disabled={isSubmitting || !isMainFormComplete}
                className="bg-[#EC5E39] text-white font-normal text-lg font-poppins px-10 py-5 rounded-full hover:bg-opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EC5E39] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? 'Sending...' : 'Search'}
              </button>
            )}
          </div>
        </div>
        {/* Multi-city segments (дополнительные) */}
        {tripType === 'Multi-city' && multiSegments.map((segment, idx) => {
          // Calculate minimum date for this segment
          let minDate = new Date();
          
          if (idx === 0) {
            // First multi-city segment: minimum date is the day after main departure date
            if (departureDate) {
              minDate = new Date(departureDate);
              minDate.setDate(minDate.getDate() + 1);
            }
          } else {
            // Subsequent segments: minimum date is the day after previous segment's date
            const prevSegment = multiSegments[idx - 1];
            if (prevSegment.date) {
              minDate = new Date(prevSegment.date);
              minDate.setDate(minDate.getDate() + 1);
            } else if (departureDate) {
              // If previous segment has no date, use main departure date + days
              minDate = new Date(departureDate);
              minDate.setDate(minDate.getDate() + idx + 1);
            }
          }
          
          return (
          <div className="relative" key={idx}>
            <MultiCitySegment
              segment={segment}
              onChange={(field, value) => handleSegmentChange(idx, field, value)}
              fromSuggestions={multiFromSuggestions[idx] || []}
              toSuggestions={multiToSuggestions[idx] || []}
              showFromSuggestions={multiShowFromSuggestions[idx] || false}
              showToSuggestions={multiShowToSuggestions[idx] || false}
              onFromInput={(v) => handleMultiFromInput(idx, v)}
              onToInput={(v) => handleMultiToInput(idx, v)}
              onCitySelect={(city, type) => handleMultiCitySelect(idx, city, type)}
              onDateClick={() => handleSegmentPopover(idx, true)}
              openPopover={multiPopovers[idx]}
              setOpenPopover={open => handleSegmentPopover(idx, open)}
              activeInput={multiActiveInputs[idx] || null}
              onInputFocus={(field) => handleMultiInputFocus(idx, field)}
              onInputBlur={() => handleMultiInputBlur(idx)}
              minDate={minDate}
            />
            <button
              onClick={() => handleRemoveSegment(idx)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors cursor-pointer"
              aria-label="Remove segment"
            >
              <X size={14} />
            </button>
          </div>
          );
        })}
        {tripType === 'Multi-city' && (
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-4">
              <button
                onClick={handleAddSegment}
                className="bg-white border border-[#0ABAB5] text-[#0ABAB5] px-6 py-4 rounded-full font-poppins font-semibold text-sm hover:bg-[#F0FBFA] transition-colors flex items-center gap-2 cursor-pointer"
                tabIndex={0}
                aria-label="Add a Flight"
              >
                <Plus size={16} />
                Add a Flight
              </button>
              <button
                onClick={handleClearAll}
                className="bg-white border border-gray-300 text-gray-600 px-6 py-4 rounded-full font-poppins font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                tabIndex={0}
                aria-label="Clear All"
              >
                Clear All
              </button>
            </div>
            

            
            <button
              onClick={handleSearch}
              disabled={isSubmitting || !isMultiCityComplete}
              className="bg-[#EC5E39] text-white px-10 py-4 rounded-full font-poppins font-semibold text-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              tabIndex={0}
              aria-label="Search flights"
            >
              {isSubmitting ? 'Sending...' : 'SEARCH'}
            </button>
          </div>
        )}
      {submissionStatus && (
        <div className={`mt-4 text-center p-2 rounded-md ${submissionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {submissionMessage}
        </div>
      )}
    </div>
  )
}

// Flight segment form for Multi-city
const MultiCitySegment: React.FC<{
  segment: { from: string; to: string; date: Date | null; fromSelection: Airport | null; toSelection: Airport | null }
  onChange: (field: 'from' | 'to' | 'date' | 'fromSelection' | 'toSelection', value: string | Date | null | Airport) => void
  fromSuggestions: GroupedSearchResult[]
  toSuggestions: GroupedSearchResult[]
  showFromSuggestions: boolean
  showToSuggestions: boolean
  onFromInput: (v: string) => void
  onToInput: (v: string) => void
  onCitySelect: (result: GroupedSearchResult | Airport, type: 'from' | 'to') => void
  onDateClick: () => void
  openPopover: boolean
  setOpenPopover: (v: boolean) => void
  activeInput: 'from' | 'to' | null
  onInputFocus: (field: 'from' | 'to') => void
  onInputBlur: () => void
  minDate?: Date
}> = ({
  segment, onChange,
  fromSuggestions, toSuggestions,
  showFromSuggestions, showToSuggestions,
  onFromInput, onToInput, onCitySelect,
  onDateClick, openPopover, setOpenPopover,
  activeInput, onInputFocus, onInputBlur,
  minDate
}) => {
  const fromInputRef = useRef<HTMLInputElement>(null)
  const toInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-1 mt-4 autocomplete-container">
      {/* From */}
      <div className={`relative grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'from' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}> 
        <div
          className="flex items-center px-4 py-3 cursor-pointer w-full"
          tabIndex={0}
          aria-label="From input"
          onClick={() => { fromInputRef.current?.focus(); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fromInputRef.current?.focus(); } }}
        >
              <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" style={{width: '16px'}} />
            </div>
                <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">FROM</div>
              <input
                ref={fromInputRef}
                type="text"
                value={segment.from}
                onChange={e => onFromInput(e.target.value)}
                onFocus={() => onInputFocus('from')}
                onBlur={onInputBlur}
                placeholder="Flying from?"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                tabIndex={-1}
              />
            </div>
            {segment.fromSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                {segment.fromSelection.code}
              </div>
            )}
                {(segment.from || segment.fromSelection) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onChange('from', ''); onChange('fromSelection', null); }}
                    className="ml-2 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer min-w-[24px] min-h-[24px] flex items-center justify-center"
                    aria-label="Clear from"
                  >
                    <X size={16} />
                  </button>
                )}
          </div>
        </div>
        {showFromSuggestions && fromSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {fromSuggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onCitySelect(city, 'from')}
                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <Image src="/icons/airport-from.svg" width={14} height={14} alt="from" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                  <div>
                    <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                    <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Divider with Swapper Button */}
      <div className="relative flex-shrink-0">
        <div className="w-px h-16 bg-gray-200"></div>
        <button
          onClick={() => {
            // Swap from and to for this segment
            const temp = segment.from
            const tempSelection = segment.fromSelection
            onChange('from', segment.to)
            onChange('to', temp)
            onChange('fromSelection', segment.toSelection)
            onChange('toSelection', tempSelection)
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-100 hover:border-[#0ABAB5] transition-all cursor-pointer"
          aria-label="Swap origin and destination"
        >
          <ArrowLeftRight size={18} className="text-gray-500 hover:text-[#0ABAB5] transition-colors" />
        </button>
      </div>
      {/* To */}
      <div className={`relative grow-[3] shrink basis-0 rounded-full transition-colors duration-200 ${activeInput === 'to' ? 'bg-[#F0FBFA]' : 'bg-transparent'}`}> 
        <div
          className="flex items-center px-4 py-3 cursor-pointer w-full"
          tabIndex={0}
          aria-label="To input"
          onClick={() => { toInputRef.current?.focus(); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); fromInputRef.current?.focus(); } }}
        >
              <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center flex-shrink-0">
              <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" style={{width: '16px'}} />
            </div>
                <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">GOING TO</div>
              <input
                ref={toInputRef}
                type="text"
                value={segment.to}
                onChange={e => onToInput(e.target.value)}
                onFocus={() => onInputFocus('to')}
                onBlur={onInputBlur}
                placeholder="Where are you flying?"
                className="w-full font-poppins font-medium text-[#0D2B29] placeholder-gray-400 border-none outline-none bg-transparent text-base"
                tabIndex={-1}
              />
            </div>
            {segment.toSelection && (
              <div className="bg-[#0ABAB5] text-white font-bold text-sm rounded-lg px-3 py-1.5 ml-2">
                {segment.toSelection.code}
              </div>
            )}
                {(segment.to || segment.toSelection) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onChange('to', ''); onChange('toSelection', null); }}
                    className="ml-2 p-2 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
                    aria-label="Clear to"
                  >
                    <X size={16} />
                  </button>
                )}
          </div>
        </div>
        {showToSuggestions && toSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {toSuggestions.map((city, idx) => (
              <button
                key={idx}
                onClick={() => onCitySelect(city, 'to')}
                className="w-full px-4 py-3 text-left hover:bg-[#F0FBFA] cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                tabIndex={0}
              >
                <div className="flex items-center">
                  <Image src="/icons/airport-to.svg" width={14} height={14} alt="to" className="mr-3 h-auto w-auto" style={{width: '16px'}} />
                  <div>
                    <div className="font-poppins font-medium text-[#0D2B29]">{city.name} <span className="text-gray-500">{city.code}</span></div>
                    <div className="font-poppins text-sm text-gray-500">{city.country}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Divider */}
      <div className="w-px h-16 bg-gray-200"></div>
      {/* Departure Date */}
      <div className="relative calendar-container grow-[2] shrink basis-0">
        <div 
          className="flex items-center px-4 py-3 cursor-pointer h-full"
          onClick={onDateClick}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#E8F4F8] rounded-full flex items-center justify-center">
              <CalendarIcon size={16} className="text-[#0ABAB5]" />
            </div>
            <div className="flex-1">
              <div className="font-poppins text-xs font-semibold text-[#0D2B29] uppercase mb-1">DEPARTURE</div>
              <div className={`w-full font-poppins font-medium border-none outline-none bg-transparent ${segment.date ? 'text-[#0D2B29]' : 'text-gray-400'}`}> 
                {segment.date ? segment.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Select Date'}
              </div>
            </div>
          </div>
        </div>
        {openPopover && (
          <div className="absolute top-full left-0 mt-2 z-50 calendar-container" onClick={(e) => e.stopPropagation()}>
            <CustomCalendar
              selectedDate={segment.date}
              onDateSelect={date => { onChange('date', date); setOpenPopover(false) }}
              minDate={minDate || new Date()}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default FlightSearchForm