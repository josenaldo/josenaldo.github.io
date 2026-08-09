import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

// Chave compartilhada entre as versões do mesmo documento em idiomas
// diferentes, mais o marcador de que a cópia ainda aguarda tradução.
// Aplicados a todas as coleções.
const translationFields = {
    translationKey: {
        type: 'string',
        description:
            'Chave compartilhada entre as versões do mesmo documento em idiomas diferentes. Ausente = documento sem par.',
        required: false,
    },
    translated: {
        type: 'boolean',
        description:
            'false quando o arquivo ainda carrega o texto do idioma original, aguardando tradução.',
        default: true,
        required: false,
    },
}

// Campos computados a partir do caminho `<coleção>/<locale>/<slug>.md`.
// Aplicados a todas as coleções.
function localeComputedFields() {
    return {
        locale: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        slug: {
            type: 'string',
            resolve: (doc) =>
                doc._raw.flattenedPath.split('/').slice(2).join('/'),
        },
        url: {
            type: 'string',
            resolve: (doc) => {
                const parts = doc._raw.flattenedPath.split('/')
                const [collection, locale, ...rest] = parts
                const slug = rest.join('/')
                return collection === 'pages'
                    ? `/${locale}/${slug}`
                    : `/${locale}/${collection}/${slug}`
            },
        },
    }
}

export const Post = defineDocumentType(() => ({
    name: 'Post',
    filePathPattern: `blog/**/*.md`,
    fields: {
        title: {
            type: 'string',
            description: 'The title of the post',
            required: true,
        },
        description: {
            type: 'string',
            description: 'The description of the post',
            required: true,
        },
        date: {
            type: 'date',
            description: 'The date of the post',
            required: true,
        },
        status: {
            type: 'string',
            description:
                'The publication status of the post (draft/rascunho, planned/planejado, published/publicado)',
            required: false,
        },
        author: {
            type: 'string',
            description: 'The author of the post',
            required: true,
        },
        category: {
            type: 'string',
            description: 'The category of the post',
            required: true,
        },
        image: {
            type: 'string',
            description: 'The image of the post',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

export const Page = defineDocumentType(() => ({
    name: 'Page',
    filePathPattern: `pages/**/*.md`,
    fields: {
        title: {
            type: 'string',
            description: 'The title of the page',
            required: true,
        },
        description: {
            type: 'string',
            description: 'The description of the page',
            required: true,
        },
        image: {
            type: 'string',
            description: 'The image of the page',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const Project = defineDocumentType(() => ({
    name: 'Project',
    filePathPattern: `projects/**/*.md`,
    fields: {
        id: {
            type: 'number',
            description: 'The id of the project',
            required: true,
        },
        title: {
            type: 'string',
            description: 'The title of the project',
            required: true,
        },
        description: {
            type: 'string',
            description: 'The description of the project',
            required: true,
        },
        projectUrl: {
            type: 'string',
            description: 'The project url',
            required: true,
        },
        pin: {
            type: 'boolean',
            description: 'The project is pinned in the portfolio',
            required: true,
        },
        image: {
            type: 'string',
            description: 'The image of the project',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const Experience = defineDocumentType(() => ({
    name: 'Experience',
    filePathPattern: `experiences/**/*.md`,
    fields: {
        id: {
            type: 'number',
            description: 'The id of the experience',
            required: true,
        },
        title: {
            type: 'string',
            description: 'The title of the experience',
            required: true,
        },
        company: {
            type: 'string',
            description: 'The company of the experience',
            required: true,
        },
        location: {
            type: 'string',
            description: 'The location of the experience',
            required: true,
        },
        description: {
            type: 'string',
            description: 'The description of the post',
            required: true,
        },
        period: {
            type: 'string',
            description: 'The period, in time, of the experience',
            required: true,
        },
        show: {
            type: 'boolean',
            description: 'Show the experience in the resume',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const Testimonial = defineDocumentType(() => ({
    name: 'Testimonial',
    filePathPattern: `testimonials/**/*.md`,
    fields: {
        show: {
            type: 'boolean',
            description: 'Whether to show this testimonial publicly',
            required: false,
        },
        name: {
            type: 'string',
            description: 'The name of the testimonial author',
            required: true,
        },
        position: {
            type: 'string',
            description: 'The position of the testimonial author',
            required: true,
        },
        testimonial: {
            type: 'string',
            description: 'The testimonial',
            required: true,
        },
        image: {
            type: 'string',
            description: 'The image of the testimonial author',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const Course = defineDocumentType(() => ({
    name: 'Course',
    filePathPattern: `courses/**/*.md`,
    fields: {
        name: {
            type: 'string',
            description: 'The name of the course',
            required: true,
        },
        institution: {
            type: 'string',
            description: 'The institution of the course',
            required: true,
        },
        completionDate: {
            type: 'date',
            description: 'The completion month and year of the course',
            required: true,
        },
        workload: {
            type: 'number',
            description: 'The workload of the course, in hours',
            required: true,
        },
        courseLink: {
            type: 'string',
            description: 'The link of the course',
            required: true,
        },
        certificateLink: {
            type: 'string',
            description: 'The link of the certificate',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

const Service = defineDocumentType(() => ({
    name: 'Service',
    filePathPattern: `services/**/*.md`,
    fields: {
        show: {
            type: 'boolean',
            description: 'Whether to show this service publicly',
            required: false,
        },
        order: {
            type: 'number',
            description: 'Ordering (lower comes first)',
            required: true,
        },
        title: {
            type: 'string',
            description: 'The service title',
            required: true,
        },
        description: {
            type: 'string',
            description: 'Short description shown on the home page',
            required: true,
        },
        image: {
            type: 'string',
            description:
                'Card image (used as OG-like preview image in UI cards)',
            required: true,
        },
        icon: {
            type: 'string',
            description:
                'Icon key used by the UI (e.g. code, api, architecture, mentoring)',
            required: true,
        },
        ...translationFields,
    },
    computedFields: localeComputedFields(),
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [
        Post,
        Page,
        Project,
        Experience,
        Testimonial,
        Course,
        Service,
    ],
})
