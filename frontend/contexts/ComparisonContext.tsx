import React, { createContext, useContext, useState, useEffect } from 'react';
import { School } from '../lib/api';

interface ComparisonContextType {
  selectedSchools: School[];
  addSchool: (school: School) => void;
  removeSchool: (schoolId: number) => void;
  clearAll: () => void;
  isSelected: (schoolId: number) => boolean;
  maxReached: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_SCHOOLS = 5;
const STORAGE_KEY = 'school_comparison';

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSchools, setSelectedSchools] = useState<School[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedSchools(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load comparison from localStorage', err);
    }
  }, []);

  // Save to localStorage whenever selection changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSchools));
    } catch (err) {
      console.error('Failed to save comparison to localStorage', err);
    }
  }, [selectedSchools]);

  const addSchool = (school: School) => {
    if (selectedSchools.length >= MAX_COMPARISON_SCHOOLS) {
      return;
    }
    if (!selectedSchools.find((s) => s.id === school.id)) {
      setSelectedSchools([...selectedSchools, school]);
    }
  };

  const removeSchool = (schoolId: number) => {
    setSelectedSchools(selectedSchools.filter((s) => s.id !== schoolId));
  };

  const clearAll = () => {
    setSelectedSchools([]);
  };

  const isSelected = (schoolId: number) => {
    return selectedSchools.some((s) => s.id === schoolId);
  };

  const maxReached = selectedSchools.length >= MAX_COMPARISON_SCHOOLS;

  return (
    <ComparisonContext.Provider
      value={{
        selectedSchools,
        addSchool,
        removeSchool,
        clearAll,
        isSelected,
        maxReached,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
