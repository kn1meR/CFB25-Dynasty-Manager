import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { recognizeText, parsePlayerData } from '@/utils/ocr';
import { Player } from '@/types';

interface RosterImageUploadProps {
  onProcessComplete: (players: Omit<Player, 'id' | 'devTrait' | 'notes' | 'jerseyNumber'>[]) => void;
}

const RosterImageUpload: React.FC<RosterImageUploadProps> = ({ onProcessComplete }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      try {
        const text = await recognizeText(image);
        const players = parsePlayerData(text);
        onProcessComplete(players);
      } catch (error) {
        console.error('Error processing image:', error);
        // Show error message to user
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <Button onClick={handleUpload} disabled={!image}>
        Upload and Process
      </Button>
    </div>
  );
};

export default RosterImageUpload;