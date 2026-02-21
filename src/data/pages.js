import ArticleIcon from '@mui/icons-material/Article'
import BookIcon from '@mui/icons-material/Book'
import CodeIcon from '@mui/icons-material/Code'
import EmailIcon from '@mui/icons-material/Email'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import WorkIcon from '@mui/icons-material/Work'

const pages = [
    { name: 'Home', url: '/', icon: HomeIcon },
    { name: 'Blog', url: '/blog', icon: BookIcon },
    { name: 'About', url: '/about', icon: PersonIcon },
    { name: 'Resume', url: '/resume', icon: ArticleIcon },
    { name: 'Experiences', url: '/experiences', icon: WorkIcon },
    { name: 'Projects', url: '/projects', icon: CodeIcon },
    { name: 'Courses', url: '/courses', icon: SchoolIcon },
    { name: 'Contact', url: '/contact', icon: EmailIcon },
]

export default pages
