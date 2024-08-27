"use client";

import React, { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ResetStorageButton from '@/components/ResetStorageButton';
import { User, School } from 'lucide-react';

const CoachProfile: React.FC = memo(() => {
  const [coachName, setCoachName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCoachName(localStorage.getItem('coachName') || '');
    setSchoolName(localStorage.getItem('schoolName') || '');
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

  if (isEditing) {
    return (
      <Card className="w-64">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center space-x-2">
            <User size={18} />
            <Input
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              placeholder="Coach Name"
            />
          </div>
          <div className="flex items-center space-x-2">
            <School size={18} />
            <Input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="School Name"
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save</Button>
          <ResetStorageButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center space-x-2">
      <User size={18} />
      <span>{coachName || 'Coach'}</span>
      <School size={18} />
      <span>{schoolName || 'School'}</span>
    </Button>
  );
});


CoachProfile.displayName = 'CoachProfile';

export default CoachProfile;