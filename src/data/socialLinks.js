import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

// `value` é o que aparece na tela; `url` é para onde o card leva. Eram a
// mesma coisa, e a URL inteira dominava o card — o mock mostra o handle.
// O WhatsApp não mostra mais o número: o link continua abrindo a conversa,
// e o telefone deixa de estar em texto puro numa página pública.
const socialLinks = [
    {
        name: 'LinkedIn',
        value: '/in/josenaldo',
        url: 'https://www.linkedin.com/in/josenaldo/',
        icon: LinkedInIcon,
    },
    {
        name: 'GitHub',
        value: '@josenaldo',
        url: 'https://github.com/josenaldo',
        icon: GitHubIcon,
    },
    {
        name: 'Email',
        value: 'josenaldo@gmail.com',
        url: 'mailto:josenaldo@gmail.com',
        icon: EmailIcon,
    },
    {
        name: 'WhatsApp',
        valueKey: 'whatsappHandle',
        url: 'https://wa.me/5534991830215',
        icon: WhatsAppIcon,
    },
]

export default socialLinks
