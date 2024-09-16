"use client";

import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, School, Edit2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResetStorageButton from '@/components/ResetStorageButton';
import { getCurrentYear } from '@/utils/localStorage';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { fbsTeams } from '@/utils/fbsTeams';

const CoachProfile: React.FC = memo(() => {
  const [coachName, setCoachName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [currentYear, setCurrentYear] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCoachName(localStorage.getItem('coachName') || '');
    setSchoolName(localStorage.getItem('schoolName') || '');
    setCurrentYear(getCurrentYear() || 0)
    setIsLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('coachName', coachName);
    localStorage.setItem('schoolName', schoolName);
    setIsEditing(false);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Popover open={isEditing} onOpenChange={setIsEditing}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <AnimatePresence>
            {coachName && schoolName ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center space-x-2"
              >
                <User size={18} className="text-blue-500" />
                <span className="font-semibold">{coachName}</span>
                <School size={18} className="text-green-500" />
                <span className="font-semibold">{schoolName}</span>
                <Calendar size={18} className='text-red-500' />
                <span className='font-semibold'>{currentYear}</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center space-x-2"
              >
                <Edit2 size={18} />
                <span>Set Coach & School</span>
                <Calendar size={18} className='text-red-500' />
                <span className='font-semibold'>{currentYear}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold text-center mb-2">Edit Profile</h3>
            <div className="space-y-2">
              <label htmlFor="coachName" className="text-sm font-medium">
                Coach Name
              </label>
              <div className="flex items-center space-x-2">
                <User size={18} className="text-blue-500" />
                <Input
                  id="coachName"
                  value={coachName}
                  onChange={(e) => setCoachName(e.target.value)}
                  placeholder=" Name "
                  className="flex-grow"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="schoolName" className="text-sm font-medium">
                School Name
              </label>
              <div className="flex items-center space-x-2">
                <School size={18} className="text-green-500" />
                <Select
                  value={schoolName}
                  onValueChange={(value) => setSchoolName(value)}
                >
                  <SelectTrigger className="w-full text-center">
                    <SelectValue placeholder="Select Current School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unselected">-- Select Team --</SelectItem>
                    {fbsTeams.map(team => (
                      <SelectItem key={team} value={team}>{team}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button onClick={handleSave} className="flex-grow">
                Save
              </Button>
              <ResetStorageButton />
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
});

CoachProfile.displayName = 'CoachProfile';

export default CoachProfile;
