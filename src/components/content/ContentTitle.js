import { Stack, Typography } from '@mui/material'

const ContentTitle = ({
  title,
  subtitle = '',
  titleVariant = 'h1',
  subtitleVariant = 'subtitle',
}) => {
  return (
    <Stack alignItems="center">
      <Typography variant={titleVariant} textAlign="center">
        {title}
      </Typography>
      <Typography
        variant={subtitleVariant}
        textAlign="center"
        color="text.secondary"
      >
        {subtitle}
      </Typography>
    </Stack>
  )
}

export default ContentTitle
