import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_APP } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import { BlogNewPostForm } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function BlogNewPostPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Blog: New Post | Minimal UI</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new post"
          links={[
            {
              name: 'Dashboard',
              href: PATH_APP.root,
            },
            {
              name: 'Blog',
              href: PATH_APP.blog.root,
            },
            {
              name: 'Create',
            },
          ]}
        />

        <BlogNewPostForm />
      </Container>
    </>
  );
}
