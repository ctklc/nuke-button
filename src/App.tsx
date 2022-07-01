import ErrorBoundary from './components/errorBoundary';
import NukeButton from './components/button';

function App() {
  return (
    <ErrorBoundary>
      <NukeButton />
    </ErrorBoundary>
  );
}

export default App;
