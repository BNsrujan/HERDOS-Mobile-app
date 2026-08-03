export type AnimalStatus = 'healthy' | 'watch' | 'alert' | 'lame';

export type Animal = {
  id: string;
  name: string;
  status: AnimalStatus;
  location: string;
  lastSeen: string;
};
