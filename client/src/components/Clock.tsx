import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Show } from '../utils/ConditionalRendering';
import { motion, AnimatePresence } from 'framer-motion';

const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = moment(now).format('dddd, MMMM DD, YYYY');
      setShow(true);
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AnimatePresence>
      <Show when={show}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="py-1 px-3 text-end bg-danger-subtle text-dark fw-bold position-absolute top-0 end-0"
          style={{
            borderRadius: '0 0 0 0.3rem',
            zIndex: 9999999,
          }}
        >
          <span>{currentDate}</span>
          <span style={{ marginLeft: '0.5rem' }}>{currentTime}</span>
        </motion.div>
      </Show>
    </AnimatePresence>
  );
};

export default Clock;
