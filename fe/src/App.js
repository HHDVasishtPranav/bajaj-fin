import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const json = JSON.parse(input);
      const res = await axios.post('http://localhost:3009/bfhl', json);
      setResponse(res.data);
      setError('');
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      setError('Invalid JSON or API error.');
      setResponse(null);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters(prevFilters =>
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const handleRemoveFilter = (filterToRemove) => {
    setSelectedFilters(selectedFilters.filter(filter => filter !== filterToRemove));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderResponse = () => {
    if (!response) return null;

    const filteredResponse = {
      Numbers: selectedFilters.includes('numbers') ? response.numbers.join(',') : '',
      Alphabets: selectedFilters.includes('alphabets') ? response.alphabets.join(',') : '',
      'Highest Alphabet': selectedFilters.includes('highest_lowercase_alphabet') ? response.highest_lowercase_alphabet[0] : '',
    };

    return (
      <>
        {Object.entries(filteredResponse).map(([key, value]) => (
          value && <p key={key}>{key}: {value}</p>
        ))}
      </>
    );
  };

  return (
    <div className="app-container">
      <h1>API Input</h1>
      <div className="input-section">
        <textarea
          rows="5"
          value={input}
          onChange={handleInputChange}
          placeholder='Enter JSON here...'
        />
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {response && (
        <div className="filter-section">
          <label className="filter-label">Multi Filter:</label>
          <div className="filter-container">
            <div className="selected-filters">
              {selectedFilters.map(filter => (
                <span key={filter} className="filter-tag">
                  {filter.replace('_', ' ')}
                  <button onClick={() => handleRemoveFilter(filter)}>×</button>
                </span>
              ))}
            </div>
            <div className="custom-dropdown" ref={dropdownRef}>
              <div className="dropdown-header" onClick={toggleDropdown}>
                <span className="dropdown-arrow">▼</span>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-list">
                  {['numbers', 'alphabets', 'highest_lowercase_alphabet'].map(filter => (
                    <div
                      key={filter}
                      className={`dropdown-item ${selectedFilters.includes(filter) ? 'selected' : ''}`}
                      onClick={() => handleFilterChange(filter)}
                    >
                      {filter.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="filtered-response">
            {renderResponse()}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;