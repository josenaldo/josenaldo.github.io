import CloseIcon from '@mui/icons-material/Close'
import FacebookIcon from '@mui/icons-material/Facebook'
import TelegramIcon from '@mui/icons-material/Telegram'
import TwitterIcon from '@mui/icons-material/Twitter'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

const iconFontSize = {
    xs: 40,
    sm: 42,
    md: 44,
    lg: 46,
    xl: 48,
}

const iconSpace = {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
}

const ShareDialog = ({ title, description, url, open, onClose }) => {
    const t = useTranslations('Common')
    const shareMsg = t('shareMessage')

    const networks = [
        {
            id: 'share-1',
            netUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
            text: shareMsg,
            target: '_blank',
            rel: 'noopener noreferrer',
            icon: <FacebookIcon sx={{ fontSize: iconFontSize }} />,
        },
        {
            id: 'share-2',
            netUrl: 'https://twitter.com/intent/tweet?text=',
            // Antes cravava um domínio alheio (`https://ciro.app.br`), lixo
            // de outro projeto. As outras redes recebem a URL compartilhada
            // via `netUrl + encodeURIComponent(url)` no DialogActions; aqui
            // seguimos o mesmo padrão pré-preenchendo o texto do tweet com a
            // própria página compartilhada.
            text: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            icon: <TwitterIcon sx={{ fontSize: iconFontSize }} />,
        },
        {
            id: 'share-3',
            netUrl: 'https://api.whatsapp.com/send?text=',
            text: shareMsg,
            target: '_blank',
            rel: 'noopener noreferrer',
            icon: <WhatsAppIcon sx={{ fontSize: iconFontSize }} />,
        },
        {
            id: 'share-4',
            videoId: '',
            netUrl: 'https://telegram.me/share/url?url=',
            text: shareMsg,
            target: '_blank',
            rel: 'noopener noreferrer',
            icon: <TelegramIcon sx={{ fontSize: iconFontSize }} />,
        },
    ]

    const handleClose = () => {
        onClose()
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle
                id="alert-dialog-title"
                color="primary"
                sx={{ paddingRight: '40px' }}
            >
                {t('shareDialogTitle')}
                {onClose ? (
                    <IconButton
                        aria-label={t('close')}
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: 12,
                            color: 'primary.main',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <DialogContent
                sx={{
                    gap: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <DialogContentText>
                    {t('shareDialogText', { title })}
                </DialogContentText>
                <Typography variant="caption">{description}</Typography>
            </DialogContent>
            <DialogActions>
                {networks.map(({ id, netUrl, target, rel, icon }) => (
                    <span key={id}>
                        <Button
                            href={netUrl + encodeURIComponent(url)}
                            target={target}
                            rel={rel}
                            onClick={handleClose}
                            sx={{
                                px: iconSpace,
                                color: 'darkGreen.main',
                            }}
                        >
                            {icon}
                        </Button>
                    </span>
                ))}
            </DialogActions>
        </Dialog>
    )
}

ShareDialog.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ShareDialog
