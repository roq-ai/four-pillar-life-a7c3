import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface LifeGoalInterface {
  id?: string;
  goal_name: string;
  pillar: string;
  organization_id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  organization?: OrganizationInterface;
  user?: UserInterface;
  _count?: {};
}

export interface LifeGoalGetQueryInterface extends GetQueryInterface {
  id?: string;
  goal_name?: string;
  pillar?: string;
  organization_id?: string;
  user_id?: string;
}
