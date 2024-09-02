import React, { useState, useEffect, useRef } from 'react';
import zipCodes from '../data/ZipCodes_data.json'
import './ZipCodeInput.css'; 

type ZipCodeData = {
  zip: string;
  area: string;
};

const ZipCodeInput: React.FC = () => {
    const [zipCode, setZipCode] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isListVisible, setIsListVisible] = useState<boolean>(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<ZipCodeData[]>([]);
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
  
    const inputRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
          setIsListVisible(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    useEffect(() => {
      if (zipCode.length > 0) {
        const suggestions = zipCodes.filter((item: ZipCodeData) =>
          item.zip.startsWith(zipCode)
        );
        setFilteredSuggestions(suggestions);
        setIsListVisible(true);
      } else {
        setFilteredSuggestions([]);
        setIsListVisible(false);
        setSelectedArea(null); 
      }
    }, [zipCode]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
        setZipCode(value);
        setError('');
      } else {
        setError('Only digits are allowed');
      }
    };
  
    const handleSearchClick = () => {
      const zipCodePattern = /^\d{5}(-\d{4})?$/;
      if (zipCodePattern.test(zipCode)) {
        const selected = zipCodes.find(item => item.zip === zipCode);
        if (selected) {
          setSelectedArea(selected.area);
          setError('');
        } else {
          setSelectedArea(null);
          setError('No area found for this ZIP code.');
        }
      } else {
        setError('ZIP code must be 5 or 9 digits.');
        setSelectedArea(null);
      }
    };
  
    const handleSuggestionClick = (zip: string) => {
      setZipCode(zip);
      setIsListVisible(false);
      setError(''); 
    };
  
    return (
      <div>
        <div className="zip-code-container" ref={inputRef}>
          <div className="input-and-button">
            <input
              type="text"
              value={zipCode}
              onChange={handleInputChange}
              placeholder="Enter ZIP code..."
              maxLength={9} 
              autoComplete="off"
              className={`zip-code-input ${error ? 'error' : ''}`}
            />
            <button
              onClick={handleSearchClick}
              className="search-button"
            >
              Search
            </button>
          </div>
          {error && <p className="error-text">{error}</p>}
          {isListVisible && zipCode && filteredSuggestions.length > 0 && (
            <ul className="suggestions-list">
              {filteredSuggestions.map((item) => (
                <li
                  key={item.zip}
                  onMouseDown={() => handleSuggestionClick(item.zip)} 
                  className="suggestion-item"
                >
                  {item.zip} - {item.area}
                </li>
              ))}
            </ul>
          )}
          {selectedArea && <p className="selected-area">Area: {selectedArea}</p>}
        </div>
      </div>
    );
  };

export default ZipCodeInput;
