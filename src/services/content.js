import {
  allExperiences,
  allPages,
  allPosts,
  allProjects,
  allServices,
  allSkills,
  allTestimonials
} from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

const lastExperiences = (numberOfExperiences) => {
  return allExperiences
    .sort((a, b) => {
      return b.id - a.id
    })
    .slice(0, numberOfExperiences)
}

const lastProjects = (numberOfProjects) => {
  return allProjects
    .sort((a, b) => {
      return a.id - b.id
    })
    .slice(0, numberOfProjects)
}

const getAllProjects = () => {
  return allProjects
}

const getAllProjectsPaths = () => {
  const paths = allProjects.map((project) => project.url)
  return paths
}

const getProjectData = (slug) => {
  const url = `/projects/${slug}`
  const projects = getAllProjects()

  const project = projects.find((p) => {
    if (p.url === url) {
      return p
    }
  })

  return project
}

const getTestimonials = () => {
  return allTestimonials.filter((t) => t.show !== false)
}

const getServices = () => {
  return allServices
    .filter((s) => s.show !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

const getAllPosts = () => {
  return allPosts
}

const getSortedPosts = (numberOfPosts) => {
  const posts = allPosts.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })

  if (numberOfPosts) {
    return posts.slice(0, numberOfPosts)
  }

  return posts
}

const getAllPostsPaths = () => {
  const paths = allPosts.map((post) => post.url)
  return paths
}

const getPostData = (slug) => {
  const url = `/blog/${slug}`
  const posts = getSortedPosts()

  const post = posts.find((post, index, posts) => {
    if (post.url === url) {
      const isFirst = index === posts.length - 1
      const isLast = index === 0
      const previousPost = !isFirst ? posts[index + 1] : null
      const nextPost = !isLast ? posts[index - 1] : null

      if (previousPost) {
        post.previous = {
          url: previousPost.url,
          title: previousPost.title,
        }
      } else {
        post.previous = {
          url: '/blog',
        }
      }

      if (nextPost) {
        post.next = {
          url: nextPost.url,
          title: nextPost.title,
        }
      } else {
        post.next = {
          url: '/blog',
        }
      }
      return post
    }
  })

  return post
}

const getPageData = (url) => {
  const page = allPages.find((page) => page.url === url)

  return page
}

const getAllSkills = () => {
  const skillsByLevel = allSkills.reduce((acc, skill) => {
    if (!acc[skill.level]) {
      acc[skill.level] = []
    }

    acc[skill.level].push(skill)

    return acc
  }, {})

  const skillByLevelKeys = Object.keys(skillsByLevel)

  skillByLevelKeys.forEach((key) => {
    skillsByLevel[key] = skillsByLevel[key].sort((a, b) => {
      return a.firstContact - b.firstContact
    })
  })

  return skillsByLevel
}

export default {
  lastExperiences,
  lastProjects,
  getAllProjects,
  getAllProjectsPaths,
  getProjectData,
  getTestimonials,
  getServices,
  getAllPosts,
  getSortedPosts,
  getAllPostsPaths,
  getPostData,
  getPageData,
  getAllSkills,
}
