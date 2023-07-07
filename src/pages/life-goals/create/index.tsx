import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createLifeGoal } from 'apiSdk/life-goals';
import { Error } from 'components/error';
import { lifeGoalValidationSchema } from 'validationSchema/life-goals';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { UserInterface } from 'interfaces/user';
import { getOrganizations } from 'apiSdk/organizations';
import { getUsers } from 'apiSdk/users';
import { LifeGoalInterface } from 'interfaces/life-goal';

function LifeGoalCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: LifeGoalInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createLifeGoal(values);
      resetForm();
      router.push('/life-goals');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<LifeGoalInterface>({
    initialValues: {
      goal_name: '',
      pillar: '',
      organization_id: (router.query.organization_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: lifeGoalValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Life Goal
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="goal_name" mb="4" isInvalid={!!formik.errors?.goal_name}>
            <FormLabel>Goal Name</FormLabel>
            <Input type="text" name="goal_name" value={formik.values?.goal_name} onChange={formik.handleChange} />
            {formik.errors.goal_name && <FormErrorMessage>{formik.errors?.goal_name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="pillar" mb="4" isInvalid={!!formik.errors?.pillar}>
            <FormLabel>Pillar</FormLabel>
            <Input type="text" name="pillar" value={formik.values?.pillar} onChange={formik.handleChange} />
            {formik.errors.pillar && <FormErrorMessage>{formik.errors?.pillar}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'life_goal',
    operation: AccessOperationEnum.CREATE,
  }),
)(LifeGoalCreatePage);
