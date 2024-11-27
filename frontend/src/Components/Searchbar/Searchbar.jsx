import React, { useEffect, useState } from 'react';
import { Input, Button } from '../index';
import axios from 'axios';
import './Searchbar.css';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

function Searchbar() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleChange = (e) => {
    const query = e.target.value;
    setValue(query);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      const { data: sug } = await axios.get(`http://localhost:5000/search?q=${query}`);
      setData(sug);
    } catch (error) {
      console.log('error in fetching search suggestions: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  setDebounceTimeout(
    setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query);
      } else {
        setData([]);
      }
    }, 300) 
  );
};

  return (
    <>
      <div className="searchbar-container">
        <div className="searchbar-input-wrapper">
          <Search className="searchbar-icon" />
          <Input
            name="query"
            value={value}
            onChange={handleChange}
            className="searchbar-input"
            placeholder="Search Products"
          />
      {loading ? (
        <div className="searchbar-loading"></div>
      ) : (
        data.length > 0 && (
          <ul className="searchbar-results">
            {data.map((product) => (
              <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }} key={product.id}>
                <li className="searchbar-result-item">
                  {product.title}
                </li>
              </Link>
            ))}
          </ul>
        )
      )}
      </div>
      </div>
    </>
  );
}

export default Searchbar;
