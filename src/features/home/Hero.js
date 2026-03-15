import { Box, Button, Stack, Typography } from '@mui/material'

import photo200 from '@/assets/images/josenaldo-200.webp'
import photo300 from '@/assets/images/josenaldo-300.webp'
import photo400 from '@/assets/images/josenaldo-400.webp'
import Section from '@/components/Section'

const Hero = () => {
    return (
        <Section elevation={1}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    gap: 5,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        textAlign: { xs: 'center', sm: 'center', md: 'left' },
                        maxWidth: { sm: '100%', md: 'clamp(300px,50vw,50%)' },
                    }}
                >
                    <Typography variant="h5" component="p">
                        Hello, my name is{' '}
                    </Typography>
                    <Typography variant="h1">Josenaldo Matos</Typography>
                    <Typography variant="subtitle">
                        Senior Full Stack Engineer. 20+ years. Java, Spring
                        Boot, React, TypeScript.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent={{ xs: 'center', md: 'flex-start' }}
                        sx={{ mt: 2 }}
                    >
                        <Button
                            variant="contained"
                            href="/files/en/JosenaldoDeOliveiraMatosFilho_en.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Download my resume"
                        >
                            Download Resume
                        </Button>
                        <Button
                            variant="outlined"
                            href="/contact"
                            aria-label="Get in touch"
                        >
                            Get in Touch
                        </Button>
                    </Stack>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        aspectRatio: '1/1',
                        width: 'clamp(200px,50vw,400px)',
                        my: { xs: 4, sm: 4, md: 0 },
                    }}
                >
                    <picture>
                        <source
                            type="image/webp"
                            srcSet={`${photo200.src} 200w, ${photo300.src} 300w, ${photo400.src} 400w`}
                            sizes="(max-width: 600px) 200px, (max-width: 960px) 300px, 400px"
                        />
                        <img
                            src={photo400.src}
                            alt="Josenaldo Matos"
                            width="400"
                            height="400"
                            loading="eager"
                            fetchPriority="high"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </picture>
                </Box>
            </Box>
        </Section>
    )
}

export default Hero
