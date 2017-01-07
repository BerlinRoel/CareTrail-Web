import {User} from '../models/user';

export class OnCallData {
  public oncallid: number;
  public year: number;
  public month: number;  
  public day: number;  
  public start_hour: number;  
  public start_minutes: number;  
  public end_hour: number;  
  public end_minutes: number;
  public onCallUser: User;
  public backupForCallUser: User;

  // UI Data
  public isWorking: boolean = false;
  public formattedStartTime: string;
  public formattedEndTime: string;
}
