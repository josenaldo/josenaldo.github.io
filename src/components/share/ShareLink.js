'use client'

import React from 'react'

import ShareIcon from '@mui/icons-material/Share'
import { Box, Button } from '@mui/material'
import { useTranslations } from 'next-intl'
import PropTypes from 'prop-types'

import ShareDialog from '@/components/share/ShareDialog'

const ShareLink = ({ title, description, url, image, color = 'secondary' }) => {
    const t = useTranslations('Common')
    const [open, setOpen] = React.useState(false)
    const [isNativeShare, setNativeShare] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    React.useEffect(() => {
        setMounted(true)
        if (navigator.share) {
            setNativeShare(true)
        }
    }, [])

    const handleOnClick = async () => {
        const data = {
            title: title,
            text: description,
            url: url,
        }

        if (image) {
            const blob = await fetch(image).then((r) => r.blob())
            const ext = blob.type.split('/')[1]
            const files = [
                new File([blob], `file.${ext}`, {
                    type: blob.type,
                }),
            ]

            if (navigator.canShare && navigator.canShare({ files })) {
                data.files = files
            }
        }

        if (navigator.share) {
            navigator
                .share(data)
                .then(() => {
                    console.log(t('successfullyShared'))
                })
                .catch(() => {
                    setOpen(true)
                })
        } else {
            setOpen(true)
        }
    }

    return (
        <Box>
            {/* Botão com rótulo, não ícone solto: o mock escreve "Share",
            e um ícone sozinho depende de o leitor reconhecer o símbolo —
            numa linha de autoria que já tem avatar, nome, data e tempo de
            leitura, ele some. O ícone fica como reforço. */}
            <Button
                onClick={handleOnClick}
                color={color}
                aria-label={t('share')}
                startIcon={<ShareIcon sx={{ fontSize: '16px' }} />}
                sx={{
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#C6CCD8',
                    bgcolor: 'rgba(255,255,255,.05)',
                    borderRadius: '10px',
                    p: '8px 14px',
                    '&:hover': { bgcolor: 'rgba(255,255,255,.09)' },
                }}
            >
                {t('share')}
            </Button>

            {mounted && !isNativeShare && (
                <ShareDialog
                    title={title}
                    url={url}
                    description={description}
                    open={open}
                    onClose={() => {
                        handleClose()
                    }}
                />
            )}
        </Box>
    )
}

ShareLink.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    url: PropTypes.string.isRequired,
    image: PropTypes.string,
    color: PropTypes.string,
}

export default ShareLink
