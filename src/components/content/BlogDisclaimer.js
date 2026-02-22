import { Box, Divider, Typography } from '@mui/material'

const BlogDisclaimer = () => {
    return (
        <Box
            component="aside"
            sx={{
                pt: 3,
            }}
        >
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                A few honest warnings before you leave:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>On the language:</strong> English is not my native
                language. I Speak Brazilian Portuguese, Baianese, Mineirese and a lot of bulshit.
                I write in it anyway — partly for reach, partly as
                practice. If something reads strangely, that&apos;s YOU!
                Your fault! You are the English Specialist, not me. I am the guy who lost the kidney of his mother-in-law!
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>On AI:</strong> Yes, I use AI to help me write — the
                same way I use an IDE to write code, a calculator to avoid
                embarrassing arithmetic, and Google to remember things I
                definitely learned and totally didn&apos;t immediately forget.
                AI is a tool. I&apos;m the one choosing what to say; the
                machine just helps me say it less incomprehensibly.
            </Typography>
            <Typography variant="body2">
                <strong>On the opinions:</strong> I&apos;m a programmer, not a
                writer, journalist, analyst, or prophet. These are my personal
                thoughts — informal, fallible, and entirely unscientific. They
                exist for my own clarity, for the mild amusement of anyone who
                stumbles here, and for the future embarrassment of my
                descendants. If you disagree, you&apos;re probably right.
                If you agree, I appreciate your questionable judgment.
            </Typography>
        </Box>
    )
}

export default BlogDisclaimer
