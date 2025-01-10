import {Photo} from './photo';

export interface Member {
  id: number;
  username: string;
  photoUrl: string;
  knownAs: string;
  age: number;
  created: string;
  lastActive: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: string;
  state: string;
  photos: Photo[];
}
