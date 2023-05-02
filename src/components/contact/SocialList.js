import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Link,
  Divider,
} from '@mui/material'

import socialLinks from '@/data/socialLinks'

const SocialList = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: {
          xs: '100%',
          sm: '100%',
          md: '30%',
        },
      }}
    >
      <List>
        {socialLinks.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <link.icon />
              </ListItemAvatar>
              <ListItemText primary={link.name} secondary={link.value} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  )
}

export default SocialList
