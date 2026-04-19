import React, { useEffect } from 'react';
import {store, persistor} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Navigator from './navigation';
import { syncScheduler } from './services/SyncScheduler';

// @ts-ignore
console.disableYellowBox = true;

function AppContent(): React.ReactElement {
  useEffect(() => {
    // Start periodic sync scheduler when app loads
    console.log('🚀 [App] Starting sync scheduler');
    syncScheduler.start();

    // Clean up on unmount
    return () => {
      console.log('🛑 [App] Stopping sync scheduler');
      syncScheduler.stop();
    };
  }, []);

  return <Navigator />;
}

export default function App(): React.ReactElement {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
} 