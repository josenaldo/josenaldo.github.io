import { compareDesc } from 'date-fns'

import {
    allExperiences,
    allPages,
    allPosts,
    allProjects,
    allServices,
    allTestimonials,
} from 'contentlayer/generated'

import skillGroups from '@/data/skillGroups'
import skills from '@/data/skills'
import slugify from '@/shared/utils/slugify'

// Mesma regra duplicada em scripts/generate-rss.js. Repetida lá porque esse
// script roda em Node puro, fora do bundler, e não resolve o alias `@/` nem
// `contentlayer/generated` que este arquivo importa. Se a regra mudar aqui,
// muda lá também.
const STATUS_ALIASES = {
    draft: 'draft',
    rascunho: 'draft',
    planned: 'planned',
    planejado: 'planned',
    published: 'published',
    publicado: 'published',
}

const normalizePostStatus = (status) => {
    const normalizedStatus = `${status || 'published'}`.trim().toLowerCase()

    return STATUS_ALIASES[normalizedStatus] || 'draft'
}

const isPublishedPost = (post, now = new Date()) => {
    const normalizedStatus = normalizePostStatus(post.status)
    return normalizedStatus === 'published' && new Date(post.date) <= now
}

const shouldIncludeUnpublishedPosts = () => {
    return process.env.NODE_ENV !== 'production'
}

// Coleções indexadas pelo `doc.type` gerado pelo Contentlayer, usadas para
// resolver a lista correta a partir de um documento qualquer (ex: em
// getTranslationSibling, que não sabe de antemão o tipo do doc recebido).
const collectionsByType = {
    Post: allPosts,
    Page: allPages,
    Project: allProjects,
    Experience: allExperiences,
    Testimonial: allTestimonials,
    Service: allServices,
}

const allDocumentsOfSameType = (doc) => collectionsByType[doc?.type] || []

export function getTranslationSibling(doc, targetLocale) {
    if (!doc?.translationKey) return null

    return (
        allDocumentsOfSameType(doc).find(
            (candidate) =>
                candidate.locale === targetLocale &&
                candidate.translationKey === doc.translationKey
        ) || null
    )
}

const byLocale = (locale) => (doc) => doc.locale === locale

const getVisiblePosts = (locale) => {
    const posts = allPosts.filter(byLocale(locale))

    if (shouldIncludeUnpublishedPosts()) {
        return posts
    }

    return posts.filter((post) => isPublishedPost(post))
}

const lastExperiences = (locale, numberOfExperiences) => {
    return allExperiences
        .filter(byLocale(locale))
        .sort((a, b) => {
            return b.id - a.id
        })
        .slice(0, numberOfExperiences)
}

const lastProjects = (locale, numberOfProjects) => {
    return allProjects
        .filter(byLocale(locale))
        .sort((a, b) => {
            return a.id - b.id
        })
        .slice(0, numberOfProjects)
}

const getAllProjects = (locale) => {
    return allProjects.filter(byLocale(locale))
}

const getProjectData = (locale, slug) => {
    const projects = getAllProjects(locale)

    const project = projects.find((p) => p.slug === slug)

    return project
}

const getTestimonials = (locale) => {
    return allTestimonials
        .filter(byLocale(locale))
        .filter((t) => t.show !== false)
}

const getServices = (locale) => {
    return allServices
        .filter(byLocale(locale))
        .filter((s) => s.show !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

const getAllPosts = (locale) => {
    return getVisiblePosts(locale)
}

const getSortedPosts = (locale, numberOfPosts) => {
    const posts = [...getAllPosts(locale)].sort((a, b) => {
        return compareDesc(new Date(a.date), new Date(b.date))
    })

    if (numberOfPosts) {
        return posts.slice(0, numberOfPosts)
    }

    return posts
}

const getPostData = (locale, slug) => {
    const posts = getSortedPosts(locale)

    const post = posts.find((post, index, posts) => {
        if (post.slug === slug) {
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

const getPageData = (locale, slug) => {
    return allPages.filter(byLocale(locale)).find((page) => page.slug === slug)
}

const getAllSkills = () => {
    const skillsByLevel = skills.reduce((acc, skill) => {
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

const getAllSkillsByCategory = () => {
    const colorMap = Object.fromEntries(
        skillGroups.map(({ group, color }) => [group, color])
    )

    const grouped = skills.reduce((acc, skill) => {
        if (!skill.group) return acc
        if (!acc[skill.group]) acc[skill.group] = []
        acc[skill.group].push(skill)
        return acc
    }, {})

    return skillGroups
        .filter(({ group }) => grouped[group])
        .map(({ group }) => ({
            group,
            color: colorMap[group],
            skills: grouped[group].sort(
                (a, b) => a.firstContact - b.firstContact
            ),
        }))
}

const getAllCategories = (locale) => {
    const posts = getAllPosts(locale)
    const categoryMap = new Map()

    posts.forEach((post) => {
        if (!post.category) return
        const slug = slugify(post.category)
        if (categoryMap.has(slug)) {
            categoryMap.get(slug).count += 1
        } else {
            categoryMap.set(slug, {
                name: post.category,
                slug,
                count: 1,
            })
        }
    })

    return [...categoryMap.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    )
}

const getPostsByCategory = (locale, slug) => {
    return getSortedPosts(locale).filter(
        (post) => post.category && slugify(post.category) === slug
    )
}

const contentService = {
    lastExperiences,
    lastProjects,
    getAllProjects,
    getProjectData,
    getTestimonials,
    getServices,
    getAllPosts,
    getSortedPosts,
    getPostData,
    getPageData,
    getAllSkills,
    getAllSkillsByCategory,
    getAllCategories,
    getPostsByCategory,
    getTranslationSibling,
}

export default contentService
