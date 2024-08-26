// src/components/YearRecordModal.tsx

/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Game {
  week: number;
  opponent: string;
  result: string;
  score: string;
}

interface YearRecord {
  year: number;
  overallRecord: string;
  conferenceRecord: string;
  bowlGame: string;
  bowlResult: string;
  pointsFor: string;
  pointsAgainst: string;
  natChamp: string;
  heisman: string;
  schedule?: Game[];
}

interface YearRecordModalProps {
  year: number;
  onClose: () => void;
}

const YearRecordModal: React.FC<YearRecordModalProps> = ({ year, onClose }) => {
  const [record, setRecord] = useState<YearRecord>({
    year,
    overallRecord: '',
    conferenceRecord: '',
    bowlGame: '',
    bowlResult: '',
    pointsFor: '',
    pointsAgainst: '',
    natChamp: '',
    heisman: '',
    schedule: Array(18).fill({ week: 0, opponent: '', result: '', score: '' }).map((game, index) => ({ ...game, week: index })),
  });

  useEffect(() => {
    const storedRecords = localStorage.getItem('yearRecords');
    if (storedRecords) {
      const records: YearRecord[] = JSON.parse(storedRecords);
      const existingRecord = records.find(r => r.year === year);
      if (existingRecord) {
        setRecord({
          ...existingRecord,
          schedule: existingRecord.schedule || record.schedule,
        });
      }
    }
  }, [year]);

  const handleSave = () => {
    const storedRecords = localStorage.getItem('yearRecords');
    let records: YearRecord[] = storedRecords ? JSON.parse(storedRecords) : [];
    const existingIndex = records.findIndex(r => r.year === year);
    
    if (existingIndex !== -1) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem('yearRecords', JSON.stringify(records));
    onClose();
  };

  const updateSchedule = (index: number, field: keyof Game, value: string) => {
    if (record.schedule) {
      const updatedSchedule = [...record.schedule];
      updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
      setRecord({ ...record, schedule: updatedSchedule });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[50vw] w-full max-h-[75vh] h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{year} Season Stats</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
          <div className="w-full md:w-1/2 space-y-4 overflow-y-auto p-4">
            <ScrollArea className="h-full">
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="overallRecord" className="text-right">Overall Record:</label>
                  <Input
                    id="overallRecord"
                    value={record.overallRecord}
                    onChange={(e) => setRecord({ ...record, overallRecord: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="conferenceRecord" className="text-right">Conference Record:</label>
                  <Input
                    id="conferenceRecord"
                    value={record.conferenceRecord}
                    onChange={(e) => setRecord({ ...record, conferenceRecord: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="pointsFor" className="text-right">Points For:</label>
                  <Input
                    id="pointsFor"
                    value={record.pointsFor}
                    onChange={(e) => setRecord({ ...record, pointsFor: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="pointsAgainst" className="text-right">Points Against:</label>
                  <Input
                    id="pointsAgainst"
                    value={record.pointsAgainst}
                    onChange={(e) => setRecord({ ...record, pointsAgainst: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="bowlGame" className="text-right">Bowl Game:</label>
                  <Input
                    id="bowlGame"
                    value={record.bowlGame}
                    onChange={(e) => setRecord({ ...record, bowlGame: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="bowlResult" className="text-right">Bowl Result:</label>
                  <Select
                    value={record.bowlResult}
                    onValueChange={(value) => setRecord({ ...record, bowlResult: value })}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Win">W</SelectItem>
                      <SelectItem value="Loss">L</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="natChamp" className="text-right">National Champion:</label>
                  <Input
                    id="natChamp"
                    value={record.natChamp}
                    onChange={(e) => setRecord({ ...record, natChamp: e.target.value })}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <label htmlFor="heisman" className="text-right">Heisman Winner:</label>
                  <Input
                    id="heisman"
                    value={record.heisman}
                    onChange={(e) => setRecord({ ...record, heisman: e.target.value })}
                    className="col-span-2"
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
          {record.schedule && (
            <div className="w-full md:w-1/2 overflow-hidden">
              <h3 className="text-xl text-center font-semibold mb-2">{year} Schedule</h3>
              <ScrollArea className="h-[calc(100%-3rem)] w-full rounded-md border p-4">
                <Table>
                  <thead>
                    <tr>
                      <th className="w-1/6">Week</th>
                      <th className="w-1/3">Opponent</th>
                      <th className="w-1/4">Result</th>
                      <th className="w-1/4">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.schedule.map((game, index) => (
                      <tr key={index}>
                        <td>{game.week}</td>
                        <td>
                          <Input
                            value={game.opponent}
                            onChange={(e) => updateSchedule(index, 'opponent', e.target.value)}
                          />
                        </td>
                        <td>
                          <Select
                            value={game.result}
                            onValueChange={(value) => updateSchedule(index, 'result', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Win">W</SelectItem>
                              <SelectItem value="Loss">L</SelectItem>
                              <SelectItem value="Tie">T</SelectItem>
                              <SelectItem value="Bye">Bye</SelectItem>
                              <SelectItem value="N/A">-</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <Input
                            value={game.score}
                            onChange={(e) => updateSchedule(index, 'score', e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YearRecordModal;