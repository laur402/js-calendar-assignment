import React, { ReactNode } from 'react';
import '../../week-view-layout.css';
import { EventFormModal } from './EventFormModal';
import { Header } from './Header';
import { Aside } from './Aside';
import { WeekView } from './WeekView';
import { Provider } from 'react-redux';
import { store } from './redux/store';

export function Body() {
  return (
    <Contexts>
      <EventFormModal />
      <Header />
      <main>
        <Aside />
        <WeekView />
      </main>
    </Contexts>
  );
}

function Contexts({ children }: { children: ReactNode }) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
