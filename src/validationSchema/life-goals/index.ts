import * as yup from 'yup';

export const lifeGoalValidationSchema = yup.object().shape({
  goal_name: yup.string().required(),
  pillar: yup.string().required(),
  organization_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
