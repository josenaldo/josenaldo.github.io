import {
    Box,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material'
import PropTypes from 'prop-types'

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
                            <ListItemText
                                primary={link.name}
                                secondary={link.value}
                            />
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    )
}

SocialList.propTypes = {}

export default SocialList
