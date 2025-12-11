// src/App.tsx
import { FlightsProvider } from './context/FlightsContext';
import Flights from "./components/Flights";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Info from "./components/Info";
import Mean from "./components/Mean";
import MostDelayedFlight from "./components/MostDelayedFlight";
import WastedTime from './components/WastedTime';

function App() {
  return (
    <FlightsProvider>
      <div className="container py-4">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col">
            <Header />
          </div>
        </div>
        {/* MAIN CONTENT */}
        <div className="row g-4">
          {/* LEFT COLUMN — FLIGHTS */}
          <div className="col-md-8">
            <Flights />
          </div>

          {/* RIGHT COLUMN — Mean + WastedTime + MostDelayed */}
          <div className="col-md-4 d-flex flex-column gap-4">
            <Mean />
            <WastedTime />
            <MostDelayedFlight />
          </div>
        </div>
        {/* INFO */}
        <div className="row my-4">
          <div className="col">
            <Info />
          </div>
        </div>
        {/* FOOTER */}
        <div className="row">
          <div className="col">
            <Footer />
          </div>
        </div>
      </div>
    </FlightsProvider>
  );
}

export default App;