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
        color="secondary.light"
        fontStyle="italic"
      >
        {subtitle}
      </Typography>
    </Stack>
  )
}

export default ContentTitle
