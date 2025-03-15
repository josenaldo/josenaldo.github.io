import ArticleIcon from '@mui/icons-material/Article'
import BookIcon from '@mui/icons-material/Book'
import CodeIcon from '@mui/icons-material/Code'
import EmailIcon from '@mui/icons-material/Email'
import HomeIcon from '@mui/icons-material/Home'
import PersonIcon from '@mui/icons-material/Person'

const pages = [
  { name: 'Home', url: '/', icon: HomeIcon },
  { name: 'About', url: '/about', icon: PersonIcon },
  { name: 'Experiences', url: '/experiences', icon: PersonIcon },
  { name: 'Blog', url: '/blog', icon: BookIcon },
  { name: 'Resume', url: '/resume', icon: ArticleIcon },
  { name: 'Projects', url: '/projects', icon: CodeIcon },
  { name: 'Contact', url: '/contact', icon: EmailIcon },
]

export default pages
