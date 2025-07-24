import React, { ReactNode } from 'react';
import '../../week-view-layout.css';
import { EventFormModal } from './EventFormModal';
import { Header } from './Header';
import { Aside } from './Aside';
import { WeekView } from './WeekView';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { STYLE_VARS } from './StyleVariables';

export function Body() {
  return (
    <Contexts>
      <EventFormModal />
      <Header />
      <main style={MainStyle}>
        <Aside />
        <WeekView />
      </main>
    </Contexts>
  );
}

const MainStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 4fr',
  gridTemplateRows: STYLE_VARS.contentSize,
  gridGap: '1.5rem',
};

function Contexts({ children }: { children: ReactNode }) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
