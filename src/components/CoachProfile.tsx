"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import useLocalStorage from '@/hooks/useLocalStorage';
import ResetStorageButton from '@/components/ResetStorageButton';
import { User, School } from 'lucide-react';

const CoachProfile: React.FC = () => {
  const [coachName, setCoachName] = useLocalStorage('coachName', '');
  const [schoolName, setSchoolName] = useLocalStorage('schoolName', '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

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
};

export default CoachProfile;