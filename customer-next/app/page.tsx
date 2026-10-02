'use client';

import React from 'react';
import { useCustomer } from '../context/CustomerContext';
import { Screen1Welcome } from '../components/screens/Screen1Welcome';
import { Screen2Menu } from '../components/screens/Screen2Menu';
import { Screen3ItemDetail } from '../components/screens/Screen3ItemDetail';
import { Screen4Cart } from '../components/screens/Screen4Cart';
import { Screen5LiveTracking } from '../components/screens/Screen5LiveTracking';
import { Screen6PaymentBreakdown } from '../components/screens/Screen6PaymentBreakdown';
import { Screen7PaymentGateway } from '../components/screens/Screen7PaymentGateway';
import { Screen8Confirmation } from '../components/screens/Screen8Confirmation';
import { Screen9DigitalBill } from '../components/screens/Screen9DigitalBill';
import { Screen10WaiterCall } from '../components/screens/Screen10WaiterCall';
import { Screen11Loyalty } from '../components/screens/Screen11Loyalty';
import { Screen12Feedback } from '../components/screens/Screen12Feedback';
import { AnimatePresence, motion } from 'framer-motion';

export default function CustomerJourneyPage() {
  const { currentScreen } = useCustomer();

  return (
    <main className="min-h-screen w-full bg-[#FFFCF7] flex justify-center items-stretch font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="w-full flex justify-center"
        >
          {(() => {
            switch (currentScreen) {
              case 1:
              default:
                return <Screen1Welcome />;
              case 2:
                return <Screen2Menu />;
              case 3:
                return <Screen3ItemDetail />;
              case 4:
                return <Screen4Cart />;
              case 5:
                return <Screen5LiveTracking />;
              case 6:
                return <Screen6PaymentBreakdown />;
              case 7:
                return <Screen7PaymentGateway />;
              case 8:
                return <Screen8Confirmation />;
              case 9:
                return <Screen9DigitalBill />;
              case 10:
                return <Screen10WaiterCall />;
              case 11:
                return <Screen11Loyalty />;
              case 12:
                return <Screen12Feedback />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
