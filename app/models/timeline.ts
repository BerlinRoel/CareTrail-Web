import {User} from '../models/user';
import {Patient} from '../models/patient';

export class Timeline {
	public messageid: number;
	public priority: string;
	public createdTimestamp: number;
	public message: string;
	public fromUser: User;
	public toPatient: Patient;
	public image: string;
	public channelName: string;
	public read: boolean;
}
