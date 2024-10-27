import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './miniCalendar.css';

const localizer = momentLocalizer(moment);

const MiniCalendar = () => {
  const [flipped, setFlipped] = useState(false);

  const events = [
    
  ];

  useEffect(() => {
    setFlipped(true);

    const timeoutId = setTimeout(() => {
      setFlipped(false);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div style={{ width: '300px', height: '300px', perspective: '1000px' }}>
      <div
        className={`calendar-container ${flipped ? 'flipped' : ''}`} 
        onClick={() => setFlipped(!flipped)}
      >
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 300 }}
          toolbar={false}
          selectable={false}
          onSelectEvent={null}
          onSelectSlot={null}
          onDoubleClickEvent={null}
          onSelecting={() => false}
          drilldownView={null} 
          popup={false}  
        />
      </div>
    </div>
  );
};

export default MiniCalendar;