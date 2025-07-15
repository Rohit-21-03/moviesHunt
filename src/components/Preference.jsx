import React, { useRef, useEffect, useState } from "react";

const preferenceOptions = ['Happy', 'Thrilling', 'Romantic', 'Chill', 'Adventurous'];
const defaultTimeOptions = [30, 60, 90, 120, 150, 180, 210, 240];

const Preference = ({
  selectedMood,
  setSelectedMood,
  availableTime,
  setAvailableTime,
}) => {
  const [sliderStyle, setSliderStyle] = useState({});
  const tabRefs = useRef([React.createRef(), React.createRef()]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const node = tabRefs.current[activeIdx].current;
    if (node) {
      setSliderStyle({
        left: node.offsetLeft,
        width: node.offsetWidth,
      });
    }
  }, [activeIdx]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-dropdown option {
        background: rgba(36, 37, 46, 0.97);
        color: #fff;
        font-weight: 600;
        border-radius: 0.5rem;
        margin: 0.2rem 0;
      }
      select.custom-dropdown:focus {
        outline: none;
        box-shadow: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleFocus = (idx) => setActiveIdx(idx);

  return (
    <div className="relative flex backdrop-blur-md bg-white/20 rounded-full shadow-lg overflow-hidden transition-all min-w-[180px]">
      <span
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 z-0"
        style={{
          ...sliderStyle,
          position: "absolute",
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        }}
      />
      <div
        ref={tabRefs.current[0]}
        className="relative px-5 py-2 z-10 flex items-center cursor-pointer"
        tabIndex={0}
        onFocus={() => handleFocus(0)}
      >
        <select
          className="custom-dropdown appearance-none bg-transparent text-white text-base font-semibold outline-none cursor-pointer transition-all"
          value={selectedMood}
          onChange={e => {
            setSelectedMood(e.target.value);
            setActiveIdx(0);
          }}
          onFocus={() => handleFocus(0)}
          style={{
            border: "none",
            background: "transparent",
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: 80,
            cursor: "pointer",
          }}
        >
          {preferenceOptions.map(mood => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>
      </div>
      <div
        ref={tabRefs.current[1]}
        className="relative px-5 py-2 z-10 flex items-center cursor-pointer"
        tabIndex={0}
        onFocus={() => handleFocus(1)}
      >
        <span className="mr-2 text-white/60 font-semibold text-base select-none">Time:</span>
        <select
          id="time-dropdown"
          className="custom-dropdown appearance-none bg-transparent text-white text-base font-semibold outline-none cursor-pointer transition-all"
          value={availableTime}
          onChange={e => {
            setAvailableTime(Number(e.target.value));
            setActiveIdx(1);
          }}
          onFocus={() => handleFocus(1)}
          style={{
            border: "none",
            background: "transparent",
            fontWeight: 600,
            fontSize: "1rem",
            minWidth: 70,
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {defaultTimeOptions.map((min) => (
            <option key={min} value={min}>
              {min} min
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Preference;
