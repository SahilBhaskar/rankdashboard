import React, { useState, useEffect } from 'react';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [rankedData, setRankedData] = useState([]);

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
        const response = await api.get(`/leaderboard?filter=${filter}`);
        console.log("response >>>>>", response);
    
        // Convert the object to an array if it has numeric keys
        const data = Array.isArray(response.data) ? response.data : Object.values(response.data);
        setLeaderboard(data);
        setRankedData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
  };

  // Log rankedData on page load
  useEffect(() => {
    console.log('Ranked data:', rankedData);
  }, [rankedData]);

  // Handle Filter Change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Handle Search
  const handleSearch = () => {
    if (search.trim() !== '') {
      const filteredData = leaderboard.filter(
        (user) => user.id.toString() === search.trim()
      );
      setRankedData(filteredData.length ? filteredData : leaderboard);
    } else {
      setRankedData(leaderboard);
    }
  };

  // Recalculate Points


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Leaderboard</h1>

      {/* Filters */}
      <div className="text-center mb-3">
        <button className="btn btn-primary mx-2" onClick={() => handleFilterChange('all')}>All Time</button>
        <button className="btn btn-secondary mx-2" onClick={() => handleFilterChange('day')}>Today</button>
        <button className="btn btn-secondary mx-2" onClick={() => handleFilterChange('month')}>This Month</button>
        <button className="btn btn-secondary mx-2" onClick={() => handleFilterChange('year')}>This Year</button>
      </div>

      {/* Search */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={handleSearch}>Search</button>
      </div>

      {/* Recalculate */}
      <div className="text-center mb-4">
      <button className="btn btn-secondary mx-2" onClick={() => handleFilterChange('year')}>Re Calculate</button>
      </div>

      {/* Leaderboard Table */}
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User ID</th>
            <th>Full Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rankedData) && rankedData.length > 0 ? (
            rankedData.map((user, index) => (
              <tr key={user.id}>
                <td>{user.rank || index + 1}</td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.total_points}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
