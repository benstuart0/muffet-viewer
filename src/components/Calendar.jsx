import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { startOfWeek, endOfWeek, format, endOfDay } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ selectedDate, onDateChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  const handleWeekChange = (direction) => {
    // Start from the beginning of the current week
    const currentStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    let newDate;

    if (direction === 'prev') {
      // Move back 7 days from start of week
      newDate = new Date(currentStart);
      newDate.setDate(currentStart.getDate() - 7);
    } else {
      // Move forward 7 days from start of week
      newDate = new Date(currentStart);
      newDate.setDate(currentStart.getDate() + 7);
    }

    // Check if we're not going past current week
    if (direction === 'prev' || startOfWeek(newDate, { weekStartsOn: 1 }) <= currentWeekStart) {
      onDateChange(newDate);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPickerOpen || e.target.tagName === 'INPUT') return;

      if (e.key === 'ArrowLeft') {
        handleWeekChange('prev');
      } else if (e.key === 'ArrowRight') {
        handleWeekChange('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPickerOpen, handleWeekChange]);

  const togglePicker = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  return (
    <div className="calendar">
      <div className="week-navigator">
        <button onClick={() => handleWeekChange('prev')}>
          Last Week
        </button>
        
        <div className="date-picker-container">
          <button 
            className="date-selector"
            onClick={togglePicker}
          >
            <span className="date-start">
              {format(startOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </span>
            <span className="date-range-separator">–</span>
            <span className="date-end">
              {format(endOfWeek(selectedDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </span>
          </button>

          {isPickerOpen && (
            <div className="picker-popup">
              <DatePicker
                selected={selectedDate}
                onChange={date => {
                  if (startOfWeek(date, { weekStartsOn: 1 }) <= currentWeekStart) {
                    onDateChange(date);
                    setIsPickerOpen(false);
                  }
                }}
                inline
                calendarClassName="week-picker"
                showWeekNumbers={false}
                showMonthDropdown={false}
                showYearDropdown={false}
                calendarStartDay={1}
                maxDate={endOfWeek(currentWeekStart)}
                onClickOutside={() => setIsPickerOpen(false)}
                dayClassName={date => {
                  return date >= startOfWeek(selectedDate, { weekStartsOn: 1 }) && 
                         date <= endOfWeek(selectedDate, { weekStartsOn: 1 })
                    ? 'calendar-day in-selected-week'
                    : 'calendar-day';
                }}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled
                }) => (
                  <div className="datepicker-header">
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                      ←
                    </button>
                    <span>{format(date, 'MMMM yyyy')}</span>
                    <button 
                      onClick={increaseMonth} 
                      disabled={nextMonthButtonDisabled || date >= today}
                    >
                      →
                    </button>
                  </div>
                )}
              />
            </div>
          )}
        </div>
        
        <button 
          onClick={() => handleWeekChange('next')}
          disabled={startOfWeek(selectedDate, { weekStartsOn: 1 }) >= currentWeekStart}
        >
          Next Week
        </button>
      </div>
    </div>
  );
};

export default Calendar; 