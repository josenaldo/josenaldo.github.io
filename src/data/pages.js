import BadgeIcon from '@mui/icons-material/Badge'
import BookIcon from '@mui/icons-material/Book'
import CodeIcon from '@mui/icons-material/Code'
import EmailIcon from '@mui/icons-material/Email'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'

// `name` é a chave de tradução em `Nav.*` (src/messages/{locale}.json), não o
// texto exibido — os componentes que consomem esta lista resolvem o rótulo
// via `useTranslations('Nav')`.
const pages = [
    { name: 'home', url: '/', icon: HomeIcon },
    { name: 'blog', url: '/blog', icon: BookIcon },
    { name: 'about', url: '/about', icon: PersonIcon },
    { name: 'hiring', url: '/hiring', icon: BadgeIcon },
    { name: 'contact', url: '/contact', icon: EmailIcon },
]

// Sub-navegação de "about" — experiences/projects/courses não têm rota
// própria no menu principal, mas continuam existindo como páginas
// independentes, sem mudança de URL. Ver spec da reformulação do DS,
// decisão 1.
export const aboutSubNav = [
    { name: 'experiences', url: '/experiences', icon: WorkIcon },
    { name: 'projects', url: '/projects', icon: CodeIcon },
    { name: 'courses', url: '/courses', icon: SchoolIcon },
]

export default pages
