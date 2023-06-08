import PropTypes from 'prop-types';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

BlogPostCommentForm.propTypes = {
  commentButton: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};

export default function BlogPostCommentForm({ commentButton,name,placeholder }) {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} alignItems="flex-end">
        <RHFTextField
          name={name}
          placeholder={placeholder}
          multiline
          rows={3}
        />

        {commentButton != null && (
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {commentButton}
          </LoadingButton>
        )}
      </Stack>
    </FormProvider>
  );
}
